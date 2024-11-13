import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";
import { z } from "zod";
import { selectUsersSchema } from "../../db/schema.js";
import { verifyJwt } from "../../middlewares/jwt-verify.js";
const tags = ["Users"];
export const registerUser = createRoute({
    path: "/users/register",
    method: "post",
    tags,
    request: {
        body: jsonContentRequired(z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(1).max(500),
        }), "Register user"),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(z.object({
            user: selectUsersSchema.omit({ password: true }),
        }), "User details"),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(createMessageObjectSchema("Bad request"), "Bad request"),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createMessageObjectSchema("Unprocessable entity"), "Unprocessable entity"),
    },
});
export const loginUser = createRoute({
    path: "/users/login",
    method: "post",
    tags,
    request: {
        body: jsonContentRequired(z.object({
            email: z.string().email(),
            password: z.string().min(1).max(500),
        }), "Login user"),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
            user: selectUsersSchema.omit({ password: true }),
        }), "User details"),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(createMessageObjectSchema("Bad request"), "Bad request"),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createMessageObjectSchema("Unprocessable entity"), "Unprocessable entity"),
    },
});
export const getUser = createRoute({
    path: "/users/{id}",
    method: "get",
    tags,
    request: {
        params: IdUUIDParamsSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
            user: selectUsersSchema.omit({ password: true }),
        }), "User details"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Not found"), "Not found"),
    },
    middleware: [verifyJwt()],
});
