import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { gamesTable } from "./games";

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  body: text("body").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  category: text("category").notNull(),
  author: text("author").notNull().default("GSV Staff"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  gameId: integer("game_id").references(() => gamesTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ArticleRow = typeof articlesTable.$inferSelect;
export type InsertArticle = typeof articlesTable.$inferInsert;
