const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const sources = require("../assets/video-sources.js");
const root = join(__dirname, "..");
const source = readFileSync(join(root, "script.js"), "utf8");
const catalog = JSON.parse(readFileSync(join(root, "assets/data/videos.json"), "utf8"));
const expectedIds = ["2kxwN11-hXs", "rDXvuOj53Ms", "IGKtu24EW5U", "cxMmPfhKSGI", "fNXEVE_PI98", "Qzw_ZK4sYVg", "KM3Ozq-2M0M", "0VinlvUBFIQ", "5YBYcydbGqs", "Qfcn8ZPDFO0"];

test("YouTube short, watch, embed, shorts and live links normalize consistently", () => {
  for (const value of [
    "https://youtu.be/2kxwN11-hXs?si=test",
    "https://www.youtube.com/watch?v=2kxwN11-hXs&t=8s",
    "https://m.youtube.com/shorts/2kxwN11-hXs",
    "https://youtube.com/live/2kxwN11-hXs",
    "https://www.youtube-nocookie.com/embed/2kxwN11-hXs"
  ]) {
    assert.equal(sources.getYouTubeVideoId(value), expectedIds[0]);
    assert.equal(sources.getYouTubeEmbedUrl(value), "https://www.youtube-nocookie.com/embed/2kxwN11-hXs");
    assert.equal(sources.getYouTubeThumbnailUrl(value), "https://i.ytimg.com/vi/2kxwN11-hXs/hqdefault.jpg");
  }
});

test("YouTube parser rejects unrelated hosts, malformed IDs and unsafe protocols", () => {
  for (const value of ["", "not a URL", "https://youtube.com.evil.test/watch?v=2kxwN11-hXs", "https://evil.test/embed/2kxwN11-hXs", "javascript:alert(1)", "https://youtu.be/short", "https://youtube.com/playlist?list=2kxwN11-hXs"]) {
    assert.equal(sources.getYouTubeEmbedUrl(value), "");
  }
});

test("catalog contains exactly the ten supplied videos in order, without Crypto or Anime", () => {
  assert.equal(catalog.videos.length, 10);
  assert.deepEqual(catalog.videos.map(video => sources.getYouTubeVideoId(video.previewUrl)), expectedIds);
  assert.equal(new Set(catalog.videos.map(video => video.code)).size, 10);
  assert.ok(!catalog.videos.some(video => ["example-01", "example-02"].includes(video.uid)));
  for (const video of catalog.videos) {
    assert.equal(video.thumbnailUrl, sources.getYouTubeThumbnailUrl(video.previewUrl));
    for (const locale of ["en", "es"]) {
      assert.ok(video.title[locale] && video.title[locale].length <= 90);
      assert.ok(video.description[locale] && video.description[locale].length <= 160);
    }
  }
  assert.ok(!JSON.stringify(catalog).includes("drive.google.com"));
});

