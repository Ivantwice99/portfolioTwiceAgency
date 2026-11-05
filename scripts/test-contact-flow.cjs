const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const source = readFileSync(join(root, "script.js"), "utf8");

test("email contact link works as a native mailto without JavaScript", () => {
  assert.match(html, /class="contact-button" href="mailto:vaguacateman@gmail\.com" data-contact-action="email"/);
  assert.match(source, /if \(link\.dataset\.contactAction !== "whatsapp"\) return;/);
});

test("failed or unactivated contact delivery keeps the message and exposes a mail draft", () => {
  assert.match(html, /data-form-email-fallback href="mailto:vaguacateman@gmail\.com" hidden/);
  assert.match(source, /contactEmailFallback\.href = buildMailtoUrl\(\{ name, project, reply, message \}, copy\);\s*contactEmailFallback\.hidden = false;/);
  assert.match(source, /if \(result\.activationRequired\)\s*\{[\s\S]*?setFormStatus\(copy\.formNeedsActivation, "error"\);\s*\} else \{\s*contactForm\.reset\(\);/);
});
