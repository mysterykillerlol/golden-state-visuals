import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import gamesRouter from "./games";
import articlesRouter from "./articles";
import galleriesRouter from "./galleries";
import homeRouter from "./home";
import uploadRouter from "./upload";
import postsRouter from "./posts";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(gamesRouter);
router.use(articlesRouter);
router.use(galleriesRouter);
router.use(homeRouter);
router.use(uploadRouter);
router.use(postsRouter);
router.use(statsRouter);

export default router;
