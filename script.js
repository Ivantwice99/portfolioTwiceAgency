const buttons = document.querySelectorAll("[data-panel-button]");
const panels = document.querySelectorAll("[data-panel]");
const stars = document.querySelector("[data-stars]");
const pentagonField = document.querySelector("[data-pentagon-field]");
const particleField = document.querySelector("[data-particle-field]");
const videoModal = document.querySelector("[data-video-modal]");
const modalPanel = videoModal?.querySelector(".modal-panel");
const modalScreen = document.querySelector(".modal-screen");
const videoPlayer = document.querySelector("[data-video-player]");
const videoFrame = document.querySelector("[data-video-frame]");
const openVideoButtons = document.querySelectorAll("[data-open-video]");
const closeVideoButtons = document.querySelectorAll("[data-close-video]");
const contactForm = document.querySelector("[data-contact-form]");
const contactLinks = document.querySelectorAll("[data-contact-action]");
const formStatus = document.querySelector("[data-form-status]");
const contactSubmit = contactForm?.querySelector("button[type=\"submit\"]");
const availabilityStatus = document.querySelector("[data-availability-status]");
const availabilityLabel = document.querySelector("[data-availability-label]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const languageToggle = document.querySelector("[data-language-toggle]");
const ambientToggle = document.querySelector("[data-ambient-toggle]");
const ambientAudio = document.querySelector("[data-ambient-audio]");
const themeLabel = document.querySelector("[data-theme-label]");
const languageCurrent = document.querySelector("[data-lang-current]");
const languageAlt = document.querySelector(".language-alt");
const validPanels = ["videos", "pagos", "contacto"];
const editorIsAvailable = true;
const clickSoundUrl = "assets/audio/final-fantasy-menu-click.mp3";
const ambientVolumePercent = 5;
const smallScreenQuery = window.matchMedia("(max-width: 720px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(pointer: fine)");
const canUseMotion = !reducedMotionQuery.matches;
const canUsePointerEffects = canUseMotion && finePointerQuery.matches;
const translations = {
  es: {
    statusRole: "Editor freelancer",
    available: "Disponible",
    unavailable: "No disponible",
    themeDark: "Oscuro",
    themeLight: "Claro",
    themeAria: "Cambiar tema",
    languageAria: "Cambiar idioma",
    ambientAria: "Audio ambiental 5%",
    videoPortfolio: "Video portfolio",
    videoPreviewLabel: "Preview de video",
    menuTitle: "Menú de edición",
    videos: "Videos",
    payments: "Formas de pago",
    contact: "Contacto",
    reels: "Reels",
    ads: "Ads",
    events: "Eventos",
    selectExample: "Selecciona un ejemplo",
    video01Title: "Tech reel futurista",
    video01Desc: "Robot, texto y ritmo vertical.",
    video02Title: "Intro anime gamer",
    video02Desc: "Hook rápido con energía visual.",
    video03Title: "Vista aérea urbana",
    video03Desc: "Dron, ambiente y corte cinemático.",
    video04Title: "Baile urbano",
    video04Desc: "Split screen y cortes al beat.",
    video05Title: "Hook dramático",
    video05Desc: "Texto grande y golpe visual.",
    video06Title: "Montaje oscuro",
    video06Desc: "Atmósfera, pausa y tensión.",
    video07Title: "Color y energia",
    video07Desc: "Flashes, saturación y ritmo.",
    video08Title: "Corte social",
    video08Desc: "Momentos clave para redes.",
    video09Title: "Cierre cinemático",
    video09Desc: "Paisaje, pausa y final limpio.",
    paymentsKicker: "Pagos",
    payPal: "PayPal",
    mercadoPago: "Mercado Pago",
    cryptoBinance: "Cripto / Binance",
    deposit: "50% anticipo",
    finalPayment: "50% al aprobar entrega final",
    contactTitle: "Reserva tu edición",
    namePlaceholder: "Nombre",
    projectPlaceholder: "Proyecto",
    projectReel: "Reel",
    projectAds: "Ads",
    projectEvent: "Evento",
    projectMotion: "Motion",
    messagePlaceholder: "Mensaje",
    contactEmail: "Correo",
    contactWhatsapp: "WhatsApp",
    contactEmailAria: "Abrir correo",
    contactWhatsappAria: "Abrir WhatsApp",
    whatsAppMessage: "Hola TwiceAgency, quiero cotizar una edicion de video.",
    send: "Enviar",
    formIncomplete: "Completa nombre y mensaje.",
    formSending: "Enviando mensaje...",
    formSent: "Mensaje enviado. Si es el primer envio, confirma el correo de FormSubmit.",
    formFailed: "No se pudo enviar. Intenta con Correo o WhatsApp.",
    projectFallback: "Sin especificar",
    mailSubject: "Proyecto de video",
    mailName: "Nombre",
    mailProject: "Proyecto"
  },
  en: {
    statusRole: "Freelance editor",
    available: "Available",
    unavailable: "Unavailable",
    themeDark: "Dark",
    themeLight: "Light",
    themeAria: "Change theme",
    languageAria: "Change language",
    ambientAria: "Ambient audio 5%",
    videoPortfolio: "Video portfolio",
    videoPreviewLabel: "Video preview",
    menuTitle: "Editing menu",
    videos: "Videos",
    payments: "Payment methods",
    contact: "Contact",
    reels: "Reels",
    ads: "Ads",
    events: "Events",
    selectExample: "Select an example",
    video01Title: "Futuristic tech reel",
    video01Desc: "Robot, text, and vertical rhythm.",
    video02Title: "Anime gamer intro",
    video02Desc: "Fast hook with visual energy.",
    video03Title: "Urban aerial view",
    video03Desc: "Drone, mood, and cinematic cut.",
    video04Title: "Urban dance",
    video04Desc: "Split screen and beat-driven cuts.",
    video05Title: "Dramatic hook",
    video05Desc: "Large text and visual impact.",
    video06Title: "Dark montage",
    video06Desc: "Atmosphere, pause, and tension.",
    video07Title: "Color and energy",
    video07Desc: "Flashes, saturation, and rhythm.",
    video08Title: "Social cut",
    video08Desc: "Key moments for social media.",
    video09Title: "Cinematic closer",
    video09Desc: "Landscape, pause, and clean ending.",
    paymentsKicker: "Payments",
    payPal: "PayPal",
    mercadoPago: "Mercado Pago",
    cryptoBinance: "Crypto / Binance",
    deposit: "50% upfront",
    finalPayment: "50% after final approval",
    contactTitle: "Book your edit",
    namePlaceholder: "Name",
    projectPlaceholder: "Project",
    projectReel: "Reel",
    projectAds: "Ads",
    projectEvent: "Event",
    projectMotion: "Motion",
    messagePlaceholder: "Message",
    contactEmail: "Email",
    contactWhatsapp: "WhatsApp",
    contactEmailAria: "Open email",
    contactWhatsappAria: "Open WhatsApp",
    whatsAppMessage: "Hi TwiceAgency, I want to quote a video edit.",
    send: "Send",
    formIncomplete: "Complete name and message.",
    formSending: "Sending message...",
    formSent: "Message sent. If this is the first send, confirm the FormSubmit email.",
    formFailed: "Could not send. Try Email or WhatsApp.",
    projectFallback: "Not specified",
    mailSubject: "Video project",
    mailName: "Name",
    mailProject: "Project"
  }
};
const contactVault = {
  emailUser: ["contacto", "twice99"],
  emailDomain: ["gmail", "com"],
  phone: ["52", "55", "1706", "5611"]
};
const menuClickSounds = Array.from({ length: 4 }, () => {
  const audio = new Audio(clickSoundUrl);
  audio.preload = "auto";
  audio.volume = 0.48;
  audio.load();
  return audio;
});
let audioContext;
let clickSoundBuffer;
let clickSoundPromise;
let clickSoundIndex = 0;
let ambientRequested = true;
let ambientPlaying = false;
let ambientEnabled = true;
const defaultLanguage = "en";
const defaultTheme = "dark";
let currentLanguage = localStorage.getItem("twiceLanguage") || defaultLanguage;
let currentTheme = localStorage.getItem("twiceTheme") || defaultTheme;

const setAvailability = (isAvailable) => {
  if (!availabilityStatus || !availabilityLabel) return;
  const copy = translations[currentLanguage] || translations.en;

  availabilityStatus.classList.toggle("is-available", isAvailable);
  availabilityStatus.classList.toggle("is-unavailable", !isAvailable);
  availabilityLabel.textContent = isAvailable ? copy.available : copy.unavailable;
};

const setTheme = (theme) => {
  currentTheme = theme === "light" ? "light" : "dark";
  document.body.classList.toggle("theme-light", currentTheme === "light");
  themeToggle?.setAttribute("aria-pressed", String(currentTheme === "light"));
  localStorage.setItem("twiceTheme", currentTheme);

  const copy = translations[currentLanguage] || translations.en;
  if (themeLabel) {
    themeLabel.textContent = currentTheme === "light" ? copy.themeLight : copy.themeDark;
  }
};

const setLanguage = (language) => {
  currentLanguage = language === "en" ? "en" : "es";
  const copy = translations[currentLanguage] || translations.en;

  document.documentElement.lang = currentLanguage;
  localStorage.setItem("twiceLanguage", currentLanguage);
  languageToggle?.setAttribute("aria-pressed", String(currentLanguage === "en"));
  languageToggle?.setAttribute("aria-label", copy.languageAria);
  themeToggle?.setAttribute("aria-label", copy.themeAria);
  ambientToggle?.setAttribute("aria-label", copy.ambientAria);
  ambientToggle?.setAttribute("title", copy.ambientAria);
  if (languageCurrent) languageCurrent.textContent = currentLanguage.toUpperCase();
  if (languageAlt) languageAlt.textContent = currentLanguage === "en" ? "ES" : "EN";
  contactLinks.forEach((link) => {
    const isEmail = link.dataset.contactAction === "email";
    link.setAttribute("aria-label", isEmail ? copy.contactEmailAria : copy.contactWhatsappAria);
  });

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key && copy[key]) element.textContent = copy[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (key && copy[key]) element.setAttribute("placeholder", copy[key]);
  });

  setAvailability(editorIsAvailable);
  setTheme(currentTheme);
  setAmbientToggleState();
};

