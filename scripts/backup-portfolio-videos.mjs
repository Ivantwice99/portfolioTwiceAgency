import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = JSON.parse(await readFile(new URL("../assets/data/videos.json", import.meta.url), "utf8"));
const destination = resolve(process.argv[2] || fileURLToPath(new URL("../../portfolio-videos/", import.meta.url)));
await mkdir(destination, { recursive: true });
const manifestPath = join(destination, "manifest.json");
const manifest = { exportedAt: new Date().toISOString(), sourceUpdatedAt: source.updatedAt, youtubeChannel: "@Miotismon", videos: [] };

async function fileSize(path) {
  return (await stat(path).catch(() => null))?.size || 0;
}

async function hashFile(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

async function download(video, output) {
  const drive = new URL(video.previewUrl);
  const id = drive.pathname.match(/\/d\/([A-Za-z0-9_-]+)/)?.[1] || drive.searchParams.get("id");
  if (!id) throw new Error("An individual Drive video link is required");
  const url = new URL("https://drive.usercontent.google.com/download");
  url.search = new URLSearchParams({ id, export: "download", confirm: "t" }).toString();
  const resourcekey = drive.searchParams.get("resourcekey");
  if (resourcekey) url.searchParams.set("resourcekey", resourcekey);
  const part = `${output}.part`;

  // Probe the real file size so an interrupted or truncated download is never marked complete.
  const probe = await fetch(url, { headers: { Range: "bytes=0-0" }, signal: AbortSignal.timeout(30000) });
  const total = Number(probe.headers.get("Content-Range")?.match(/\/(\d+)$/)?.[1]);
  const type = probe.headers.get("Content-Type") || "";
  await probe.body?.cancel();
  if (!probe.ok || !/^(video\/|application\/octet-stream)/i.test(type) || !Number.isSafeInteger(total) || total < 1) {
    throw new Error(`Drive did not return a downloadable video (HTTP ${probe.status}, ${type})`);
  }
  if (await fileSize(output) === total) return { bytes: total, sha256: await hashFile(output), reused: true };
  if (await fileSize(output) > 0) throw new Error("Existing final file has a different size; original preserved");
  let offset = await fileSize(part);
  if (offset > total) throw new Error("Partial file is larger than the source; original preserved");
  let failures = 0;
  while (offset < total && failures < 3) {
    try {
      const response = await fetch(url, {
        headers: { Range: `bytes=${offset}-` },
        signal: AbortSignal.timeout(180000)
      });
      const returned = response.headers.get("Content-Range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
      if (response.status !== 206 || !returned || Number(returned[1]) !== offset || Number(returned[3]) !== total || !/^(video\/|application\/octet-stream)/i.test(response.headers.get("Content-Type") || "")) {
        await response.body?.cancel();
        throw new Error("Drive returned an unexpected download range");
      }
      await pipeline(Readable.fromWeb(response.body), createWriteStream(part, { flags: offset ? "a" : "w" }));
      offset = await fileSize(part);
      if (offset > total) throw new Error("Download exceeded the expected size");
      console.log(`${video.code}: ${Math.round(offset / total * 100)}% (${offset}/${total} bytes)`);
    } catch (error) {
      failures += 1;
      offset = await fileSize(part);
      console.log(`${video.code}: download interrupted, attempt ${failures}/3; ${offset} bytes preserved`);
      if (failures === 3) throw error;
      await new Promise(resolve => setTimeout(resolve, 1500 * failures));
    }
  }
  if (offset !== total) throw new Error("Incomplete download; partial file preserved");
  await rename(part, output);
  return { bytes: total, sha256: await hashFile(output), reused: false };
}

for (const [index, video] of source.videos.entries()) {
  const slug = (video.title?.en || video.code).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
  const filename = `${String(index + 1).padStart(2, "0")}-${video.code}-${slug}.mp4`;
  const record = { code: video.code, uid: video.uid, filename, title: video.title?.en || video.code, description: video.description?.en || "", sourceUrl: video.previewUrl, youtube: { visibility: "unlisted", status: "not-uploaded", videoId: "" } };
  console.log(`Downloading ${index + 1}/${source.videos.length}: ${filename}`);
  try {
    Object.assign(record, await download(video, join(destination, filename)), { status: "downloaded" });
  } catch (error) {
    record.status = "failed";
    record.error = error.message;
    console.log(`${video.code}: ${error.message}`);
  }
  manifest.videos.push(record);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
const complete = manifest.videos.filter(video => video.status === "downloaded").length;
console.log(`Saved ${complete}/${manifest.videos.length} videos to ${destination}`);
if (complete !== manifest.videos.length) process.exitCode = 1;
