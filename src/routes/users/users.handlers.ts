import { eq, getTableColumns } from "drizzle-orm";
import {
  setCookie,
} from "hono/cookie";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { users } from "@/db/schema";
import { compare, hash } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";

import type { GetUserRoute, LoginUserRoute, RegisterUserRoute } from "./users.routes";

export const registerUser: AppRouteHandler<RegisterUserRoute> = async (c) => {
  const { name, email, password } = c.req.valid("json");
  const hashedPassword = await hash(password as string);
  const [user] = await db.insert(users).values({ name, email, password: hashedPassword }).returning();
  return c.json({ user }, HttpStatusCodes.CREATED);
};

export const loginUser: AppRouteHandler<LoginUserRoute> = async (c) => {
  const { email, password } = c.req.valid("json");
  const [user] = await db.select().from(users).where(users => eq(users.email, email));
  if (!user) {
    return c.json({
      message: "User not found",
    }, HttpStatusCodes.BAD_REQUEST);
  }

  const isPasswordCorrect = await compare(password as string, user.password);
  if (!isPasswordCorrect) {
    return c.json({
      message: "Incorrect password",
    }, HttpStatusCodes.BAD_REQUEST);
  }
  const token = await generateToken(user.id);
  setCookie(c, "token", token);
  return c.json({ user: {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } }, HttpStatusCodes.OK);
};

export const getUserById: AppRouteHandler<GetUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { password, ...nonPwCols } = getTableColumns(users);
  const [user] = await db.select(nonPwCols).from(users).where(users => eq(users.id, id));
  return c.json({ user }, HttpStatusCodes.OK);
};
