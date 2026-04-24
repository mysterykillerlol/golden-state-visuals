import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { gamesTable } from "./games";

export const galleriesTable = pgTable("galleries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  category: text("category").notNull(),
  published: boolean("published").notNull().default(true),
  gameId: integer("game_id").references(() => gamesTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const galleryImagesTable = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  galleryId: integer("gallery_id")
    .notNull()
    .references(() => galleriesTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GalleryRow = typeof galleriesTable.$inferSelect;
export type InsertGallery = typeof galleriesTable.$inferInsert;
export type GalleryImageRow = typeof galleryImagesTable.$inferSelect;
export type InsertGalleryImage = typeof galleryImagesTable.$inferInsert;
