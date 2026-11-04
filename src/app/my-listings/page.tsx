"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarCheck,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import type { Studio } from "@/app/types/studio";
import SafeImage from "@/app/components/SafeImage";
import ConfirmDialog from "@/app/components/ui/confirm-dialog";
import EmptyState from "@/app/components/ui/empty-state";

export default function MyListingsPage() {
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/studios/${encodeURIComponent(pendingDelete._id)}`, {
        method: "DELETE",
      });
      setStudios((current) =>
        current.filter((item) => item._id !== pendingDelete._id),
      );
      toast.success("Studio deleted.");
      setPendingDelete(null);
      router.refresh();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this studio.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            Host dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My Studio Listings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-70">
            Manage the spaces you host. Edits go live immediately.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/my-bookings"
            className="inline-flex items-center gap-2 rounded-lg border border-current/20 px-4 py-2.5 text-sm font-medium transition hover:border-amber-400"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            View bookings
          </Link>
          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
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
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
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
        <EmptyState
          title="You have not listed a studio yet"
          description="Publish your first space and start accepting hourly bookings. It takes a few minutes and you can edit everything later."
          actionLabel="Host your space"
          actionHref="/add-studio"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-current/10 bg-white dark:bg-zinc-900/60"
            >
              <div className="relative aspect-[4/3] w-full">
                <SafeImage
                  src={studio.image}
                  alt={studio.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white backdrop-blur">
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-current/20 px-3 py-2 text-sm font-medium transition hover:border-amber-400"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    View
                  </Link>
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(studio)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete "${pendingDelete.title}"?` : "Delete studio?"}
        description="This also removes its bookings and cannot be undone. The space will disappear from Explore immediately."
        confirmLabel="Delete studio"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
      />
    </main>
  );
}
