import { mkdir, writeFile } from "node:fs/promises";

const youtubeApiKey = process.env.YOUTUBE_API_KEY?.trim() || "";
const socialBladeClientId = process.env.SOCIALBLADE_CLIENT_ID?.trim() || "";
const socialBladeToken = process.env.SOCIALBLADE_TOKEN?.trim() || "";
const outputPath = new URL("../assets/data/youtube-clients.json", import.meta.url);
const youtubeApiBase = "https://www.googleapis.com/youtube/v3";
const socialBladeBase = "https://matrix.sbapis.com/b";
const publicHeaders = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
  "accept-language": "es-MX,es;q=0.9,en;q=0.8",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};
const clients = [
  {
    handle: "RealidadPolicial",
    publicHandle: "RealidadPolicial",
    title: "Realidad Policial",
    url: "https://www.youtube.com/@RealidadPolicial"
  },
  {
    handle: "ConocimientoEsoterico",
    publicHandle: "ConocimientoEsoterico",
    title: "Conocimiento Esoterico",
    url: "https://www.youtube.com/@ConocimientoEsoterico"
  },
  {
    handle: "DoubleTwiceOficial",
    publicHandle: "DoubleTwiceOficial",
    title: "DoubleTwice",
    url: "https://www.youtube.com/@DoubleTwiceOficial"
  },
  {
    handle: "impactogeopolitik",
    publicHandle: "ImpactoGeopolitik",
    title: "Impacto Geopolitik",
    url: "https://www.youtube.com/@ImpactoGeopolitik"
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function decodeJsonText(value = "") {
  const text = String(value);

  try {
    return JSON.parse(`"${text.replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r")}"`);
  } catch {
    return text;
  }
}

function cleanText(value = "") {
  return decodeJsonText(value)
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCount(value = "") {
  const text = cleanText(value).toLowerCase().replace(/\u00a0/g, " ");
  const match = text.match(/\d+(?:[.,]\d+)*/);
  if (!match) return 0;

  const compact = /\b(k|m|b)\b|mil|millon|million|billon|billion/.test(text);
  let normalized = match[0];

  if (compact) {
    normalized = normalized.replace(/[,.](?=\d{3}\b)/g, "").replace(",", ".");
  } else {
    normalized = normalized.replace(/[,.](?=\d{3}\b)/g, "").replace(",", ".");
  }

  const number = Number(normalized);
  if (!Number.isFinite(number)) return 0;

  const multiplier = /\bb\b|billon|billion/.test(text)
    ? 1000000000
    : (/\bm\b|millon|million/.test(text) ? 1000000 : (/\bk\b|mil/.test(text) ? 1000 : 1));

  return Math.round(number * multiplier);
}

function numberString(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? String(Math.round(number)) : "0";
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...publicHeaders,
      ...(options.headers || {})
    }
  });

  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

async function fetchJsonResponse(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.status?.success === false) {
    throw new Error(payload.status?.error || payload.error?.message || `HTTP ${response.status} for ${url}`);
  }

  return payload;
}

function getRegexValues(scope, pattern) {
  return [...scope.matchAll(pattern)].map((match) => cleanText(match[1])).filter(Boolean);
}

function extractLastText(scope, name) {
  const patterns = [
    new RegExp(`"${name}"\\s*:\\s*"([^"]+)"`, "g"),
    new RegExp(`"${name}"\\s*:\\s*\\{\\s*"simpleText"\\s*:\\s*"([^"]+)"`, "g"),
    new RegExp(`"${name}"\\s*:\\s*\\{\\s*"runs"\\s*:\\s*\\[\\{\\s*"text"\\s*:\\s*"([^"]+)"`, "g")
  ];
  const values = patterns.flatMap((pattern) => getRegexValues(scope, pattern));
  return values.at(-1) || "";
}

function extractLastMatch(scope, pattern) {
  const values = getRegexValues(scope, pattern);
  return values.at(-1) || "";
}

function getAboutScope(html) {
  const canonicalIndex = html.lastIndexOf("\"canonicalChannelUrl\"");
  if (canonicalIndex >= 0) {
    return html.slice(Math.max(0, canonicalIndex - 4500), canonicalIndex + 4500);
  }

  const aboutIndex = html.lastIndexOf("\"channelAboutFullMetadataRenderer\"");
  return aboutIndex >= 0 ? html.slice(aboutIndex, aboutIndex + 9000) : html;
}

