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
const videoGrid = document.querySelector("[data-video-grid]");
const videoStatus = document.querySelector("[data-video-status]");
const adminOpen = document.querySelector("[data-admin-open]");
const adminModal = document.querySelector("[data-admin-modal]");
const adminPanel = adminModal?.querySelector(".admin-panel");
const adminLogin = document.querySelector("[data-admin-login]");
const adminEditor = document.querySelector("[data-admin-editor]");
const adminStatus = document.querySelector("[data-admin-status]");
const adminGoogle = document.querySelector("[data-admin-google]");
const googleLoginSlot = document.querySelector("[data-google-login]");
const adminAccount = document.querySelector("[data-admin-account]");
const adminList = document.querySelector("[data-admin-list]");
const adminAdd = document.querySelector("[data-admin-add]");
const adminSave = document.querySelector("[data-admin-save]");
const adminLogout = document.querySelector("[data-admin-logout]");
const adminCloseButtons = document.querySelectorAll("[data-admin-close]");
const closeVideoButtons = document.querySelectorAll("[data-close-video]");
const contactForm = document.querySelector("[data-contact-form]");
const contactLinks = document.querySelectorAll("[data-contact-action]");
const formStatus = document.querySelector("[data-form-status]");
const contactSubmit = contactForm?.querySelector("button[type=\"submit\"]");
const clientGrid = document.querySelector("[data-client-grid]");
const clientStatus = document.querySelector("[data-client-status]");
const clientRefresh = document.querySelector("[data-client-refresh]");
const clientApiState = document.querySelector("[data-client-api-state]");
const clientSummaryViews = document.querySelector("[data-client-summary=\"views\"]");
const clientSummaryLikes = document.querySelector("[data-client-summary=\"likes\"]");
const clientSummaryChannels = document.querySelector("[data-client-summary=\"channels\"]");
const availabilityStatus = document.querySelector("[data-availability-status]");
const availabilityLabel = document.querySelector("[data-availability-label]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const languageToggle = document.querySelector("[data-language-toggle]");
const ambientToggle = document.querySelector("[data-ambient-toggle]");
const ambientAudio = document.querySelector("[data-ambient-audio]");
const themeLabel = document.querySelector("[data-theme-label]");
const languageCurrent = document.querySelector("[data-lang-current]");
const languageAlt = document.querySelector(".language-alt");
const validPanels = ["videos", "clientes", "pagos", "contacto"];
const editorIsAvailable = true;
const clickSoundUrl = "assets/audio/final-fantasy-menu-click.mp3";
const ambientVolumePercent = 5;
const clientStatsDataUrl = "assets/data/youtube-clients.json";
const videoDataUrl = "assets/data/videos.json";
const adminApiBase = "/api/admin";
const allowedAdminEmail = "vaguacateman@gmail.com";
const clientChannels = [
  {
    handle: "RealidadPolicial",
    title: "Realidad Policial",
    url: "https://www.youtube.com/@RealidadPolicial",
    niche: "Documental / casos",
    tone: "gold"
  },
  {
    handle: "ConocimientoEsoterico",
    title: "Conocimiento Esoterico",
    url: "https://www.youtube.com/@ConocimientoEsoterico",
    niche: "Misterio / narrativas",
    tone: "cyan"
  },
  {
    handle: "DoubleTwiceOficial",
    title: "Double Twice Oficial",
    url: "https://www.youtube.com/@DoubleTwiceOficial",
    niche: "Marca / entretenimiento",
    tone: "rose"
  },
  {
    handle: "impactogeopolitik",
    title: "Impacto Geopolitik",
    url: "https://www.youtube.com/@impactogeopolitik",
    niche: "Geopolitica / actualidad",
    tone: "silver"
  }
];
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
    clients: "Clientes",
    payments: "Formas de pago",
    contact: "Contacto",
    reels: "Reels",
    ads: "Ads",
    events: "Eventos",
    selectExample: "Selecciona un ejemplo",
    loadingVideos: "Cargando ejemplos...",
    videoLoadError: "No se pudieron cargar los videos.",
    adminEditVideos: "Editar videos",
    adminOnlyKicker: "Solo admin",
    adminLoginTitle: "Selecciona tu cuenta de Google",
    adminLoginCopy: "Solo el admin autorizado puede editar este menu de videos.",
    adminGoogleButton: "Iniciar sesion con Google",
    adminEditorKicker: "Editor de videos",
    adminEditorTitle: "Gestionar ejemplos",
    adminAddVideo: "Agregar video",
    adminSaveVideos: "Guardar cambios",
    adminLogout: "Salir",
    adminOnlyMessage: "Solo el admin puede editar. Usa la cuenta autorizada.",
    adminConfigMissing: "Falta configurar GOOGLE_CLIENT_ID en Vercel.",
    adminLoginReady: "Elige la cuenta admin para continuar.",
    adminLoginChecking: "Validando cuenta...",
    adminLoginDenied: "Esta cuenta no tiene permiso. Solo puede editar el admin.",
    adminLoginSuccess: "Acceso de admin activo.",
    adminSaving: "Guardando cambios...",
    adminSaved: "Cambios guardados. Vercel puede tardar unos minutos en desplegar.",
    adminSaveError: "No se pudo guardar. Revisa la sesion o los secrets de Vercel.",
    adminFieldId: "ID visible",
    adminFieldRatio: "Formato",
    adminFieldTone: "Color",
    adminFieldDrive: "Link de Drive / preview",
    adminFieldThumb: "Miniatura",
    adminFieldTitleEn: "Titulo EN",
    adminFieldDescEn: "Descripcion EN",
    adminFieldTitleEs: "Titulo ES",
    adminFieldDescEs: "Descripcion ES",
    adminDeleteVideo: "Borrar",
    adminDriveHint: "Pega un enlace de Google Drive o /preview. El video debe estar visible para quien tenga el enlace.",
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
    clientsKicker: "Clientes",
    clientsTitle: "Impacto de canales",
    clientsIntro: "Metricas publicas de YouTube: views, likes recientes, suscriptores y uploads.",
    refreshStats: "Sincronizar",
    clientApiReady: "Stats listas",
    totalClients: "Clientes",
    totalViews: "Views totales",
    totalLikes: "Likes recientes",
    clientViews: "Views",
    clientSubscribers: "Subs",
    clientLikes: "Likes",
    clientVideos: "Videos",
    clientImpact: "Impacto",
    clientVisit: "Abrir canal",
    clientLatest: "Ultimo video",
    clientPendingShort: "Sync",
    clientReadyPrompt: "Stats publicas listas para sincronizar.",
    clientLoading: "Sincronizando canales...",
    clientLoaded: "Datos actualizados.",
    clientFallback: "Agrega SOCIALBLADE_CLIENT_ID/SOCIALBLADE_TOKEN o YOUTUBE_API_KEY para automatizar stats.",
    clientError: "No se pudo sincronizar YouTube ahora.",
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
    clients: "Clients",
    payments: "Payment methods",
    contact: "Contact",
    reels: "Reels",
    ads: "Ads",
    events: "Events",
    selectExample: "Select an example",
    loadingVideos: "Loading examples...",
    videoLoadError: "Could not load videos.",
    adminEditVideos: "Edit videos",
    adminOnlyKicker: "Admin only",
    adminLoginTitle: "Select your Google account",
    adminLoginCopy: "Only the authorized admin can edit this video menu.",
    adminGoogleButton: "Sign in with Google",
    adminEditorKicker: "Video editor",
    adminEditorTitle: "Manage examples",
    adminAddVideo: "Add video",
    adminSaveVideos: "Save changes",
    adminLogout: "Logout",
    adminOnlyMessage: "Only the admin can edit. Use the authorized account.",
    adminConfigMissing: "GOOGLE_CLIENT_ID must be configured in Vercel.",
    adminLoginReady: "Choose the admin account to continue.",
    adminLoginChecking: "Checking account...",
    adminLoginDenied: "This account is not allowed. Only the admin can edit.",
    adminLoginSuccess: "Admin access active.",
    adminSaving: "Saving changes...",
    adminSaved: "Changes saved. Vercel may take a few minutes to deploy.",
    adminSaveError: "Could not save. Check the session or Vercel secrets.",
    adminFieldId: "Visible ID",
    adminFieldRatio: "Format",
    adminFieldTone: "Color",
    adminFieldDrive: "Drive / preview link",
    adminFieldThumb: "Thumbnail",
    adminFieldTitleEn: "Title EN",
    adminFieldDescEn: "Description EN",
    adminFieldTitleEs: "Title ES",
    adminFieldDescEs: "Description ES",
    adminDeleteVideo: "Delete",
    adminDriveHint: "Paste a Google Drive link or /preview. The video must be visible to anyone with the link.",
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
    clientsKicker: "Client impact",
    clientsTitle: "Channel results",
    clientsIntro: "Public YouTube metrics: views, recent likes, subscribers, and uploads.",
    refreshStats: "Sync stats",
    clientApiReady: "Stats live",
    totalClients: "Clients",
    totalViews: "Total views",
    totalLikes: "Recent likes",
    clientViews: "Views",
    clientSubscribers: "Subs",
    clientLikes: "Likes",
    clientVideos: "Videos",
    clientImpact: "Impact",
    clientVisit: "Open channel",
    clientLatest: "Latest video",
    clientPendingShort: "Sync",
    clientReadyPrompt: "Public stats ready to sync.",
    clientLoading: "Syncing channels...",
    clientLoaded: "Data updated.",
    clientFallback: "Add SOCIALBLADE_CLIENT_ID/SOCIALBLADE_TOKEN or YOUTUBE_API_KEY to automate stats.",
    clientError: "Could not sync YouTube right now.",
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
  audio.volume = finePointerQuery.matches ? 0.42 : 0.24;
  audio.load();
  return audio;
});
let audioContext;
let clickSoundBuffer;
let clickSoundPromise;
let clickSoundIndex = 0;
let lastClickSoundAt = 0;
let ambientRequested = true;
let ambientPlaying = false;
let ambientEnabled = true;
const defaultLanguage = "en";
const defaultTheme = "dark";
let currentLanguage = localStorage.getItem("twiceLanguage") || defaultLanguage;
let currentTheme = localStorage.getItem("twiceTheme") || defaultTheme;
let clientStatsByHandle = new Map();
let clientStatsRequested = false;
let clientStatusKey = "clientReadyPrompt";
let clientStatusTone = "neutral";
let clientStatsUpdatedAt = "";
let portfolioVideos = [];
let adminVideosDraft = [];
let googleClientId = "";
let adminCredential = sessionStorage.getItem("twiceAdminCredential") || "";
let adminProfile = null;
let adminConfigRequested = false;
let adminGoogleInitialized = false;

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

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMetric(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "--";

  return new Intl.NumberFormat(currentLanguage === "es" ? "es-MX" : "en-US", {
    notation: "compact",
    maximumFractionDigits: number >= 1000000 ? 1 : 0
  }).format(number);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(currentLanguage === "es" ? "es-MX" : "en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

function getCopy() {
  return translations[currentLanguage] || translations.en;
}

function setClientStatus(key = clientStatusKey, tone = clientStatusTone) {
  clientStatusKey = key;
  clientStatusTone = tone;
  const copy = getCopy();
  const message = copy[key] || "";

  if (clientStatus) {
    const stamp = key === "clientLoaded" ? formatDate(clientStatsUpdatedAt) : "";
    clientStatus.textContent = stamp ? `${message} ${stamp}` : message;
    clientStatus.classList.toggle("is-success", tone === "success");
    clientStatus.classList.toggle("is-error", tone === "error");
  }

  if (clientApiState) {
    clientApiState.textContent = tone === "success" ? copy.clientApiReady : copy.clientPendingShort;
    clientApiState.classList.toggle("is-live", tone === "success");
    clientApiState.classList.toggle("is-pending", tone !== "success");
  }
}

function normalizeClientPayload(raw = {}, fallback = {}) {
  const stats = raw.statistics || raw.stats || {};
  const videos = Array.isArray(raw.videos)
    ? raw.videos
    : (Array.isArray(raw.latestVideos) ? raw.latestVideos : []);
  const recent = raw.recent || {};
  const channelViews = toNumber(stats.viewCount || raw.viewCount || raw.channelViews);
  const subscriberCount = toNumber(stats.subscriberCount || raw.subscriberCount);
  const videoCount = toNumber(stats.videoCount || raw.videoCount);
  const recentViews = toNumber(recent.views || raw.recentViews) || videos.reduce((total, video) => (
    total + toNumber(video.statistics?.viewCount || video.viewCount)
  ), 0);
  const recentLikes = toNumber(recent.likes || raw.recentLikes) || videos.reduce((total, video) => (
    total + toNumber(video.statistics?.likeCount || video.likeCount)
  ), 0);
  const latestVideo = videos[0] || raw.latestVideo || {};
  const hasStats = Boolean(channelViews || subscriberCount || videoCount || recentViews || recentLikes);

  return {
    handle: raw.handle || fallback.handle,
    title: raw.title || raw.name || raw.snippet?.title || fallback.title,
    url: raw.url || fallback.url,
    niche: raw.niche || fallback.niche,
    tone: fallback.tone,
    thumbnail: raw.thumbnail || raw.avatar || raw.snippet?.thumbnails?.high?.url || raw.snippet?.thumbnails?.default?.url || "",
    channelViews,
    subscriberCount,
    videoCount,
    recentViews,
    recentLikes,
    latestTitle: raw.latestTitle || latestVideo.title || latestVideo.snippet?.title || "",
    hasStats
  };
}

function getClientData(channel) {
  return clientStatsByHandle.get(channel.handle.toLowerCase()) || normalizeClientPayload({}, channel);
}

function updateClientSummary() {
  const rows = clientChannels.map(getClientData);
  const hasAnyStats = rows.some((row) => row.hasStats);
  const totalViews = rows.reduce((total, row) => total + row.channelViews, 0);
  const totalLikes = rows.reduce((total, row) => total + row.recentLikes, 0);

  if (clientSummaryChannels) clientSummaryChannels.textContent = String(clientChannels.length);
  if (clientSummaryViews) clientSummaryViews.textContent = hasAnyStats ? formatMetric(totalViews) : "--";
  if (clientSummaryLikes) clientSummaryLikes.textContent = hasAnyStats ? formatMetric(totalLikes) : "--";
}

function renderClientCards() {
  if (!clientGrid) return;
  const copy = getCopy();

  clientGrid.innerHTML = clientChannels.map((channel) => {
    const data = getClientData(channel);
    const avatar = data.thumbnail
      ? `<img src="${escapeHtml(data.thumbnail)}" alt="">`
      : `<span>${escapeHtml((data.title || channel.title).slice(0, 2).toUpperCase())}</span>`;
    const latest = data.latestTitle
      ? `${copy.clientLatest}: ${data.latestTitle}`
      : channel.niche;

    return `
      <article class="client-card client-${escapeHtml(channel.tone)}${data.hasStats ? "" : " is-pending"}">
        <a class="client-main" href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(`${copy.clientVisit}: ${data.title}`)}">
          <span class="client-avatar" aria-hidden="true">${avatar}</span>
          <span class="client-copy">
            <strong>${escapeHtml(data.title)}</strong>
            <small>@${escapeHtml(channel.handle)}</small>
          </span>
        </a>
        <div class="client-metrics">
          <span class="client-metric">
            <strong>${formatMetric(data.channelViews)}</strong>
            <small>${copy.clientViews}</small>
          </span>
          <span class="client-metric">
            <strong>${formatMetric(data.subscriberCount)}</strong>
            <small>${copy.clientSubscribers}</small>
          </span>
          <span class="client-metric">
            <strong>${formatMetric(data.recentLikes)}</strong>
            <small>${copy.clientLikes}</small>
          </span>
          <span class="client-metric">
            <strong>${formatMetric(data.videoCount)}</strong>
            <small>${copy.clientVideos}</small>
          </span>
        </div>
        <p>${escapeHtml(latest)}</p>
      </article>
    `;
  }).join("");

  updateClientSummary();
  setClientStatus();
}

function mergeClientStats(payload = {}) {
  const channels = Array.isArray(payload) ? payload : (payload.channels || []);
  let synced = 0;

  channels.forEach((raw) => {
    const handle = String(raw.handle || "").replace(/^@/, "");
    const fallback = clientChannels.find((channel) => channel.handle.toLowerCase() === handle.toLowerCase());
    if (!fallback) return;

    const normalized = normalizeClientPayload(raw, fallback);
    clientStatsByHandle.set(fallback.handle.toLowerCase(), normalized);
    if (normalized.hasStats) synced += 1;
  });

  clientStatsUpdatedAt = payload.updatedAt || "";
  return synced;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`stats-http-${response.status}`);
  return response.json();
}

function setVideoStatus(key = "", tone = "neutral") {
  if (!videoStatus) return;
  const copy = getCopy();
  videoStatus.textContent = key ? (copy[key] || key) : "";
  videoStatus.classList.toggle("is-success", tone === "success");
  videoStatus.classList.toggle("is-error", tone === "error");
}

function getLocalizedVideoText(video, field) {
  const value = video?.[field];
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[currentLanguage] || value.en || value.es || "";
}

function getVideoPreviewUrl(video) {
  const rawUrl = video.previewUrl || video.driveUrl || "";
  const driveId = getDriveFileId(rawUrl);
  if (driveId) return `https://drive.google.com/file/d/${driveId}/preview`;
  return rawUrl;
}

function getVideoThumbnailUrl(video) {
  if (video.thumbnailUrl) return video.thumbnailUrl;
  const driveId = getDriveFileId(video.previewUrl || video.driveUrl || "");
  return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w640` : "";
}

function normalizeVideoRecord(video = {}, index = 0) {
  const code = String(video.code || video.id || `MDV-${String(index + 1).padStart(2, "0")}`).trim();
  const uid = String(video.uid || code || `video-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const title = typeof video.title === "object"
    ? video.title
    : { en: String(video.title || ""), es: String(video.title || "") };
  const description = typeof video.description === "object"
    ? video.description
    : { en: String(video.description || ""), es: String(video.description || "") };

  return {
    uid: uid || `video-${index + 1}`,
    code,
    ratio: video.ratio === "9:16" ? "9:16" : "16:9",
    tone: ["gold", "cyan", "rose", "silver"].includes(video.tone) ? video.tone : ["gold", "cyan", "rose", "silver"][index % 4],
    quality: video.quality || "original",
    previewUrl: getVideoPreviewUrl(video),
    thumbnailUrl: getVideoThumbnailUrl(video),
    title: {
      en: String(title.en || title.es || code),
      es: String(title.es || title.en || code)
    },
    description: {
      en: String(description.en || description.es || ""),
      es: String(description.es || description.en || "")
    }
  };
}

function renderVideoTiles() {
  if (!videoGrid) return;
  const copy = getCopy();

  if (!portfolioVideos.length) {
    videoGrid.innerHTML = "";
    setVideoStatus("loadingVideos");
    return;
  }

  videoGrid.innerHTML = portfolioVideos.map((video, index) => {
    const title = getLocalizedVideoText(video, "title") || video.code;
    const description = getLocalizedVideoText(video, "description");
    const thumbnail = getVideoThumbnailUrl(video);
    const style = thumbnail ? ` style="--thumb: url('${escapeHtml(thumbnail)}');"` : "";

    return `
      <button class="video-tile" type="button" data-open-video="${escapeHtml(video.uid || `video-${index + 1}`)}" data-video-id="${escapeHtml(video.code)}" data-video-ratio="${escapeHtml(video.ratio)}" data-video-quality="${escapeHtml(video.quality || "original")}" data-video-title="${escapeHtml(title)}" data-video-preview="${escapeHtml(getVideoPreviewUrl(video))}">
        <span class="video-thumb thumb-${escapeHtml(video.tone || "gold")}"${style} aria-hidden="true">
          <i></i>
        </span>
        <span class="tile-copy">
          <span class="video-code">ID ${escapeHtml(video.code)}</span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(description)}</small>
        </span>
      </button>
    `;
  }).join("");

  setVideoStatus("");
}

async function loadPortfolioVideos() {
  setVideoStatus("loadingVideos");

  try {
    const payload = await fetchJson(`${videoDataUrl}?v=admin-video-editor-v1`);
    portfolioVideos = (payload.videos || []).map(normalizeVideoRecord);
    renderVideoTiles();
  } catch (error) {
    renderVideoTiles();
    setVideoStatus("videoLoadError", "error");
  }
}

function setAdminStatus(key = "", tone = "neutral") {
  if (!adminStatus) return;
  const copy = getCopy();
  adminStatus.textContent = key ? (copy[key] || key) : "";
  adminStatus.classList.toggle("is-success", tone === "success");
  adminStatus.classList.toggle("is-error", tone === "error");
}

function setAdminMode(isAuthed) {
  if (adminLogin) adminLogin.hidden = isAuthed;
  if (adminEditor) adminEditor.hidden = !isAuthed;
  if (adminAccount) {
    adminAccount.textContent = adminProfile?.email
      ? `${adminProfile.name || "Admin"} · ${adminProfile.email}`
      : allowedAdminEmail;
  }
}

function cloneVideoList(videos) {
  return JSON.parse(JSON.stringify(videos || []));
}

async function loadAdminConfig() {
  if (adminConfigRequested) return;
  adminConfigRequested = true;

  try {
    const payload = await fetchJson(`${adminApiBase}/config`);
    googleClientId = payload.googleClientId || "";
  } catch {
    googleClientId = "";
  }
}

function initializeGoogleLogin() {
  if (!googleClientId || adminGoogleInitialized || !window.google?.accounts?.id) return false;
  adminGoogleInitialized = true;

  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true
  });

  if (googleLoginSlot) {
    googleLoginSlot.innerHTML = "";
    window.google.accounts.id.renderButton(googleLoginSlot, {
      theme: currentTheme === "light" ? "outline" : "filled_black",
      size: "large",
      shape: "rectangular",
      text: "signin_with",
      width: Math.min(360, Math.max(220, googleLoginSlot.clientWidth || 260))
    });
  }

  return true;
}

