import configureOpenAPI from "./lib/configure-openapi.js";
import createApp from "./lib/create-app.js";
import { rateLimitter } from "./middlewares/rate-limit.js";
import { ChatRouter } from "./routes/chat/chat.index.js";
import IndexRouter from "./routes/index.js";
import { UserRouter } from "./routes/users/users.index.js";
const app = createApp();
configureOpenAPI(app);
const routes = [
    ChatRouter,
    UserRouter,
    IndexRouter,
];
app.use(rateLimitter());
routes.forEach((route) => {
    app.route("/", route);
});
export default app;
