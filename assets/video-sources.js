(function (root) {
  function getYouTubeVideoId(value = "") {
    try {
      const url = new URL(String(value).trim());
      if (!["https:", "http:"].includes(url.protocol)) return "";
      const host = url.hostname.toLowerCase();
      let id = "";
      if (host === "youtu.be") {
        id = url.pathname.split("/")[1];
      } else if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) {
        id = url.pathname === "/watch"
          ? url.searchParams.get("v")
          : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      }
      return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? id : "";
    } catch {
      return "";
    }
  }

  function getYouTubeEmbedUrl(value) {
    const id = getYouTubeVideoId(value);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
  }

  function getYouTubeThumbnailUrl(value) {
    const id = getYouTubeVideoId(value);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  }

  const sources = { getYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl };
  if (typeof module === "object" && module.exports) module.exports = sources;
  else root.TwiceVideoSources = sources;
})(globalThis);