const getContactTarget = () => ({
  email: `${contactVault.emailUser.join("")}@${contactVault.emailDomain.join(".")}`,
  phone: contactVault.phone.join("")
});

const setFormStatus = (message = "", tone = "neutral") => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.toggle("is-success", tone === "success");
  formStatus.classList.toggle("is-error", tone === "error");
};

const sendContactRequest = async ({ name, project, message }, copy) => {
  const contact = getContactTarget();
  const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name,
      project,
      message,
      _subject: `${copy.mailSubject}: ${project}`,
      _template: "table",
      _captcha: "false"
    })
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false || result.success === "false") {
    throw new Error(result.message || "contact-send-failed");
  }

  return result;
};

const setAmbientToggleState = () => {
  if (!ambientToggle) return;

  ambientToggle.classList.toggle("is-enabled", ambientEnabled);
  ambientToggle.classList.toggle("is-playing", ambientPlaying);
  ambientToggle.setAttribute("aria-pressed", String(ambientEnabled));
};

const syncAmbientVolume = () => {
  if (!ambientAudio) return;

  ambientAudio.volume = ambientVolumePercent / 100;
  ambientAudio.loop = true;
};

const markAmbientPlaying = (isPlaying) => {
  ambientPlaying = isPlaying;
  document.body.classList.toggle("ambient-playing", ambientPlaying);
  setAmbientToggleState();
};