async function verifyAdminCredential(credential) {
  const response = await fetch(`${adminApiBase}/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      action: "verify",
      credential
    })
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || "admin-denied");
  }

  return payload.profile || {};
}

async function handleGoogleCredential(response) {
  if (!response?.credential) {
    setAdminStatus("adminLoginDenied", "error");
    return;
  }

  adminCredential = response.credential;
  sessionStorage.setItem("twiceAdminCredential", adminCredential);
  setAdminStatus("adminLoginChecking");

  try {
    adminProfile = await verifyAdminCredential(adminCredential);
    adminVideosDraft = cloneVideoList(portfolioVideos);
    setAdminMode(true);
    renderAdminEditor();
    setAdminStatus("adminLoginSuccess", "success");
  } catch {
    sessionStorage.removeItem("twiceAdminCredential");
    adminCredential = "";
    adminProfile = null;
    setAdminMode(false);
    setAdminStatus("adminLoginDenied", "error");
  }
}

async function openAdminModal() {
  if (!adminModal || !adminPanel) return;
  adminModal.classList.add("is-open");
  adminModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setAdminMode(false);
  setAdminStatus("adminOnlyMessage");
  adminPanel.focus();

  await loadAdminConfig();

  if (!googleClientId) {
    setAdminStatus("adminConfigMissing", "error");
    return;
  }

  if (!initializeGoogleLogin()) {
    window.setTimeout(initializeGoogleLogin, 500);
  }

  if (adminCredential) {
    await handleGoogleCredential({ credential: adminCredential });
  } else {
    setAdminStatus("adminLoginReady");
  }
}

function closeAdminModal() {
  if (!adminModal) return;
  adminModal.classList.remove("is-open");
  adminModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function createBlankVideo() {
  const nextNumber = adminVideosDraft.length + 1;
  return normalizeVideoRecord({
    uid: `example-${String(nextNumber).padStart(2, "0")}`,
    code: `MDV-${String(nextNumber).padStart(2, "0")}`,
    ratio: "9:16",
    tone: ["gold", "cyan", "rose", "silver"][adminVideosDraft.length % 4],
    previewUrl: "",
    thumbnailUrl: "",
    title: {
      en: "New video",
      es: "Nuevo video"
    },
    description: {
      en: "Short portfolio example.",
      es: "Ejemplo breve de portafolio."
    }
  }, nextNumber - 1);
}

function renderAdminEditor() {
  if (!adminList) return;
  const copy = getCopy();

  adminList.innerHTML = adminVideosDraft.map((video, index) => `
    <article class="admin-video-card" data-admin-video-index="${index}">
      <div class="admin-video-card-head">
        <span class="video-code">ID ${escapeHtml(video.code)}</span>
        <button class="admin-danger" type="button" data-admin-delete="${index}">${escapeHtml(copy.adminDeleteVideo)}</button>
      </div>
      <div class="admin-form-grid">
        <label>
          <span>${escapeHtml(copy.adminFieldId)}</span>
          <input type="text" value="${escapeHtml(video.code)}" data-admin-field="code">
        </label>
        <label>
          <span>${escapeHtml(copy.adminFieldRatio)}</span>
          <select data-admin-field="ratio">
            <option value="9:16"${video.ratio === "9:16" ? " selected" : ""}>9:16</option>
            <option value="16:9"${video.ratio === "16:9" ? " selected" : ""}>16:9</option>
          </select>
        </label>
        <label>
          <span>${escapeHtml(copy.adminFieldTone)}</span>
          <select data-admin-field="tone">
            ${["gold", "cyan", "rose", "silver"].map((tone) => (
              `<option value="${tone}"${video.tone === tone ? " selected" : ""}>${tone}</option>`
            )).join("")}
          </select>
        </label>
        <label class="admin-field-wide">
          <span>${escapeHtml(copy.adminFieldDrive)}</span>
          <input type="url" value="${escapeHtml(video.previewUrl)}" data-admin-field="previewUrl">
          <small>${escapeHtml(copy.adminDriveHint)}</small>
        </label>
        <label class="admin-field-wide">
          <span>${escapeHtml(copy.adminFieldThumb)}</span>
          <input type="text" value="${escapeHtml(video.thumbnailUrl)}" data-admin-field="thumbnailUrl">
        </label>
        <label>
          <span>${escapeHtml(copy.adminFieldTitleEn)}</span>
          <input type="text" value="${escapeHtml(video.title.en)}" data-admin-field="title.en">
        </label>
        <label>
          <span>${escapeHtml(copy.adminFieldTitleEs)}</span>
          <input type="text" value="${escapeHtml(video.title.es)}" data-admin-field="title.es">
        </label>
        <label>
          <span>${escapeHtml(copy.adminFieldDescEn)}</span>
          <textarea rows="3" data-admin-field="description.en">${escapeHtml(video.description.en)}</textarea>
        </label>
        <label>
          <span>${escapeHtml(copy.adminFieldDescEs)}</span>
          <textarea rows="3" data-admin-field="description.es">${escapeHtml(video.description.es)}</textarea>
        </label>
      </div>
    </article>
  `).join("");
}

function updateAdminDraftField(index, field, value) {
  const video = adminVideosDraft[index];
  if (!video) return;

  if (field.includes(".")) {
    const [group, key] = field.split(".");
    video[group] = video[group] || {};
    video[group][key] = value;
  } else {
    video[field] = value;
  }

  adminVideosDraft[index] = normalizeVideoRecord(video, index);
}

async function saveAdminVideos() {
  if (!adminCredential) {
    setAdminStatus("adminLoginDenied", "error");
    return;
  }

  setAdminStatus("adminSaving");
  if (adminSave) adminSave.disabled = true;

  try {
    const response = await fetch(`${adminApiBase}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        action: "save",
        credential: adminCredential,
        videos: adminVideosDraft
      })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || "save-failed");
    }

    portfolioVideos = (payload.videos || adminVideosDraft).map(normalizeVideoRecord);
    adminVideosDraft = cloneVideoList(portfolioVideos);
    renderVideoTiles();
    renderAdminEditor();
    setAdminStatus("adminSaved", "success");
  } catch {
    setAdminStatus("adminSaveError", "error");
  } finally {
    if (adminSave) adminSave.disabled = false;
  }
}

