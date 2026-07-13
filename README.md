# Seaward PAT Converter

A small browser-based converter for Seaward Apollo 400+ PAT export files.

## What it does

- Upload a `.txt` export from the tester
- Parse each test record into columns
- Download a CSV that opens in Excel

## Why this shape

This version runs entirely in the browser, so the corporate PC does not need PowerShell, Node.js, or any installed app. You just host these static files somewhere and give users a URL.

## How users use it

1. Open the web page in a browser.
2. Choose the Seaward export `.txt` file.
3. Download the generated CSV.

## Local preview

Because this is a static app, any simple web server will work for previewing it locally.

```bash
python3 -m http.server 8085
```

Then open `http://localhost:8085`.

## Notes

- The CSV includes the parsed fields from the export.
- `TEXT` lines are preserved as `text_1` through `text_4`.
- Unknown labels are kept in `extras_json` so nothing is silently dropped.
