import path from "node:path";
import fs from "node:fs";
import multer from "multer";

export const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
export const PUBLIC_UPLOAD_PREFIX = "/api/uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safe =
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 10) +
      ext;
    cb(null, safe);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

export function publicUrlForFilename(filename: string): string {
  return `${PUBLIC_UPLOAD_PREFIX}/${filename}`;
}
