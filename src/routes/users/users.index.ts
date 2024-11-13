import { createRouter } from "@/lib/create-app";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

export const UserRouter = createRouter().openapi(
  routes.getUser,
  handlers.getUserById,
).openapi(
  routes.registerUser,
  handlers.registerUser,
).openapi(
  routes.loginUser,
  handlers.loginUser,
);
