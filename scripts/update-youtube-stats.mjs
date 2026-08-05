import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.YOUTUBE_API_KEY;
const outputPath = new URL("../assets/data/youtube-clients.json", import.meta.url);
const apiBase = "https://www.googleapis.com/youtube/v3";
const clients = [
  {
    handle: "RealidadPolicial",
    title: "Realidad Policial",
    url: "https://www.youtube.com/@RealidadPolicial"
  },
  {
    handle: "ConocimientoEsoterico",
    title: "Conocimiento Esoterico",
    url: "https://www.youtube.com/@ConocimientoEsoterico"
  },
  {
    handle: "DoubleTwiceOficial",
    title: "Double Twice Oficial",
    url: "https://www.youtube.com/@DoubleTwiceOficial"
  },
  {
    handle: "impactogeopolitik",
    title: "Impacto Geopolitik",
    url: "https://www.youtube.com/@impactogeopolitik"
  }
];

if (!apiKey) {
  console.error("Missing YOUTUBE_API_KEY.");
  process.exit(1);
}

async function youtubeRequest(path, params) {
  const url = new URL(`${apiBase}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([name, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(name, value);
  });

  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || `YouTube API returned ${response.status}`);
  }

  return payload;
}

function sumStats(videos, field) {
  return videos.reduce((total, video) => total + Number(video.statistics?.[field] || 0), 0);
}

async function fetchClient(client) {
  const channelPayload = await youtubeRequest("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: `@${client.handle}`
  });
  const channel = channelPayload.items?.[0];

  if (!channel) {
    return {
      ...client,
      error: "Channel not found",
      statistics: {},
      videos: []
    };
  }

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
    title: channel.snippet?.title || client.title,
    url: client.url,
    thumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url || "",
    statistics: {
      viewCount: channel.statistics?.viewCount || "0",
      subscriberCount: channel.statistics?.subscriberCount || "0",
      videoCount: channel.statistics?.videoCount || "0"
    },
    recent: {
      views: sumStats(videos, "viewCount"),
      likes: sumStats(videos, "likeCount"),
      comments: sumStats(videos, "commentCount"),
      sample: videos.length
    },
    videos
  };
}

const channels = [];

for (const client of clients) {
  try {
    channels.push(await fetchClient(client));
  } catch (error) {
    channels.push({
      ...client,
      error: error.message,
      statistics: {},
      videos: []
    });
  }
}

await mkdir(new URL("../assets/data/", import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({
  updatedAt: new Date().toISOString(),
  source: "youtube-data-api-v3",
  channels
}, null, 2)}\n`);

console.log(`Updated ${channels.length} YouTube client channels.`);