const playAmbientAudio = (options = {}) => {
  if (!ambientEnabled || !ambientAudio) return;

  const mutedBootstrap = Boolean(options.mutedBootstrap);
  ambientRequested = true;
  syncAmbientVolume();
  ambientAudio.muted = mutedBootstrap;

  const playback = ambientAudio.play();
  if (playback?.then) {
    playback
      .then(() => {
        syncAmbientVolume();
        ambientAudio.muted = false;
        markAmbientPlaying(!ambientAudio.paused);
      })
      .catch(() => {
        ambientAudio.muted = false;
        markAmbientPlaying(false);
      });
  } else {
    ambientAudio.muted = false;
    markAmbientPlaying(!ambientAudio.paused);
  }
};

const pauseAmbientAudio = () => {
  ambientRequested = false;
  if (ambientAudio) {
    ambientAudio.muted = false;
    ambientAudio.pause();
  }

  markAmbientPlaying(false);
};

const requestAmbientAudio = (options = {}) => {
  if (!ambientEnabled || !ambientAudio) return;

  ambientRequested = true;
  playAmbientAudio(options);
};

const scheduleAmbientAutoplay = () => {
  if (!ambientEnabled || !ambientAudio) return;

  requestAmbientAudio({ mutedBootstrap: true });
  [700, 1800, 3600, 6200].forEach((delay) => {
    window.setTimeout(() => {
      if (ambientEnabled && !ambientPlaying) {
        requestAmbientAudio({ mutedBootstrap: true });
      }
    }, delay);
  });
};

