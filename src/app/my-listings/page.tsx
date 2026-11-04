"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import type { Studio } from "@/app/types/studio";
import SafeImage from "@/app/components/SafeImage";

export default function MyListingsPage() {
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Studio[]>("/api/studios?mine=true")
      .then((data) => {
        if (!cancelled) {
          setStudios(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (loadError instanceof ApiError && loadError.status === 401) {
          router.replace("/login?from=%2Fmy-listings");
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load your listings.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, router]);

  async function handleDelete(studio: Studio) {
    const confirmed = window.confirm(
      `Delete "${studio.title}"? This also removes its bookings and cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(studio._id);
    try {
      await apiFetch(`/api/studios/${encodeURIComponent(studio._id)}`, {
        method: "DELETE",
      });
      setStudios((current) =>
        current.filter((item) => item._id !== studio._id),
      );
      toast.success("Studio deleted.");
      router.refresh();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this studio.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="mt-2 text-sm opacity-70">
            Manage the spaces you host. Edits go live immediately.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/my-bookings"
            className="rounded-lg border border-current/20 px-4 py-2 text-sm font-medium hover:border-amber-400"
          >
            View bookings
          </Link>
          <Link
            href="/add-studio"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
          >
            Add studio
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] animate-pulse rounded-2xl bg-current/10"
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
      ) : studios.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
          <p className="text-lg font-medium">You have not listed a studio yet.</p>
          <p className="max-w-md text-sm opacity-70">
            Publish your first space and start accepting hourly bookings.
          </p>
          <Link
            href="/add-studio"
            className="rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-black"
          >
            Host your space
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-current/10"
            >
              <div className="relative aspect-[4/3] w-full">
                <SafeImage
                  src={studio.image}
                  alt={studio.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                  {studio.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="text-lg font-semibold">{studio.title}</h2>
                <p className="text-sm opacity-70">{studio.location}</p>
                <p className="text-sm">
                  <span className="font-bold text-amber-500">
                    ${studio.hourlyRate}
                  </span>
                  <span className="opacity-70"> / hr</span>
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link
                    href={`/studios/${studio._id}`}
                    className="rounded-lg border border-current/20 px-3 py-2 text-sm font-medium hover:border-amber-400"
                  >
                    View
                  </Link>
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-black"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(studio)}
                    disabled={deletingId === studio._id}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
                  >
                    {deletingId === studio._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
