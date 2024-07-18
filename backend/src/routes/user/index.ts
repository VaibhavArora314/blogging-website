import { Hono } from "hono";
import { sign } from "hono/jwt";
import getPrismaInstance from "../../utils/db";
import {
  signInSchema,
  signInType,
  signUpSchema,
  signUpType,
} from "@vaibhav314/blogging-common";
import { hashPassword, verifyPassword } from "../../utils/hash";
import uploadImage from "../../utils/imageUpload";
import checkAuthHeader from "../../utils/checkAuthHeader";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLOUD_NAME: string;
    UPLOAD_PRESET_NAME: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const body = await c.req.parseBody();
    const { success, data, error } = signUpSchema.safeParse(body);

    if (!success) {
      c.status(411);

      type errorType = Partial<
        Pick<signUpType, "email" | "password" | "username">
      >;
      const formattedError: errorType = {};

      error.issues.forEach((issue) => {
        formattedError[issue.path[0] as keyof errorType] = issue.message;
      });

      return c.json({
        error: formattedError,
      });
    }

    const { username, email, password, image } = data;

    const passwordHash = await hashPassword(password);

    let url = "";
    if (image) {
      url = await uploadImage(
        c.env.CLOUD_NAME,
        c.env.UPLOAD_PRESET_NAME,
        image
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        profilePicture: url,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
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
      error: {
        other: "An unexpected error occurred!",
      },
    });
  }
});

userRouter.post("/signin", async (c) => {
  try {
    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const body = await c.req.json();

    const { success, data, error } = signInSchema.safeParse(body);

    if (!success) {
      c.status(411);

      type errorType = Partial<Pick<signInType, "email" | "password">>;
      const formattedError: errorType = {};

      error.issues.forEach((issue) => {
        formattedError[issue.path[0] as keyof errorType] = issue.message;
      });

      return c.json({
        error: formattedError,
      });
    }

    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: { other: "No such user found!" } });
    }

    const isPasswordSame = await verifyPassword(user.passwordHash, password);

    if (!isPasswordSame) {
      c.status(401);
      return c.json({ error: { other: "Wrong password!" } });
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
      error: { other: "An unexpected error occurred!" },
    });
  }
});

userRouter.get("/me", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");

    const userId = await checkAuthHeader(authHeader, c.env.JWT_SECRET);

    if (!userId) {
      c.status(401);
      return c.json({
        message: "Invalid token/format",
      });
    }

    const prisma = getPrismaInstance(c.env.DATABASE_URL);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "No such user exists!",
      });
    }

    c.status(200);
    return c.json({
      user,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Error fetching user details!",
    });
  }
});

export default userRouter;
