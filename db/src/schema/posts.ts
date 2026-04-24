import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  author: text("author").notNull().default("GSV Staff"),
  category: text("category"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type PostRow = typeof postsTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
