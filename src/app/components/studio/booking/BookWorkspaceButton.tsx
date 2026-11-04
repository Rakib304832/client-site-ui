"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Clock, Loader2, ShieldCheck, Users, X } from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type Props = {
  studioId: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
};

export default function BookWorkspaceButton({
  studioId,
  hourlyRate,
  securityDeposit,
  maxCapacity,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [autoOpen] = useState(() => searchParams.get("book") === "1");
  const [autoDismissed, setAutoDismissed] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const wantsBooking = searchParams.get("book") === "1";
  const showModal =
    open || (autoOpen && Boolean(session?.user) && !autoDismissed);
  const safeHours = Number.isFinite(hours) && hours > 0 ? Math.min(hours, 12) : 1;
  const safeGuests = Number.isFinite(guests) && guests > 0 ? guests : 1;
  const subtotal = hourlyRate * safeHours;
  const total = subtotal;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;

  useEffect(() => {
    if (!autoOpen || isPending) return;
    if (!session?.user) {
      router.replace(
        `/login?from=${encodeURIComponent(`/studios/${studioId}?book=1`)}`,
      );
      return;
    }
    if (wantsBooking) {
      router.replace(`/studios/${studioId}`);
    }
  }, [autoOpen, wantsBooking, session, isPending, router, studioId]);

  useEffect(() => {
    if (!showModal) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setAutoDismissed(true);
        if (wantsBooking) router.replace(`/studios/${studioId}`);
      }
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, wantsBooking, router, studioId]);

  function openBooking() {
    if (!isPending && !session?.user) {
      router.push(
        `/login?from=${encodeURIComponent(`/studios/${studioId}?book=1`)}`,
      );
      return;
    }
    setAutoDismissed(false);
    setOpen(true);
  }

  function closeBooking() {
    setOpen(false);
    setAutoDismissed(true);
    if (wantsBooking) router.replace(`/studios/${studioId}`);
  }

  async function handleBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (safeGuests > maxCapacity) {
      toast.error(`This studio holds up to ${maxCapacity} guests.`);
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    if (Number.isNaN(start.getTime())) {
      toast.error("Choose a valid date and start time.");
      return;
    }
    if (start.getTime() < Date.now()) {
      toast.error("Choose a start time in the future.");
      return;
    }

    const end = new Date(start.getTime() + safeHours * 60 * 60 * 1000);

    setSubmitting(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: {
          studioId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          guests: safeGuests,
        },
      });

      toast.success("Booking request sent. The host will confirm it shortly.");
      setOpen(false);
      setAutoDismissed(true);
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Please log in to book this studio.");
        router.push(
          `/login?from=${encodeURIComponent(`/studios/${studioId}?book=1`)}`,
        );
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openBooking}
        className="w-full rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black transition hover:bg-amber-300"
      >
        Book Workspace Now
      </button>

      {showModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm"
          onClick={closeBooking}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-dialog-title"
            className="my-8 w-full max-w-lg rounded-2xl border border-current/10 bg-white p-6 text-black shadow-2xl dark:bg-zinc-900 dark:text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="booking-dialog-title" className="text-xl font-bold">
                  Book this studio
                </h2>
                <p className="mt-1 text-sm opacity-70">
                  Choose a date, start time, and how long you need the space.
                </p>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                aria-label="Close booking dialog"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg opacity-60 transition hover:bg-current/5 hover:opacity-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleBook} className="mt-5 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-date" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="booking-time" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Start time
                  </label>
                  <input
                    id="booking-time"
                    type="time"
                    required
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-hours" className="mb-1.5 block text-sm font-medium">
                    Hours
                  </label>
                  <input
                    id="booking-hours"
                    type="number"
                    min={1}
                    max={12}
                    step={1}
                    value={safeHours}
                    onChange={(event) => setHours(Number(event.target.value))}
                    className="w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="booking-guests" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    Guests
                  </label>
                  <input
                    id="booking-guests"
                    type="number"
                    min={1}
                    max={maxCapacity}
                    step={1}
                    value={safeGuests}
                    onChange={(event) => setGuests(Number(event.target.value))}
                    className="w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 focus:border-amber-400 focus:outline-none"
                  />
                  <p className="mt-1 text-xs opacity-60">
                    Up to {maxCapacity} guests.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-current/10 bg-current/[0.03] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">
                    ${hourlyRate} × {safeHours} hour{safeHours === 1 ? "" : "s"}
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 opacity-70">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Refundable security deposit
                  </span>
                  <span className="font-medium">
                    ${securityDeposit.toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-current/10 pt-3 text-base font-bold">
                  <span>Booking total</span>
                  <span className="text-amber-500">${total.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-xs opacity-60">
                  The deposit is returned after the space is checked. You are not
                  charged yet — the host confirms your request first.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeBooking}
                  className="flex-1 rounded-lg border border-current/20 py-2.5 font-medium transition hover:border-current/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 py-2.5 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  {submitting ? "Sending request..." : "Send booking request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
