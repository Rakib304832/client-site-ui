"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type Props = {
  studioId: string;
  hourlyRate: number;
};

export default function BookWorkspaceButton({ studioId, hourlyRate }: Props) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 1;
  const total = hourlyRate * safeHours;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;

  function openBooking() {
    if (!isPending && !session?.user) {
      router.push(`/login?from=${encodeURIComponent(`/studios/${studioId}`)}`);
      return;
    }
    setOpen(true);
  }

  async function handleBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
        },
      });

      toast.success("Booking request sent. Status: Pending.");
      setOpen(false);
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Please log in to book this studio.");
        router.push(`/login?from=${encodeURIComponent(`/studios/${studioId}`)}`);
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
        className="w-full rounded-lg bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
      >
        Book Workspace Now
      </button>

      {/* The modal only renders when open, so it adds no weight to the page otherwise. */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          {/* stopPropagation keeps clicks inside the card from closing the modal. */}
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 text-black dark:bg-zinc-900 dark:text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-1 text-xl font-bold">Book this studio</h2>
            <p className="mb-5 text-sm opacity-70">
              Choose a date and how many hours you need.
            </p>

            <form onSubmit={handleBook} className="flex flex-col gap-4">
              <div>
                <label htmlFor="booking-date" className="mb-1 block text-sm font-medium">
                  Date
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="booking-time" className="mb-1 block text-sm font-medium">
                  Start time
                </label>
                <input
                  id="booking-time"
                  type="time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="booking-hours" className="mb-1 block text-sm font-medium">
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
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <p className="text-right text-lg font-bold">
                Total: ${total.toFixed(2)}
              </p>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-amber-400 py-2.5 font-semibold text-black disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border py-2.5 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
