# Seaward PAT Converter

A small browser-based converter for Seaward Apollo 400+ PAT export files. The latest version is freely avaialable for anyone to use on the Cloudflare hosted, [public version](https://apollo-pat-exporter.fluffycheese.co.uk/)

## What it does

- Upload a `.txt` export from the tester
- Parse each test record into columns
- Download a CSV that opens in Excel

## Why this design

In my job, our onsite electrician requested for us to install the PATguard3 software provided by Seaward. In conducting due diligence, I was not prepared to install this on a corporate PC. From reading Seawards documentation, I was concerned that it was written for Windows 7, referenced MS Office 2007 throughout and most likely is using an MS Access backend for the database. In my experience, companies that have documentation referencing old, unsupported software are normally not very good at keeping their proprietary product and dependencies upto date or closing security vunerabilities.

This version runs entirely in the browser, so the corporate PC does not need PowerShell, Node.js, or any installed app. You just host these static files somewhere and give users a URL.

## Server prerequisites

- Any static file server will work: Nginx, Apache, Caddy, IIS, S3/CloudFront, or a simple internal web host.
- No application runtime is required for the converter itself.
- A modern browser is required on the client side because the upload and download happen in the browser.
- HTTPS is recommended if the app will be accessed over a network.
- If you only want to test it locally, `python3 -m http.server 8085` is enough.

## How users use it

1. Open the web page in a browser.
2. Choose the Seaward export `.txt` file.
3. Download the generated CSV.

## User guide

There is a friendlier, non-technical walkthrough in [`help.html`](https://apollo-pat-exporter.fluffycheese.co.uk/help).

## Development Branches & Workflow

We use a three-stage branching workflow to ensure safe development and production deployments.

| Branch | Purpose | Cloudflare Deployment |
|--------|---------|---------------------|
| `dev` | Local development branch. Work on CSS, scripts, HTML layout. | **No automated build**. Preview locally with `npm run dev` or `npm run preview`. |
| `staging` | Integration branch after `dev` changes are verified locally. | **Automated Cloudflare Pages build** for testing on a live preview URL (`*.pages.dev`). |
| `main` | Production-ready branch. Merges from `staging` after testing. | **Automated Cloudflare Pages build** and deployment to `https://apollo-pat-exporter.fluffycheese.co.uk`. |

**Recommended workflow:**

1. Work on `dev` locally.
2. Test locally using `npm run dev` or `npm run preview`.
3. Merge `dev` → `staging` and push.
4. Cloudflare automatically builds and deploys a preview URL for review/testing.
5. Once approved, merge `staging` → `main` and push.
6. Cloudflare automatically builds and deploys the production site.
> **Note:** All merges should be done via pull requests to maintain a clear history and allow review.

---

## Cloudflare Pages Setup

1. **Create a new Pages project** on Cloudflare and connect the GitHub repository (`https://github.com/fluffycheese/seaward-pat-converter`).
2. **Production branch**: `main`
3. **Preview branch**: `staging` (optional: other branches can also trigger preview builds)
4. **Framework preset**: `None` (or Static HTML)
5. **Build settings**:
   - Build command: `npm run build`
   - Output directory: `.`
6. **Custom domain**: `apollo-pat-exporter.fluffycheese.co.uk` → set via the Cloudflare Pages dashboard for the `main` branch.
7. **Always HTTPS**: Enable for secure connections.

---

## Local preview & Deployment

This project is configured for deployment on **Cloudflare Pages**.

### 1. Using Node.js & Wrangler (Recommended)

Install the dependencies first:
```bash
npm install
```

To preview the site locally using Wrangler:
```bash
npm run dev
```
Then open `http://localhost:8788`.

To deploy directly to Cloudflare Pages:
```bash
npm run deploy
```

### 2. Using Python (Alternative)

If you do not have Node.js installed, any static file server will work for previewing locally:
```bash
python3 -m http.server 8085
```
Then open `http://localhost:8085`.

## Notes

- The CSV includes the parsed fields from the export.
- `TEXT` lines are preserved as `text_1` through `text_4`.
- Unknown labels are kept in `extras_json` so nothing is silently dropped.
