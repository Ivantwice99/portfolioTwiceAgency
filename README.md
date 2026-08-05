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

## YouTube Client Stats

The Clients panel reads `assets/data/youtube-clients.json`.

To fill it with real stats, add a GitHub secret named `YOUTUBE_API_KEY` and run the `Update YouTube client stats` workflow, or run locally:

```bash
YOUTUBE_API_KEY="your-key" node scripts/update-youtube-stats.mjs
```
