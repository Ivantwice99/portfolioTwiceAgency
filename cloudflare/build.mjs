import { cp, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const output = new URL("./dist/", import.meta.url);

// Only public files belong in the asset upload, never API sources or secrets.
await mkdir(output, { recursive: true });
for (const path of ["index.html", "script.js", "styles.css", "assets"]) {
  await cp(new URL(path, root), new URL(path, output), { recursive: true });
}
console.log("Cloudflare public assets prepared; Vercel files are unchanged.");
