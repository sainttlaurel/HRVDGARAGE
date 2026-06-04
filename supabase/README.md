# Supabase setup (production)

## 1. Vercel environment variables

In [Vercel](https://vercel.com) → Project → Settings → Environment Variables:

| Variable | Value |
|----------|--------|
| `VITE_SUPABASE_URL` | Project URL from Supabase → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `anon` public key |

Redeploy after saving.

## 2. Database

1. Open **Supabase Dashboard → SQL Editor**
2. Run `setup.sql` (skip sections for tables you already have; merge policies if policies exist)
3. **Authentication → Users** — create your admin user

## 3. Realtime (required for live website updates)

**Database → Replication** (or Publications) → enable **`vehicles`** and **`parts`**.

## 4. How sync works (no localStorage for listings)

| Action | Flow |
|--------|------|
| Admin saves vehicle/part | → Supabase row updated |
| Public website | Supabase Realtime refetches → UI updates |
| Same browser, back to home | `dataEvents` + fresh fetch on load |

## 5. Seed data

Add vehicles/parts in **Admin → Vehicles / Parts**, or insert rows in Supabase Table Editor.

The public site shows **demo cars/parts only when Supabase returns zero rows** (empty database).
