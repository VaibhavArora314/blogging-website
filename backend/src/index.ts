import { Hono } from "hono";
import rootRouter from "./routes";
import { cors } from "hono/cors";

const app = new Hono();

app.use('/*', cors())

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route('/api/v1',rootRouter);

export default app;
