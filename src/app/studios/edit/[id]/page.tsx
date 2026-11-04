"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import type { Studio } from "@/app/types/studio";
import StudioForm, {
  type StudioFormValues,
} from "@/app/components/studio/StudioForm";

function EditStudioPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Studio>(`/api/studios/${encodeURIComponent(id)}`)
      .then((data) => {
        if (!cancelled) {
          setStudio(data);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          router.replace(`/login?from=${encodeURIComponent(`/studios/edit/${id}`)}`);
          return;
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : "We could not load this studio.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey, router]);

  async function handleSubmit(values: StudioFormValues) {
    await apiFetch<Studio>(`/api/studios/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: {
        title: values.title.trim(),
        category: values.category,
        hourlyRate: Number(values.hourlyRate),
        securityDeposit: Number(values.securityDeposit),
        maxCapacity: Number(values.maxCapacity),
        location: values.location.trim(),
        image: values.image.trim(),
        overview: values.overview.trim(),
        amenities: values.amenities,
      },
    });
    toast.success("Studio updated successfully.");
    router.push("/my-listings");
    router.refresh();
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-xl font-semibold">Could not load this studio</h1>
          <p className="mt-2 text-sm">{loadError}</p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setLoadError(null);
                setReloadKey((key) => key + 1);
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
            <Link
              href="/my-listings"
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium"
            >
              Back to my listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="mx-auto max-w-3xl animate-pulse px-4 py-10">
        <p role="status" className="sr-only">
          Loading studio editor...
        </p>
        <div className="mb-8 h-8 w-1/2 rounded bg-current/10" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-11 rounded bg-current/10" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Update Studio</h1>
      <p className="mb-8 text-sm opacity-70">
        Edit your listing. Changes appear on the explore page right away.
      </p>

      <StudioForm
        submitLabel="Save Changes"
        initial={{
          title: studio.title,
          category: studio.category,
          hourlyRate: String(studio.hourlyRate),
          securityDeposit: String(studio.securityDeposit),
          maxCapacity: String(studio.maxCapacity),
          location: studio.location,
          image: studio.image,
          overview: studio.overview,
          amenities: studio.amenities,
        }}
        host={{ name: studio.ownerName, email: studio.ownerEmail }}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/my-listings")}
      />
    </main>
  );
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main aria-busy="true" className="mx-auto max-w-3xl px-4 py-10">
          <p role="status">Loading studio editor...</p>
        </main>
      }
    >
      <EditStudioPageContent params={params} />
    </Suspense>
  );
}
