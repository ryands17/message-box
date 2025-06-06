import { Database } from 'bun:sqlite';
import { relations, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
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
// performance tuning
sqlite.exec('pragma journal_mode = WAL');
sqlite.exec('pragma synchronous = NORMAL');
sqlite.exec('pragma journal_size_limit = 67108864');
sqlite.exec('pragma mmap_size = 134217728');
sqlite.exec('pragma cache_size = 2000');
sqlite.exec('pragma busy_timeout = 5000');

export const db = drizzle(sqlite, {
  schema: { user, message, usersMessages, messageAuthor },
});

export type Message = typeof message.$inferSelect;
