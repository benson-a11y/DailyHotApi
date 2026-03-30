import { handle } from "hono/vercel";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import registry from "../dist/registry.js";

const app = new Hono();

// prettyJSON
app.use(prettyJSON());

// 尾部斜杠重定向
app.use(trimTrailingSlash());

// CORS - allow all origins for API
app.use("*", cors({
  origin: "*",
  allowMethods: ["POST", "GET", "OPTIONS"],
  credentials: true,
}));

// 主路由
app.route("/", registry);

// 首页
app.get("/", (c) => c.json({ name: "DailyHotApi", version: "2.0.8", status: "ok" }));

// 404
app.notFound((c) => c.json({ code: 404, message: "Not Found" }, 404));

// error
app.onError((err, c) => c.json({ code: 500, message: err?.message }, 500));

export default handle(app);
