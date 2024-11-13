import { sign, verify } from "hono/jwt";

import env from "@/env";

export async function generateToken(userId: string) {
  const token = await sign({ userId }, env.JWT_SECRET);
  return token;
}

export async function verifyToken(token: string) {
  return await verify(token, env.JWT_SECRET) as unknown as { userId: string };
}
