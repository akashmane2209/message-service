import { sign, verify } from "hono/jwt";
import env from "../env.js";
export async function generateToken(userId) {
    const token = await sign({ userId }, env.JWT_SECRET);
    return token;
}
export async function verifyToken(token) {
    return await verify(token, env.JWT_SECRET);
}
