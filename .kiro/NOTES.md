# Project Status — HRVD Car Trading (Sacred Garage)

**Repo:** [sainttlaurel/HRVDGARAGE](https://github.com/sainttlaurel/HRVDGARAGE/tree/main)  
**Live:** [sacredgarage.vercel.app](https://sacredgarage.vercel.app)  
**Last Updated:** June 5, 2026  
**Latest on `main`:** `3d20a0a` (pushed to GitHub)

---

## What we changed (June 5, 2026)

### Supabase as source of truth (listings)
- **Reads** for vehicles, parts, inquiries, orders, settings come from Supabase only — no `localStorage` read fallback.
- Shared helpers in `supabase.ts`: `fetchAllRows`, `fetchRowById`, `fetchSingleRow`.
- `loadInitialData()` fetches from Supabase only; returns `[]` on failure (background retry via `dataEvents`).
- List queries order by **`createdAt`** (matches insert fields).

### Admin → main website sync (no localStorage for listings)
- Admin CRUD dispatches **`dispatchDataChange()`** (`dataEvents.ts`).
- Public **Inventory** / **Parts** listen to:
  1. **Supabase Realtime** (cross-tab, all visitors)
  2. **`onDataChange`** (same browser after admin edit → navigate home)
- Removed **`onStorageChange`** / cross-tab `localStorage` listeners.

### Admin portal simplified
- **Removed:** “Supabase connected” indicator, **Sync** button, **Performance** tab.
- **Removed files:** `SupabaseConnectionIndicator.tsx`, `supabaseConnection.ts`, `initializeData.ts`.
- **Nav:** Vehicles → Parts → Inquiries → Orders → Settings → Logout.
- **Default tab:** Vehicles.
- **Settings:** loads/saves `business_settings` in Supabase; stats from live queries.

### App startup cleaned up
- **Removed** from `App.tsx`: `initializeDefaultData()`, `loadFromSupabaseToLocalStorage()`, `syncLocalStorageToSupabase()` on every page load.

### Git
- `5237c81` — Supabase read SSOT + `dataEvents` + admin Settings on cloud.
- `3d20a0a` — Admin simplification + drop listing `localStorage` sync + `supabase/setup.sql`.
- Pushed to [HRVDGARAGE `main`](https://github.com/sainttlaurel/HRVDGARAGE/tree/main).
- Local `origin` may still point at `sacredgarage` — use `git push https://github.com/sainttlaurel/HRVDGARAGE.git main` or update remote URL.

---

## What we added

| Item | Purpose |
|------|---------|
| `src/lib/dataEvents.ts` | Custom event bus for admin → public refresh |
| `supabase/setup.sql` | Table definitions + RLS policies (run in Supabase SQL Editor; use **Run and enable RLS**) |
| `.kiro/NOTES.md` | This file (project status) |

---

## How data flows now

```
Admin saves vehicle/part → Supabase DB
                              ↓
         Realtime subscription → public Inventory / Parts update
         (or reload on navigate home via dataEvents)
```

**Still uses `localStorage` (OK):** theme, analytics consent.  
**Still uses `localStorage` on write failure:** `supabase.ts` create/update/delete fallbacks if Supabase errors.  
**Empty database:** Public Inventory/Parts show the “no listings” empty state until you add rows in admin or Supabase.

---

## ✅ Already done (summary)

- Public site: hero, inventory, parts, contact, SEO, admin auth, mobile layout.
- Admin: full CRUD for vehicles, parts, inquiries, orders, settings.
- Code quality: TypeScript + ESLint clean; Vite build passes.
- Real-time sync path: Realtime + `dataEvents` (no listing sync via `localStorage`).

---

## 📋 Still need to do

### Supabase (dashboard — one-time)

- [ ] Run `supabase/setup.sql` in **SQL Editor** (choose **Run and enable RLS** when prompted).
- [ ] **Database → Replication** — enable Realtime for **`vehicles`** and **`parts`**.
- [ ] **Authentication** — create admin user(s).
- [ ] Confirm tables have **`createdAt`** / **`updatedAt`** columns (camelCase) or adjust `setup.sql` / app to match your existing schema.
- [ ] Seed data: Admin → **Vehicles** / **Parts**, or Supabase Table Editor.

### Vercel

- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (Production + Preview).
- [ ] Redeploy after env vars.
- [ ] Smoke test: public listings + admin login + add/edit vehicle.

### Main website (optional improvements)

- [x] Empty DB: show “no listings” instead of demo cars/parts (Supabase-only, no hardcoded fallback).
- [ ] Load footer/contact copy from `business_settings` on public site.
- [ ] Wire or remove unused **reviews** components.
- [ ] Form sanitization + rate limiting on contact/orders.

### Admin (optional improvements)

- [ ] Test all CRUD against **live** Supabase (not write fallbacks).
- [ ] Remove write `localStorage` fallbacks in `supabase.ts` once RLS + auth are stable.
- [ ] Add or delete unused `AdminBackup.tsx`.
- [ ] Optional: analytics dashboard, advanced filters.

### DevOps

- [ ] Point `git remote` at HRVDGARAGE for everyday `git push` (optional).

---

## Supabase tables the app expects

| Table | Public | Admin |
|-------|--------|-------|
| `vehicles` | Read | CRUD |
| `parts` | Read | CRUD |
| `inquiries` | Insert (contact) | Manage |
| `part_orders` | Insert | Manage |
| `vehicle_inquiries` | Insert | Manage |
| `business_settings` | Read (future) | CRUD |
| `reviews` | Optional (not in App) | No UI yet |

**Env vars:** see `.env.example`.

---

## Key files

| File | Role |
|------|------|
| `src/lib/supabase.ts` | Client + services + Supabase-only reads |
| `src/lib/dataEvents.ts` | Admin → public event bus |
| `src/lib/realtimeSubscriptions.ts` | Realtime + initial load |
| `src/lib/syncToSupabase.ts` | Legacy bidirectional sync (no longer called on app boot) |
| `src/pages/AdminPortal.tsx` | Simplified admin shell |
| `src/components/admin/AdminInventory.tsx` | Vehicles CRUD + `dispatchDataChange` |
| `src/components/admin/AdminParts.tsx` | Parts CRUD + `dispatchDataChange` |
| `src/components/admin/AdminSettings.tsx` | Business settings + stats |
| `supabase/setup.sql` | DB + RLS setup script |

---

## Pre-deploy checklist

- [x] Code on GitHub `main` (`3d20a0a`)
- [x] Admin simplified; listing sync via Supabase + events
- [ ] Vercel Supabase env vars
- [ ] `setup.sql` + RLS + Realtime in Supabase
- [ ] Production smoke test (admin + public inventory)
- [x] Paywall off

---

*Built with precision. Designed for performance.*