async function fetchConfiguredClientStats() {
  const endpoint = window.TWICE_YOUTUBE_STATS_ENDPOINT;
  if (!endpoint) return null;

  const url = new URL(endpoint, window.location.href);
  url.searchParams.set("handles", clientChannels.map((channel) => channel.handle).join(","));
  return fetchJson(url.toString());
}

async function youtubeApiRequest(path, params, key) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries({ ...params, key }).forEach(([name, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(name, value);
  });

  return fetchJson(url.toString());
}

async function fetchYouTubeClientStats(channel, key) {
  const channelPayload = await youtubeApiRequest("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: `@${channel.handle}`
  }, key);
  const item = channelPayload.items?.[0];
  if (!item) throw new Error(`missing-channel-${channel.handle}`);

  const uploads = item.contentDetails?.relatedPlaylists?.uploads;
  const playlistPayload = uploads
    ? await youtubeApiRequest("playlistItems", {
      part: "contentDetails",
      playlistId: uploads,
      maxResults: "6"
    }, key)
    : { items: [] };
  const ids = (playlistPayload.items || [])
    .map((video) => video.contentDetails?.videoId)
    .filter(Boolean);
  const videoPayload = ids.length
    ? await youtubeApiRequest("videos", {
      part: "snippet,statistics",
      id: ids.join(",")
    }, key)
    : { items: [] };
  const videos = (videoPayload.items || []).map((video) => ({
    id: video.id,
    title: video.snippet?.title || "",
    viewCount: video.statistics?.viewCount || "0",
    likeCount: video.statistics?.likeCount || "0"
  }));

  return normalizeClientPayload({
    handle: channel.handle,
    url: channel.url,
    title: item.snippet?.title,
    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
    statistics: item.statistics,
    videos
  }, channel);
}

