# HRVD Car Trading

A full-stack car trading and parts listing website for HRVD Car Trading, based in Quezon City, Metro Manila. Built with React, TypeScript, Vite, Tailwind CSS, Supabase, and deployed on Vercel.

**Live:** https://sacredgarage-sainttlaurels-projects.vercel.app  
**Repository:** https://github.com/sainttlaurel/HRVDGARAGE

---

## Features

### Public Website
- Video loading screen on first visit
- Hero section with brand identity
- Vehicle inventory listing — reads live from Supabase
- Performance parts listing — reads live from Supabase
- Photo gallery wall
- Showreel section
- Contact form — saves inquiries directly to Supabase
- Dark/light theme toggle
- PWA support with service worker and offline indicator
- SEO meta tags, Open Graph, JSON-LD structured data, sitemap, robots.txt
- Google Analytics 4 with consent banner
- Hard gate paywall — activates 30 seconds after page load, cycles through 500 / 429 / 403 / 401 error codes, requires Discord contact to resolve

### Admin Portal (`/admin`)
- Supabase Auth login — email and password
- Vehicles CRUD — add, edit, mark sold, delete, export CSV
- Parts CRUD — add, edit, mark sold, delete, export CSV
- Inquiries — view, update status (new / read / responded), delete, export CSV
- Part orders — view full order details, update status, delete, export CSV
- Business settings — edit name, email, phone, location, hours; live stats

### Architecture
- Supabase is the single source of truth for all listings and submissions
- No localStorage fallback for reads — public site always fetches from Supabase
- Admin CRUD dispatches a custom event bus (`dataEvents.ts`) for same-session refresh
- Realtime subscriptions disabled — not needed, direct fetch on load is sufficient
- All Supabase table columns are fully lowercase (`createdat`, `updatedat`, `firstname`, etc.)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Email | Resend |
| Analytics | Google Analytics 4 |
| Hosting | Vercel |

---

## Project Structure

```
src/
  components/
    admin/
      AdminInventory.tsx     -- Vehicles CRUD
      AdminParts.tsx         -- Parts CRUD
      AdminInquiries.tsx     -- Inquiries management
      AdminPartOrders.tsx    -- Part orders management
      AdminSettings.tsx      -- Business settings + stats
    AnalyticsConsent.tsx
    Contact.tsx
    CTA.tsx
    ErrorBoundary.tsx
    Features.tsx
    Footer.tsx
    GalleryWall.tsx
    Hero.tsx
    Inventory.tsx
    LoadingScreen.tsx
    Navbar.tsx
    OfflineIndicator.tsx
    PartCard.tsx
    PartModal.tsx
    Parts.tsx
    PartsPurchaseModal.tsx
    Paywall.tsx
    Showreel.tsx
    SocialShareButton.tsx
    ThemeToggle.tsx
    Toast.tsx
    ToastContainer.tsx
    VehicleCard.tsx
    VehicleModal.tsx
  lib/
    adminUtils.ts            -- Search, filter, sort, export helpers
    analytics.ts             -- GA4 event tracking
    dataEvents.ts            -- Admin to public event bus
    emailService.ts          -- Resend email notifications
    emailTemplates.ts        -- HTML email templates
    imageUtils.ts            -- WebP URL helpers
    notifications.ts         -- Toast notification system
    offline.ts               -- Service worker + offline support
    realtimeSubscriptions.ts -- Disabled noop stubs
    seo.ts                   -- Meta tags, canonical, structured data
    supabase.ts              -- Supabase client + all service functions
    validation.ts            -- Form validation
  pages/
    AdminPortal.tsx          -- Admin shell + auth
  types/
    index.ts                 -- Shared TypeScript types
  App.tsx
  main.tsx
  index.css
public/
  cars/                      -- Car listing photos (1.jpg - 35.jpg)
  image/                     -- Brand assets, hero images, logo
  video/                     -- Loading screen video
  manifest.json
  robots.txt
  sitemap.xml
  sw.js                      -- Service worker
supabase/
  setup.sql                  -- Table definitions + RLS policies
```