if (ambientAudio) {
  syncAmbientVolume();
  try {
    ambientAudio.load();
  } catch {
    // Some browsers defer remote audio loading until play() is requested.
  }
  ambientAudio.addEventListener("play", () => markAmbientPlaying(true));
  ambientAudio.addEventListener("playing", () => markAmbientPlaying(true));
  ambientAudio.addEventListener("pause", () => markAmbientPlaying(false));
  ambientAudio.addEventListener("ended", () => {
    if (ambientEnabled && ambientRequested) requestAmbientAudio();
  });
}

setLanguage(currentLanguage);
setTheme(currentTheme);
setAmbientToggleState();
scheduleAmbientAutoplay();

if (stars) {
  const total = canUseMotion
    ? (smallScreenQuery.matches ? 10 : 28)
    : 0;

  for (let index = 0; index < total; index += 1) {
    const star = document.createElement("span");
    star.style.setProperty("--x", `${Math.random() * 100}%`);
    star.style.setProperty("--y", `${Math.random() * 100}%`);
    star.style.setProperty("--s", `${Math.random() * 2.4 + 1}px`);
    star.style.setProperty("--o", `${Math.random() * 0.6 + 0.25}`);
    star.style.setProperty("--d", `${Math.random() * 2.4 + 1.8}s`);
    stars.append(star);
  }
}

const createMotionElement = (className, index, total) => {
  const element = document.createElement("span");
  const size = className === "falling-pentagon"
    ? Math.random() * 26 + 18
    : Math.random() * 2.8 + 1.4;
  const duration = className === "falling-pentagon"
    ? Math.random() * 8 + 10
    : Math.random() * 5 + 6;
  const delay = -(duration / total) * index - Math.random() * 3;
  const drift = (Math.random() - 0.5) * 28;

  element.className = className;
  element.style.setProperty("--x", `${Math.random() * 100}%`);
  element.style.setProperty("--size", `${size}px`);
  element.style.setProperty("--duration", `${duration}s`);
  element.style.setProperty("--delay", `${delay}s`);
  element.style.setProperty("--drift", `${drift}vw`);
  element.style.setProperty("--rot", `${Math.random() * 360}deg`);
  element.style.setProperty("--o", `${Math.random() * 0.34 + 0.18}`);

  return element;
};

