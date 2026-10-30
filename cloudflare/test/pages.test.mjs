import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import pages from "../pages-worker.mjs";
import backend from "../worker.mjs";

test("Pages forwards the original API request and response through its private service binding", async () => {
  const request = new Request("https://twiceagency.pages.dev/api/admin/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", credential: "test-credential" })
  });
  const result = Response.json({ ok: false }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const response = await pages.fetch(request, {
    PORTFOLIO_API: { async fetch(incoming) {
      assert.equal(incoming, request);
      assert.equal(incoming.headers.get("Content-Type"), "application/json");
      assert.equal((await incoming.json()).credential, "test-credential");
      return result;
    } },
    ASSETS: { fetch() { throw new Error("API must not fall back to HTML"); } }
  });
  assert.equal(response, result);
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("Pages preserves backend rejection of anonymous writes and unknown API routes", async () => {
  const env = { PORTFOLIO_API: { fetch: request => backend.fetch(request, {}) } };
  const rejected = await pages.fetch(new Request("https://twiceagency.pages.dev/api/admin/videos", {
    method: "POST", body: JSON.stringify({ action: "save", videos: [] })
  }), env);
  assert.equal((await rejected.json()).ok, false);
  assert.equal((await pages.fetch(new Request("https://twiceagency.pages.dev/api/missing"), env)).status, 404);
});

test("Pages serves static assets locally rather than through the old public address", async () => {
  const request = new Request("https://twiceagency.pages.dev/styles.css");
  const response = await pages.fetch(request, {
    ASSETS: { async fetch(incoming) {
      assert.equal(incoming, request);
      return new Response("body{}", { headers: { "Content-Type": "text/css" } });
    } },
    PORTFOLIO_API: { fetch() { throw new Error("Static assets must stay in Pages"); } }
  });
  assert.equal(await response.text(), "body{}");
});

test("social preview metadata uses the requested Pages origin and retains the existing HTML", async () => {
  const original = globalThis.HTMLRewriter;
  const metadata = [
    { property: "og:url", content: "https://old.test/" },
    { property: "og:image", content: "https://old.test/image.png" },
    { property: "og:image:secure_url", content: "https://old.test/image.png" },
    { name: "twitter:image", content: "https://old.test/image.png" },
    { name: "description", content: "Freelance video editing portfolio." }
  ];
  globalThis.HTMLRewriter = class {
    on(selector, handler) { assert.equal(selector, "meta"); this.handler = handler; return this; }
    transform(response) {
      for (const entry of metadata) this.handler.element({
        getAttribute: name => entry[name], setAttribute: (name, value) => { entry[name] = value; }
      });
      return response;
    }
  };
  try {
    const response = await pages.fetch(new Request("https://twiceagency.pages.dev/"), {
      ASSETS: { fetch: async () => new Response("unchanged portfolio", {
        headers: { "Content-Type": "text/html", "ETag": "old", "Content-Length": "19" }
      }) }
    });
    assert.equal(await response.text(), "unchanged portfolio");
    assert.equal(response.headers.get("Cache-Control"), "no-cache");
    assert.equal(response.headers.get("ETag"), null);
    assert.equal(response.headers.get("Content-Length"), null);
    assert.equal(metadata[0].content, "https://twiceagency.pages.dev/");
    for (const entry of metadata.slice(1, 4)) assert.match(entry.content, /^https:\/\/twiceagency\.pages\.dev\/assets\/social-preview\.png/);
    assert.equal(metadata[4].content, "Freelance video editing portfolio.");
  } finally {
    if (original === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = original;
  }
});

test("Pages build has only public assets and the bundled entry point, never server secrets", async () => {
  const roots = await readdir(new URL("../pages-dist/", import.meta.url));
  assert.deepEqual(roots.sort(), ["_worker.js", "assets", "index.html", "script.js", "styles.css"]);
  const bundle = await readFile(new URL("../pages-dist/_worker.js", import.meta.url), "utf8");
  assert.match(bundle, /PORTFOLIO_API\.fetch/);
  assert.ok(!bundle.includes("GITHUB_CONTENTS_TOKEN"));
  const config = JSON.parse(await readFile(new URL("../pages/wrangler.jsonc", import.meta.url), "utf8"));
  assert.deepEqual(config.services, [{ binding: "PORTFOLIO_API", service: "twiceagency-portfolio" }]);
});
