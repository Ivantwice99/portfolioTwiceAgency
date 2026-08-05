const { webcrypto } = require("node:crypto");

const ADMIN_EMAIL = "vaguacateman@gmail.com";
const DEFAULT_REPO = "Ivantwice99/portfolioTwiceAgency";
const DEFAULT_BRANCH = "main";
const VIDEO_DATA_PATH = "assets/data/videos.json";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

function sendJson(response, status, payload) {
  response.setHeader("Cache-Control", "no-store");
  response.status(status).json(payload);
}

function base64UrlToBuffer(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Buffer.from(base64, "base64");
}

function decodeJwtPart(value) {
  return JSON.parse(base64UrlToBuffer(value).toString("utf8"));
}

async function verifyGoogleIdToken(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("missing-google-client");
  if (!credential || typeof credential !== "string") throw new Error("missing-credential");

  const [headerPart, payloadPart, signaturePart] = credential.split(".");
  if (!headerPart || !payloadPart || !signaturePart) throw new Error("invalid-token");

  const header = decodeJwtPart(headerPart);
  const payload = decodeJwtPart(payloadPart);
  const jwksResponse = await fetch(GOOGLE_JWKS_URL);
  const jwks = await jwksResponse.json();
  const jwk = (jwks.keys || []).find((key) => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) throw new Error("missing-google-key");

  const cryptoKey = await webcrypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const valid = await webcrypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    cryptoKey,
    base64UrlToBuffer(signaturePart),
    Buffer.from(`${headerPart}.${payloadPart}`)
  );

  if (!valid) throw new Error("invalid-signature");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss)) throw new Error("invalid-issuer");
  if (payload.aud !== clientId) throw new Error("invalid-audience");
  if (Number(payload.exp || 0) <= Math.floor(Date.now() / 1000)) throw new Error("expired-token");
  if (String(payload.email_verified) !== "true") throw new Error("email-not-verified");
  if (String(payload.email || "").toLowerCase() !== ADMIN_EMAIL.toLowerCase()) throw new Error("admin-only");

  return {
    email: payload.email,
    name: payload.name || "Admin",
    picture: payload.picture || ""
  };
}

function getDriveFileId(url = "") {
  const pathMatch = String(url).match(/\/d\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  const queryMatch = String(url).match(/[?&]id=([^&]+)/);
  return queryMatch ? queryMatch[1] : "";
}

function normalizePreviewUrl(value = "") {
  const driveId = getDriveFileId(value);
  if (driveId) return `https://drive.google.com/file/d/${driveId}/preview`;
  return String(value || "").trim();
}

function normalizeThumbnailUrl(value = "", previewUrl = "") {
  const thumbnail = String(value || "").trim();
  if (thumbnail) return thumbnail;

  const driveId = getDriveFileId(previewUrl);
  return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w640` : "";
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeVideo(video, index) {
  const code = cleanText(video.code || video.id || `MDV-${String(index + 1).padStart(2, "0")}`, 24);
  const previewUrl = normalizePreviewUrl(video.previewUrl || video.driveUrl || "");
  const title = video.title && typeof video.title === "object" ? video.title : {};
  const description = video.description && typeof video.description === "object" ? video.description : {};
  const uid = cleanText(video.uid || code, 48)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `video-${index + 1}`;

  return {
    uid,
    code,
    ratio: video.ratio === "9:16" ? "9:16" : "16:9",
    tone: ["gold", "cyan", "rose", "silver"].includes(video.tone) ? video.tone : ["gold", "cyan", "rose", "silver"][index % 4],
    quality: cleanText(video.quality || "original", 32),
    previewUrl,
    thumbnailUrl: normalizeThumbnailUrl(video.thumbnailUrl, previewUrl),
    title: {
      en: cleanText(title.en || title.es || code, 90),
      es: cleanText(title.es || title.en || code, 90)
    },
    description: {
      en: cleanText(description.en || description.es || "", 160),
      es: cleanText(description.es || description.en || "", 160)
    }
  };
}

function validateVideos(rawVideos) {
  if (!Array.isArray(rawVideos)) throw new Error("videos-must-be-array");
  if (rawVideos.length > 40) throw new Error("too-many-videos");

  const seenCodes = new Set();
  return rawVideos.map((video, index) => {
    const normalized = normalizeVideo(video, index);
    if (!normalized.code) throw new Error("missing-video-id");
    if (!normalized.previewUrl) throw new Error(`missing-preview-url-${normalized.code}`);
    const codeKey = normalized.code.toLowerCase();
    if (seenCodes.has(codeKey)) throw new Error(`duplicate-video-id-${normalized.code}`);
    seenCodes.add(codeKey);
    return normalized;
  });
}

async function githubRequest(path, options = {}) {
  const token = process.env.GITHUB_CONTENTS_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) throw new Error("missing-github-token");

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "TwiceAgency-admin-editor",
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `github-${response.status}`);
  }

  return payload;
}

async function saveVideosToGithub(videos, profile) {
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
  const encodedPath = VIDEO_DATA_PATH.split("/").map(encodeURIComponent).join("/");
  let currentFile = null;

  try {
    currentFile = await githubRequest(`/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`);
  } catch (error) {
    if (!String(error.message).includes("Not Found")) throw error;
  }

  const nextData = {
    updatedAt: new Date().toISOString(),
    updatedBy: profile.email,
    videos
  };

  const payload = await githubRequest(`/repos/${repo}/contents/${encodedPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: "Update portfolio videos",
      content: Buffer.from(`${JSON.stringify(nextData, null, 2)}\n`, "utf8").toString("base64"),
      sha: currentFile?.sha,
      branch
    })
  });

  return {
    commit: payload.commit?.sha || "",
    data: nextData
  };
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});
    const profile = await verifyGoogleIdToken(body.credential);

    if (body.action === "verify") {
      sendJson(response, 200, { ok: true, profile });
      return;
    }

    if (body.action !== "save") {
      sendJson(response, 400, { ok: false, message: "Unknown action" });
      return;
    }

    const videos = validateVideos(body.videos);
    const saved = await saveVideosToGithub(videos, profile);
    sendJson(response, 200, {
      ok: true,
      profile,
      commit: saved.commit,
      videos: saved.data.videos,
      updatedAt: saved.data.updatedAt
    });
  } catch (error) {
    const message = error.message === "admin-only"
      ? "Only the admin can edit this page."
      : error.message;
    const status = ["admin-only", "invalid-audience", "invalid-signature", "expired-token", "email-not-verified"].includes(error.message)
      ? 403
      : 500;

    sendJson(response, status, { ok: false, message });
  }
};
