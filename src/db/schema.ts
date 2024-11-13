import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const selectUsersSchema = createSelectSchema(users);

export const insertUsersSchema = createInsertSchema(
  users,
  {
    name: z.string().min(1).max(500),
    email: z.string().email(),
    password: z.string().min(1).max(500),
  },
).required({
  name: true,
  email: true,
  password: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchUsersSchema = insertUsersSchema.partial();

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  recipients: text("recipients").array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const selectChatsSchema = createSelectSchema(chats).extend({ recipients: z.array(z.string().uuid()) });

export const insertChatsSchema = createInsertSchema(
  chats,

).extend({ recipients: z.array(z.string().uuid()) }).required({
  recipients: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchChatsSchema = insertChatsSchema.partial();

export const MessageTypeEnum = z.enum(["text", "image", "video"]).optional().default("text");
export const MessageStatusValues = ["pending", "delivered", "read"];
export const MessageStatusEnum = z.enum(["pending", "delivered", "read", "failed"]).optional().default("pending");

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  chatId: uuid("chat_id")
    .notNull(),
  sender: uuid("sender")
    .notNull(),
  content: text("content")
    .notNull(),
  type: text("type").default("text"),
  status: text("status").default("pending"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const selectMessagesSchema = createSelectSchema(messages);

export const insertMessagesSchema = createInsertSchema(
  messages,
).extend({ type: MessageTypeEnum, status: MessageStatusEnum }).required({
  chatId: true,
  sender: true,
  content: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchMessagesSchema = insertMessagesSchema.partial();
