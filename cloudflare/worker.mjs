import adminConfig from "../api/admin/config.js";
import adminVideos from "../api/admin/videos.js";
import { serveDriveVideo } from "./drive-video.mjs";

export async function runAdminHandler(handler, request) {
  let body;
  if (request.method === "POST") {
    try {
      body = await request.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid-body");
    } catch {
      return Response.json({ ok: false, message: "Invalid JSON body" }, {
        status: 400,
        headers: { "Cache-Control": "no-store" }
      });
    }
  }
  let result;
  let status = 200;
  const headers = new Headers();
  const response = {
    setHeader(name, value) { headers.set(name, value); },
    status(value) { status = value; return response; },
    json(payload) { result = Response.json(payload, { status, headers }); }
  };
  // The same server-side Google signature and email checks protect both hosts.
  // nodejs_compat populates process.env from the Worker's variables and secrets.
  await handler({ method: request.method, body }, response);
  return result;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "");
    if (path === "/api/drive-video") return serveDriveVideo(request);
    if (path === "/api/admin/config") return runAdminHandler(adminConfig, request);
    if (path === "/api/admin/videos") return runAdminHandler(adminVideos, request);
    if (path.startsWith("/api/")) {
      return Response.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    const asset = await env.ASSETS.fetch(request);
    if ((path === "" || path === "/index.html") && asset.headers.get("Content-Type")?.includes("text/html")) {
      const headers = new Headers(asset.headers);
      headers.delete("Content-Length");
      headers.delete("ETag");
      headers.set("Cache-Control", "no-cache");
      const html = new Response(asset.body, { status: asset.status, headers });
      return new HTMLRewriter().on("meta", {
        element(element) {
          const key = element.getAttribute("property") || element.getAttribute("name");
          if (key === "og:url") element.setAttribute("content", `${url.origin}/`);
          if (["og:image", "og:image:secure_url", "twitter:image"].includes(key)) {
            element.setAttribute("content", `${url.origin}/assets/social-preview.png?v=editing-icon-v1`);
          }
        }
      }).transform(html);
    }
    return asset;
  }
};
