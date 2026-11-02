"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  studioId: string;
  hourlyRate: number;
};

export default function BookWorkspaceButton({ studioId, hourlyRate }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Shown in the modal so the user sees the cost before confirming.
  const total = hourlyRate * hours;

  async function handleBook(e: FormEvent<HTMLFormElement>) {
    // Stop the browser from reloading the page when the form is submitted.
    e.preventDefault();

    // Start and end times are sent as ISO strings, so the server can compare them with existing bookings.
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    setSubmitting(true);
    try {
      // credentials: "include" sends the HTTPOnly JWT cookie, which the server needs for POST /api/bookings.
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          totalPrice: total,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // 401 means the user is not logged in, so we send them to login instead of showing a generic error.
      if (res.status === 401) {
        toast.error("Please log in to book this studio.");
        router.push("/login");
        return;
      }

      // 409 is the status our server uses for a double-booking collision, so we show the server's clear message.
      if (res.status === 409) {
        toast.error(data.message ?? "This time slot is already booked.");
        return;
      }

      if (!res.ok) {
        toast.error(data.message ?? "Booking failed. Please try again.");
        return;
      }

      toast.success("Booking request sent. Status: Pending.");
      setOpen(false);
      router.push("/my-bookings");
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-xl font-bold">Book this studio</h2>
            <p className="mb-5 text-sm opacity-70">Choose a date and how many hours you need.</p>

            <form onSubmit={handleBook} className="flex flex-col gap-4">
              <div>
                <label htmlFor="booking-date" className="mb-1 block text-sm font-medium">Date</label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="booking-time" className="mb-1 block text-sm font-medium">Start time</label>
                <input
                  id="booking-time"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="booking-hours" className="mb-1 block text-sm font-medium">Hours</label>
                <input
                  id="booking-hours"
                  type="number"
                  min={1}
                  max={12}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <p className="text-right text-lg font-bold">Total: ${total}</p>

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