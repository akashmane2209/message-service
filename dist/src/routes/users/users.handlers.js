import { eq, getTableColumns } from "drizzle-orm";
import { setCookie, } from "hono/cookie";
import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "../../db/index.js";
import { users } from "../../db/schema.js";
import { compare, hash } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
export const registerUser = async (c) => {
    const { name, email, password } = c.req.valid("json");
    const hashedPassword = await hash(password);
    const [user] = await db.insert(users).values({ name, email, password: hashedPassword }).returning();
    return c.json({ user }, HttpStatusCodes.CREATED);
};
export const loginUser = async (c) => {
    const { email, password } = c.req.valid("json");
    const [user] = await db.select().from(users).where(users => eq(users.email, email));
    if (!user) {
        return c.json({
            message: "User not found",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const isPasswordCorrect = await compare(password, user.password);
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
export const getUserById = async (c) => {
    const { id } = c.req.valid("param");
    const { password, ...nonPwCols } = getTableColumns(users);
    const [user] = await db.select(nonPwCols).from(users).where(users => eq(users.id, id));
    return c.json({ user }, HttpStatusCodes.OK);
};
