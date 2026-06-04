# Project Status — HRVD Car Trading (Sacred Garage)

**Repo:** [sainttlaurel/HRVDGARAGE](https://github.com/sainttlaurel/HRVDGARAGE/tree/main)  
**Live:** [sacredgarage.vercel.app](https://sacredgarage.vercel.app)  
**Last Updated:** June 5, 2026  
**Overall Status:** ✅ Production-ready UI | 🔄 Supabase integration in progress (reads on cloud; writes still hybrid)

---

## 🔍 Code Quality (Current)

| Check | Status |
|-------|--------|
| TypeScript (`tsc`) | ✅ 0 errors |
| ESLint | ✅ 0 errors (Phase 1 cleanup) |
| Vite production build | ✅ Passes |
| Latest commit (Supabase SSOT) | `5237c81` — pushed to `main` |

---

## ✅ Completed — Public Website (Main)

### Core experience
- [x] Cinematic loading screen, hero, features, CTA, contact, footer
- [x] Luxury monochrome / motorsport theme (Tailwind + Framer Motion)
- [x] Lazy-loaded gallery wall & showreel sections
- [x] Theme toggle (dark/light) — `localStorage` only (UI preference, not business data)
- [x] Paywall disabled (`PAYWALL_ACTIVE = false` in `App.tsx`)
- [x] Error boundary, toast notifications, offline indicator (browser online/offline)
- [x] Analytics consent banner + optional GA4 (`VITE_GA_TRACKING_ID`)

### Inventory & parts (public)
- [x] Vehicle inventory grid + detail modal (`Inventory.tsx`, `VehicleCard`, `VehicleModal`)
- [x] Parts marketplace + purchase modal (`Parts.tsx`, `PartCard`, `PartModal`, `PartsPurchaseModal`)
- [x] Default showcase data when Supabase returns **empty** (hardcoded fallbacks in components — see TODO)
- [x] Supabase real-time subscription on `vehicles` / `parts` (when configured)
- [x] Same-tab admin sync via custom event bus (`dataEvents.ts` → `onDataChange`)
- [x] Cross-tab reload hook via `StorageEvent` (legacy; less useful now that reads skip `localStorage`)

### SEO & performance
- [x] Dynamic meta tags, canonical URLs, JSON-LD (organization, local business, product, breadcrumb, FAQ) in `seo.ts`
- [x] Performance monitoring hooks
- [x] WebP / lazy image utilities

### Forms & inquiries (public → database)
- [x] Contact form → `inquiryService` (Supabase `inquiries` table, write fallback to `localStorage` if cloud fails)
- [x] Vehicle inquiry modal → `vehicleInquiryService`
- [x] Part orders → `partOrdersService`

### Reviews (built, optional)
- [x] `ReviewForm`, `ReviewList`, `ReviewStats` + `reviewService.ts` (expects Supabase `reviews` table)
- [ ] **Not wired into main `App.tsx` layout** — components exist but are not on the live homepage flow

---

## ✅ Completed — Admin Portal (`/admin`)

### Auth & shell
- [x] Supabase Auth login (email/password) — no hardcoded admin password in Settings anymore
- [x] Session persistence + logout
- [x] Tabs: Inquiries, Vehicles, Parts, Orders, Settings, Performance
- [x] **Supabase connection indicator** (`SupabaseConnectionIndicator.tsx`) — login + header + mobile menu
- [x] Manual **Sync** button (`loadFromSupabaseToLocalStorage` + `syncLocalStorageToSupabase`)

### CRUD
- [x] **AdminInventory** — list, add, edit, delete, availability toggle, photo manager, search/filter/export
- [x] **AdminParts** — same pattern for parts
- [x] **AdminInquiries** — inquiry management
- [x] **AdminPartOrders** — order management
- [x] **AdminSettings** — loads/saves `business_settings` via `settingsService`; live stats from Supabase
- [x] **PerformanceMonitor** tab
- [x] All inventory/parts mutations dispatch `dispatchDataChange()` for instant public-site refresh

### Real-time sync (June 4–5, 2026)
- [x] `dataEvents.ts` — event bus (`vehicles`, `parts`, `inquiries`, `part_orders`, `business_settings`)
- [x] `supabaseConnection.ts` — health ping on `business_settings`
- [x] **Supabase-only reads** in `supabase.ts` (`fetchAllRows`, `fetchRowById`, `fetchSingleRow`)
- [x] `loadInitialData()` — no `localStorage` read fallback; returns `[]` on failure + background retry

### Built but not in admin nav
- [x] `AdminBackup.tsx` — CSV export/import, full backup (exists, **not linked** in `AdminPortal.tsx`)

---

## ✅ Completed — Earlier Phases (Summary)

### Phase 1 — Code quality
- [x] 71/71 lint issues fixed (hooks, `any` types, regex, memory leaks, etc.)

### Phase 2 — Functional testing
- [x] Image paths under `public/cars`, `public/image`
- [x] Mobile breakpoints (375 / 360 / 768px), 44px touch targets
- [x] Lighthouse-oriented SEO setup

### Phase 2.5 — Admin → website sync
- [x] Custom events + Supabase realtime + (legacy) storage listeners on Inventory/Parts

---

## 🗄️ Supabase / Database

### Required tables (app expects these in `public` schema)

| Table | Used by | Notes |
|-------|---------|--------|
| `vehicles` | Public inventory, admin | Needs `available`, `specs` (JSON), `images` (array) |
| `parts` | Public parts, admin | Needs `available`, `condition`, etc. |
| `inquiries` | Contact form, admin | Status: `new` \| `read` \| `responded` |
| `part_orders` | Parts checkout, admin | |
| `vehicle_inquiries` | Vehicle modal inquiries | |
| `business_settings` | Admin settings, connection ping | Single-row or `.single()` query |
| `reviews` | Review components (optional) | Moderation statuses; **no admin UI yet** |

### Environment variables (Vercel + local `.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_GA_TRACKING_ID=G-XXXXXXXXXX   # optional
```

See `.env.example`.

### Supabase dashboard checklist

- [ ] Project URL + anon key set on **Vercel** (Production + Preview)
- [ ] **Row Level Security (RLS)** — policies for:
  - Public **SELECT** on `vehicles`, `parts` (available rows only if desired)
  - Public **INSERT** on `inquiries`, `part_orders`, `vehicle_inquiries`
  - Authenticated admin **ALL** on management tables
- [ ] **Realtime** enabled for `vehicles`, `parts` (Database → Replication)
- [ ] **Auth** — admin user(s) created in Authentication
- [ ] Confirm column naming: app queries use `order('created_at')` but TypeScript models use `createdAt` / `updatedAt` — **align DB columns or add a DB view / client mapper** (common breakage source)

### Current data architecture (important)

| Layer | Role today |
|-------|------------|
| **Supabase** | ✅ Single source of truth for **reads** (after June 5 change) |
| **localStorage** | ⚠️ Still used for: write fallbacks, `App.tsx` boot sync, `initializeDefaultData()`, manual admin Sync, theme, analytics consent |
| **Hardcoded defaults** | Public Inventory/Parts show embedded demo vehicles/parts if DB is empty |

---

## 🔧 Database & Alternatives — Issues to Fix

### High priority
1. **Column name mismatch** — Queries use `created_at`; inserts use `createdAt`. Verify Supabase columns match or add snake_case columns + migration.
2. **Remove or slim boot-time dual sync** — `App.tsx` still runs `loadFromSupabaseToLocalStorage()` + `syncLocalStorageToSupabase()` on every visit; can reintroduce stale data vs Supabase-only reads.
3. **`initializeDefaultData()`** — Seeds `localStorage` on first visit; conflicts with “Supabase only” story. Prefer seeding Supabase once or removing when cloud is configured.
4. **Write path still falls back to `localStorage`** — All `*Service.create/update/delete` in `supabase.ts`. Admin may think data is saved to cloud when it is only local.
5. **RLS / permissions** — If indicator shows “unreachable”, check policies and anon key before debugging the app.

### Medium priority
6. **Empty DB UX** — Public site shows hardcoded defaults when Supabase returns `[]`; document or change to “no listings” empty state in production.
7. **Admin manual Sync** — Still mirrors to `localStorage`; consider “Refresh from Supabase” only.
8. **`onStorageChange` listeners** — Low value without localStorage mirrors on read; can remove after sync refactor.
9. **`business_settings` key** — Sync uses `business_settings`; old Settings used `businessSettings` — migrate any legacy browser data if needed.
10. **`reviews` table** — Create in Supabase + wire `ReviewForm`/`ReviewList` + admin moderation tab, or remove dead code.

### Lower priority / optional
11. **AdminBackup** — Add tab in `AdminPortal` or delete unused component.
12. **`vehicle_inquiries`** — Add to `dataEvents` if public pages should hot-reload (currently not dispatched).
13. **Type duplication** — `src/types/index.ts` vs `src/lib/supabase.ts` interfaces differ slightly (status enums, `price` types).

### Alternative if Supabase is not viable
- **Short term:** Keep write fallbacks but show clear admin warning when not connected (indicator already helps).
- **Not recommended:** Full offline-first `localStorage` app — reverts June 5 read changes.
- **Better alternative:** Supabase Edge Functions for validated writes + stricter RLS; drop client write fallbacks entirely.

---

## 📋 TODO — Public Website (Main)

- [ ] Set production env vars on Vercel (`VITE_SUPABASE_*`)
- [ ] Decide production behavior when DB is empty (empty state vs demo defaults)
- [ ] Remove reliance on `localStorage` boot sync in `App.tsx` once Supabase is stable
- [ ] Wire **reviews** into vehicle/part modals OR remove unused review components
- [ ] Load **business settings** on public site (footer/contact hours) from `settingsService` instead of static copy
- [ ] Form **sanitization** + rate limiting (contact, orders, inquiries)
- [ ] Phase 3 optional: advanced filters (price/year/brand), wishlist/favorites

---

## 📋 TODO — Admin Portal

- [ ] Verify connection indicator = **connected** in production after deploy
- [ ] Test full CRUD on each tab against live Supabase (not local fallback)
- [ ] Add **AdminBackup** tab or remove component
- [ ] **Reviews moderation** UI (approve/reject) if `reviews` table is used
- [ ] Dispatch `dataEvents` for inquiries/orders/settings where public pages need instant updates
- [ ] Replace “Sync” with clearer actions: “Pull from Supabase” / “Push pending local changes” (after write-fallback refactor)
- [ ] Phase 3 optional: analytics dashboard (charts, popular items)
- [ ] Align git `origin` remote to `HRVDGARAGE` repo URL for future pushes

---

## 📋 TODO — Supabase / DevOps

- [ ] Create/verify all tables + indexes + RLS policies (see table list above)
- [ ] Enable Realtime on `vehicles`, `parts`
- [ ] Create admin Auth user(s); rotate keys if ever exposed
- [ ] Run one-time migration: local/demo data → Supabase (use admin Sync or SQL seed)
- [ ] Confirm `created_at` / `updated_at` columns exist on all tables
- [ ] Monitor Vercel deploy logs after `main` push
- [ ] Document Supabase project ID in team notes (not in git)

---

## 📁 Key Files (Recent)

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Client, services, Supabase-only read helpers |
| `src/lib/supabaseConnection.ts` | Connection health check + hook |
| `src/lib/dataEvents.ts` | Admin → public event bus |
| `src/lib/realtimeSubscriptions.ts` | Realtime + `loadInitialData` |
| `src/lib/syncToSupabase.ts` | Bidirectional localStorage ↔ Supabase (legacy hybrid) |
| `src/lib/initializeData.ts` | Seeds localStorage defaults on first visit |
| `src/components/admin/SupabaseConnectionIndicator.tsx` | Admin status UI |
| `src/components/admin/AdminSettings.tsx` | Settings + stats from Supabase |
| `src/pages/AdminPortal.tsx` | Admin shell, auth, sync, indicator |

---

## 🔒 Security Notes

- [x] Hardcoded admin password removed from Settings UI
- [ ] RLS must enforce who can read/write each table (do not rely on obscurity)
- [ ] Never commit `.env` with real keys
- [ ] Consider Edge Functions for sensitive writes and spam protection

---

## Pre-Deployment Checklist

- [x] Phase 1: Lint / TypeScript clean
- [x] Phase 2: Functional testing (images, mobile, SEO)
- [x] Phase 2.5: Real-time admin → website sync
- [x] Phase 3 (partial): Supabase read SSOT + admin connection indicator + Settings on cloud
- [ ] Vercel env vars for Supabase
- [ ] Supabase RLS + Realtime configured
- [ ] Production smoke test: public inventory/parts + admin CRUD + connection indicator green
- [x] Paywall off

---

*Built with precision. Designed for performance.*
