import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import worker from "../worker.mjs";
import { capRange, serveDriveVideo } from "../drive-video.mjs";

const originalFetch = globalThis.fetch;
const originalClient = process.env.GOOGLE_CLIENT_ID;
const originalToken = process.env.GITHUB_CONTENTS_TOKEN;
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of [["GOOGLE_CLIENT_ID", originalClient], ["GITHUB_CONTENTS_TOKEN", originalToken]]) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("ranges preserve seeking and cap each response to 4 MiB", () => {
  assert.equal(capRange(null), "bytes=0-4194303");
  assert.equal(capRange("bytes=0-15"), "bytes=0-15");
  assert.equal(capRange("bytes=5000000-"), "bytes=5000000-9194303");
  assert.equal(capRange("bytes=5000000-20000000"), "bytes=5000000-9194303");
  assert.equal(capRange("bytes=-128"), "bytes=-128");
  for (const value of ["bytes=10-1", "bytes=-0", "bytes=0-1,5-10", "bytes=abc-"]) assert.equal(capRange(value), null);
});

test("Drive streams exact ranges, content length and resource key", async () => {
  const request = new Request("https://portfolio.test/api/drive-video?id=drive_id&resourcekey=key", { headers: { Range: "bytes=8-11" } });
  const response = await serveDriveVideo(request, async (url, options) => {
    assert.equal(url.hostname, "drive.usercontent.google.com");
    assert.equal(url.searchParams.get("id"), "drive_id");
    assert.equal(url.searchParams.get("resourcekey"), "key");
    assert.equal(options.headers.Range, "bytes=8-11");
    return new Response(new Uint8Array([1, 2, 3, 4]), { status: 206, headers: { "Content-Type": "video/mp4", "Content-Range": "bytes 8-11/100", "Content-Length": "4" } });
  });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), "bytes 8-11/100");
  assert.equal(response.headers.get("Content-Length"), "4");
  assert.equal(response.headers.get("Vary"), "Range");
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2, 3, 4]);
});

test("Drive HEAD has no body and OPTIONS permits range requests", async () => {
  const response = await serveDriveVideo(new Request("https://portfolio.test/api/drive-video?id=drive_id", { method: "HEAD" }), async (url, options) => {
    assert.equal(options.method, "HEAD");
    return new Response(null, { status: 206, headers: { "Content-Type": "video/mp4", "Content-Range": "bytes 0-3/10", "Content-Length": "4" } });
  });
  assert.equal(await response.text(), "");
  const options = await serveDriveVideo(new Request("https://portfolio.test/api/drive-video", { method: "OPTIONS" }));
  assert.equal(options.status, 204);
  assert.match(options.headers.get("Access-Control-Allow-Headers"), /Range/);
});

test("Drive rejects HTML, network failures, invalid IDs and invalid ranges", async () => {
  const request = new Request("https://portfolio.test/api/drive-video?id=drive_id");
  assert.equal((await serveDriveVideo(request, async () => new Response("sign in", { headers: { "Content-Type": "text/html" } }))).status, 502);
  assert.equal((await serveDriveVideo(request, async () => { throw new Error("network"); })).status, 502);
  assert.equal((await serveDriveVideo(new Request("https://portfolio.test/api/drive-video?id=bad%2Fid"))).status, 400);
  assert.equal((await serveDriveVideo(new Request(request, { headers: { Range: "bytes=30-5" } }))).status, 416);
  assert.equal((await serveDriveVideo(new Request(request, { method: "POST" }))).status, 405);
});

test("admin config uses Worker bindings without disclosing the GitHub secret", async () => {
  process.env.GOOGLE_CLIENT_ID = "test-client";
  process.env.GITHUB_CONTENTS_TOKEN = "secret-never-public";
  const response = await worker.fetch(new Request("https://portfolio.test/api/admin/config"), {});
  const data = await response.json();
  assert.equal(data.googleClientId, "test-client");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.ok(!JSON.stringify(data).includes("secret-never-public"));
  assert.equal((await worker.fetch(new Request("https://portfolio.test/api/admin/config", { method: "DELETE" }), {})).status, 405);
});

