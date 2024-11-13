import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import db from "../db/index.js";
import { users } from "../db/schema.js";
import { verifyToken } from "../utils/jwt.js";
export function verifyJwt() {
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
