import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const ADMIN_EMAIL = "tylershawphoto@gmail.com";
const ADMIN_PASSWORD = "4Lex!gsv";
const ADMIN_NAME = "Tyler Shaw";

export async function ensureAdminUser(): Promise<void> {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, ADMIN_EMAIL))
    .limit(1);
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await db.insert(usersTable).values({
      email: ADMIN_EMAIL,
      passwordHash,
      name: ADMIN_NAME,
    });
  }
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ id: number; email: string; name: string } | null> {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);
  const user = rows[0];
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export async function getUserById(
  id: number,
): Promise<{ id: number; email: string; name: string } | null> {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  const user = rows[0];
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  next();
}
