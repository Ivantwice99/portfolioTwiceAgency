const test = require("node:test");
const assert = require("node:assert/strict");
const { create } = require("../assets/youtube-player.js");
const flush = () => new Promise(resolve => setImmediate(resolve));

function environment(apiReady = true) {
  const scripts = [];
  const frames = [];
  const players = [];
  const timers = new Map();
  let nextTimer = 0;
  const win = {
    location: { href: "https://portfolio.test/#videos" },
    setTimeout(callback, ms) { timers.set(++nextTimer, { callback, ms }); return nextTimer; },
    clearTimeout(id) { timers.delete(id); }
  };
  const api = {
    Player: function (frame, options) {
      const player = { frame, options, plays: 0, destroyed: false, playVideo() { this.plays++; }, destroy() { this.destroyed = true; frame.remove(); } };
      players.push(player);
      return player;
    }
  };
  if (apiReady) win.YT = api;
  const doc = {
    head: { append(script) { scripts.push(script); } },
    createElement(tag) {
      return { tag, removed: false, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; }, removeAttribute(key) { delete this.attributes[key]; }, remove() { this.removed = true; } };
    }
  };
  const container = { append(frame) { frames.push(frame); } };
  const ready = [];
  const errors = [];
  const start = videoId => create({ container, videoId, title: videoId, win, doc, onReady: () => ready.push(videoId), onError: error => errors.push(error.message) });
  return { win, api, doc, frames, scripts, players, ready, errors, timers, start };
}

test("fresh eager frames have a single URL with origin, API support and referrer", async () => {
  const env = environment();
  const first = env.start("2kxwN11-hXs");
  await flush();
  const frame = env.frames[0];
  const url = new URL(frame.src);
  assert.equal(url.hostname, "www.youtube-nocookie.com");
  assert.equal(url.searchParams.get("enablejsapi"), "1");
  assert.equal(url.searchParams.get("origin"), "https://portfolio.test");
  assert.equal(url.searchParams.get("autoplay"), "1");
  assert.equal(frame.loading, "eager");
  assert.equal(frame.referrerPolicy, "strict-origin-when-cross-origin");
  assert.equal(env.ready.length, 0);
  env.players[0].options.events.onReady({ target: env.players[0] });
  assert.deepEqual(env.ready, ["2kxwN11-hXs"]);
  assert.equal(env.players[0].plays, 1);
  assert.equal(env.timers.size, 0);
  first.destroy();
  assert.equal(frame.removed, true);
  env.start("rDXvuOj53Ms");
  await flush();
  assert.notEqual(env.frames[1], frame);
  assert.match(env.frames[1].src, /rDXvuOj53Ms/);
  assert.match(frame.src, /2kxwN11-hXs/);
});

test("closing before the API is ready never inserts a late player", async () => {
  const env = environment(false);
  const playback = env.start("2kxwN11-hXs");
  playback.destroy();
  env.win.YT = env.api;
  env.win.onYouTubeIframeAPIReady();
  await flush();
  assert.equal(env.frames.length, 0);
  assert.equal(env.ready.length, 0);
  assert.equal(env.timers.size, 0);
});

test("rapid video switches ignore callbacks from destroyed players", async () => {
  const env = environment();
  const first = env.start("2kxwN11-hXs");
  await flush();
  first.destroy();
  env.start("rDXvuOj53Ms");
  await flush();
  env.players[0].options.events.onReady({ target: env.players[0] });
  env.players[0].options.events.onError({ data: 150 });
  assert.deepEqual(env.ready, []);
  assert.deepEqual(env.errors, []);
  env.players[1].options.events.onReady({ target: env.players[1] });
  assert.deepEqual(env.ready, ["rDXvuOj53Ms"]);
});

test("the API script is shared while loading; only the current playback remains active", async () => {
  const env = environment(false);
  const first = env.start("2kxwN11-hXs");
  first.destroy();
  env.start("rDXvuOj53Ms");
  assert.equal(env.scripts.length, 1);
  env.win.YT = env.api;
  env.win.onYouTubeIframeAPIReady();
  await flush();
  assert.equal(env.frames.length, 1);
  assert.match(env.frames[0].src, /rDXvuOj53Ms/);
});

test("unresponsive players time out and YouTube errors reach recovery UI", async () => {
  const env = environment();
  env.start("2kxwN11-hXs");
  await flush();
  [...env.timers.values()].find(timer => timer.ms === 20000).callback();
  assert.deepEqual(env.errors, ["youtube-player-timeout"]);
  assert.equal(env.players[0].destroyed, true);
  assert.equal(env.frames[0].removed, true);
  env.players[0].options.events.onError({ data: 153 });
  assert.deepEqual(env.errors, ["youtube-player-timeout"]);
  env.players[0].options.events.onReady({ target: env.players[0] });
  assert.equal(env.ready.length, 0);
  assert.equal(env.frames[0].attributes["aria-hidden"], "true");
  const blocked = environment();
  blocked.start("2kxwN11-hXs");
  await flush();
  blocked.players[0].options.events.onError({ data: 153 });
  assert.deepEqual(blocked.errors, ["youtube-player-153"]);
  assert.equal(blocked.players[0].destroyed, true);
});

test("API network errors can be retried instead of caching a failed loader forever", async () => {
  const env = environment(false);
  const first = env.start("2kxwN11-hXs");
  env.scripts[0].onerror();
  await flush();
  assert.deepEqual(env.errors, ["youtube-api-blocked"]);
  first.destroy();
  env.start("2kxwN11-hXs");
  assert.equal(env.scripts.length, 2);
  env.win.YT = env.api;
  env.win.onYouTubeIframeAPIReady();
  await flush();
  assert.equal(env.frames.length, 1);
});

test("blocked autoplay exposes the loaded player controls", async () => {
  const env = environment();
  env.start("2kxwN11-hXs");
  await flush();
  env.players[0].options.events.onAutoplayBlocked();
  assert.deepEqual(env.ready, ["2kxwN11-hXs"]);
});
