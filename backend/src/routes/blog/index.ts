import { Hono } from "hono";
import { verify } from "hono/jwt";
import getPrismaInstance from "../../utils/db";
import {
  createBlogSchema,
  updateBlogSchema,
  updateBlogType,
} from "@vaibhav314/blogging-common";
import uploadImage from "../../utils/imageUpload";

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

    if (!authHeader || authHeader.split(" ")[0] != "Bearer") {
      c.status(401);
      return c.json({
        message: "Invalid token/format",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload || !payload.id) {
      c.status(401);
      return c.json({
        message: "Invalid token/format",
      });
    }

    c.set("userId", String(payload?.id));
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

    const blogs = await prisma.blog.findMany({
      where: {},
      select: {
        id: true,
        title: true,
        content: true,
        bannerImage: true,
        category: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    c.status(200);
    return c.json({
      blogs: blogs,
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
      return c.json({
        error,
      });
    }

    const { title, content, category, image } = data;

    let url = "";
    if (image) {
      url = await uploadImage(c.env.CLOUD_NAME,c.env.UPLOAD_PRESET_NAME,image);
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
        category,
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
        category: true,
        author: {
          select: {
            id: true,
            username: true,
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
