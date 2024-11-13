import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import type { AppBindings } from "@/lib/types";

import { pinoLogger } from "@/middlewares/pino-logger";
import { rateLimitter } from "@/middlewares/rate-limit";
import defaultHook from "@/openapi/default-hook";

import { connectionInit } from "./connection";

connectionInit();

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon("💬"));

  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}