const initMotionBackground = () => {
  if (pentagonField) {
    const totalPentagons = canUseMotion
      ? (smallScreenQuery.matches ? 5 : 12)
      : 0;
    pentagonField.replaceChildren(...Array.from({ length: totalPentagons }, (_, index) => (
      createMotionElement("falling-pentagon", index, totalPentagons)
    )));
  }

  if (particleField) {
    const totalParticles = canUseMotion
      ? (smallScreenQuery.matches ? 0 : 24)
      : 0;
    particleField.replaceChildren(...Array.from({ length: totalParticles }, (_, index) => (
      createMotionElement("falling-particle", index, totalParticles)
    )));
  }

  if (!canUsePointerEffects) return;

  document.addEventListener("pointerdown", (event) => {
    if (!pentagonField) return;
    const rect = pentagonField.getBoundingClientRect();
    pentagonField.style.setProperty("--pulse-x", `${event.clientX - rect.left}px`);
    pentagonField.style.setProperty("--pulse-y", `${event.clientY - rect.top}px`);
    pentagonField.classList.remove("is-pulsing");
    void pentagonField.offsetWidth;
    pentagonField.classList.add("is-pulsing");
  }, { passive: true });
};

initMotionBackground();

const activatePanel = (panelName, updateHash = true) => {
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panelButton === panelName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === panelName);
  });

  if (updateHash) {
    history.replaceState(null, "", `#${panelName}`);
    document.querySelector(".stage")?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  audioContext = audioContext || new AudioContextClass();
  return audioContext;
};

const prepareClickSound = () => {
  const context = getAudioContext();
  if (!context || clickSoundBuffer) return clickSoundPromise;

  clickSoundPromise = clickSoundPromise || fetch(clickSoundUrl)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((buffer) => {
      clickSoundBuffer = buffer;
      return buffer;
    })
    .catch(() => null);

  return clickSoundPromise;
};

const playSynthClick = (variant = 0) => {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    context.resume();
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const startFrequency = 440 + variant * 90;

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(startFrequency * 1.55, now + 0.08);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1600, now);
  filter.frequency.exponentialRampToValueAtTime(420, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.14);
};

const playClick = (variant = 0) => {
  const context = getAudioContext();

  if (context?.state === "suspended") {
    context.resume();
  }

  if (context && clickSoundBuffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = clickSoundBuffer;
    gain.gain.setValueAtTime(0.5, context.currentTime);
    source.connect(gain);
    gain.connect(context.destination);
    source.start(context.currentTime);
    return;
  }

  prepareClickSound();

  const click = menuClickSounds[clickSoundIndex % menuClickSounds.length];
  clickSoundIndex += 1;

  try {
    click.currentTime = 0;
  } catch {
    // Some browsers lock currentTime until the file is ready; the pool still avoids clone latency.
  }

  const playback = click.play();

  if (playback?.catch) {
    playback.catch(() => playSynthClick(variant));
  }
};

prepareClickSound();

const playOnPointerDown = (element, variant) => {
  element.addEventListener("pointerdown", (event) => {
    if (event.button && event.button !== 0) return;
    playClick(typeof variant === "function" ? variant(element) : variant);
  });
};

const playOnKeyboardClick = (event, variant) => {
  if (event.detail === 0) {
    playClick(variant);
  }
};

const burstAt = (event) => {
  if (!canUsePointerEffects) return;

  const spark = document.createElement("span");
  spark.className = "click-spark";
  spark.style.setProperty("--x", `${event.clientX}px`);
  spark.style.setProperty("--y", `${event.clientY}px`);
  document.body.append(spark);
  spark.addEventListener("animationend", () => spark.remove(), { once: true });
};

const setLocalPointer = (event) => {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--local-x", `${event.clientX - rect.left}px`);
  target.style.setProperty("--local-y", `${event.clientY - rect.top}px`);
};

