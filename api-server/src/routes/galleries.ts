import { Router, type IRouter, type Request } from "express";
import {
  db,
  galleriesTable,
  galleryImagesTable,
  gamesTable,
} from "@workspace/db";
import { eq, desc, asc, and } from "drizzle-orm";

import {
  CreateGalleryBody,
  UpdateGalleryBody,
  AddGalleryImagesBody,
  ListGalleriesQueryParams,
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

async function loadGalleryImages(galleryId: number) {
  const images = await db
    .select()
    .from(galleryImagesTable)
    .where(eq(galleryImagesTable.galleryId, galleryId))
    .orderBy(asc(galleryImagesTable.position));
  return images.map((i) => ({
    id: i.id,
    url: i.url,
    caption: i.caption,
    position: i.position,
  }));
}

function serializeGallery(
  g: typeof galleriesTable.$inferSelect,
  game: typeof gamesTable.$inferSelect | null | undefined,
  images: Awaited<ReturnType<typeof loadGalleryImages>>,
) {
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    coverImage: g.coverImage,
    category: g.category,
    gameId: g.gameId,
    game: serializeGame(game),
    published: g.published,
    images,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  };
}

router.get("/galleries", async (req, res) => {
  const parsed = ListGalleriesQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};
  const conditions = [];
  if (params.gameId) conditions.push(eq(galleriesTable.gameId, params.gameId));
  if (!isAdmin(req)) {
    conditions.push(eq(galleriesTable.published, true));
  }

  const rows = await db
    .select({ gallery: galleriesTable, game: gamesTable })
    .from(galleriesTable)
    .leftJoin(gamesTable, eq(galleriesTable.gameId, gamesTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(galleriesTable.createdAt))
    .limit(params.limit ?? 100);

  const result = await Promise.all(
    rows.map(async (r) =>
      serializeGallery(r.gallery, r.game, await loadGalleryImages(r.gallery.id)),
    ),
  );
  res.json(result);
});

router.get("/galleries/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const rows = await db
    .select({ gallery: galleriesTable, game: gamesTable })
    .from(galleriesTable)
    .leftJoin(gamesTable, eq(galleriesTable.gameId, gamesTable.id))
    .where(eq(galleriesTable.id, id));
  const row = rows[0];
  if (!row) {
    res.status(404).json({ message: "Gallery not found" });
    return;
  }
  res.json(
    serializeGallery(row.gallery, row.game, await loadGalleryImages(row.gallery.id)),
  );
});

router.post("/galleries", requireAdmin, async (req, res) => {
  const parsed = CreateGalleryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request", errors: parsed.error.errors });
    return;
  }
  const data = parsed.data;
  const [created] = await db
    .insert(galleriesTable)
    .values({
      title: data.title,
      description: data.description ?? "",
      coverImage: data.coverImage ?? "",
      category: data.category,
      gameId: data.gameId ?? null,
      published: data.published ?? true,
    })
    .returning();
  if (data.images && data.images.length) {
    await db.insert(galleryImagesTable).values(
      data.images.map((url, idx) => ({
        galleryId: created!.id,
        url,
        caption: "",
        position: idx,
      })),
    );
  }
  let game = null;
  if (created!.gameId) {
    const gr = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, created!.gameId));
    game = gr[0] ?? null;
  }
  const images = await loadGalleryImages(created!.id);
  res.status(201).json(serializeGallery(created!, game, images));
});

router.patch("/galleries/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdateGalleryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const k of [
    "title",
    "description",
    "coverImage",
    "category",
    "published",
  ] as const) {
    if (data[k] !== undefined) updates[k] = data[k];
  }
  if (data.gameId !== undefined) updates.gameId = data.gameId;

  const [updated] = await db
    .update(galleriesTable)
    .set(updates)
    .where(eq(galleriesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Gallery not found" });
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
  const images = await loadGalleryImages(updated.id);
  res.json(serializeGallery(updated, game, images));
});

router.delete("/galleries/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(galleriesTable).where(eq(galleriesTable.id, id));
  res.json({ ok: true });
});

router.post("/galleries/:id/images", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = AddGalleryImagesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const existing = await db
    .select()
    .from(galleryImagesTable)
    .where(eq(galleryImagesTable.galleryId, id));
  const startIdx = existing.length;
  if (parsed.data.urls.length) {
    await db.insert(galleryImagesTable).values(
      parsed.data.urls.map((url, idx) => ({
        galleryId: id,
        url,
        caption: "",
        position: startIdx + idx,
      })),
    );
  }
  const rows = await db
    .select({ gallery: galleriesTable, game: gamesTable })
    .from(galleriesTable)
    .leftJoin(gamesTable, eq(galleriesTable.gameId, gamesTable.id))
    .where(eq(galleriesTable.id, id));
  const row = rows[0];
  if (!row) {
    res.status(404).json({ message: "Gallery not found" });
    return;
  }
  res.json(
    serializeGallery(row.gallery, row.game, await loadGalleryImages(id)),
  );
});

router.delete("/galleries/:id/images/:imageId", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  if (isNaN(id) || isNaN(imageId)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db
    .delete(galleryImagesTable)
    .where(eq(galleryImagesTable.id, imageId));
  const rows = await db
    .select({ gallery: galleriesTable, game: gamesTable })
    .from(galleriesTable)
    .leftJoin(gamesTable, eq(galleriesTable.gameId, gamesTable.id))
    .where(eq(galleriesTable.id, id));
  const row = rows[0];
  if (!row) {
    res.status(404).json({ message: "Gallery not found" });
    return;
  }
  res.json(
    serializeGallery(row.gallery, row.game, await loadGalleryImages(id)),
  );
});

export default router;
