import { servePortfolioAssets } from "./public-assets.mjs";

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === "/api" || path.startsWith("/api/")) {
      // Keep Google verification and GitHub secrets in the existing backend.
      return env.PORTFOLIO_API.fetch(request);
    }
    return servePortfolioAssets(request, env);
  }
};
