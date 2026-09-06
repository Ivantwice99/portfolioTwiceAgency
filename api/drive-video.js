const MAX_RANGE_BYTES = 4 * 1024 * 1024;

function getDriveFileId(value = "") {
  const url = String(value || "");
  const pathMatch = url.match(/\/d\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  return queryMatch ? queryMatch[1] : "";
}

function getResourceKey(value = "") {
  const rawValue = String(value || "");
  if (!rawValue.includes("?") && !rawValue.includes("&")) return rawValue;
  try {
    return new URL(rawValue).searchParams.get("resourcekey") || "";
  } catch {
    return "";
  }
}

function capRange(range) {
  const match = String(range || "").match(/^bytes=(\d+)-(\d*)$/i);
  if (!match) return `bytes=0-${MAX_RANGE_BYTES - 1}`;

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : start + MAX_RANGE_BYTES - 1;
  const end = Math.min(requestedEnd, start + MAX_RANGE_BYTES - 1);
  return `bytes=${start}-${Math.max(start, end)}`;
}

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");
  response.setHeader("Access-Control-Expose-Headers", "Accept-Ranges, Content-Length, Content-Range, Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (!["GET", "HEAD"].includes(request.method)) {
    response.setHeader("Allow", "GET, HEAD, OPTIONS");
    sendJson(response, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  const rawId = String(request.query?.id || "");
  const id = getDriveFileId(rawId) || rawId;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    sendJson(response, 400, { ok: false, message: "Invalid Drive file id" });
    return;
  }

  const resourceKey = getResourceKey(request.query?.resourcekey || "");
  const upstreamUrl = new URL("https://drive.usercontent.google.com/download");
  upstreamUrl.searchParams.set("id", id);
  upstreamUrl.searchParams.set("export", "download");
  upstreamUrl.searchParams.set("confirm", "t");
  if (resourceKey) upstreamUrl.searchParams.set("resourcekey", resourceKey);

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Range: capRange(request.headers.range)
      }
    });

    if (!upstream.ok && upstream.status !== 206) {
      sendJson(response, 502, { ok: false, message: "Drive did not return a video stream" });
      return;
    }

    response.status(upstream.status);
    response.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
    response.setHeader("Accept-Ranges", "bytes");
    response.setHeader("Cache-Control", "private, no-store");

    for (const name of ["content-length", "content-range", "etag", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) response.setHeader(name, value);
    }

    if (request.method === "HEAD" || !upstream.body) {
      response.end();
      return;
    }

    const { Readable } = require("node:stream");
    Readable.fromWeb(upstream.body).pipe(response);
  } catch {
    sendJson(response, 502, { ok: false, message: "Could not load the Drive video" });
  }
};
