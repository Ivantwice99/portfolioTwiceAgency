import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = new URL("../", import.meta.url);
const output = new URL("./pages-dist/", import.meta.url);
await mkdir(output, { recursive: true });
for (const path of ["index.html", "script.js", "styles.css", "assets"]) {
  await cp(new URL(path, root), new URL(path, output), { recursive: true });
}
await build({
  entryPoints: [fileURLToPath(new URL("./pages-worker.mjs", import.meta.url))],
  outfile: fileURLToPath(new URL("_worker.js", output)),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022"
});
console.log("Cloudflare Pages prepared with the existing private API service binding.");
