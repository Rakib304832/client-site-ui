# StudioSpace
**Creative spaces, booked by the hour.**

StudioSpace is a peer-to-peer marketplace for photo studios, film stages, podcast lounges, music suites, and workshops. Hosts publish the rooms they know; creators discover them, compare the details, and reserve the hours they need.

![StudioSpace Banner](https://res.cloudinary.com/demo/image/upload/v1654321234/banner-studiospace.png#center)

## 🚀 Live Deployment

**Client (Vercel):** https://studio-space-client.vercel.app
**Server (Render):** https://studio-space-api.onrender.com

> **Note:** Replace these URLs with your actual deployed domains after deployment.

## ✨ Features

### Core Features
- **Interactive Hero Slider** — Swiper.js with 3 autoplay slides, navigation, and pagination. High-res visuals with punchy headlines and primary CTA buttons ("Explore Studios" / "Host Your Space").
- **Dynamic Featured Studios** — Fetches 6 top-rated studios from MongoDB with `.limit(6)`. Each card displays image, category badge, title, hourly rate ($XX / hr), rating badge, location, and "View Details" button.
- **Category Browsing** — Interactive category cards (Photo Studios, Sound Stages, Podcast Rooms, Music Suites, Art Workshops). Clicking any category redirects to `/studios` with that category pre-selected.
- **4-Step Booking Workflow** — Animated section showing: 1. Discover Spaces → 2. Select Shoot Hours → 3. Book Instantly → 4. Create & Produce.
- **Host Guarantee & Creator Support** — 4 platform assurances: liability protection, verified profiles, equipment safety, and 24/7 host support.

### Authentication
- **Login Page** — Email/password form with Google OAuth button. Shows error toast on failed login. Has register link and "Forgot password" info.
- **Register Page** — Name, email, photo URL, password with validation (6+ chars, uppercase, lowercase). Success navigates to login page. Has login link and Google sign-up button.
- **Password Validation** — Real-time error display for: minimum 6 characters, must have uppercase letter, must have lowercase letter.
- **Google OAuth** — Sign in/up with Google, navigates to home page on success.

### CRUD Operations
- **Add Studio** — Private route `/add-studio`. Full form with title, category select, hourly rate, security deposit, max capacity, location, image URL, amenities checklist, detailed overview. Success toast + redirect to `/my-listings`.
- **Explore Studios** — Grid view listing all workspaces with title, category badge, hourly rate, location, rating, and "View Details" button. Supports category filtering and search.
- **Studio Details** — Full specifications, image gallery carousel (Swiper), amenity list, host details, reviews, and "Book Workspace Now" button launching booking modal.
- **My Studio Listings** — Protected route `/my-listings`. Table/card format showing user-owned spaces (ownerEmail match) with Update and Delete buttons. Delete shows confirmation modal before removing from MongoDB.
- **Update Studio** — Private route `/studios/edit/[id]`. Pre-filled form with existing data. Read-only host info. On submit, updates MongoDB via PATCH and shows success toast before redirecting to `/my-listings`.
- **My Bookings** — Private route `/my-bookings`. Displays reservations with status badges (Pending, Confirmed, Completed, Cancelled). "Cancel Booking" option for pending slots.

### UI/UX Design
- **Theme Toggle** — Light/dark mode switch that persists in `localStorage` and applies `data-theme` attribute to `<html>` element for full system theming.
- **X Logo** — Used throughout (not old Twitter bird). Features in header, footer, newsletter, and category cards.
- **Sonner Toast Notifications** — Standardized feedback across all CRUD, auth, and booking actions. No default alert() calls.
- **Custom 404 Page** — Creative studio illustration with "Return to Home" button.
- **Branded Skeleton Loaders** — Animated spinners during route transitions and asynchronous data fetches.
- **Empty States** — Friendly displays with CTA buttons when search returns no results or booking lists are empty.
- **Responsive Design** — Fully responsive for mobile, tablet, and desktop views.
- **Sticky Header** — Active route indicators, authenticated profile dropdown with Dashboard, Add New Studio, My Studio Listings, My Bookings, and Logout.

### Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 14 (App Router, Turbopack, React 19) |
| **Language** | TypeScript |
| **UI** | Tailwind CSS 4, Daisy UI, Shadcn UI components |
| **Icons** | Lucide React |
| **Carousel** | Swiper.js (3 interactive slides) |
| **Notifications** | Sonner (replace default alerts) |
| **Auth** | Better Auth with MongoDB adapter, Google OAuth |
| **API** | Express 5 + MongoDB (separate repository) |
| **Images** | ImgBB upload with direct URL fallback |
| **Fonts** | Geist Sans + Geist Mono via `next/font` |
| **Animations** | Framer Motion (for skeletons and transitions) |

### 📦 Local Setup

#### 1. Start the API
```bash
cd ../server-site
npm install
cp .env.example .env   # or create .env with your values
npm run seed           # seeds studios and demo examiner account
npm run dev            # http://localhost:5000
```
*The API needs `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL=http://localhost:3000`. Google sign-in also needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.*

#### 2. Start the Client
```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```
*Required environment variables:*
- `NEXT_PUBLIC_API_URL=http://localhost:5000`
- `BETTER_AUTH_URL=http://localhost:3000`
- `BETTER_AUTH_SECRET=your-secret`
- `MONGODB_URI=your-mongodb-uri`
- `GOOGLE_CLIENT_ID=optional`
- `GOOGLE_CLIENT_SECRET=optional`
- `NEXT_PUBLIC_IMGBB_API_KEY=optional` *(enables studio image upload)*

#### 3. Google OAuth Redirect URI
Add this authorized redirect URI in Google Cloud Console:
```
http://localhost:3000/api/auth/callback/google
```

### 🧪 Examiner Test Credentials

| Field | Value |
| --- | --- |
| **Email** | `examiner@studiospace.demo` |
| **Password** | `Studio123` |

*The demo account is created by `npm run seed`. You can also register a new account from `/register` — email verification is intentionally disabled for this assignment.*

### 📚 Routes Overview

| Route | Description |
| --- | --- |
| `/` | Home page with hero slider, featured studios, categories, 4-step booking workflow, host guarantee, and host CTA |
| `/studios` | Explore and filter studios with category tabs, search, and sort options |
| `/studios/[id]` | Studio details with gallery carousel, amenities, host profile, and booking button |
| `/studios/edit/[id]` | Edit a listing (protected — owner only) |
| `/add-studio` | Publish a new studio listing (protected) |
| `/my-listings` | Host listing management (protected) |
| `/my-bookings` | Guest and host booking management (protected) |
| `/dashboard` | Host and creator overview (protected) |
| `/how-it-works` | Creator and host guide, FAQ, and support |
| `/about` | Mission, values, terms, and privacy |
| `/login` | Email/password and Google login |
| `/register` | Account creation with photo URL and password validation |
| `not-found.tsx` | Custom 404 illustration with "Return to Home" |

### ⚠️ Security & Challenge Notes

- **HTTP-only Sessions** — Better Auth stores the session in an HTTP-only cookie. The Express API verifies it on every protected mutation.
- **Double-Booking Prevention** — `POST /api/bookings` checks for overlapping `Pending` or `Confirmed` reservations with a MongoDB range query (`$lt`/`$gt` operators) before inserting. Returns 409 with clear error message.
- **Ownership Checks** — Only the host can edit/delete a studio or confirm/complete a booking.
- **Theme Customization** — The header toggle persists the choice in `localStorage`, applies `data-theme` and the `dark` class before paint, and restyles the full app.
- **JWT Security** — JWT stored in HTTP-only cookie, rejected with 401 on unauthorized mutations.

### 📦 Scripts

```bash
npm run dev       # Start the development server
npm run build     # Production build
npm run start     # Serve the production build
npm run lint      # ESLint
```

### 📂 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, register, shared auth layout
│   ├── about/               # About, terms, privacy
│   ├── add-studio/          # Create listing (protected)
│   ├── api/auth/[...all]/   # Better Auth route handler
│   ├── components/          # Header, footer, studio, booking, UI
│   ├── dashboard/           # Host/creator overview (protected)
│   ├── hooks/               # Theme hook useThemets.ts
│   ├── how-it-works/        # Creator/host guide
│   ├── my-bookings/         # Guest + host bookings (protected)
│   ├── my-listings/         # Host listings (protected)
│   ├── studios/             # Explore, details, edit
│   ├── layout.tsx           # Global shell with theme toggle, X logo, sticky header
│   └── page.tsx             # Home
├── components/
│   ├── ui/                  # EmptyState, ConfirmDialog, etc.
│   ├── home/                # HeroSlider, HowItWorksSection, AboutSection
│   ├── studio/              # StudioCard, StudioForm, GalleryCarousel, BookWorkspaceButton
│   ├── site-header.tsx      # Sticky header with theme toggle
│   ├── site-footer.tsx      # Footer with X logo, newsletter, categories
│   └── theme-toggle.tsx     # Light/dark mode switch
├── lib/
│   ├── api.ts             # API fetch with credentials: "include"
│   ├── auth.ts            # Better Auth client instance
│   ├── auth-client.ts     # authClient export
│   ├── upload.ts          # ImgBB upload function
│   └── type.ts            # Shared type definitions
└── types/
    └── studio.tsx         # Studio and Booking types
```

### 📫 Related Repository

- **Server:** https://github.com/Rakib304832/server-site
- **Client:** https://github.com/Rakib304832/client-side1

---

**Built with StudioSpace — where creative spaces meet hourly booking.**