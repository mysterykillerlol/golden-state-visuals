import { Router, type IRouter } from "express";
import { upload, publicUrlForFilename } from "../lib/uploads";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.post("/upload", requireAdmin, (req, res, next) => {
  const fileMw = upload.single("file");
  fileMw(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    if (req.file) {
      res.json({ url: publicUrlForFilename(req.file.filename) });
      return;
    }
    const filesMw = upload.array("files", 50);
    filesMw(req, res, (err2) => {
      if (err2) {
        next(err2);
        return;
      }
      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      res.json({ urls: files.map((f) => publicUrlForFilename(f.filename)) });
    });
  });
});

router.post("/upload/multiple", requireAdmin, (req, res, next) => {
  const filesMw = upload.array("files", 50);
  filesMw(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    res.json({ urls: files.map((f) => publicUrlForFilename(f.filename)) });
  });
});

export default router;
