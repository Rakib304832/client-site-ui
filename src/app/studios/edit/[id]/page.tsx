"use client";

import { use, useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Studio } from "@/app/types/studio";

const API = process.env.NEXT_PUBLIC_API_URL;
const CATEGORIES = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

// Inputs always hold strings, even for numbers, because that is what form fields give us.
// We convert to numbers only when sending, so the user can type freely while editing.
type FormState = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  overview: string;
  amenities: string;
};

export default function EditStudioPage({ params }: { params: Promise<{ id: string }> }) {
  // In a client component, React's use() unwraps the params Promise.
  const { id } = use(params);
  const router = useRouter();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  // Load the current studio once, then copy its values into the editable form.
  useEffect(() => {
    // credentials: "include" sends the HTTPOnly JWT cookie, so the server can confirm ownership.
    fetch(`${API}/api/studios/${id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load studio");
        return res.json();
      })
      .then((data: Studio) => {
        setStudio(data);
        // Convert numbers and arrays to strings here, because the inputs need string values.
        setForm({
          title: data.title,
          category: data.category,
          hourlyRate: String(data.hourlyRate),
          securityDeposit: String(data.securityDeposit),
          maxCapacity: String(data.maxCapacity),
          location: data.location,
          image: data.image,
          overview: data.overview,
          amenities: data.amenities.join(", "),
        });
      })
      .catch(() => toast.error("We could not load this studio. Please try again."));
  }, [id]);

  // One handler for every input, using the input's name attribute to know which field changed.
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Stops the browser from reloading the page, which would lose the form state.
    e.preventDefault();
    if (!form) return;

    // Check numbers on the client first for quick feedback. The server checks them again,
    // because client checks alone can be skipped.
    const rate = Number(form.hourlyRate);
    if (!rate || rate <= 0) {
      toast.error("Hourly rate must be a positive number.");
      return;
    }

    // Amenities are typed as "Wi-Fi, Parking", so split on commas and drop empty entries.
    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: rate,
      securityDeposit: Number(form.securityDeposit),
      maxCapacity: Number(form.maxCapacity),
      location: form.location.trim(),
      image: form.image.trim(),
      overview: form.overview.trim(),
      amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      // PATCH updates only the fields we send. The host info is never sent, since it is read-only.
      const res = await fetch(`${API}/api/studios/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // catch() handles a body that is not JSON, such as an empty 500 response.
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 401 means not logged in, 403 means not the owner. The server's message explains which.
        toast.error(data.message ?? "Update failed. Please try again.");
        return;
      }

      toast.success("Studio updated successfully");
      router.push("/my-listings");
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  // Skeleton shown while the studio loads, so the page never looks blank or broken.
  if (!studio || !form) {
    return (
      <main className="mx-auto max-w-3xl animate-pulse px-4 py-10">
        <div className="mb-8 h-8 w-1/2 rounded bg-current/10" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-11 rounded bg-current/10" />
          ))}
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-current/20 bg-transparent px-4 py-2.5 focus:border-amber-400 focus:outline-none";
  const labelClass = "mb-1.5 block text-sm font-medium";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Update Studio</h1>
      <p className="mb-8 text-sm opacity-70">Edit your listing. Changes appear on the explore page right away.</p>

      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>Location / Address</label>
          <input id="location" name="location" value={form.location} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="hourlyRate" className={labelClass}>Hourly Rate ($)</label>
          <input id="hourlyRate" name="hourlyRate" type="number" min="1" value={form.hourlyRate} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="securityDeposit" className={labelClass}>Security Deposit ($)</label>
          <input id="securityDeposit" name="securityDeposit" type="number" min="0" value={form.securityDeposit} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="maxCapacity" className={labelClass}>Max Capacity</label>
          <input id="maxCapacity" name="maxCapacity" type="number" min="1" value={form.maxCapacity} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="image" className={labelClass}>Image URL (imgbb direct link)</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} required className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="amenities" className={labelClass}>Amenities (comma separated)</label>
          <input id="amenities" name="amenities" value={form.amenities} onChange={handleChange} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="overview" className={labelClass}>Detailed Overview</label>
          <textarea id="overview" name="overview" rows={5} value={form.overview} onChange={handleChange} required className={inputClass} />
        </div>

        {/* Host info is shown but disabled, so it is visible and clearly not editable. */}
        <div>
          <label className={labelClass}>Host Name</label>
          <input value={studio.ownerName} disabled className={`${inputClass} opacity-60`} />
        </div>

        <div>
          <label className={labelClass}>Host Email</label>
          <input value={studio.ownerEmail} disabled className={`${inputClass} opacity-60`} />
        </div>

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-amber-400 px-6 py-2.5 font-semibold text-black disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/my-listings")}
            className="rounded-lg border border-current/30 px-6 py-2.5 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}