function createClassList() {
  const values = new Set();
  return {
    add: (...keys) => keys.forEach(key => values.add(key)),
    remove: (...keys) => keys.forEach(key => values.delete(key)),
    contains: key => values.has(key),
    toggle: (key, on) => on ? values.add(key) : values.delete(key)
  };
}
function element() {
  return { classList: createClassList(), style: { removeProperty() {}, setProperty() {} }, setAttribute() {}, removeAttribute() {}, focus() {}, append() {}, remove() {} };
}
function playerContext() {
  const context = {
    ...sources, URL, Set,
    isDirectVideoUrl: value => /\.(mp4|webm|ogg)([?#]|$)/i.test(value),
    smallScreenQuery: { matches: true },
    modalScreen: element(), modalPanel: element(), videoModal: element(),
    videoFrame: null,
    videoLoadLayer: { hidden: true }, videoLoadPoster: {}, videoLoadStatus: {},
    videoLoadActions: { hidden: true }, videoExternal: {}, videoRetry: null,
    players: [],
    videoPlayer: { pause() {}, load() {}, removeAttribute(name) { delete this[name]; }, play() { return Promise.resolve(); } },
    ambientEnabled: false, ambientAudio: null,
    document: { body: element(), head: { append() { throw new Error("Unexpected prefetch"); } } },
    window: { location: { href: "https://portfolio.test/" }, requestAnimationFrame: callback => callback() },
    translations: { en: { videoPreviewLabel: "Video", videoLoading: "Loading", videoPlaybackError: "Error" } }, currentLanguage: "en"
  };
  context.getCopy = () => context.translations.en;
  context.TwiceYouTubePlayer = {
    create(options) {
      const controller = { options, destroyed: false, destroy() { this.destroyed = true; } };
      context.players.push(controller);
      return controller;
    }
  };
  const helpers = source.slice(source.indexOf("function getDriveFileId("), source.indexOf('let currentVideoFallback = "";'));
  const modal = source.slice(source.indexOf('let currentVideoFallback = "";'), source.indexOf('videoPlayer?.addEventListener("error"'));
  vm.runInNewContext(`function withAutoplay(url) { return url + (url.includes("?") ? "&" : "?") + "autoplay=1"; }\n${helpers}\n${modal}\nglobalThis.actions = { openVideo, closeVideo, prewarmVideoPreview };`, context);
  return context;
}

test("YouTube opens in the responsive embed, not the Drive proxy or native video", () => {
  const context = playerContext();
  for (const video of catalog.videos) {
    context.actions.openVideo(video.title.en, video.previewUrl, video.ratio, video.thumbnailUrl);
    const controller = context.players.at(-1);
    assert.equal(controller.options.videoId, sources.getYouTubeVideoId(video.previewUrl));
    assert.ok(context.modalScreen.classList.contains("has-youtube"));
    assert.ok(context.modalScreen.classList.contains("is-loading"));
    assert.ok(!context.modalScreen.classList.contains("has-embed"));
    assert.equal(context.videoLoadLayer.hidden, false);
    assert.equal(context.videoLoadPoster.src, video.thumbnailUrl);
    controller.options.onReady();
    assert.equal(context.videoLoadLayer.hidden, true);
    assert.ok(context.modalScreen.classList.contains("has-embed"));
    assert.ok(!context.modalScreen.classList.contains("has-native"));
    assert.equal(context.videoPlayer.src, undefined);
    assert.equal(context.videoPlayer.hidden, true);
    context.actions.prewarmVideoPreview(video.previewUrl);
    context.actions.closeVideo();
    assert.equal(controller.destroyed, true);
    assert.ok(!context.modalScreen.classList.contains("has-youtube"));
  }
});

test("failed playback keeps the thumbnail and exposes retry plus the correct YouTube link", () => {
  const context = playerContext();
  const video = catalog.videos[0];
  context.actions.openVideo(video.title.en, video.previewUrl, video.ratio, video.thumbnailUrl);
  context.players[0].options.onError(new Error("blocked"));
  assert.equal(context.videoLoadLayer.hidden, false);
  assert.equal(context.videoLoadActions.hidden, false);
  assert.equal(context.videoLoadStatus.textContent, "Error");
  assert.equal(context.videoExternal.href, "https://www.youtube.com/watch?v=2kxwN11-hXs");
  assert.ok(!context.modalScreen.classList.contains("has-embed"));
  context.actions.openVideo(video.title.en, video.previewUrl, video.ratio, video.thumbnailUrl);
  assert.equal(context.players[0].destroyed, true);
  assert.equal(context.videoLoadActions.hidden, true);
  assert.equal(context.players.length, 2);
});

test("existing Drive and direct-file playback remain supported", () => {
  const context = playerContext();
  context.actions.openVideo("Drive", "https://drive.google.com/file/d/drive_id/preview", "16:9", "poster.jpg");
  assert.equal(context.videoPlayer.src, "/api/drive-video?id=drive_id");
  assert.ok(context.modalScreen.classList.contains("has-native"));
  assert.equal(context.videoPlayer.poster, "poster.jpg");
  context.actions.closeVideo();
  context.actions.openVideo("File", "https://media.test/video.mp4", "16:9");
  assert.equal(context.videoPlayer.src, "https://media.test/video.mp4");
});

test("frontend normalization preserves custom thumbnails and generates missing YouTube thumbnails", () => {
  const context = { ...sources, URL };
  const helpers = source.slice(source.indexOf("function getDriveFileId("), source.indexOf('let currentVideoFallback = "";'));
  const normalize = source.slice(source.indexOf("function getVideoPreviewUrl("), source.indexOf("function renderVideoTiles("));
  vm.runInNewContext(`${helpers}\n${normalize}\nglobalThis.normalize = normalizeVideoRecord;`, context);
  const record = context.normalize({ code: "YT-01", previewUrl: "https://youtu.be/2kxwN11-hXs" });
  assert.equal(record.previewUrl, sources.getYouTubeEmbedUrl(record.previewUrl));
  assert.equal(record.thumbnailUrl, sources.getYouTubeThumbnailUrl(record.previewUrl));
  assert.equal(context.normalize({ ...record, thumbnailUrl: "assets/thumbs/custom.jpg" }).thumbnailUrl, "assets/thumbs/custom.jpg");
});
