(function (root) {
  const apiLoads = new WeakMap();

  function loadApi(win, doc) {
    if (win.YT?.Player) return Promise.resolve(win.YT);
    if (apiLoads.has(win)) return apiLoads.get(win);

    const promise = new Promise((resolve, reject) => {
      const script = doc.createElement("script");
      const previousReady = win.onYouTubeIframeAPIReady;
      let settled = false;
      const finish = (error) => {
        if (settled) return;
        settled = true;
        win.clearTimeout(timer);
        if (win.onYouTubeIframeAPIReady === ready) win.onYouTubeIframeAPIReady = previousReady;
        if (error) {
          apiLoads.delete(win);
          script.remove();
          reject(error);
        } else {
          resolve(win.YT);
        }
      };
      const ready = () => {
        finish(win.YT?.Player ? null : new Error("youtube-api-unavailable"));
        if (typeof previousReady === "function") previousReady();
      };
      const timer = win.setTimeout(() => finish(new Error("youtube-api-timeout")), 15000);
      win.onYouTubeIframeAPIReady = ready;
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => finish(new Error("youtube-api-blocked"));
      doc.head.append(script);
    });
    apiLoads.set(win, promise);
    return promise;
  }

  function create({ container, videoId, title, onReady, onError, win = window, doc = document }) {
    let active = true;
    let ready = false;
    let failed = false;
    let frame = null;
    let player = null;
    const removePlayer = () => {
      try {
        player?.destroy();
      } catch {
        // A detached third-party frame must not prevent closing the modal.
      }
      frame?.remove();
    };
    const fail = (error) => {
      if (!active || failed) return;
      failed = true;
      win.clearTimeout(timer);
      frame?.setAttribute("aria-hidden", "true");
      if (frame) frame.tabIndex = -1;
      removePlayer();
      onError(error);
    };
    const timer = win.setTimeout(() => {
      if (!ready) fail(new Error("youtube-player-timeout"));
    }, 20000);

    const reveal = () => {
      if (!active || failed) return;
      ready = true;
      win.clearTimeout(timer);
      frame?.removeAttribute("aria-hidden");
      if (frame) frame.tabIndex = 0;
      onReady();
    };

    loadApi(win, doc).then((YT) => {
      if (!active) return;
      // Never reuse a frame or navigate it through about:blank between videos.
      frame = doc.createElement("iframe");
      frame.setAttribute("data-video-frame", "");
      frame.setAttribute("aria-hidden", "true");
      frame.tabIndex = -1;
      frame.title = title;
      frame.loading = "eager";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
      url.searchParams.set("enablejsapi", "1");
      url.searchParams.set("autoplay", "1");
      url.searchParams.set("playsinline", "1");
      url.searchParams.set("rel", "0");
      const origin = new URL(win.location.href).origin;
      if (origin !== "null") url.searchParams.set("origin", origin);
      frame.src = url.toString();
      container.append(frame);
      player = new YT.Player(frame, {
        events: {
          onReady(event) {
            if (!active || failed) return;
            reveal();
            event.target.playVideo();
          },
          onAutoplayBlocked: reveal,
          onError: (event) => fail(new Error(`youtube-player-${event.data}`))
        }
      });
    }).catch(fail);

    return {
      destroy() {
        active = false;
        win.clearTimeout(timer);
        removePlayer();
      }
    };
  }

  if (typeof module === "object" && module.exports) module.exports = { create };
  else root.TwiceYouTubePlayer = { create };
})(globalThis);