async function fetchDirectYouTubeStats() {
  const key = window.TWICE_YOUTUBE_API_KEY;
  if (!key) return null;

  const channels = await Promise.all(clientChannels.map((channel) => fetchYouTubeClientStats(channel, key)));
  return {
    updatedAt: new Date().toISOString(),
    source: "youtube-data-api-v3",
    channels
  };
}

async function loadClientStats(force = false) {
  if (clientStatsRequested && !force) return;
  clientStatsRequested = true;
  setClientStatus("clientLoading", "neutral");

  try {
    const payload = await fetchConfiguredClientStats()
      || await fetchDirectYouTubeStats()
      || await fetchJson(clientStatsDataUrl);
    const synced = mergeClientStats(payload);
    renderClientCards();
    setClientStatus(synced ? "clientLoaded" : "clientFallback", synced ? "success" : "error");
  } catch (error) {
    renderClientCards();
    setClientStatus("clientFallback", "error");
  }
}

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
  renderVideoTiles();
  renderAdminEditor();
  renderClientCards();
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
loadPortfolioVideos();

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

  if (panelName === "clientes") {
    loadClientStats();
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
  gain.gain.exponentialRampToValueAtTime(finePointerQuery.matches ? 0.08 : 0.045, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.14);
};

const playClick = (variant = 0) => {
  const nowMs = window.performance?.now?.() || Date.now();
  const cooldown = finePointerQuery.matches ? 70 : 180;

  if (nowMs - lastClickSoundAt < cooldown) return;
  lastClickSoundAt = nowMs;

  const context = getAudioContext();

  if (context?.state === "suspended") {
    context.resume();
  }

  if (context && clickSoundBuffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = clickSoundBuffer;
    gain.gain.setValueAtTime(finePointerQuery.matches ? 0.42 : 0.24, context.currentTime);
    source.connect(gain);
    gain.connect(context.destination);
    source.start(context.currentTime);
    return;
  }

  prepareClickSound();

  const click = menuClickSounds[clickSoundIndex % menuClickSounds.length];
  clickSoundIndex += 1;

  try {
    if (!finePointerQuery.matches) {
      menuClickSounds.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    click.volume = finePointerQuery.matches ? 0.42 : 0.24;
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
  document.querySelectorAll(".payment-grid article, .contact-button, .control-switch, .client-sync").forEach((element) => {
    element.addEventListener("pointermove", setLocalPointer, { passive: true });
  });
}

document.querySelectorAll(".payment-grid article, .contact-button, .control-switch, .client-sync").forEach((element, index) => {
  playOnPointerDown(element, index % 4);

  element.addEventListener("click", (event) => {
    playOnKeyboardClick(event, index % 4);
    burstAt(event);
  });
});

clientGrid?.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".client-card");
  if (!card || (event.button && event.button !== 0)) return;
  playClick(2);
});

