"use client";

import Link from "next/link";

export default function StudiosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
        <h1 className="text-2xl font-bold">Studios could not load</h1>
        <p className="mt-2 text-sm">
          {error.message ||
            "The studio service is unavailable right now. Please try again."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-medium"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
