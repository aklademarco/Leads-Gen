# Leads-Gen

pnpm monorepo for finding businesses without a website (Google Places API) and tracking them as leads.

```
apps/
├── web/      @leads-gen/web     React 19 + Vite + Tailwind dashboard
└── server/   @leads-gen/server  Express 5 API + PostgreSQL (Neon)
packages/     (reserved for shared code)
```

## Setup

Requires Node 24+ and pnpm 11.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env   # then fill in GOOGLE_PLACES_API and DB_URI
```

## Scripts (run from the repo root)

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `pnpm dev`        | Runs web (Vite) and server (nodemon) together |
| `pnpm dev:web`    | Frontend only                             |
| `pnpm dev:server` | API only                                  |
| `pnpm build`      | Builds every package (`apps/web/dist`)    |
| `pnpm lint`       | Lints every package                       |
| `pnpm start`      | Starts the API in production mode         |

Add a dependency to one app: `pnpm --filter @leads-gen/web add <pkg>`.
