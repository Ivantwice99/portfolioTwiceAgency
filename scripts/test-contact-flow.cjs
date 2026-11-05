const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const source = readFileSync(join(root, "script.js"), "utf8");

test("email contact link works as a native mailto without JavaScript", () => {
  assert.match(html, /class="contact-button" href="mailto:contactotwice99@gmail\.com" data-contact-action="email"/);
  assert.match(html, /class="contact-email-address"><a href="mailto:contactotwice99@gmail\.com">contactotwice99@gmail\.com<\/a><\/p>/);
  assert.match(source, /if \(link\.dataset\.contactAction !== "whatsapp"\) return;/);
});

test("contact message uses FormSubmit native POST and the configured destination", () => {
  assert.match(html, /<form class="mini-form" data-contact-form action="https:\/\/formsubmit\.co\/contactotwice99@gmail\.com" method="POST">/);
  assert.match(html, /name="email" type="email"/);
  assert.match(html, /name="_replyto" data-contact-replyto/);
  assert.match(html, /name="_next" data-contact-next/);
  assert.match(html, /name="_subject" data-contact-subject/);
  assert.match(html, /name="_captcha" value="false"/);
  assert.doesNotMatch(source, /formsubmit\.co\/ajax\//);
  assert.match(source, /contactReplyTo\.value = reply;[\s\S]*contactForm\.submit\(\);/);
  assert.match(source, /get\("contact"\) === "sent"[\s\S]*setFormStatus\(copy\.formSent, "success"\)/);
});
