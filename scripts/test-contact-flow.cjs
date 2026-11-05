const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

const root = join(__dirname, "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const source = readFileSync(join(root, "script.js"), "utf8");

test("email contact link works as a native mailto without JavaScript", () => {
  assert.match(html, /class="contact-button" href="mailto:contactotwice99@gmail\.com" data-contact-action="email"/);
  assert.match(html, /class="contact-email-address"><a href="mailto:contactotwice99@gmail\.com">contactotwice99@gmail\.com<\/a><\/p>/);
  assert.match(source, /if \(link\.dataset\.contactAction !== "whatsapp"\) return;/);
});

test("failed or unactivated contact delivery keeps the message and exposes a mail draft", () => {
  assert.match(html, /data-form-email-fallback href="mailto:contactotwice99@gmail\.com" hidden/);
  assert.match(source, /contactEmailFallback\.href = buildMailtoUrl\(\{ name, project, reply, message \}, copy\);\s*contactEmailFallback\.hidden = false;/);
  assert.match(source, /if \(result\.activationRequired\)\s*\{[\s\S]*?setFormStatus\(copy\.formNeedsActivation, "error"\);\s*\} else \{\s*contactForm\.reset\(\);/);
});

test("FormSubmit receives JSON using its documented AJAX content type", async () => {
  const start = source.indexOf("const sendContactRequest = async");
  const end = source.indexOf("\n};", start) + 3;
  let request;
  const context = {
    getContactTarget: () => ({ email: "contactotwice99@gmail.com" }),
    window: { location: { href: "https://twiceagency.pages.dev/#contacto" } },
    fetch: async (url, options) => {
      request = { url, ...options };
      return { ok: true, json: async () => ({ success: "true" }) };
    }
  };
  vm.runInNewContext(`${source.slice(start, end)}\nglobalThis.sendContactRequest = sendContactRequest;`, context);
  const result = await context.sendContactRequest(
    { name: "Client", project: "Reel", reply: "client@example.com", message: "Please edit this link." },
    { projectFallback: "Not specified", mailSubject: "Video project" }
  );
  const payload = JSON.parse(request.body);

  assert.equal(request.url, "https://formsubmit.co/ajax/contactotwice99@gmail.com");
  assert.equal(request.headers["Content-Type"], "application/json");
  assert.equal(payload.message, "Please edit this link.");
  assert.equal(payload._replyto, "client@example.com");
  assert.equal(payload._url, "https://twiceagency.pages.dev/#contacto");
  assert.equal(result.ok, true);
});
