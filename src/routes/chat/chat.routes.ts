import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import { insertChatsSchema, insertMessagesSchema, MessageStatusEnum, selectChatsSchema, selectMessagesSchema } from "@/db/schema";
import { verifyJwt } from "@/middlewares/jwt-verify";

const tags = ["Chat"];

export const startChat = createRoute({
  description: "Start a chat",
  path: "/chat/start",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      insertChatsSchema,
      "Start a chat",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        chat: selectChatsSchema,
      }),
      "Created chat",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Bad request",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertChatsSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized",
    ),
  },
  middleware: [verifyJwt()] as const,
});

export const sendMessage = createRoute({
  description: "Send a message in a chat",
  path: "/chat/send",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      insertMessagesSchema,
      "Sends a message",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        message: selectMessagesSchema,
      }),
      "Success",
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMessagesSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Bad request",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized",
    ),
  },
  middleware: [verifyJwt()] as const,
});

export const getChatHistory = createRoute({
  description: "Get chat history by chat id",
  path: "/chat/history/{id}",
  method: "get",
  tags,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        messages: z.array(selectMessagesSchema),
      }),
      "Success",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized",
    ),
  },
  middleware: [verifyJwt()] as const,
});

export const updateMessageStatus = createRoute({
  description: "Update message status",
  path: "/chat/message/{id}/status",
  method: "patch",
  tags,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(
      z.object({
        status: MessageStatusEnum,
      }),
      "Update message status",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: selectMessagesSchema,
      }),
      "Success",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Bad request",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMessagesSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized",
    ),
  },
  middleware: [verifyJwt()] as const,
});

export const listUserChats = createRoute({
  description: "Get chats by user id",
  path: "/chats/user/{id}",
  method: "get",
  tags,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        chats: z.array(selectChatsSchema),
      }),
      "Success",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Bad request",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized",
    ),
  },
  middleware: [verifyJwt()] as const,
});

export const getChatMetaData = createRoute({
  description: "Get chat metadata by chat id",
  path: "/chat/metadata/{id}",
  method: "get",
  tags,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        users: z.array(z.object({
          name: z.string(),
          email: z.string().email(),
        })),
        usersCount: z.number(),
        messagesCount: z.number(),
      }),
      "Success",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Bad request",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized",
    ),
  },
  middleware: [verifyJwt()] as const,
});

export type StartChatRoute = typeof startChat;
export type SendMessageRoute = typeof sendMessage;
export type GetChatHistoryRoute = typeof getChatHistory;
export type UpdateMessageStatusRoute = typeof updateMessageStatus;
export type ListUserChatsRoute = typeof listUserChats;
export type GetChatMetaDataRoute = typeof getChatMetaData;
