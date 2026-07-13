# AGENTS.md

## Purpose

This repository contains the Seaward PAT converter project. The current scope is a browser-first static app that converts Apollo 400+ `.txt` exports into CSV.

## Working assumptions

- Prefer the simplest static deployment that avoids installing software on locked-down corporate devices.
- Keep parsing in the browser unless there is a clear reason to move it server-side.
- Preserve all meaningful fields from the export.
- Keep unknown or unexpected labels from being silently discarded.

## Design guidance

- Use the existing glossary in `CONTEXT.md` when naming concepts.
- Record significant architecture decisions in `docs/adr/`.
- Prefer CSV as the baseline output format; add `.xlsx` only if there is a real user need.
- Avoid introducing a database unless the project explicitly grows into a record-management system.

## Implementation guidance

- Follow the current plain HTML/CSS/JS structure unless a build step becomes necessary.
- Keep changes small and easy to reason about.
- Validate parser changes against representative PAT export samples.
- Keep the browser-only deployment story intact unless the user asks for a different architecture.

## References

- `README.md` for the user-facing workflow
- `CONTEXT.md` for the project vocabulary
- `docs/adr/0001-browser-first-static-converter.md` for the deployment decision
