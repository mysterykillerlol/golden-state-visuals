import { Router, type IRouter } from "express";
import {
  db,
  articlesTable,
  postsTable,
  galleriesTable,
  galleryImagesTable,
  gamesTable,
} from "@workspace/db";
import { sql, eq, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const [
    [{ count: totalArticles }],
    [{ count: publishedArticles }],
    [{ count: totalPosts }],
    [{ count: totalGalleries }],
    [{ count: totalGames }],
    [{ count: totalImages }],
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(articlesTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(articlesTable)
      .where(eq(articlesTable.published, true)),
    db.select({ count: sql<number>`count(*)::int` }).from(postsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(galleriesTable),
    db.select({ count: sql<number>`count(*)::int` }).from(gamesTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(galleryImagesTable),
  ]);

  const recent = await db
    .select({
      id: galleryImagesTable.id,
      url: galleryImagesTable.url,
      galleryId: galleryImagesTable.galleryId,
      galleryTitle: galleriesTable.title,
      createdAt: galleryImagesTable.createdAt,
    })
    .from(galleryImagesTable)
    .leftJoin(
      galleriesTable,
      eq(galleryImagesTable.galleryId, galleriesTable.id),
    )
    .orderBy(desc(galleryImagesTable.createdAt))
    .limit(8);

  res.json({
    totalArticles,
    publishedArticles,
    draftArticles: totalArticles - publishedArticles,
    totalPosts,
    totalGalleries,
    totalGames,
    totalImages,
    recentUploads: recent.map((r) => ({
      id: r.id,
      url: r.url,
      galleryId: r.galleryId,
      galleryTitle: r.galleryTitle ?? "Untitled gallery",
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

export default router;
