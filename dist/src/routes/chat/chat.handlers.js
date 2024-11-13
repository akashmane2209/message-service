import { arrayContains, count, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "../../db/index.js";
import { chats, messages, MessageStatusValues, users } from "../../db/schema.js";
export const startChat = async (c) => {
    const { recipients } = c.req.valid("json");
    const duplicateRecipients = new Set(recipients).size !== recipients.length;
    if (duplicateRecipients) {
        return c.json({
            message: "Recipients must be unique",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const chatsPresent = await db.select().from(chats).where(arrayContains(chats.recipients, recipients));
    if (chatsPresent.length > 0) {
        return c.json({
            message: "Chat already exists",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const [chat] = await db.insert(chats).values({
        recipients,
    }).returning();
    return c.json({
        chat,
    }, HttpStatusCodes.CREATED);
};
export const sendMessage = async (c) => {
    const { content, sender, status, type, chatId } = c.req.valid("json");
    const [currentChat] = await db.select().from(chats).where(eq(chats.id, chatId));
    if (!currentChat) {
        return c.json({
            message: "Chat not found",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const isUserPresent = currentChat.recipients.includes(sender);
    if (!isUserPresent) {
        return c.json({
            message: "User not found",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const [message] = await db.insert(messages).values({
        sender,
        status,
        type,
        chatId,
        content,
    }).returning();
    return c.json({ message }, HttpStatusCodes.CREATED);
};
export const getChatHistory = async (c) => {
    const { id } = c.req.valid("param");
    const messages = await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.chatId, id),
    });
    return c.json({ messages }, HttpStatusCodes.OK);
};
export const updateMessageStatus = async (c) => {
    const { status } = c.req.valid("json");
    const { id } = c.req.valid("param");
    const message = await db.query.messages.findFirst({
        where: (messages, { eq }) => eq(messages.id, id),
    });
    if (!message) {
        return c.json({
            message: "Message not found",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const isFailed = message.status === "failed" || status === "failed";
    if (message.status === status) {
        return c.json({
            message: "Message status is already updated",
        }, HttpStatusCodes.BAD_REQUEST);
    }
    const nextStatusIdx = MessageStatusValues.indexOf(message.status) + 1;
    const newStatus = MessageStatusValues[nextStatusIdx];
    if (newStatus === status || isFailed) {
        const [updatedMessage] = await db.update(messages).set({
            status,
        }).where(eq(messages.id, id)).returning();
        return c.json({ message: updatedMessage }, HttpStatusCodes.OK);
    }
    else {
        return c.json({
            message: "Message status is not valid",
        }, HttpStatusCodes.BAD_REQUEST);
    }
};
export const listUserChats = async (c) => {
    const { id } = c.req.valid("param");
    const chat = await db.select().from(chats).where(arrayContains(chats.recipients, [id]));
    return c.json({ chats: chat }, HttpStatusCodes.OK);
};
export const getChatMetaData = async (c) => {
    const { id } = c.req.valid("param");
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    const usersData = await db.select().from(users).where(users => inArray(users.id, chat.recipients));
    const messagesCount = (await db.select({ count: count() }).from(messages).where(eq(messages.chatId, id)))[0].count;
    return c.json({ users: usersData.map(row => ({ name: row.name, email: row.email })), usersCount: usersData.length, messagesCount }, HttpStatusCodes.OK);
};
