import { Hono } from "hono";
import { verify } from "hono/jwt";
import getPrismaInstance from "../../db";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
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

    const body = await c.req.json();
    const { title, content } = body;
    const userId = c.get("userId");

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    c.status(201);
    return c.json({
      message: "Successfully created blog",
      blog,
    });
  } catch (error) {
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
        message: "No such blog exists"
      })
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
    const { title, content } = body;

    const blog = await prisma.blog.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        content,
      },
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
