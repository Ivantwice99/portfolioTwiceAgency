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

The published catalog uses ten YouTube videos from @Miotismon. Crypto & Tech Reel and Anime & Gaming are intentionally omitted until uploaded. YouTube short, watch, shorts, live and embed links are normalized by `assets/video-sources.js`, shared by the browser and admin API. The public player uses YouTube's privacy-enhanced embed, with responsive 16:9 sizing and YouTube thumbnails. Drive and direct-file playback remain supported for future admin entries.

YouTube videos must be viewable by visitors and allow embedding. Unlisted videos work; private videos do not. Changing a YouTube video's visibility or embedding settings is managed in YouTube, not by this website.

Run the video integration checks with `node --test scripts/test-video-sources.cjs scripts/test-youtube-player.cjs`. Each modal opening uses a fresh eager iframe; the official IFrame API must report readiness before it becomes visible. The thumbnail and loading status remain visible in the meantime. Errors or a 20-second timeout expose Retry and Open on YouTube; blocked API downloads time out after 15 seconds. Closed players ignore late callbacks.

The original Drive catalog is preserved in Git history and in the local `portfolio-videos/videos-drive-backup-before-youtube.json` backup. Selecting an arbitrary thumbnail frame for a YouTube video requires its local MP4 copy; the editor does not attempt to read pixels from a cross-origin YouTube player.

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

In Google Cloud, create an OAuth Web client and add the portfolio's URL as an authorized JavaScript origin. The editor saves changes by committing `assets/data/videos.json` through the GitHub Contents API. Each connected hosting provider must redeploy from the new commit.

## Cloudflare Hosting

Primary deployment:

```text
https://twiceagency.pages.dev
```

Keep the existing Vercel deployment active as a backup:

```text
https://portfolio-twice-agency.vercel.app
```

Cloudflare-specific files live in `cloudflare/`; the existing Vercel API handlers remain unchanged. Pages serves the same portfolio without changing its design. A private `PORTFOLIO_API` service binding forwards `/api/*` to the existing `twiceagency-portfolio` Worker, retaining server-side Google verification, GitHub secrets and Drive byte ranges. The old `https://twiceagency-portfolio.vaguacateman.workers.dev` address remains active. Social preview URLs are rewritten to the requested origin without changing the Vercel copy.

Use Node.js 22 or newer:

```bash
cd cloudflare
npm ci
npm run build
npm test
npm run dev
# After authorizing the Cloudflare account:
npm run deploy:pages

# Only when backend API code or Worker configuration changes:
npm run deploy
```

### Finish Admin Setup

The public Google client ID, repository and branch are in `cloudflare/wrangler.jsonc`. They are not secrets.

1. In Cloudflare, open **Workers & Pages > twiceagency-portfolio > Settings > Variables and Secrets**. Add `GITHUB_CONTENTS_TOKEN` as a **Secret**, restricted to this GitHub repository with Contents read/write permission. Do not put the token in source code or the chat. The admin can authenticate without this token but cannot save changes until it is configured.
2. In the existing Google OAuth Web client, add `https://twiceagency.pages.dev` to **Authorized JavaScript origins**. Retain every existing Worker and Vercel origin so the backups still work. No new Google permissions or redirect callback are required for the current Google Identity Services popup flow. Until the new origin is authorized, use the old address for Google admin sign-in.
3. To publish changes automatically, connect `Ivantwice99/portfolioTwiceAgency` to this Worker under **Settings > Builds**. Use branch `main`, root directory `cloudflare`, build command `npm run build`, and deploy command `npx wrangler deploy`. Use Node.js 22+ and watch the whole repository, including `assets/data/` and `assets/thumbs/`, not only `cloudflare/`.

Pages is a Direct Upload project. Until a Pages deployment workflow is configured, run `npm run deploy:pages` from `cloudflare/` after repository updates. Connecting only the old Worker's Git build does not update the Pages catalog. The GitHub YouTube statistics workflow is unchanged; its new snapshots reach Pages on the next Pages deployment. Leave the Vercel Git integration enabled.

The Pages project is configured in `cloudflare/pages/wrangler.jsonc`; its public build is `cloudflare/pages-dist/`. Do not publish the repository root. Run `npm run build`, `npm run build:pages`, then `npm test` for both hosting adapters' tests.

### Local Video Backup and YouTube Handoff

Download the current Drive originals without modifying the published video list:

```bash
node scripts/backup-portfolio-videos.mjs ../portfolio-videos
```

The folder contains numbered MP4 files and `manifest.json`, with source URLs, titles, descriptions, exact byte sizes, SHA-256 checksums and explicit YouTube upload status. Interrupted downloads resume from `.part` files. Existing completed files are checked before reuse. Originals are outside the Git repository and never uploaded with website assets.

Upload to the user-selected channel **@Miotismon** with visibility **Unlisted**, not Public. Keep every `youtube.status` as `not-uploaded` until an actual upload and its visibility are verified in YouTube. Replace portfolio playback links only after the corresponding YouTube embed works; retain the Drive URL in the backup manifest.
