# 🏢 StudioSpace

**Creative spaces, booked by the hour.**

StudioSpace is a peer-to-peer marketplace for photo studios, film stages, podcast lounges, music suites, and workshops. Hosts publish the rooms they know; creators discover them, compare the details, and reserve the hours they need.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.7-purple)](https://better-auth.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?logo=mongodb)](https://www.mongodb.com/)

---

## 🚀 Live Deployment

| Service | URL |
|---------|-----|
| **Client (Vercel)** | https://studio-space-client.vercel.app |
| **Server (Render)** | https://studio-space-api.onrender.com |

> Replace these URLs with your own deployed domains after deployment.

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📦 Local Setup](#-local-setup)
- [🔐 Environment Variables](#-environment-variables)
- [🔑 Google OAuth Setup](#-google-oauth-setup)
- [🧪 Test Credentials](#-test-credentials)
- [🗺 Routes Overview](#-routes-overview)
- [🔒 Protected Routes](#-protected-routes)
- [📂 Project Structure](#-project-structure)
- [📜 Scripts](#-scripts)
- [🔗 Related Repository](#-related-repository)
- [📄 License](#-license)

---

## ✨ Features

### Core marketplace

- **Interactive Hero Slider** — Swiper.js with 3 autoplay slides, navigation, pagination, and primary/secondary CTAs.
- **Featured Studios** — Top-rated studios fetched from MongoDB, with client-side category filter chips (no page reload) and a per-card **favorite/like toggle**.
- **Animated Stats** — Count-up counters for spaces, cities, rating, and support hours.
- **Explore Studios** — Grid view with real-time search, category/price/capacity filters, sorting, and clear-all filters.
- **Studio Details** — Image gallery carousel (Swiper), amenities, host details, reviews, and a **booking modal** (date, time, hours, guests, price breakdown).
- **4-Step Booking Workflow** — Discover → Select hours → Book instantly → Create & produce.
- **Host Guarantee** — Liability protection, verified profiles, equipment safety, 24/7 host support.

### Authentication (Better Auth)

- **Login** — Email/password form + Google OAuth. Clear errors and a hint when an account was created via Google.
- **Register** — Name, email, photo URL, password with live validation (6+ chars, upper/lower case).
- **Google OAuth** — Sign in/up with Google, redirects home on success.
- **Session guard** — Protected routes wait for the session to hydrate, so a page reload never kicks out a logged-in user.

### Host tools (protected routes)

- **Add Studio** — Full listing form: title, category, hourly rate, security deposit, capacity, location, image URL, amenities, overview.
- **My Listings** — Manage your own spaces with update/delete (confirmation modal).
- **Update Studio** — Pre-filled edit form; PATCH updates to MongoDB.
- **My Bookings** — Guest and host reservations with status badges (Pending, Confirmed, Completed, Cancelled) and cancel option.

### UI/UX

- **Theme toggle** — Light/dark mode persisted in `localStorage`, applied before paint.
- **Sonner toasts** — Standardized feedback across auth, CRUD, and booking actions.
- **Scroll-to-top** — Floating button that appears after scrolling.
- **Skeleton loaders** — Branded animated placeholders during data fetches.
- **Empty states** — Friendly displays with CTAs when results are empty.
- **Responsive** — Mobile, tablet, and desktop.
- **Sticky header** — Active route indicators, authenticated profile dropdown.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, DaisyUI |
| Icons | Lucide React |
| Carousel | Swiper.js |
| Notifications | Sonner |
| Auth | Better Auth + MongoDB adapter, Google OAuth |
| API | Express 5 + MongoDB (separate repo) |
| Images | ImgBB upload (optional) |
| Fonts | Geist Sans + Geist Mono (`next/font`) |
| State | React hooks (`useState`, `useEffect`, `useMemo`) |

---

## 📦 Local Setup

### 1. Start the API (server)

```bash
cd ../server-site
npm install
cp .env.example .env   # fill in your values
npm run seed           # seeds studios and demo account
npm run dev            # http://localhost:5000
```

### 2. Start the client

```bash
npm install
cp .env.example .env.local   # or use the provided .env
npm run dev                  # http://localhost:3000
```

---

## 🔐 Environment Variables

Create `.env.local` in the client root:

```env
# Express API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your-generated-secret
BETTER_AUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/studiospace

# Google OAuth (optional — enables Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Image upload (optional — enables studio image upload)
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key
```

Generate a secret with:

```bash
openssl rand -base64 32
```

---

## 🔑 Google OAuth Setup

In **Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client ID**, add this **Authorized redirect URI**:

```
http://localhost:3000/api/auth/callback/google
```

---

## 🧪 Test Credentials

| Field | Value |
|-------|-------|
| Email | `examiner@studiospace.demo` |
| Password | `Studio123` |

Created by `npm run seed` on the server. You can also register a new account from `/register` (email verification is disabled for this demo).

---

## 🗺 Routes Overview

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Home: hero slider, stats, featured studios, categories, booking steps | Public |
| `/studios` | Explore + filter + sort all studios | Public |
| `/studios/[id]` | Studio details: gallery, amenities, booking modal | Public |
| `/add-studio` | Publish a new studio listing | Private |
| `/studios/edit/[id]` | Edit a listing (owner only) | Private |
| `/my-listings` | Host listing management | Private |
| `/my-bookings` | Guest + host booking management | Private |
| `/dashboard` | Host/creator overview | Private |
| `/how-it-works` | Creator/host guide and FAQ | Public |
| `/about` | Mission, terms, privacy | Public |
| `/login` | Email/password + Google login | Public |
| `/register` | Account creation | Public |

---

## 🔒 Protected Routes

The following routes require a logged-in session:

- `/add-studio`
- `/my-listings`
- `/studios/edit/[id]`
- `/my-bookings`
- `/dashboard`

Each protected page reads the session via `authClient.useSession()` and waits for it to resolve (`isPending`) before redirecting. This means a logged-in user who refreshes the page is **not** sent to `/login` mid-hydration. Unauthenticated users are redirected to `/login?from=<current-path>` so they can return after signing in.

Public pages (Home, `/studios`, `/studios/[id]`, `/how-it-works`, `/about`, `/login`, `/register`) remain viewable without logging in.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Login, register, shared auth layout
│   ├── about/                  # About, terms, privacy
│   ├── add-studio/             # Create listing (protected)
│   ├── api/auth/[...all]/      # Better Auth route handler
│   ├── components/
│   │   ├── ui/                 # EmptyState, ConfirmDialog, AnimatedCounter, ScrollToTop
│   │   ├── home/               # HeroSlider, HowItWorksSection, AboutSection
│   │   ├── studio/             # StudioCard, StudioForm, GalleryCarousel, BookWorkspaceButton
│   │   ├── site-header.tsx     # Sticky header with theme toggle + profile menu
│   │   ├── site-footer.tsx     # Footer, social links, newsletter
│   │   ├── theme-toggle.tsx    # Light/dark mode switch
│   │   └── google-auth-button.tsx
│   ├── dashboard/              # Host/creator overview (protected)
│   ├── hooks/                  # Theme hook (useThemets)
│   ├── how-it-works/           # Creator/host guide
│   ├── my-bookings/            # Guest + host bookings (protected)
│   ├── my-listings/            # Host listings (protected)
│   ├── studios/                # Explore, details, edit
│   ├── layout.tsx              # Global shell: header, scroll-to-top, footer, toaster
│   └── page.tsx                # Home
├── lib/
│   ├── api.ts                  # API fetch with credentials: "include"
│   ├── auth.ts                 # Better Auth server instance
│   ├── auth-client.ts          # authClient export (Better Auth client)
│   ├── redirect.ts             # Safe redirect-path helper
│   ├── upload.ts               # ImgBB upload helper
│   └── type.ts                 # Shared type definitions
├── types/
│   └── studio.tsx              # Studio, Booking, Review types + STUDIO_CATEGORIES
├── globals.css                 # Tailwind, custom vars, dark mode, animations
└── layout.tsx                  # Root layout, theme script, fonts
```

---

## 📜 Scripts

```bash
npm run dev      # Start the development server (Turbopack)
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

---

## 🔗 Related Repository

- **Server:** https://github.com/Rakib304832/server-site
- **Client (this repo):** https://github.com/Rakib304832/client-site-ui

---

## 📄 License

MIT

---

**Built with StudioSpace — where creative spaces meet hourly booking.**
