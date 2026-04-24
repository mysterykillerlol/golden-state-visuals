import { Router, type IRouter, type Request } from "express";
import { db, articlesTable, gamesTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  CreateArticleBody,
  UpdateArticleBody,
  ListArticlesQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

function isAdmin(req: Request): boolean {
  return Boolean(req.session?.userId);
}

const router: IRouter = Router();

function serializeGame(g: typeof gamesTable.$inferSelect | null | undefined) {
  if (!g) return null;
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

function serializeArticle(
  a: typeof articlesTable.$inferSelect,
  g: typeof gamesTable.$inferSelect | null | undefined,
) {
  return {
    id: a.id,
    title: a.title,
    subtitle: a.subtitle,
    body: a.body,
    coverImage: a.coverImage,
    category: a.category,
    author: a.author,
    featured: a.featured,
    published: a.published,
    gameId: a.gameId,
    game: serializeGame(g),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

router.get("/articles", async (req, res) => {
  const parsed = ListArticlesQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};
  const conditions = [];
  if (params.category) conditions.push(eq(articlesTable.category, params.category));
  if (params.gameId) conditions.push(eq(articlesTable.gameId, params.gameId));
  if (!isAdmin(req)) {
    conditions.push(eq(articlesTable.published, true));
  }

  const rows = await db
    .select({ article: articlesTable, game: gamesTable })
    .from(articlesTable)
    .leftJoin(gamesTable, eq(articlesTable.gameId, gamesTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(articlesTable.createdAt))
    .limit(params.limit ?? 100);

  res.json(rows.map((r) => serializeArticle(r.article, r.game)));
});

router.get("/articles/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const rows = await db
    .select({ article: articlesTable, game: gamesTable })
    .from(articlesTable)
    .leftJoin(gamesTable, eq(articlesTable.gameId, gamesTable.id))
    .where(eq(articlesTable.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    res.status(404).json({ message: "Article not found" });
    return;
  }
  res.json(serializeArticle(row.article, row.game));
});

router.post("/articles", requireAdmin, async (req, res) => {
  const parsed = CreateArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request", errors: parsed.error.errors });
    return;
  }
  const data = parsed.data;
  const [created] = await db
    .insert(articlesTable)
    .values({
      title: data.title,
      subtitle: data.subtitle ?? "",
      body: data.body ?? "",
      coverImage: data.coverImage ?? "",
      category: data.category,
      gameId: data.gameId ?? null,
      author: data.author ?? "GSV Staff",
      featured: data.featured ?? false,
      published: data.published ?? true,
    })
    .returning();
  let game = null;
  if (created!.gameId) {
    const gr = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, created!.gameId));
    game = gr[0] ?? null;
  }
  res.status(201).json(serializeArticle(created!, game));
});

router.patch("/articles/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdateArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const k of [
    "title",
    "subtitle",
    "body",
    "coverImage",
    "category",
    "author",
    "featured",
    "published",
  ] as const) {
    if (data[k] !== undefined) updates[k] = data[k];
  }
  if (data.gameId !== undefined) updates.gameId = data.gameId;

  const [updated] = await db
    .update(articlesTable)
    .set(updates)
    .where(eq(articlesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Article not found" });
    return;
  }
  let game = null;
  if (updated.gameId) {
    const gr = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, updated.gameId));
    game = gr[0] ?? null;
  }
  res.json(serializeArticle(updated, game));
});

router.delete("/articles/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(articlesTable).where(eq(articlesTable.id, id));
  res.json({ ok: true });
});

export default router;
