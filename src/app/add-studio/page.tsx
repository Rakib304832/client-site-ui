"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/app/types/studio";
import StudioForm, {
  type StudioFormValues,
} from "@/app/components/studio/StudioForm";

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Require login. Wait for the session to resolve so a page reload does not
  // redirect a logged-in user to /login before hydration finishes.
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/login?from=${encodeURIComponent("/add-studio")}`);
      return;
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10" aria-busy="true">
        <p role="status" className="sr-only">Loading add studio...</p>
        <div className="h-9 w-72 animate-pulse rounded-lg bg-amber-400/10" />
      </main>
    );
  }

  async function handleSubmit(values: StudioFormValues) {
    try {
      await apiFetch<Studio>("/api/studios", {
        method: "POST",
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

      toast.success("Studio published. Manage it from My Listings.");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace(`/login?from=${encodeURIComponent("/add-studio")}`);
      }
      throw error;
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
        Host tools
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Host your space
      </h1>
      <p className="mb-8 mt-2 max-w-2xl text-sm leading-relaxed opacity-70">
        Add the details guests need to choose your studio. You can edit
        everything later from My Listings.
      </p>

      <div className="rounded-2xl border border-current/10 bg-white p-5 dark:bg-zinc-900/60 sm:p-7">
        <StudioForm
          submitLabel="Publish Studio"
          onSubmit={handleSubmit}
          host={{
            name: session.user.name,
            email: session.user.email,
          }}
          onCancel={() => router.push("/studios")}
        />
      </div>
    </main>
  );
}
