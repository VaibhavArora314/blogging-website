import { Hono } from "hono";
import rootRouter from "./routes";
import { cors } from "hono/cors";

const app = new Hono();


app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use('/api/*', cors())
app.route('/api/v1',rootRouter);

export default app;
