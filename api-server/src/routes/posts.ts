import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { CreatePostBody, UpdatePostBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(p: typeof postsTable.$inferSelect) {
  return {
    id: p.id,
    body: p.body,
    author: p.author,
    category: p.category,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/posts", async (req, res) => {
  const includeUnpublished =
    req.query["includeUnpublished"] === "true" && Boolean(req.session?.userId);
  const limit = req.query["limit"] ? Number(req.query["limit"]) : 50;

  const rows = await db
    .select()
    .from(postsTable)
    .where(includeUnpublished ? undefined : eq(postsTable.published, true))
    .orderBy(desc(postsTable.createdAt))
    .limit(limit);
  res.json(rows.map(serialize));
});

router.get("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const rows = await db.select().from(postsTable).where(eq(postsTable.id, id));
  if (!rows[0]) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json(serialize(rows[0]));
});

router.post("/posts", requireAdmin, async (req, res) => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const data = parsed.data;
  const [created] = await db
    .insert(postsTable)
    .values({
      body: data.body,
      author: data.author ?? "GSV Staff",
      category: data.category ?? null,
      published: data.published ?? true,
    })
    .returning();
  res.status(201).json(serialize(created!));
});

router.patch("/posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.body !== undefined) updates.body = data.body;
  if (data.author !== undefined) updates.author = data.author;
  if (data.category !== undefined) updates.category = data.category;
  if (data.published !== undefined) updates.published = data.published;
  const [updated] = await db
    .update(postsTable)
    .set(updates)
    .where(eq(postsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json(serialize(updated));
});

router.delete("/posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(postsTable).where(eq(postsTable.id, id));
  res.json({ ok: true });
});

export default router;
