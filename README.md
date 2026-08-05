# TwiceAgency Video Portfolio

Static immersive video portfolio for TwiceAgency.

## Preview

Open `index.html` directly or serve the folder locally:

```bash
python -m http.server 4173
```

Then visit:

```text
http://localhost:4173
```

## Files

- `index.html`: page structure
- `styles.css`: visual system, layout, responsive styles
- `script.js`: menu interactions, video modal, contact form, theme/language/audio controls
- `assets/`: images, thumbnails, and audio files

## Client Stats

The Clients panel reads `assets/data/youtube-clients.json`.

The update script tries providers in this order:

1. SocialBlade Business API with `SOCIALBLADE_CLIENT_ID` and `SOCIALBLADE_TOKEN`.
2. YouTube Data API with `YOUTUBE_API_KEY`.
3. Public YouTube snapshot fallback, so the portfolio still shows visible stats without client-side keys.

Run locally:

```bash
node scripts/update-youtube-stats.mjs
```

For automated premium stats, add the SocialBlade or YouTube keys as GitHub repository secrets and run the `Update YouTube client stats` workflow.
