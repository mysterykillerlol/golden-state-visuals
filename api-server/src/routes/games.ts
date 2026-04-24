import { Router, type IRouter } from "express";
import { db, gamesTable, articlesTable, galleriesTable, galleryImagesTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import {
  CreateGameBody,
  UpdateGameBody,
  GetGameParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serializeGame(g: typeof gamesTable.$inferSelect) {
  return {
    id: g.id,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
    date: g.date.toISOString(),
    location: g.location,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
    category: g.category,
    sport: g.sport,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  };
}

router.get("/games", async (_req, res) => {
  const rows = await db
    .select()
    .from(gamesTable)
    .orderBy(desc(gamesTable.date));
  res.json(rows.map(serializeGame));
});

router.get("/games/:id", async (req, res) => {
  const parsed = GetGameParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const id = parsed.data.id;
  const rows = await db.select().from(gamesTable).where(eq(gamesTable.id, id));
  const game = rows[0];
  if (!game) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  const articleRows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.gameId, id))
    .orderBy(desc(articlesTable.createdAt));
  const galleryRows = await db
    .select()
    .from(galleriesTable)
    .where(eq(galleriesTable.gameId, id))
    .orderBy(desc(galleriesTable.createdAt));
  const galleries = await Promise.all(
    galleryRows.map(async (gallery) => {
      const images = await db
        .select()
        .from(galleryImagesTable)
        .where(eq(galleryImagesTable.galleryId, gallery.id))
        .orderBy(asc(galleryImagesTable.position));
      return {
        id: gallery.id,
        title: gallery.title,
        description: gallery.description,
        coverImage: gallery.coverImage,
        category: gallery.category,
        gameId: gallery.gameId,
        game: serializeGame(game),
        images: images.map((i) => ({
          id: i.id,
          url: i.url,
          caption: i.caption,
          position: i.position,
        })),
        createdAt: gallery.createdAt.toISOString(),
        updatedAt: gallery.updatedAt.toISOString(),
      };
    }),
  );
  res.json({
    game: serializeGame(game),
    articles: articleRows.map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.subtitle,
      body: a.body,
      coverImage: a.coverImage,
      category: a.category,
      author: a.author,
      featured: a.featured,
      gameId: a.gameId,
      game: serializeGame(game),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    galleries,
  });
});

router.post("/games", requireAdmin, async (req, res) => {
  const parsed = CreateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request", errors: parsed.error.errors });
    return;
  }
  const data = parsed.data;
  const date = new Date(data.date);
  if (isNaN(date.getTime())) {
    res.status(400).json({ message: "Invalid date" });
    return;
  }
  const [created] = await db
    .insert(gamesTable)
    .values({
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      date,
      location: data.location,
      homeScore: data.homeScore ?? null,
      awayScore: data.awayScore ?? null,
      category: data.category,
      sport: data.sport,
    })
    .returning();
  res.status(201).json(serializeGame(created!));
});

router.patch("/games/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.homeTeam !== undefined) updates.homeTeam = data.homeTeam;
  if (data.awayTeam !== undefined) updates.awayTeam = data.awayTeam;
  if (data.location !== undefined) updates.location = data.location;
  if (data.category !== undefined) updates.category = data.category;
  if (data.sport !== undefined) updates.sport = data.sport;
  if (data.homeScore !== undefined) updates.homeScore = data.homeScore;
  if (data.awayScore !== undefined) updates.awayScore = data.awayScore;
  if (data.date !== undefined) {
    const d = new Date(data.date);
    if (isNaN(d.getTime())) {
      res.status(400).json({ message: "Invalid date" });
      return;
    }
    updates.date = d;
  }
  const [updated] = await db
    .update(gamesTable)
    .set(updates)
    .where(eq(gamesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  res.json(serializeGame(updated));
});

router.delete("/games/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(gamesTable).where(eq(gamesTable.id, id));
  res.json({ ok: true });
});

export default router;
