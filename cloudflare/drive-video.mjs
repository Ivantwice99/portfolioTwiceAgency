const MAX_RANGE_BYTES = 4 * 1024 * 1024;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Content-Type",
  "Access-Control-Expose-Headers": "Accept-Ranges, Content-Length, Content-Range, Content-Type"
};

export function capRange(value) {
  if (!value) return `bytes=0-${MAX_RANGE_BYTES - 1}`;
  const suffix = value.match(/^bytes=-(\d+)$/i);
  if (suffix) {
    const size = Number(suffix[1]);
    return Number.isSafeInteger(size) && size > 0 ? `bytes=-${Math.min(size, MAX_RANGE_BYTES)}` : null;
  }
  const match = value.match(/^bytes=(\d+)-(\d*)$/i);
  if (!match) return null;
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : start + MAX_RANGE_BYTES - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || end < start) return null;
  return `bytes=${start}-${Math.min(end, start + MAX_RANGE_BYTES - 1)}`;
}

function errorResponse(status, message, headers = {}) {
  return Response.json({ ok: false, message }, {
    status,
    headers: { ...corsHeaders, "Cache-Control": "no-store", ...headers }
  });
}

export async function serveDriveVideo(request, fetchUpstream = fetch) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (!["GET", "HEAD"].includes(request.method)) {
    return errorResponse(405, "Method not allowed", { Allow: "GET, HEAD, OPTIONS" });
  }

  const params = new URL(request.url).searchParams;
  const rawId = params.get("id") || "";
  const id = rawId.match(/\/d\/([^/?]+)/)?.[1] || rawId.match(/[?&]id=([^&]+)/)?.[1] || rawId;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return errorResponse(400, "Invalid Drive file id");
  const range = capRange(request.headers.get("Range"));
  if (!range) return errorResponse(416, "Invalid byte range");

  const url = new URL("https://drive.usercontent.google.com/download");
  url.search = new URLSearchParams({ id, export: "download", confirm: "t" }).toString();
  const resourceKey = params.get("resourcekey");
  if (resourceKey) url.searchParams.set("resourcekey", resourceKey);

  try {
    const upstream = await fetchUpstream(url, {
      method: request.method,
      headers: { Range: range },
      redirect: "follow"
    });
    if (upstream.status === 416) {
      await upstream.body?.cancel();
      const contentRange = upstream.headers.get("Content-Range");
      return errorResponse(416, "Range not satisfiable", contentRange ? { "Content-Range": contentRange } : {});
    }
    const type = upstream.headers.get("Content-Type") || "";
    if (!upstream.ok || !/^(video\/|application\/octet-stream\b)/i.test(type)) {
      await upstream.body?.cancel();
      return errorResponse(502, "Drive did not return a video stream");
    }
    const headers = new Headers({
      ...corsHeaders,
      "Content-Type": type,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600",
      Vary: "Range"
    });
    for (const name of ["Content-Length", "Content-Range", "ETag", "Last-Modified"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    if (request.method === "HEAD") await upstream.body?.cancel();
    // Stream directly instead of buffering a large Drive file in Worker memory.
    return new Response(request.method === "HEAD" ? null : upstream.body, { status: upstream.status, headers });
  } catch {
    return errorResponse(502, "Could not load the Drive video");
  }
}
