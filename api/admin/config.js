const ADMIN_EMAIL = "vaguacateman@gmail.com";

module.exports = function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ ok: false, message: "Method not allowed" });
    return;
  }

  response.status(200).json({
    ok: true,
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    adminHint: ADMIN_EMAIL.replace(/^(.{2}).*(@.*)$/, "$1***$2")
  });
};
