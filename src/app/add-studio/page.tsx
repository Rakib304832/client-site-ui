"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/app/types/studio";
import StudioForm, {
  type StudioFormValues,
} from "@/app/components/studio/StudioForm";

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function handleSubmit(values: StudioFormValues) {
    const studio = await apiFetch<Studio>("/api/studios", {
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
        amenities: values.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      },
    });

    toast.success("Studio published. You can manage it from My Listings.");
    router.push(`/studios/${studio._id}`);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Host your space</h1>
      <p className="mb-8 text-sm opacity-70">
        Add the details guests need to choose your studio. You can edit everything
        later from My Listings.
      </p>

      <StudioForm
        submitLabel="Publish Studio"
        onSubmit={handleSubmit}
        host={
          session?.user
            ? { name: session.user.name, email: session.user.email }
            : null
        }
        onCancel={() => router.push("/studios")}
      />
    </main>
  );
}
