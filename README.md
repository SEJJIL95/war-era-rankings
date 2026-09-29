# Service discontinued

The War Era rankings service is discontinued. This repository now builds a static statement page. The prior application remains available in Git history.

## Local preview

Run `npm run build` and then `npm start`. The page is served at `http://localhost:3000`.

## Deployment

Vercel builds with `npm run build` and serves the `build` directory. The published output contains only `index.html`; no client JavaScript, search, rankings, game API requests, or functional endpoints are included.
