const RECIPIENT_EMAIL = "contactotwice99@gmail.com";
const DEFAULT_ORIGIN = "https://portfolio-twice-agency.vercel.app";
const MAX_NAME_LENGTH = 120;
const MAX_PROJECT_LENGTH = 160;
const MAX_REPLY_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 4000;

function sendJson(response, status, payload) {
  response.setHeader("Cache-Control", "no-store");
  response.status(status).json(payload);
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanMessage(value) {
  return String(value || "").trim().slice(0, MAX_MESSAGE_LENGTH);
}

function getRequestOrigin(request) {
  const origin = request.headers.origin || "";
  if (origin) return origin;

  const referer = request.headers.referer || "";
  try {
    return referer ? new URL(referer).origin : "";
  } catch (error) {
    return "";
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    return (
      protocol === "https:" && (
        hostname === "portfolio-twice-agency.vercel.app" ||
        hostname.endsWith(".vercel.app")
      )
    ) || (
      protocol === "http:" && ["localhost", "127.0.0.1"].includes(hostname)
    );
  } catch (error) {
    return false;
  }
}

async function submitToFormSubmit({ origin, name, project, reply, message, subject }) {
  const payload = new URLSearchParams({
    name,
    project,
    reply,
    email: reply,
    message,
    _replyto: reply,
    _subject: subject,
    _template: "table",
    _captcha: "false"
  });

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT_EMAIL)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: origin || DEFAULT_ORIGIN,
      Referer: `${origin || DEFAULT_ORIGIN}/`
    },
    body: payload.toString()
  });
  const result = await response.json().catch(() => ({}));
  const messageText = String(result.message || "");
  const activationRequired = /activate|activation|confirm|verify|verification/i.test(messageText);

  if (!response.ok || result.success === false || result.success === "false") {
    if (activationRequired) {
      return { ok: true, activationRequired, message: messageText };
    }

    throw new Error(messageText || `formsubmit-${response.status}`);
  }

  return { ok: true, activationRequired: false, message: messageText };
}

module.exports = async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  try {
    const origin = getRequestOrigin(request);
    if (!isAllowedOrigin(origin)) {
      sendJson(response, 403, { ok: false, message: "Origin not allowed" });
      return;
    }

    const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});
    if (cleanText(body._honey, 80)) {
      sendJson(response, 200, { ok: true, spam: true });
      return;
    }

    const name = cleanText(body.name, MAX_NAME_LENGTH);
    const project = cleanText(body.project, MAX_PROJECT_LENGTH) || "Not specified";
    const reply = cleanText(body.reply, MAX_REPLY_LENGTH);
    const message = cleanMessage(body.message);
    const subject = cleanText(body.subject, 220) || `Video project: ${project}`;

    if (!name || !message) {
      sendJson(response, 400, { ok: false, message: "Name and message are required" });
      return;
    }

    const result = await submitToFormSubmit({ origin, name, project, reply, message, subject });
    sendJson(response, result.activationRequired ? 202 : 200, result);
  } catch (error) {
    sendJson(response, 502, { ok: false, message: error.message || "Could not send message" });
  }
};
