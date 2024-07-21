import { Hono } from "hono";
import getPrismaInstance from "../../utils/db";
import {
  createBlogSchema,
  createBlogType,
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
  if (c.req.method == "GET") {
    await next();
    return;
  }

  try {
    const authHeader = c.req.header("Authorization");

    const userId = await checkAuthHeader(authHeader, c.env.JWT_SECRET);

    if (!userId) {
      c.status(401);
      return c.json({
        message: "Invalid token/format",
      });
    }

    c.set("userId", userId);
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

    console.log(searchQuery);

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

      type errorType = Partial<Pick<createBlogType, "title" | "content"> & {image: string}>;
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
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
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

export default blogRouter;
