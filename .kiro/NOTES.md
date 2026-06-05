# HRVD Car Trading — Project Notes

**Repo:** [sainttlaurel/HRVDGARAGE](https://github.com/sainttlaurel/HRVDGARAGE)
**Live:** [sacredgarage-sainttlaurels-projects.vercel.app](https://sacredgarage-sainttlaurels-projects.vercel.app)
**Stack:** React + TypeScript + Vite + Tailwind + Supabase + Vercel

---

## Supabase

**Project URL:** `https://opfhikdkqfveoweqxqia.supabase.co`
**Key:** `VITE_SUPABASE_PUBLISHABLE_KEY` (set in Vercel env vars)

### Tables & column naming
All columns are **fully lowercase** (no camelCase). Key columns: `createdat`, `updatedat`, `firstname`, `lastname`, `customername`, etc.

| Table | Public access | Admin access |
|-------|--------------|--------------|
| `vehicles` | Read | Full CRUD |
| `parts` | Read | Full CRUD |
| `inquiries` | Insert | Full CRUD |
| `part_orders` | Insert | Full CRUD |
| `vehicle_inquiries` | Insert | Full CRUD |
| `business_settings` | — | Full CRUD |

### RLS policies
- Public read on `vehicles` and `parts`
- Public insert on `inquiries`, `part_orders`, `vehicle_inquiries`
- Authenticated full access on all tables
- **Realtime broadcast triggers removed** — were causing insert failures (`realtime.send` error)

---

## Architecture

```
Admin adds vehicle/part → Supabase DB → public site reads on load
```

- **No localStorage** for listings — Supabase is the single source of truth
- **localStorage** still used for: theme preference, analytics consent
- **dataEvents.ts** — event bus for same-session admin → public refresh
- **Realtime disabled** — not needed, simple refresh on load is enough

---

## Environment variables

| Variable | Where |
|----------|-------|
| `VITE_SUPABASE_URL` | Vercel + `.env.local` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel + `.env.local` |
| `VITE_RESEND_API_KEY` | `.env.local` only |
| `VITE_ADMIN_EMAIL` | `.env.local` only |
| `VITE_FROM_EMAIL` | `.env.local` only |
| `VITE_GA_TRACKING_ID` | Optional — set real GA4 ID or leave blank |

---

## Key files

| File | Role |
|------|------|
| `src/lib/supabase.ts` | Supabase client + all service functions |
| `src/lib/dataEvents.ts` | Admin → public refresh event bus |
| `src/lib/realtimeSubscriptions.ts` | Disabled (noop stubs) |
| `src/lib/validation.ts` | Form validation |
| `src/lib/emailService.ts` | Resend email notifications |
| `src/pages/AdminPortal.tsx` | Admin shell + Supabase auth |
| `supabase/setup.sql` | DB schema + RLS setup script |

---

## To do

- [ ] Upload real car/part photos to Supabase Storage and use those URLs in admin
- [ ] Load contact info (phone, email, location) from `business_settings` on public site
- [ ] Wire up vehicle inquiry form in `VehicleModal`
- [x] Paywall: enabled, shows after 20 seconds of browsing
- [ ] Add real `VITE_GA_TRACKING_ID` in Vercel