test("admin rejects malformed bodies, missing tokens and unsupported methods", async () => {
  process.env.GOOGLE_CLIENT_ID = "test-client";
  for (const body of ["{", "null", "[]"]) {
    assert.equal((await worker.fetch(new Request("https://portfolio.test/api/admin/videos", { method: "POST", body }), {})).status, 400);
  }
  const response = await worker.fetch(new Request("https://portfolio.test/api/admin/videos", { method: "POST", body: JSON.stringify({ action: "save", videos: [] }) }), {});
  assert.equal((await response.json()).ok, false);
  assert.equal((await worker.fetch(new Request("https://portfolio.test/api/admin/videos"), {})).status, 405);
});

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "test-key", alg: "RS256", use: "sig" };
function token(overrides = {}) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", kid: "test-key" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iss: "https://accounts.google.com", aud: "test-client", exp: Math.floor(Date.now() / 1000) + 60, email_verified: true, email: "vaguacateman@gmail.com", ...overrides })).toString("base64url");
  const body = `${header}.${payload}`;
  return `${body}.${sign("RSA-SHA256", Buffer.from(body), privateKey).toString("base64url")}`;
}
function adminRequest(credential, extra = {}) {
  return new Request("https://portfolio.test/api/admin/videos", { method: "POST", body: JSON.stringify({ credential, action: "verify", ...extra }) });
}

test("admin verifies actual RSA signatures and only admits the designated verified email", async () => {
  process.env.GOOGLE_CLIENT_ID = "test-client";
  globalThis.fetch = async url => {
    assert.equal(String(url), "https://www.googleapis.com/oauth2/v3/certs");
    return Response.json({ keys: [jwk] });
  };
  const allowed = await worker.fetch(adminRequest(token()), {});
  assert.equal(allowed.status, 200);
  assert.equal((await allowed.json()).profile.email, "vaguacateman@gmail.com");
  for (const invalid of [{ email: "other@example.com" }, { aud: "other-client" }, { exp: 1 }, { email_verified: false }]) {
    const response = await worker.fetch(adminRequest(token(invalid)), {});
    assert.equal(response.status, 403);
    assert.equal((await response.json()).ok, false);
  }
  const forged = token().split(".");
  forged[2] = Buffer.alloc(256).toString("base64url");
  assert.equal((await worker.fetch(adminRequest(forged.join(".")), {})).status, 403);
});

test("authenticated save retains video normalization and writes to GitHub server-side", async () => {
  process.env.GOOGLE_CLIENT_ID = "test-client";
  process.env.GITHUB_CONTENTS_TOKEN = "test-github-token";
  const writes = [];
  globalThis.fetch = async (url, options) => {
    if (String(url).includes("googleapis.com/oauth2/v3/certs")) return Response.json({ keys: [jwk] });
    assert.match(String(url), /^https:\/\/api.github.com\/repos\//);
    assert.equal(options.headers.Authorization, "Bearer test-github-token");
    if (options.method === "PUT") {
      writes.push(JSON.parse(options.body));
      return Response.json({ commit: { sha: "saved-commit" } });
    }
    return Response.json({ sha: "old-sha" });
  };
  const video = { code: "MDV-01", uid: "example-01", previewUrl: "https://drive.google.com/file/d/drive_id/view", title: { en: "Example" }, description: { en: "Portfolio" } };
  const response = await worker.fetch(adminRequest(token(), { action: "save", videos: [video] }), {});
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.commit, "saved-commit");
  assert.equal(result.videos[0].previewUrl, "https://drive.google.com/file/d/drive_id/preview");
  assert.equal(writes.length, 1);
  assert.equal(JSON.parse(Buffer.from(writes[0].content, "base64").toString()).updatedBy, "vaguacateman@gmail.com");
  const youtube = await worker.fetch(adminRequest(token(), {
    action: "save",
    videos: [{ ...video, previewUrl: "https://youtu.be/2kxwN11-hXs" }]
  }), {});
  assert.equal(youtube.status, 200);
  const youtubeData = await youtube.json();
  assert.equal(youtubeData.videos[0].previewUrl, "https://www.youtube-nocookie.com/embed/2kxwN11-hXs");
  assert.equal(youtubeData.videos[0].thumbnailUrl, "https://i.ytimg.com/vi/2kxwN11-hXs/hqdefault.jpg");
});

test("unknown API paths are JSON 404, static files use ASSETS", async () => {
  assert.equal((await worker.fetch(new Request("https://portfolio.test/api/missing"), {})).status, 404);
  const response = await worker.fetch(new Request("https://portfolio.test/styles.css"), { ASSETS: { fetch: async () => new Response("body{}", { headers: { "Content-Type": "text/css" } }) } });
  assert.equal(await response.text(), "body{}");
});

test("public build contains exactly the permitted roots, never API sources", async () => {
  const roots = await readdir(new URL("../dist/", import.meta.url));
  assert.deepEqual(roots.sort(), ["assets", "index.html", "script.js", "styles.css"]);
  const data = JSON.parse(await readFile(new URL("../dist/assets/data/youtube-clients.json", import.meta.url), "utf8"));
  assert.ok(data.channels.some(channel => channel.handle === "CleanShelf"));
});
