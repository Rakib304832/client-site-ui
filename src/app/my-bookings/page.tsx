"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import type { Booking, BookingStatus } from "@/app/types/studio";
import SafeImage from "@/app/components/SafeImage";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-300",
  Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Completed: "bg-sky-100 text-sky-800 border-sky-300",
  Cancelled: "bg-zinc-200 text-zinc-700 border-zinc-300",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

type BookingCardProps = {
  booking: Booking;
  mode: "guest" | "host";
  updating: boolean;
  onStatusChange: (booking: Booking, status: BookingStatus) => void;
};

function BookingCard({
  booking,
  mode,
  updating,
  onStatusChange,
}: BookingCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-current/10 p-4 sm:flex-row">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-40">
        <SafeImage
          src={booking.studioImage}
          alt={booking.studioTitle}
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link
              href={`/studios/${booking.studioId}`}
              className="text-lg font-semibold hover:underline"
            >
              {booking.studioTitle}
            </Link>
            <p className="text-sm opacity-70">
              {booking.studioCategory} · {booking.studioLocation}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <p className="text-sm">
          {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
        </p>
        <p className="text-sm opacity-70">
          {booking.hours} hour{booking.hours === 1 ? "" : "s"} ·{" "}
          {mode === "guest"
            ? `Host: ${booking.ownerEmail}`
            : `Guest: ${booking.userName} (${booking.userEmail})`}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-lg font-bold text-amber-500">
            ${booking.totalPrice}
          </p>

          <div className="flex flex-wrap gap-2">
            {mode === "guest" && booking.status === "Pending" ? (
              <button
                type="button"
                disabled={updating}
                onClick={() => onStatusChange(booking, "Cancelled")}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
              >
                {updating ? "Updating..." : "Cancel request"}
              </button>
            ) : null}

            {mode === "host" && booking.status === "Pending" ? (
              <>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => onStatusChange(booking, "Confirmed")}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => onStatusChange(booking, "Cancelled")}
                  className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
                >
                  Decline
                </button>
              </>
            ) : null}

            {mode === "host" && booking.status === "Confirmed" ? (
              <>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => onStatusChange(booking, "Completed")}
                  className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Mark completed
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => onStatusChange(booking, "Cancelled")}
                  className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
                >
                  Cancel
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [guestBookings, setGuestBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      apiFetch<Booking[]>("/api/bookings?scope=guest"),
      apiFetch<Booking[]>("/api/bookings?scope=host"),
    ])
      .then(([guest, host]) => {
        if (!cancelled) {
          setGuestBookings(guest);
          setHostBookings(host);
          setError(null);
          setLoading(false);
        }
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (loadError instanceof ApiError && loadError.status === 401) {
          router.replace("/login?from=%2Fmy-bookings");
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load your bookings.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, router]);

  async function handleStatusChange(booking: Booking, status: BookingStatus) {
    setUpdatingId(booking._id);
    try {
      await apiFetch(`/api/bookings/${encodeURIComponent(booking._id)}`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Booking marked ${status.toLowerCase()}.`);
      setReloadKey((key) => key + 1);
      router.refresh();
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Could not update this booking.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const totalBookings = guestBookings.length + hostBookings.length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-2 text-sm opacity-70">
            Track your requests and manage bookings for the studios you host.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/studios"
            className="rounded-lg border border-current/20 px-4 py-2 text-sm font-medium hover:border-amber-400"
          >
            Explore studios
          </Link>
          <Link
            href="/my-listings"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
          >
            My listings
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-current/10"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              setReloadKey((key) => key + 1);
            }}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : totalBookings === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No bookings yet.</p>
          <p className="max-w-md text-sm opacity-70">
            Book a studio to see your requests here, or share your listing so guests
            can book your space.
          </p>
          <Link
            href="/studios"
            className="rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-black"
          >
            Find a studio
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-xl font-semibold">My booking requests</h2>
            {guestBookings.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-sm opacity-70">
                You have not booked a studio yet.
              </p>
            ) : (
              <div className="space-y-4">
                {guestBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    mode="guest"
                    updating={updatingId === booking._id}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              Bookings for my studios
            </h2>
            {hostBookings.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-sm opacity-70">
                No guests have booked your studios yet.
              </p>
            ) : (
              <div className="space-y-4">
                {hostBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    mode="host"
                    updating={updatingId === booking._id}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
