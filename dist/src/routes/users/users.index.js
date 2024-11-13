import { createRouter } from "../../lib/create-app.js";
import * as handlers from "./users.handlers.js";
import * as routes from "./users.routes.js";
export const UserRouter = createRouter().openapi(routes.getUser, handlers.getUserById).openapi(routes.registerUser, handlers.registerUser).openapi(routes.loginUser, handlers.loginUser);
