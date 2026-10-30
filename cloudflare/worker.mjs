import adminConfig from "../api/admin/config.js";
import adminVideos from "../api/admin/videos.js";
import { serveDriveVideo } from "./drive-video.mjs";
import { servePortfolioAssets } from "./public-assets.mjs";

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
    return servePortfolioAssets(request, env);
  }
};
