# Affirmations API

A tiny JSON API that serves random affirmations. Built with Hono, TypeScript, and a Node server. Supports filters, CORS, pretty-printed JSON, and Netlify Functions deployment.

## Endpoints

Base URL (local dev): `http://localhost:8787`

- GET `/` — Health/info
- GET `/v1/affirmation`
  - Returns a single random affirmation object.
  - Query params: `tag`, `lang`
- GET `/v1/affirmations`
  - Returns a random list (default `limit=1`).
  - Query params: `limit` (1–100), `tag`, `lang`
- GET `/v1/affirmations/:id` — Returns an affirmation by id, or 404.
- GET `/v1/openapi.json` — OpenAPI spec (v1)
- GET `/docs` — Interactive Swagger UI

### Affirmation shape

```json
{
  "id": "a_001",
  "text": "You’re allowed to take up space.",
  "author": "optional",
  "tags": ["self-worth"],
  "lang": "en"
}
```

## Run locally

Node 18+ recommended.

```bash
# install deps
yarn install

# dev server (Node)
yarn dev
# -> http://localhost:8787

# type-check & build JS to dist/
yarn build

# run built server
yarn start
```

JSON responses are pretty-printed globally for readability.

## Filtering and sampling

- `/v1/affirmation` returns one random item (optionally filtered by `tag`, `lang`).
- `/v1/affirmations` returns a random sample with default `limit=1`. Increase `limit` for more items (max 100). Sampling is without replacement.
- If filters produce an empty list, the API falls back to sampling from the full dataset.

Examples:

```bash
curl "http://localhost:8787/v1/affirmation?tag=growth"
curl "http://localhost:8787/v1/affirmations?limit=5&lang=en"
```

## Deploy to Netlify (Functions)

This repo includes a Netlify Functions entry that wraps the Hono app using the AWS Lambda adapter.

- Function source: `netlify/functions/api.ts`
- Config: `netlify.toml`
- Deployed paths (no redirect):
  - `/.netlify/functions/api/v1/affirmation`
  - `/.netlify/functions/api/v1/affirmations`

Optional pretty URLs: uncomment the redirect in `netlify.toml` to map `/v1/*` to the function.

### Local dev with Netlify CLI

```bash
# install once
yarn global add netlify-cli  # or: npm i -g netlify-cli

# run Netlify dev (serves the function)
yarn dev:netlify
# -> http://localhost:8888/.netlify/functions/api/v1/affirmation
```

### Deploy

- Push this repo to GitHub.
- In Netlify, “Add new site” → “Import from Git”.
- Build settings (site):
  - Build command: `yarn build` (or leave empty; functions don’t require a site build)
  - Publish directory: leave empty
  - Functions directory: `netlify/functions` (already in `netlify.toml`)
- After deploy, use the function URLs shown above (or pretty URLs if you enabled the redirect).

## Project structure

```
src/
	data.ts        # Affirmations dataset (now ~60 entries)
	index.ts       # Hono app (routes, middleware)
	server.ts      # Node server entry (@hono/node-server)
netlify/
	functions/
		api.ts       # Netlify Function wrapper around the Hono app
netlify.toml      # Netlify config (functions dir + optional redirects)
```

## Scripts

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "dev:netlify": "netlify dev"
}
```

## Notes

- CORS is enabled for all routes.
- Responses use Cache-Control headers: random single is `no-store`; lists are short-lived cache; ID lookup is longer-lived.
- This API is ESM-only and compiles to `dist/` via TypeScript.

## License

MIT (add your actual license if different)
