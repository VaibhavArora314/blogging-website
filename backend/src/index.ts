import { Hono } from "hono";
import rootRouter from "./routes";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route('/api/v1',rootRouter);

export default app;
