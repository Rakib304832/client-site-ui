# StudioSpace

**Creative spaces, booked by the hour.**

StudioSpace is a peer-to-peer marketplace for photo studios, film stages, podcast lounges, music suites, and workshops. Hosts publish the rooms they know; creators discover them, compare the details, and reserve the hours they need.

## Live site

**Live URL:** _Add the deployed Vercel URL here._

> The app is deployment-ready. Deploy the client to Vercel, deploy the Express API separately, and set `NEXT_PUBLIC_API_URL` to the API URL. The local demo runs at `http://localhost:3000`.

## Features

- **Discovery that respects your time** — a Swiper hero slider, six featured studios, category cards, keyword search, price and capacity filters, and five sort options.
- **Studio details built for decisions** — gallery carousel, amenity tags, host profile, hourly rate, refundable security deposit, capacity, and a booking panel with a transparent price breakdown.
- **Booking with real conflict checks** — date, start time, duration, and guest count are validated on the client and the server. Overlapping pending or confirmed bookings are rejected with a clear message.
- **Host tools** — publish a studio with an ImgBB upload or a direct image URL, edit every field, manage listings, and delete with a custom confirmation dialog.
- **Guest and host booking management** — status tabs for Pending, Confirmed, Completed, and Cancelled, guest cancellation with confirmation, host confirm/decline/complete actions, and a “Book again” shortcut.
- **Accounts and protected routes** — Better Auth email/password and Google sign-in, HTTP-only session cookies, protected `/add-studio`, `/my-listings`, `/my-bookings`, `/dashboard`, and `/studios/edit/[id]` routes.
- **A complete shell** — sticky header with an account dropdown, light/dark theme toggle, responsive mobile menu, footer with newsletter, category links, and the new X logo.
- **Polished states** — branded skeletons, empty states, custom 404 illustration, Sonner toasts for auth, CRUD, booking, upload, and newsletter actions.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| UI | React 19, TypeScript, Tailwind CSS 4, HeroUI, daisyUI |
| Icons | Lucide React |
| Carousel | Swiper |
| Notifications | Sonner |
| Auth | Better Auth with the MongoDB adapter and Google OAuth |
| API | Express 5 + MongoDB (separate `server-site` repository) |
| Images | ImgBB upload with direct URL fallback |
| Fonts | Geist Sans + Geist Mono via `next/font` |

## Local setup

### 1. Start the API

```bash
cd ../server-site
npm install
cp .env.example .env   # if present, otherwise create .env
npm run seed           # seeds the studio collection and the demo host
npm run dev            # http://localhost:5000
```

The API needs `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL=http://localhost:3000`. Google sign-in also needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 2. Start the client

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Required client variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret
MONGODB_URI=your-mongodb-uri
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
NEXT_PUBLIC_IMGBB_API_KEY=optional
```

`NEXT_PUBLIC_IMGBB_API_KEY` enables the studio image upload button. Without it, hosts can paste a direct image URL.

### 3. Google OAuth redirect URI

Add this authorized redirect URI in Google Cloud Console:

```
http://localhost:3000/api/auth/callback/google
```

## Examiner test credentials

| Field | Value |
| --- | --- |
| Email | `examiner@studiospace.demo` |
| Password | `Studio123` |

The demo account is created by the server seed script. You can also register a new account from `/register` — email verification is intentionally disabled for this assignment.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page with hero slider, featured studios, categories, booking steps, host guarantee, and the full How It Works and About sections |
| `/studios` | Explore, search, filter, and sort studios |
| `/studios/[id]` | Studio details, reviews, and booking |
| `/studios/edit/[id]` | Edit a listing (protected) |
| `/add-studio` | Publish a listing (protected) |
| `/my-listings` | Host listing management (protected) |
| `/my-bookings` | Guest and host booking management (protected) |
| `/dashboard` | Host and creator overview (protected) |
| `/how-it-works` | Creator and host guide, FAQ, support |
| `/about` | Mission, values, terms, and privacy |
| `/login` | Email/password and Google login |
| `/register` | Account creation with photo URL |
| `not-found.tsx` | Custom 404 illustration |

## Security and challenge notes

- **HTTP-only sessions** — Better Auth stores the session in an HTTP-only cookie. The Express API verifies it on every protected mutation.
- **Double-booking prevention** — `POST /api/bookings` checks for overlapping `Pending` or `Confirmed` reservations with a MongoDB range query before inserting.
- **Ownership checks** — only the host can edit/delete a studio or confirm/complete a booking.
- **Theme customization** — the header toggle persists the choice in `localStorage`, applies `data-theme` and the `dark` class before paint, and restyles the full app.

## Project structure

```
src/
├── app/
│   ├── (auth)/              # Login, register, shared auth layout
│   ├── about/               # About, terms, privacy
│   ├── add-studio/          # Create listing
│   ├── api/auth/[...all]/   # Better Auth route handler
│   ├── components/          # Header, footer, studio, booking, UI
│   ├── dashboard/           # Host/creator overview
│   ├── hooks/               # Theme hook
│   ├── how-it-works/        # Creator/host guide
│   ├── my-bookings/         # Guest + host bookings
│   ├── my-listings/         # Host listings
│   ├── studios/             # Explore, details, edit
│   ├── layout.tsx           # Global shell
│   └── page.tsx             # Home
└── lib/                     # API client, auth, upload, redirect
```

## Scripts

```bash
npm run dev       # Start the development server
npm run build     # Production build
npm run start     # Serve the production build
npm run lint      # ESLint
```

## Related repository

- Server: https://github.com/Rakib304832/server-site
