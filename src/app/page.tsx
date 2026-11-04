import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  Clapperboard,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import HeroSlider from "@/app/components/home/hero-slider";
import StudioCard from "@/app/components/studio/StudioCard";
import { API_URL } from "@/lib/api";
import type { Studio } from "@/app/types/studio";

const categories = [
  {
    name: "Photo Studio",
    description: "Natural light, cyc walls, and styled sets.",
    image: "/studios/daylight.jpg",
  },
  {
    name: "Film Stage",
    description: "Sound stages, lighting rigs, and production rooms.",
    image: "/studios/studio-film.jpg",
  },
  {
    name: "Podcast Lounge",
    description: "Quiet rooms with broadcast mics and mixing desks.",
    image: "/studios/studio-podcast.jpg",
  },
  {
    name: "Music Suite",
    description: "Writing rooms, consoles, and live-ready gear.",
    image: "/studios/studio-music.jpg",
  },
  {
    name: "Workshop",
    description: "Open tables, tools, and room to get messy.",
    image: "/studios/studio-art.jpg",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover spaces",
    description: "Search by category, location, budget, or the kind of light you need.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select shoot hours",
    description: "Pick your date and a time window that fits the shape of your day.",
    icon: CalendarRange,
  },
  {
    number: "03",
    title: "Book instantly",
    description: "Send a request, hear back from the host, and keep everything in one place.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Create & produce",
    description: "Load in, make the work, and come back to the room that gets you.",
    icon: Clapperboard,
  },
];

const assurances = [
  {
    title: "Liability protection",
    description: "Confirmed bookings include host liability cover, so the unexpected stays small.",
    icon: ShieldCheck,
  },
  {
    title: "Verified profiles",
    description: "Creators and hosts confirm their identity before the first conversation.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment safety",
    description: "Condition checklists and deposit protection for the gear that matters.",
    icon: Wrench,
  },
  {
    title: "24/7 host support",
    description: "Real humans on call for the last-minute question or the middle-of-the-night worry.",
    icon: Headphones,
  },
];

async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    const response = await fetch(`${API_URL}/api/studios`, { cache: "no-store" });
    if (!response.ok) return [];
    const studios = (await response.json()) as Studio[];
    return [...studios]
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 6);
  } catch {
    return [];
  }
}

function FeaturedSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/3] animate-pulse rounded-2xl bg-current/10"
        />
      ))}
    </div>
  );
}

async function FeaturedStudios() {
  const studios = await getFeaturedStudios();

  if (studios.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-current/20 p-10 text-center">
        <Sparkles className="mx-auto h-7 w-7 text-amber-500" aria-hidden="true" />
        <p className="mt-3 text-lg font-semibold">New spaces are on the way.</p>
        <p className="mx-auto mt-1 max-w-md text-sm opacity-70">
          The first host listings will appear here. In the meantime, browse every
          space or publish your own studio.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/studios"
            className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black"
          >
            Explore studios
          </Link>
          <Link
            href="/add-studio"
            className="rounded-lg border border-current/25 px-5 py-2.5 text-sm font-medium"
          >
            Host your space
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio, index) => (
        <StudioCard key={studio._id} studio={studio} priority={index < 3} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSlider />

      <section className="border-b border-current/10 bg-white/60 dark:bg-zinc-950/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-current/10 px-4 lg:grid-cols-4">
          {[
            ["2,400+", "Creative spaces"],
            ["38", "Cities and counting"],
            ["4.9 / 5", "Average studio rating"],
            ["24 / 7", "Creator support"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`px-3 py-7 sm:px-7 sm:py-8 ${
                index > 1 ? "border-t border-current/10 lg:border-t-0" : ""
              }`}
            >
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                {value}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              Handpicked this week
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured studios
            </h2>
            <p className="mt-2 max-w-xl text-sm opacity-70">
              Top-rated spaces with the light, gear, and room to make something
              worth keeping.
            </p>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-amber-400 decoration-2 underline-offset-4"
          >
            See all studios
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedStudios />
        </Suspense>
      </section>

      <section className="border-y border-current/10 bg-white/60 py-16 dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
                Find your format
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Browse by studio type
              </h2>
              <p className="mt-2 max-w-xl text-sm opacity-70">
                Five categories, one place to book them all.
              </p>
            </div>
            <Link
              href="/studios"
              className="text-sm font-semibold underline decoration-amber-400 decoration-2 underline-offset-4"
            >
              View the full collection
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/studios?category=${encodeURIComponent(category.name)}`}
                className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/80">
                    {category.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                    Explore category
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}

            <div className="flex min-h-56 flex-col justify-between rounded-2xl border border-amber-400 bg-amber-50 p-6 text-black dark:bg-amber-950/30 dark:text-amber-50">
              <div>
                <h3 className="text-xl font-semibold">Have a space?</h3>
                <p className="mt-1 text-sm opacity-70">
                  Turn an empty room into income. List it in a few minutes and
                  manage every booking from one dashboard.
                </p>
              </div>
              <Link
                href="/add-studio"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Start hosting
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            From idea to call sheet
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How booking works
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            Four clear steps between the idea in your notes app and the room
            where it becomes real.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="relative flex h-full flex-col rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60"
              >
                <span className="absolute right-5 top-5 text-4xl font-bold tracking-tight text-amber-400/25">
                  {step.number}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-70">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-current/10 bg-zinc-950 py-16 text-white sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Host guarantee & creator support
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Book with a little less uncertainty.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                Every confirmed booking is backed by clear standards, verified
                people, and a support team that understands production timelines.
              </p>
              <Link
                href="/how-it-works"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                Read the host guarantee
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {assurances.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                    <h3 className="mt-3 font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-amber-400/40 bg-amber-50 px-6 py-12 text-center dark:bg-amber-950/20">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-black">
            <Clapperboard className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Your next room is one search away.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed opacity-70">
            Whether you are shooting a campaign, recording a season, or running a
            workshop, find a space that fits the work.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/studios"
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Explore studios
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-current/25 px-6 py-3 text-sm font-semibold transition hover:border-amber-500"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