if (canUsePointerEffects) {
  clientGrid?.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".client-card");
    if (!card) return;
    setLocalPointer({ currentTarget: card, clientX: event.clientX, clientY: event.clientY });
  }, { passive: true });
}

clientRefresh?.addEventListener("click", () => {
  loadClientStats(true);
});

videoGrid?.addEventListener("pointerdown", (event) => {
  const button = event.target.closest("[data-open-video]");
  if (!button || (event.button && event.button !== 0)) return;
  playClick(3);
});

videoGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-video]");
  if (!button) return;

  playOnKeyboardClick(event, 3);
  burstAt(event);
  openVideo(
    button.dataset.videoTitle || button.querySelector(".tile-copy strong")?.textContent.trim() || "Video",
    button.dataset.videoPreview || "",
    button.dataset.videoRatio || "16:9"
  );
});

if (canUsePointerEffects) {
  videoGrid?.addEventListener("pointermove", (event) => {
    const tile = event.target.closest(".video-tile");
    if (!tile) return;
    setLocalPointer({ currentTarget: tile, clientX: event.clientX, clientY: event.clientY });
  }, { passive: true });
}

adminOpen?.addEventListener("pointerdown", (event) => {
  if (event.button && event.button !== 0) return;
  playClick(1);
});

adminOpen?.addEventListener("click", (event) => {
  playOnKeyboardClick(event, 1);
  burstAt(event);
  openAdminModal();
});