buttons.forEach((button) => {
  playOnPointerDown(button, () => Number(button.textContent.trim().slice(0, 2)) || 0);

  button.addEventListener("click", (event) => {
    playOnKeyboardClick(event, Number(button.textContent.trim().slice(0, 2)) || 0);
    burstAt(event);
    activatePanel(button.dataset.panelButton);
  });
});

if (canUsePointerEffects) {
  document.querySelectorAll(".video-tile, .payment-grid article, .contact-button, .control-switch").forEach((element) => {
    element.addEventListener("pointermove", setLocalPointer, { passive: true });
  });
}

document.querySelectorAll(".payment-grid article, .contact-button, .control-switch").forEach((element, index) => {
  playOnPointerDown(element, index % 4);

  element.addEventListener("click", (event) => {
    playOnKeyboardClick(event, index % 4);
    burstAt(event);
  });
});

themeToggle?.addEventListener("click", () => {
  setTheme(currentTheme === "light" ? "dark" : "light");
});

languageToggle?.addEventListener("click", () => {
  setLanguage(currentLanguage === "en" ? "es" : "en");
});

ambientToggle?.addEventListener("click", () => {
  const shouldPause = ambientPlaying || Boolean(ambientAudio && !ambientAudio.paused);

  if (shouldPause) {
    ambientEnabled = false;
    pauseAmbientAudio();
  } else {
    ambientEnabled = true;
    ambientRequested = true;
    requestAmbientAudio();
  }

  setAmbientToggleState();
});

window.addEventListener("load", scheduleAmbientAutoplay);
window.addEventListener("pageshow", scheduleAmbientAutoplay);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    scheduleAmbientAutoplay();
  }
});

contactLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const contact = getContactTarget();
    const copy = translations[currentLanguage] || translations.en;

    if (link.dataset.contactAction === "whatsapp") {
      const url = `https://wa.me/${contact.phone}?text=${encodeURIComponent(copy.whatsAppMessage)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = `mailto:${contact.email}`;
  });
});

if (canUsePointerEffects) {
  let pointerFrame = 0;
  let pointerX = 50;
  let pointerY = 45;

  document.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth) * 100;
    pointerY = (event.clientY / window.innerHeight) * 100;

    if (pointerFrame) return;

    pointerFrame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--pointer-x", `${pointerX}%`);
      document.documentElement.style.setProperty("--pointer-y", `${pointerY}%`);
      pointerFrame = 0;
    });
  }, { passive: true });
}

const initialPanel = location.hash.replace("#", "");
if (validPanels.includes(initialPanel)) {
  activatePanel(initialPanel, false);
  window.scrollTo(0, 0);
}

window.addEventListener("load", () => {
  if (validPanels.includes(location.hash.replace("#", ""))) {
    window.scrollTo(0, 0);
    document.querySelector(".stage")?.scrollTo(0, 0);
  }
});

window.addEventListener("hashchange", () => {
  const panelName = location.hash.replace("#", "");

  if (validPanels.includes(panelName)) {
    activatePanel(panelName, false);
  }
});

const withAutoplay = (url) => {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
};

const getDriveFileId = (url) => {
  if (!url) return "";
  const pathMatch = url.match(/\/d\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  return queryMatch ? queryMatch[1] : "";
};

const getDriveDownloadUrl = (url) => {
  const id = getDriveFileId(url);
  return id ? `https://drive.usercontent.google.com/download?id=${id}&export=download` : "";
};

let currentVideoFallback = "";

const syncEmbedScale = () => {
  if (!modalScreen || !smallScreenQuery.matches || !modalScreen.classList.contains("has-embed")) {
    modalScreen?.style.removeProperty("--embed-scale");
    return;
  }

  const width = modalScreen.clientWidth || window.innerWidth;
  const scale = Math.min(1, width / 640);
  modalScreen.style.setProperty("--embed-scale", scale.toFixed(4));
};

