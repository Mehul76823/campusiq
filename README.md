# CampusIQ — College Discovery Platform

> Full Stack Intern Assignment — Track B (College Discovery Platform)
> Role: Full Stack Engineer

A production-grade MVP for discovering, comparing, and shortlisting Indian engineering and MBA colleges.

---

## Features Built

| Feature | Status |
|---|---|
| College listing with search | ✅ |
| Filter by type, state, exam, fees, rating | ✅ |
| Grid + list view toggle | ✅ |
| Pagination | ✅ |
| College detail page (4 tabs) | ✅ |
| Side-by-side comparison (up to 3) | ✅ |
| Best-value highlighting in comparison | ✅ |
| Auth (signup / login / session) | ✅ |
| Save colleges + personal shortlist | ✅ |
| Submit reviews with star ratings | ✅ |
| Responsive design | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | TailwindCSS (custom dark theme) |
| Backend | Next.js API Routes |
| Database | PostgreSQL via Prisma ORM |
| Auth | iron-session (cookie-based) |
| Validation | Zod |
| Deployment | Vercel + Neon (recommended) |

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd campusiq
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and SESSION_SECRET
```

### 3. Database setup

```bash
npm run db:push        # Push schema to your DB
npm run db:seed        # Seed 8 colleges with full data
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment (Vercel + Neon)

1. Create a [Neon](https://neon.tech) database → copy the connection string
2. Push to GitHub
3. Connect repo on [Vercel](https://vercel.com)
4. Add environment variables in Vercel dashboard
5. Run seed script via Vercel CLI or locally against production DB

---

## Architecture Decisions

### API Design
- All data is fetched from the DB via `/api/*` routes — no hardcoded frontend data
- College listing uses parameterized Prisma queries with full filter + sort support
- Reviews update the aggregate rating atomically via a DB aggregation pass

### Auth
- Cookie-based sessions via `iron-session` — no JWTs, no third-party auth services
- Session is validated server-side on every protected API call

### Validation
- All POST bodies are validated with Zod before any DB interaction
- Unknown/malformed fields are stripped; errors return structured JSON

### Schema
- Reviews maintain a denormalized `rating` + `reviewCount` on the College model for fast reads
- `SavedCollege` uses a composite unique key `[userId, collegeId]` to prevent duplicates

### Frontend
- Client components only where state is needed (search, filters, forms)
- Debounced search (400ms) to avoid excessive API calls
- Skeleton loading states on all data-fetching components

---

## Demo Account

```
Email:    demo@campusiq.in
Password: demo1234
```

---

## Project Structure

```
campusiq/
├── app/
│   ├── page.tsx                    # Home / landing
│   ├── colleges/page.tsx           # Listing + search + filters
│   ├── college/[slug]/page.tsx     # Detail with 4 tabs
│   ├── compare/page.tsx            # Side-by-side comparison
│   ├── saved/page.tsx              # Saved shortlist
│   ├── auth/login/page.tsx
│   ├── auth/signup/page.tsx
│   └── api/
│       ├── colleges/route.ts       # GET (list)
│       ├── colleges/[slug]/route.ts
│       ├── colleges/[slug]/reviews/route.ts
│       ├── compare/route.ts
│       ├── saved/route.ts
│       └── auth/{login,signup,session}/route.ts
├── components/
│   ├── layout/Navbar.tsx
│   ├── college/CollegeCard.tsx
│   ├── college/CollegeListRow.tsx
│   ├── college/FilterPanel.tsx
│   └── ui/{Skeleton,StarRating,Toast}.tsx
├── lib/
│   ├── db.ts                       # Prisma singleton
│   ├── session.ts                  # iron-session config
│   └── utils.ts                    # Formatters + helpers
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/index.ts
```
