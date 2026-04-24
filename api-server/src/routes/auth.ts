import { Router, type IRouter } from "express";
import { LoginBody } from "@workspace/api-zod";
import { verifyCredentials, getUserById } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  req.session.userId = user.id;
  res.json(user);
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", async (req, res) => {
  if (!req.session?.userId) {
    res.json({ user: null });
    return;
  }
  const user = await getUserById(req.session.userId);
  res.json({ user });
});

export default router;