const resetVideoSurfaces = () => {
  currentVideoFallback = "";
  modalScreen?.classList.remove("has-video", "has-native", "has-embed");
  modalScreen?.style.removeProperty("--embed-scale");

  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
  }

  if (videoFrame) {
    videoFrame.src = "";
  }
};

const showEmbedVideo = (previewUrl) => {
  if (!videoFrame || !previewUrl) return;

  modalScreen?.classList.remove("has-native");
  modalScreen?.classList.add("has-video", "has-embed");
  videoFrame.src = withAutoplay(previewUrl);
  window.requestAnimationFrame(syncEmbedScale);
};

const openVideo = (title, previewUrl, ratio) => {
  if (!videoModal || !modalPanel) return;
  const copy = translations[currentLanguage] || translations.en;
  const sourceUrl = getDriveDownloadUrl(previewUrl);

  modalPanel.setAttribute("aria-label", `${copy.videoPreviewLabel}: ${title}`);
  modalPanel.classList.remove("is-portrait", "is-landscape");
  modalPanel.classList.add(ratio === "9:16" ? "is-portrait" : "is-landscape");

  resetVideoSurfaces();

  if (videoFrame) {
    videoFrame.title = copy.videoPreviewLabel;
    videoFrame.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
  }

  if (videoPlayer && sourceUrl) {
    currentVideoFallback = previewUrl;
    videoPlayer.title = copy.videoPreviewLabel;
    videoPlayer.src = sourceUrl;
    modalScreen?.classList.add("has-video", "has-native");
    const playback = videoPlayer.play();

    if (playback?.catch) {
      playback.catch(() => {
        // The visible native controls still let the user start playback after autoplay is blocked.
      });
    }
  } else if (previewUrl) {
    showEmbedVideo(previewUrl);
  }

  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalPanel.focus();
};

const closeVideo = () => {
  if (!videoModal) return;
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalPanel?.classList.remove("is-portrait", "is-landscape");
  resetVideoSurfaces();
};

videoPlayer?.addEventListener("error", () => {
  const fallback = currentVideoFallback;
  if (!fallback || !videoModal?.classList.contains("is-open")) return;

  currentVideoFallback = "";

  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
  }

  showEmbedVideo(fallback);
});

openVideoButtons.forEach((button) => {
  playOnPointerDown(button, 3);

  button.addEventListener("click", (event) => {
    playOnKeyboardClick(event, 3);
    burstAt(event);
    openVideo(
      button.querySelector(".tile-copy strong")?.textContent.trim() || button.dataset.videoTitle || "Video",
      button.dataset.videoPreview || "",
      button.dataset.videoRatio || "16:9"
    );
  });
});

closeVideoButtons.forEach((button) => {
  playOnPointerDown(button, 1);

  button.addEventListener("click", (event) => {
    playOnKeyboardClick(event, 1);
    burstAt(event);
    closeVideo();
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideo();
  }
});

window.addEventListener("resize", syncEmbedScale, { passive: true });

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  playClick(2);
  const copy = translations[currentLanguage] || translations.en;

  const data = new FormData(contactForm);
  const name = data.get("name")?.toString().trim();
  const project = data.get("project")?.toString().trim() || copy.projectFallback;
  const message = data.get("message")?.toString().trim();
  const honey = data.get("_honey")?.toString().trim();

  if (honey) {
    contactForm.reset();
    setFormStatus(copy.formSent, "success");
    return;
  }

  if (!name || !message) {
    setFormStatus(copy.formIncomplete, "error");
    return;
  }

  setFormStatus(copy.formSending);
  if (contactSubmit) contactSubmit.disabled = true;

  try {
    await sendContactRequest({ name, project, message }, copy);
    contactForm.reset();
    setFormStatus(copy.formSent, "success");
  } catch (error) {
    setFormStatus(copy.formFailed, "error");
  } finally {
    if (contactSubmit) contactSubmit.disabled = false;
  }
});
