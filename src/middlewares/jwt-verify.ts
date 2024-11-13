import type { MiddlewareHandler } from "hono";

import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";

import db from "@/db";
import { users } from "@/db/schema";
import { verifyToken } from "@/utils/jwt";

export function verifyJwt(): MiddlewareHandler {
  return async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) {
      return c.json({
        message: "Unauthorized",
      }, 401);
    }
    const verified = await verifyToken(token);
    if (!verified) {
      return c.json({
        message: "Unauthorized",
      }, 401);
    }
    const { userId = "" } = verified;
    const [user] = await db.select().from(users).where(users => eq(users.id, userId));
    c.env.user = user;
    return next();
  };
}
