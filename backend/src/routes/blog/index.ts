import { Hono } from "hono";
import getPrismaInstance from "../../utils/db";
import {
  createBlogSchema,
  createBlogType,
  createCommentSchema,
  updateBlogSchema,
  updateBlogType,
} from "@vaibhav314/blogging-common";
import uploadImage from "../../utils/imageUpload";
import checkAuthHeader from "../../utils/checkAuthHeader";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLOUD_NAME: string;
    UPLOAD_PRESET_NAME: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");

    const userId = await checkAuthHeader(authHeader, c.env.JWT_SECRET);

    if (!userId && c.req.method != "GET") {
      c.status(401);
      return c.json({
        message: "Invalid token/format",
      });
    }

    if (userId) c.set("userId", userId);
    await next();
  } catch (error) {
    c.status(401);
    return c.json({
      message: "Invalid token/format",
    });
  }
});

blogRouter.get("/", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const page = parseInt(c.req.query("page") || "") || 1;
    const limit = parseInt(c.req.query("limit") || "") || 10;
    const searchQuery = c.req.query("search") || "";

    const skip = (page - 1) * limit;

    const blogs = await prisma.blog.findMany({
      skip: skip,
      take: limit,
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: "insensitive", // Case-insensitive search
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        bannerImage: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        totalLikes: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    const totalBlogs = await prisma.blog.count({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    c.status(200);
    return c.json({
      blogs: blogs,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs: totalBlogs,
    });
  } catch (error) {
    c.status(500);
    console.log(error);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

blogRouter.post("/", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const userId = c.get("userId");
    const body = await c.req.parseBody();

    const { success, data, error } = createBlogSchema.safeParse(body);

    if (!success) {
      c.status(411);

      type errorType = Partial<
        Pick<createBlogType, "title" | "content"> & { image: string }
      >;
      const formattedError: errorType = {};

      error.issues.forEach((issue) => {
        formattedError[issue.path[0] as keyof errorType] = issue.message;
      });

      return c.json({
        error: formattedError,
      });
    }

    const { title, content, image } = data;

    let url = "";
    if (image) {
      url = await uploadImage(
        c.env.CLOUD_NAME,
        c.env.UPLOAD_PRESET_NAME,
        image
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
        bannerImage: url,
      },
    });

    c.status(201);
    return c.json({
      message: "Successfully created blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const id = c.req.param("id");

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        bannerImage: true,
        createdAt: true,
        updatedAt: true,
        totalLikes: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({
        message: "No such blog exists",
      });
    }

    let isLiked = false;
    const userId = c.get("userId");
    if (userId) {
      const like = await prisma.like.findFirst({
        where: {
          userId,
          blogId: id,
        },
      });

      if (like) isLiked = true;
    }

    c.status(201);
    return c.json({
      blog: {
        ...blog,
        isLiked,
      },
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

blogRouter.put("/:id", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const id = c.req.param("id");
    const userId = c.get("userId");
    const body = await c.req.json();

    const { success, data, error } = updateBlogSchema.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        error,
      });
    }

    const { title, content } = data;

    const updatedData: updateBlogType = {};
    if (title) {
      updatedData.title = title;
    }
    if (content) {
      updatedData.content = content;
    }

    const blog = await prisma.blog.update({
      where: {
        id,
        authorId: userId,
      },
      data: updatedData,
    });

    c.status(201);
    return c.json({
      blog,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

blogRouter.post("/:id/comment", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const blogId = c.req.param("id");
    const userId = c.get("userId");
    const body = await c.req.json();

    const { success, data, error } = createCommentSchema.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        error: {
          content: error.errors[0].message,
        },
      });
    }

    const { content } = data;

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      c.status(411);
      return c.json({
        error: { other: "No such blog exists" },
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        blogId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    c.status(201);
    return c.json({
      comment,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      error: { other: "An unexpected error occurred!" },
    });
  }
});

blogRouter.post("/:id/like", async (c) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("userId");
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    // Check if the user has already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        blogId: id,
        userId: userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        },
      });

      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: { totalLikes: { decrement: 1 } },
      });

      c.status(200);
      return c.json({
        message: "Successfully Unliked!",
        totalLikes: updatedBlog.totalLikes,
        isLiked: false,
      });
    } else {
      await prisma.like.create({
        data: {
          blogId: id,
          userId: userId,
        },
      });

      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: { totalLikes: { increment: 1 } },
      });

      c.status(201);
      return c.json({
        message: "Successfully Liked!",
        totalLikes: updatedBlog.totalLikes,
        isLiked: true,
      });
    }
  } catch (error) {
    c.status(500);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

export default blogRouter;
