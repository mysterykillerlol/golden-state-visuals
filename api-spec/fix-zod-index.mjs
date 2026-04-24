import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(
  __dirname,
  "..",
  "api-zod",
  "src",
  "index.ts",
);

writeFileSync(
  target,
  'export * from "./generated/api";\n',
  "utf8",
);

console.log("Patched", target);
