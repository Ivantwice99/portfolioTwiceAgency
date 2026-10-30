export async function servePortfolioAssets(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");
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
