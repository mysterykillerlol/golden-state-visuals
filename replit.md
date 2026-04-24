# Golden State Visuals (GSV)

ESPN-style Bay Area sports media platform — high school, college, club, events, athlete spotlights.

## Stack
- pnpm monorepo
- Backend: `artifacts/api-server` — Express + Drizzle + Postgres + session auth
- Frontend: `artifacts/gsv` — React + Vite + wouter + shadcn/ui + TanStack Query
- Shared: `lib/api-spec` (openapi.yaml), `lib/api-zod`, `lib/api-client-react` (orval-generated hooks), `lib/db` (Drizzle schema)

## Design rules
- Palette: ONLY Black `#0a0a0a`, White `#ffffff`, Gold `#d4af37`. No blue, no emojis.
- Photo-first when images exist; text-only ESPN tile when no cover image is present (never use placeholder photos or AI-generated images).
- Fully responsive — hamburger Sheet nav on mobile.

## Domain entities
- **Articles** — long-form stories, with `published` flag, `featured` flag, optional `gameId`, optional `coverImage`.
- **Posts** — short updates (no cover image), feed the breaking-news ticker. `published` flag.
- **Galleries** — photo sets with images. `published` flag.
- **Games** — schedule entries linked from articles/galleries.

## Public routes
`/`, `/high-school`, `/college`, `/club`, `/events`, `/spotlights`, `/galleries`, `/galleries/:id`, `/articles/:id`, `/games/:id`, `/posts`, `/login`

## Admin routes (gated by AuthGuard / useGetMe)
`/admin` (dashboard with stats + recent uploads), `/admin/articles`, `/admin/articles/new`, `/admin/articles/:id/edit`, `/admin/posts` (+ new/edit), `/admin/galleries` (+ new/edit), `/admin/games` (+ new/edit), `/admin/settings`. Sidebar order: Dashboard → Manage Articles → Create Article → Posts → Galleries → Games → Settings.

## Auth
- Admin credentials: `tylershawphoto@gmail.com` / `4Lex!gsv` (auto-provisioned on first server boot).
- Staff Login link only appears in the footer.

## Backend endpoints
- Standard CRUD for articles/galleries/games/posts with admin gating on writes.
- Public list/get endpoints filter `published=true` unless an admin session cookie is present.
- `GET /api/admin/stats` — totals + recent uploads (admin-only).
- `POST /api/upload` (single, field `file`) and `/api/upload/multiple` (field `files`) — store under `uploads/` and return URLs.
- `GET /api/home/featured` — hero + game of the week + latest 12 articles + 6 galleries (published only).

## Workflows
- `pnpm --filter @workspace/api-server run dev` — API on $PORT
- `pnpm --filter @workspace/gsv run dev` — Vite frontend
- DB migrations: `pnpm --filter @workspace/db run push-force`
- Codegen after openapi changes: `pnpm --filter @workspace/api-spec run codegen`

## Notable
- DB seeding is intentionally a no-op (`artifacts/api-server/src/lib/seed.ts`) — no AI/sample images are ever created. The site starts empty and is populated entirely through the admin UI.
