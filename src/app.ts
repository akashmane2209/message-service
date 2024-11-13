import configureOpenAPI from "./lib/configure-openapi";
import createApp from "./lib/create-app";
import { rateLimitter } from "./middlewares/rate-limit";
import { ChatRouter } from "./routes/chat/chat.index";
import IndexRouter from "./routes/index";
import { UserRouter } from "./routes/users/users.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  ChatRouter,
  UserRouter,
  IndexRouter,
] as const;

app.use(rateLimitter());
routes.forEach((route) => {
  app.route("/", route);
});

export default app;
