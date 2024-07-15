import { Hono } from "hono";
import { sign } from "hono/jwt";
import getPrismaInstance from "../../db";
import { signInSchema, signUpSchema } from "@vaibhav314/blogging-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const body = await c.req.json();
    const {success,data,error} = signUpSchema.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        error
      })
    }

    const { username, email, password } = data;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: password,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    c.status(201);
    return c.json({
      user,
      token: jwt,
    });
  } catch (error) {
    c.status(500);
    console.log(error);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

userRouter.post("/signin", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const body = await c.req.json();

    const {success,data,error} = signInSchema.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        error
      })
    }


    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json("No such user found!");
    }

    if (user.passwordHash != password) {
      c.status(401);
      return c.json("Wrong password!");
    }

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    c.status(200);
    return c.json({
      token: jwt,
    });
  } catch (error) {
    c.status(500);
    console.log(error);
    return c.json({
      message: "An unexpected error occurred!",
    });
  }
});

export default userRouter;
