import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  category: text("category").notNull(),
  sport: text("sport").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Game = typeof gamesTable.$inferSelect;
export type InsertGame = typeof gamesTable.$inferInsert;