adminGoogle?.addEventListener("click", () => {
  if (!initializeGoogleLogin()) {
    setAdminStatus(googleClientId ? "adminLoginReady" : "adminConfigMissing", googleClientId ? "neutral" : "error");
    return;
  }

  window.google.accounts.id.prompt();
});

adminCloseButtons.forEach((button) => {
  playOnPointerDown(button, 1);
  button.addEventListener("click", (event) => {
    playOnKeyboardClick(event, 1);
    burstAt(event);
    closeAdminModal();
  });
});

adminAdd?.addEventListener("click", () => {
  adminVideosDraft.push(createBlankVideo());
  renderAdminEditor();
});

adminSave?.addEventListener("click", () => {
  saveAdminVideos();
});

adminLogout?.addEventListener("click", () => {
  sessionStorage.removeItem("twiceAdminCredential");
  adminCredential = "";
  adminProfile = null;
  setAdminMode(false);
  setAdminStatus("adminLoginReady");
});

adminList?.addEventListener("input", (event) => {
  const field = event.target.dataset.adminField;
  const card = event.target.closest("[data-admin-video-index]");
  if (!field || !card) return;

  updateAdminDraftField(Number(card.dataset.adminVideoIndex), field, event.target.value);
});

adminList?.addEventListener("change", (event) => {
  const field = event.target.dataset.adminField;
  const card = event.target.closest("[data-admin-video-index]");
  if (!field || !card) return;

  updateAdminDraftField(Number(card.dataset.adminVideoIndex), field, event.target.value);
  renderAdminEditor();
});

