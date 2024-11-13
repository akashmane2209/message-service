import { createRouter } from "../../lib/create-app.js";
import * as handlers from "./chat.handlers.js";
import * as routes from "./chat.routes.js";
export const ChatRouter = createRouter()
    .openapi(routes.startChat, handlers.startChat)
    .openapi(routes.sendMessage, handlers.sendMessage)
    .openapi(routes.getChatHistory, handlers.getChatHistory)
    .openapi(routes.updateMessageStatus, handlers.updateMessageStatus)
    .openapi(routes.listUserChats, handlers.listUserChats)
    .openapi(routes.getChatMetaData, handlers.getChatMetaData);
