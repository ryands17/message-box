import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql, relations } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { ulid } from 'ulid';

export const user = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text('name').notNull(),
});

export const message = sqliteTable('messages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  content: text('content').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: text('created_by').notNull(),
});

export const usersMessages = relations(user, ({ many }) => ({
  messages: many(message),
}));

export const messageAuthor = relations(message, ({ one }) => ({
  author: one(user, {
    fields: [message.createdBy],
    references: [user.id],
  }),
}));

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, {
  schema: { user, message, usersMessages, messageAuthor },
});

export type Message = typeof message.$inferSelect;
