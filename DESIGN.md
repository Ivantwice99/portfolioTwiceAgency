# TwiceAgency Portfolio

## Scope

Preserve the established cinematic portfolio and compact admin editor. This is
an English/Spanish portfolio, not a redesign or a new marketing landing page.

## Runtime Ownership

- `styles.css` owns the current colors, typography, spacing, themes and breakpoints.
- `script.js` owns localization, rendering, the existing modal, and admin workflow.
- `assets/video-sources.js` owns YouTube URL recognition shared with the admin API.
- `assets/data/videos.json` owns public catalog order, IDs, titles and thumbnails.
- `api/admin/videos.js` owns Google identity verification and authorized writes.
- `cloudflare/worker.mjs` adapts the existing server contracts for Cloudflare.

## Video Interaction

Keep the existing video tile and modal as the canonical public playback flow.
YouTube uses its standard visible player controls in a responsive 16:9 iframe,
without the legacy Drive mobile scaling. Native video playback and the existing
Drive fallback stay available. Closing the modal clears playback surfaces.

Preserve admin IDs and ordering on save. Normalize YouTube links consistently in
the editor and on the server. Preserve explicit thumbnail overrides; otherwise
derive a YouTube thumbnail. Use the local-video frame picker for YouTube sources,
with an English/Spanish status message instead of a failed remote video load.

## Boundaries

No changes to admin authorization, contact delivery, clients, payments or
Vercel's role as a backup. Omitted portfolio entries remain in local backups
and Git history. Never infer that a video is unlisted from a public embed alone.
