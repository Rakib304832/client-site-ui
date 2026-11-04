"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock,
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Booking, Studio } from "@/app/types/studio";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [guestBookings, setGuestBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login?from=%2Fdashboard");
      return;
    }

    let cancelled = false;

    Promise.all([
      apiFetch<Booking[]>("/api/bookings?scope=guest"),
      apiFetch<Booking[]>("/api/bookings?scope=host"),
      apiFetch<Studio[]>("/api/studios?mine=true"),
    ])
      .then(([guest, host, mine]) => {
        if (cancelled) return;
        setGuestBookings(guest);
        setHostBookings(host);
        setListings(mine);
        setNow(Date.now());
        setError(null);
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (loadError instanceof ApiError && loadError.status === 401) {
          router.replace("/login?from=%2Fdashboard");
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load your dashboard.";
        setError(message);
        setLoading(false);
        toast.error(message);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, isPending, session, router]);

  const stats = useMemo(() => {
    const all = [...guestBookings, ...hostBookings];
    const upcoming = all
      .filter(
        (booking) =>
          new Date(booking.startTime).getTime() >= now &&
          (booking.status === "Pending" || booking.status === "Confirmed"),
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
    const pending = all.filter((booking) => booking.status === "Pending").length;
    const totalSpent = guestBookings
      .filter(
        (booking) =>
          booking.status === "Confirmed" || booking.status === "Completed",
      )
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    return { upcoming, pending, totalSpent };
  }, [guestBookings, hostBookings, now]);

  if (isPending || loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10" aria-busy="true">
        <p role="status" className="sr-only">
          Loading dashboard...
        </p>
        <div className="h-9 w-72 animate-pulse rounded-lg bg-current/10" />
        <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-current/10" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-current/10"
            />
          ))}
        </div>
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-current/5" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <h1 className="text-xl font-semibold">Dashboard could not load</h1>
          <p className="mt-2 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const firstName = (session?.user.name || "there").split(" ")[0];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            Your StudioSpace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-70">
            A quick read on your bookings, listings, and what needs attention
            next.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/studios"
            className="rounded-lg border border-current/20 px-4 py-2.5 text-sm font-medium transition hover:border-amber-400"
          >
            Explore studios
          </Link>
          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add studio
          </Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Upcoming bookings",
            value: stats.upcoming.length,
            icon: CalendarCheck,
          },
          { label: "Pending requests", value: stats.pending, icon: Clock },
          { label: "Active listings", value: listings.length, icon: Building2 },
          {
            label: "Total spent",
            value: `$${stats.totalSpent.toFixed(2)}`,
            icon: Wallet,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="rounded-2xl border border-current/10 bg-white p-5 dark:bg-zinc-900/60"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-2xl font-bold tracking-tight">
                {item.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] opacity-60">
                {item.label}
              </p>
            </article>
          );
        })}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-current/10 bg-white p-5 dark:bg-zinc-900/60 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Upcoming bookings</h2>
              <p className="mt-1 text-sm opacity-70">
                Pending and confirmed requests, soonest first.
              </p>
            </div>
            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500 hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {stats.upcoming.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-current/20 p-8 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-amber-500" aria-hidden="true" />
              <p className="mt-2 font-medium">Nothing on the calendar yet.</p>
              <p className="mx-auto mt-1 max-w-sm text-sm opacity-70">
                Book a space or share your listing to start filling the schedule.
              </p>
              <Link
                href="/studios"
                className="mt-4 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black"
              >
                Find a studio
              </Link>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-current/10">
              {stats.upcoming.slice(0, 5).map((booking) => (
                <li key={booking._id} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="truncate text-sm font-semibold hover:underline"
                    >
                      {booking.studioTitle}
                    </Link>
                    <p className="truncate text-xs opacity-60">
                      {formatDateTime(booking.startTime)} · {booking.hours} hour
                      {booking.hours === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {booking.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-current/10 bg-white p-5 dark:bg-zinc-900/60 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Your listings</h2>
              <p className="mt-1 text-sm opacity-70">
                The spaces you host right now.
              </p>
            </div>
            <Link
              href="/my-listings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500 hover:underline"
            >
              Manage
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-current/20 p-6 text-center">
              <Building2 className="mx-auto h-6 w-6 text-amber-500" aria-hidden="true" />
              <p className="mt-2 font-medium">No listings yet.</p>
              <p className="mt-1 text-sm opacity-70">
                Turn a room into your next income stream.
              </p>
              <Link
                href="/add-studio"
                className="mt-4 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black"
              >
                Host your space
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {listings.slice(0, 4).map((studio) => (
                <li
                  key={studio._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-current/10 p-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="truncate text-sm font-semibold hover:underline"
                    >
                      {studio.title}
                    </Link>
                    <p className="truncate text-xs opacity-60">{studio.location}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-amber-500">
                    ${studio.hourlyRate}
                    <span className="text-xs font-normal opacity-60"> /hr</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 grid gap-2 border-t border-current/10 pt-5">
            <Link
              href="/my-bookings"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-amber-400/10"
            >
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 opacity-70" aria-hidden="true" />
                Manage bookings
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            </Link>
            <Link
              href="/my-listings"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-amber-400/10"
            >
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 opacity-70" aria-hidden="true" />
                Manage listings
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
