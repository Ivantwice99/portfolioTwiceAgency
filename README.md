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

## Contact Form

The contact panel submits through FormSubmit to:

```text
vaguacateman@gmail.com
```

On the first real submission, FormSubmit sends an activation email to that inbox. Confirm it once. When the automatic send fails, the site opens the visitor's email app with the message already prepared.

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

## Admin Video Editor

The Videos panel reads `assets/data/videos.json`.

The admin editor is protected by Google Sign-In and only allows:

```text
vaguacateman@gmail.com
```

Set these Vercel environment variables:

```text
GOOGLE_CLIENT_ID=your-google-oauth-web-client-id
GITHUB_CONTENTS_TOKEN=your-fine-grained-github-token-with-contents-read-write
GITHUB_REPO=Ivantwice99/portfolioTwiceAgency
GITHUB_BRANCH=main
```

In Google Cloud, create an OAuth Web client and add your Vercel URL as an authorized JavaScript origin. The editor saves changes by committing `assets/data/videos.json` through the GitHub Contents API, then Vercel redeploys from the new commit.
