import { Router, type IRouter } from "express";
import {
  db,
  articlesTable,
  galleriesTable,
  gamesTable,
  galleryImagesTable,
} from "@workspace/db";
import { eq, desc, asc, gte, and } from "drizzle-orm";

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

router.get("/home/featured", async (_req, res) => {
  const featuredRows = await db
    .select({ article: articlesTable, game: gamesTable })
    .from(articlesTable)
    .leftJoin(gamesTable, eq(articlesTable.gameId, gamesTable.id))
    .where(
      and(
        eq(articlesTable.featured, true),
        eq(articlesTable.published, true),
      ),
    )
    .orderBy(desc(articlesTable.createdAt))
    .limit(1);

  let heroRow = featuredRows[0];
  if (!heroRow) {
    const fallback = await db
      .select({ article: articlesTable, game: gamesTable })
      .from(articlesTable)
      .leftJoin(gamesTable, eq(articlesTable.gameId, gamesTable.id))
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.createdAt))
      .limit(1);
    heroRow = fallback[0];
  }

  const now = new Date();
  const upcoming = await db
    .select()
    .from(gamesTable)
    .where(gte(gamesTable.date, now))
    .orderBy(asc(gamesTable.date))
    .limit(1);
  let gameOfTheWeek = upcoming[0];
  if (!gameOfTheWeek) {
    const past = await db
      .select()
      .from(gamesTable)
      .orderBy(desc(gamesTable.date))
      .limit(1);
    gameOfTheWeek = past[0];
  }

  const latestRows = await db
    .select({ article: articlesTable, game: gamesTable })
    .from(articlesTable)
    .leftJoin(gamesTable, eq(articlesTable.gameId, gamesTable.id))
    .where(eq(articlesTable.published, true))
    .orderBy(desc(articlesTable.createdAt))
    .limit(12);

  const galleryRows = await db
    .select({ gallery: galleriesTable, game: gamesTable })
    .from(galleriesTable)
    .leftJoin(gamesTable, eq(galleriesTable.gameId, gamesTable.id))
    .where(eq(galleriesTable.published, true))
    .orderBy(desc(galleriesTable.createdAt))
    .limit(6);

  const galleries = await Promise.all(
    galleryRows.map(async (r) => {
      const images = await db
        .select()
        .from(galleryImagesTable)
        .where(eq(galleryImagesTable.galleryId, r.gallery.id))
        .orderBy(asc(galleryImagesTable.position));
      return {
        id: r.gallery.id,
        title: r.gallery.title,
        description: r.gallery.description,
        coverImage: r.gallery.coverImage,
        category: r.gallery.category,
        gameId: r.gallery.gameId,
        game: serializeGame(r.game),
        published: r.gallery.published,
        images: images.map((i) => ({
          id: i.id,
          url: i.url,
          caption: i.caption,
          position: i.position,
        })),
        createdAt: r.gallery.createdAt.toISOString(),
        updatedAt: r.gallery.updatedAt.toISOString(),
      };
    }),
  );

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

  res.json({
    hero: heroRow ? serializeArticle(heroRow.article, heroRow.game) : null,
    gameOfTheWeek: gameOfTheWeek ? serializeGame(gameOfTheWeek) : null,
    latest: latestRows.map((r) => serializeArticle(r.article, r.game)),
    featuredGalleries: galleries,
  });
});

export default router;