adminList?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-admin-delete]");
  if (!deleteButton) return;

  adminVideosDraft.splice(Number(deleteButton.dataset.adminDelete), 1);
  adminVideosDraft = adminVideosDraft.map(normalizeVideoRecord);
  renderAdminEditor();
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

function withAutoplay(url) {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
}

function getDriveFileId(url) {
  if (!url) return "";
  const pathMatch = url.match(/\/d\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  return queryMatch ? queryMatch[1] : "";
}

function getDriveDownloadUrl(url) {
  const id = getDriveFileId(url);
  return id ? `https://drive.usercontent.google.com/download?id=${id}&export=download` : "";
}

let currentVideoFallback = "";
let shouldRestoreAmbientAfterVideo = false;

const pauseAmbientForVideo = () => {
  shouldRestoreAmbientAfterVideo = ambientEnabled && Boolean(ambientAudio && !ambientAudio.paused);

  if (ambientAudio && !ambientAudio.paused) {
    pauseAmbientAudio();
  }
};

const restoreAmbientAfterVideo = () => {
  if (!shouldRestoreAmbientAfterVideo) return;

  shouldRestoreAmbientAfterVideo = false;

  if (ambientEnabled) {
    ambientRequested = true;
    requestAmbientAudio();
  }
};

const syncEmbedScale = () => {
  if (!modalScreen || !smallScreenQuery.matches || !modalScreen.classList.contains("has-embed")) {
    modalScreen?.style.removeProperty("--embed-scale");
    return;
  }

  const width = modalScreen.getBoundingClientRect().width || modalScreen.clientWidth || window.innerWidth;
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

  pauseAmbientForVideo();

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
  window.requestAnimationFrame(syncEmbedScale);
};

const closeVideo = () => {
  if (!videoModal) return;
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalPanel?.classList.remove("is-portrait", "is-landscape");
  resetVideoSurfaces();
  restoreAmbientAfterVideo();
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
    closeAdminModal();
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