---

## Database Schema

All tables use fully lowercase column names. The `id` column is UUID type.

### vehicles
| Column | Type |
|--------|------|
| id | uuid |
| image | text |
| images | jsonb |
| brand | text |
| model | text |
| year | integer |
| price | text |
| location | text |
| description | text |
| specs | jsonb |
| available | boolean |
| createdat | timestamptz |
| updatedat | timestamptz |

### parts
| Column | Type |
|--------|------|
| id | uuid |
| image | text |
| category | text |
| name | text |
| brand | text |
| price | text |
| condition | text |
| description | text |
| available | boolean |
| createdat | timestamptz |
| updatedat | timestamptz |

### inquiries
| Column | Type |
|--------|------|
| id | uuid |
| firstname | text |
| lastname | text |
| email | text |
| phone | text |
| message | text |
| status | text |
| createdat | timestamptz |
| updatedat | timestamptz |

### part_orders
| Column | Type |
|--------|------|
| id | uuid |
| partid | text |
| partname | text |
| partbrand | text |
| partprice | text |
| quantity | integer |
| customername | text |
| customeremail | text |
| customerphone | text |
| customercar | text |
| address | text |
| paymentmethod | text |
| deliveryoption | text |
| facebookprofile | text |
| notes | text |
| status | text |
| createdat | timestamptz |
| updatedat | timestamptz |

### vehicle_inquiries
| Column | Type |
|--------|------|
| id | uuid |
| vehicleid | text |
| vehiclebrand | text |
| vehiclemodel | text |
| vehicleyear | integer |
| vehicleprice | text |
| customername | text |
| customeremail | text |
| customerphone | text |
| inquirytype | text |
| message | text |
| facebookprofile | text |
| status | text |
| createdat | timestamptz |
| updatedat | timestamptz |

### business_settings
| Column | Type |
|--------|------|
| id | uuid |
| businessname | text |
| email | text |
| phone | text |
| location | text |
| businesshours | text |
| createdat | timestamptz |
| updatedat | timestamptz |

---

## RLS Policies

| Table | Public | Authenticated |
|-------|--------|---------------|
| vehicles | SELECT | ALL |
| parts | SELECT | ALL |
| inquiries | INSERT | ALL |
| part_orders | INSERT | ALL |
| vehicle_inquiries | INSERT | ALL |
| business_settings | SELECT | ALL |

Realtime broadcast triggers (`parts_inventory_broadcast`, `vehicles_inventory_broadcast`) must be dropped to prevent insert failures. Run in Supabase SQL Editor:

```sql
DROP TRIGGER IF EXISTS parts_inventory_broadcast ON public.parts;
DROP TRIGGER IF EXISTS vehicles_inventory_broadcast ON public.vehicles;
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_RESEND_API_KEY=re_...
VITE_ADMIN_EMAIL=your@email.com
VITE_FROM_EMAIL=notifications@yourdomain.com
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

For Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under Project Settings > Environment Variables, then redeploy.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check + build
npm run build

# Preview production build
npm run preview
```

---

## Deployment

The project deploys automatically to Vercel on push to `main`.

`vercel.json` rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Admin Access

Navigate to `/admin` on the live site. Login uses Supabase Auth — create a user in the Supabase dashboard under Authentication > Users.

---

## Paywall

A hard gate paywall activates 30 seconds after the loading screen completes. It displays cycling HTTP error codes (500, 429, 403, 401) and directs users to contact via Discord to resolve the issue. The paywall has no dismiss button — it locks scroll and blocks all interaction until the Discord link is clicked.

To adjust the timer, edit `PAYWALL_DELAY_MS` in `src/App.tsx`.

---

## Image Hosting

Vehicle and part images are referenced by URL in the database. Recommended approach: upload photos to Supabase Storage (create a public bucket named `vehicles` or `parts`), then use the public URL when adding listings in the admin panel.

Format: `https://your-project.supabase.co/storage/v1/object/public/vehicles/photo.jpg`
