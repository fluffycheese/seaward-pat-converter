# Seaward PAT Converter

A small browser-based converter for Seaward Apollo 400+ PAT export files.

## What it does

- Upload a `.txt` export from the tester
- Parse each test record into columns
- Download a CSV that opens in Excel

## Why this shape

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

There is a friendlier, non-technical walkthrough in [`help.html`](./help.html).

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