function extractThumbnail(html) {
  const urls = [
    ...html.matchAll(/(?:https?:)?\/\/yt3(?:\.ggpht|\.googleusercontent)\.com\/[^"\\]+/g)
  ].map((match) => cleanText(match[0]).replace(/^\/\//, "https://"));

  return urls.find((url) => /s176|s160|s88/.test(url)) || urls[0] || "";
}

function extractRecentVideoRows(html) {
  return html
    .split("\"lockupMetadataViewModel\"")
    .slice(1, 9)
    .map((chunk) => {
      const title = cleanText(chunk.match(/"title"\s*:\s*\{\s*"content"\s*:\s*"([^"]+)"/)?.[1] || "");
      const viewText = cleanText(chunk.match(/"content"\s*:\s*"([^"]*?(?:vistas|views)[^"]*?)"/i)?.[1] || "");

      return {
        title,
        viewCount: parseCount(viewText)
      };
    })
    .filter((row) => row.title || row.viewCount);
}

function extractVideoIds(html) {
  return [...new Set(
    [...html.matchAll(/"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1])
  )].slice(0, 8);
}

function extractLikeCount(html) {
  const alongWith = html.match(/like this video along with ([\d,.]+) other people/i);
  if (alongWith) return parseCount(alongWith[1]) + 1;

  const likeIndex = html.indexOf("id.video.like.button");
  if (likeIndex >= 0) {
    const scope = html.slice(Math.max(0, likeIndex - 1400), likeIndex + 1400);
    const title = scope.match(/"title"\s*:\s*"([\d,.KMB]+)"/i);
    if (title) return parseCount(title[1]);
  }

  return 0;
}

async function fetchVideoLikeCount(videoId) {
  await sleep(90);
  const html = await fetchText(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "accept-language": "en-US,en;q=0.9" }
  });

  return extractLikeCount(html);
}

async function fetchPublicRecentStats(client) {
  const handle = client.publicHandle || client.handle;
  const html = await fetchText(`https://www.youtube.com/@${handle}/videos`);
  const rows = extractRecentVideoRows(html);
  const ids = extractVideoIds(html).slice(0, 6);
  const likes = [];

  for (const id of ids) {
    try {
      likes.push(await fetchVideoLikeCount(id));
    } catch (error) {
      likes.push(0);
    }
  }

  const videos = ids.map((id, index) => ({
    id,
    title: rows[index]?.title || "",
    viewCount: numberString(rows[index]?.viewCount || 0),
    likeCount: numberString(likes[index] || 0)
  }));

  return {
    latestTitle: rows[0]?.title || "",
    recent: {
      views: videos.reduce((total, video) => total + Number(video.viewCount || 0), 0),
      likes: likes.reduce((total, value) => total + Number(value || 0), 0),
      sample: videos.length
    },
    videos
  };
}

async function fetchPublicYouTubeClient(client) {
  const handle = client.publicHandle || client.handle;
  const html = await fetchText(`https://www.youtube.com/@${handle}/about`);
  const aboutScope = getAboutScope(html);
  const title = cleanText(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || "") || client.title;
  const subscriberText = extractLastText(aboutScope, "subscriberCountText") || extractLastText(html, "subscriberCountText");
  const viewText = extractLastText(aboutScope, "viewCountText") || extractLastText(html, "viewCountText");
  const videoText = extractLastText(aboutScope, "videoCountText") || extractLastText(html, "videoCountText");
  const channelId = extractLastMatch(aboutScope, /"channelId"\s*:\s*"([^"]+)"/g) || extractLastMatch(html, /"channelId"\s*:\s*"([^"]+)"/g);
  const recentStats = await fetchPublicRecentStats(client).catch(() => ({
    latestTitle: "",
    recent: { views: 0, likes: 0, sample: 0 },
    videos: []
  }));

  return {
    handle: client.handle,
    publicHandle: handle,
    title,
    url: client.url,
    channelId,
    thumbnail: extractThumbnail(html),
    statistics: {
      viewCount: numberString(parseCount(viewText)),
      subscriberCount: numberString(parseCount(subscriberText)),
      videoCount: numberString(parseCount(videoText))
    },
    latestTitle: recentStats.latestTitle,
    recent: recentStats.recent,
    videos: recentStats.videos,
    source: "youtube-public-snapshot"
  };
}

async function youtubeRequest(path, params) {
  const url = new URL(`${youtubeApiBase}/${path}`);
  Object.entries({ ...params, key: youtubeApiKey }).forEach(([name, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(name, value);
  });

  return fetchJsonResponse(url);
}

function sumStats(videos, field) {
  return videos.reduce((total, video) => total + Number(video.statistics?.[field] || video[field] || 0), 0);
}

async function fetchYouTubeApiClient(client) {
  const channelPayload = await youtubeRequest("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: `@${client.publicHandle || client.handle}`
  });
  const channel = channelPayload.items?.[0];

  if (!channel) throw new Error(`Channel not found: ${client.handle}`);

  const uploads = channel.contentDetails?.relatedPlaylists?.uploads;
  const playlistPayload = uploads
    ? await youtubeRequest("playlistItems", {
      part: "contentDetails",
      playlistId: uploads,
      maxResults: "6"
    })
    : { items: [] };
  const videoIds = (playlistPayload.items || [])
    .map((video) => video.contentDetails?.videoId)
    .filter(Boolean);
  const videosPayload = videoIds.length
    ? await youtubeRequest("videos", {
      part: "snippet,statistics",
      id: videoIds.join(",")
    })
    : { items: [] };
  const videos = (videosPayload.items || []).map((video) => ({
    id: video.id,
    title: video.snippet?.title || "",
    publishedAt: video.snippet?.publishedAt || "",
    statistics: {
      viewCount: video.statistics?.viewCount || "0",
      likeCount: video.statistics?.likeCount || "0",
      commentCount: video.statistics?.commentCount || "0"
    }
  }));

  return {
    handle: client.handle,
    publicHandle: client.publicHandle || client.handle,
    title: channel.snippet?.title || client.title,
    url: client.url,
    channelId: channel.id,
    thumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url || "",
    statistics: {
      viewCount: channel.statistics?.viewCount || "0",
      subscriberCount: channel.statistics?.subscriberCount || "0",
      videoCount: channel.statistics?.videoCount || "0"
    },
    latestTitle: videos[0]?.title || "",
    recent: {
      views: sumStats(videos, "viewCount"),
      likes: sumStats(videos, "likeCount"),
      comments: sumStats(videos, "commentCount"),
      sample: videos.length
    },
    videos,
    source: "youtube-data-api-v3"
  };
}

async function fetchSocialBladeClient(client) {
  const url = new URL(`${socialBladeBase}/youtube/statistics`);
  url.searchParams.set("query", `@${client.publicHandle || client.handle}`);
  url.searchParams.set("history", "default");
  url.searchParams.set("allow-stale", "true");

  const payload = await fetchJsonResponse(url, {
    headers: {
      clientid: socialBladeClientId,
      token: socialBladeToken,
      accept: "application/json"
    }
  });
  const data = payload.data;
  if (!data) throw new Error(`SocialBlade data missing: ${client.handle}`);

  const total = data.statistics?.total || {};
  const growth = data.statistics?.growth || {};
  const recentStats = await fetchPublicRecentStats(client).catch(() => ({
    latestTitle: "",
    recent: { views: Number(growth.vidviews?.["30"] || 0), likes: 0, sample: 0 },
    videos: []
  }));

  return {
    handle: client.handle,
    publicHandle: client.publicHandle || client.handle,
    title: data.id?.display_name || client.title,
    url: client.url,
    channelId: data.id?.id || "",
    thumbnail: data.general?.branding?.avatar || "",
    statistics: {
      viewCount: numberString(total.views),
      subscriberCount: numberString(total.subscribers),
      videoCount: numberString(total.uploads)
    },
    latestTitle: recentStats.latestTitle,
    recent: {
      ...recentStats.recent,
      views: recentStats.recent.views || Number(growth.vidviews?.["30"] || 0),
      subscribers: Number(growth.subs?.["30"] || 0)
    },
    socialBlade: {
      grade: data.misc?.grade?.grade || "",
      verified: Boolean(data.misc?.sb_verified)
    },
    videos: recentStats.videos,
    source: "socialblade-api"
  };
}

async function fetchClient(client) {
  const providers = [
    socialBladeClientId && socialBladeToken ? fetchSocialBladeClient : null,
    youtubeApiKey ? fetchYouTubeApiClient : null,
    fetchPublicYouTubeClient
  ].filter(Boolean);
  const errors = [];

  for (const provider of providers) {
    try {
      return await provider(client);
    } catch (error) {
      errors.push(error.message);
    }
  }

  return {
    ...client,
    error: errors.join(" | ") || "Stats unavailable",
    statistics: {},
    videos: []
  };
}

const channels = [];

for (const client of clients) {
  channels.push(await fetchClient(client));
}

const source = new Set(channels.map((channel) => channel.source || "unavailable")).size === 1
  ? channels[0]?.source || "unavailable"
  : "mixed";

await mkdir(new URL("../assets/data/", import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({
  updatedAt: new Date().toISOString(),
  source,
  channels
}, null, 2)}\n`);

console.log(`Updated ${channels.length} client channels from ${source}.`);
