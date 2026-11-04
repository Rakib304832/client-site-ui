"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Plus, Tag, X } from "lucide-react";
import SafeImage from "@/app/components/SafeImage";
import { STUDIO_CATEGORIES } from "@/app/types/studio";
import { uploadStudioImage } from "@/lib/upload";

export type StudioFormValues = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  overview: string;
  amenities: string[];
};

type Props = {
  initial?: Omit<Partial<StudioFormValues>, "amenities"> & {
    amenities?: string | string[];
  };
  submitLabel: string;
  onSubmit: (values: StudioFormValues) => Promise<void>;
  onCancel?: () => void;
  host?: { name: string; email: string } | null;
};

const EMPTY_FORM: StudioFormValues = {
  title: "",
  category: STUDIO_CATEGORIES[0],
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  overview: "",
  amenities: [],
};

const COMMON_AMENITIES = [
  "Wi-Fi",
  "Parking",
  "Natural Light",
  "Seamless Backdrop",
  "Acoustic Treatment",
  "Lighting Kit",
  "Mixing Desk",
  "Kitchenette",
  "Changing Room",
  "Freight Access",
];

const inputClass =
  "w-full rounded-lg border border-current/20 bg-transparent px-4 py-2.5 focus:border-amber-400 focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium";

export default function StudioForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  host,
}: Props) {
  const [values, setValues] = useState<StudioFormValues>({
    ...EMPTY_FORM,
    ...initial,
    amenities: Array.isArray(initial?.amenities)
      ? initial.amenities
      : initial?.amenities
        ? initial.amenities.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenityInput, setAmenityInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function toggleAmenity(amenity: string) {
    setValues((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter((item) => item !== amenity)
        : [...previous.amenities, amenity],
    }));
  }

  function addCustomAmenity() {
    const value = amenityInput.trim();
    if (!value) return;
    if (values.amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.info("That amenity is already on the list.");
      setAmenityInput("");
      return;
    }
    setValues((previous) => ({
      ...previous,
      amenities: [...previous.amenities, value],
    }));
    setAmenityInput("");
  }

  async function handleImageFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file (JPG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Keep the image under 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadStudioImage(file);
      setValues((previous) => ({ ...previous, image: url }));
      toast.success("Image uploaded. The preview is ready.");
    } catch (uploadError) {
      toast.error(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload that image. Paste a direct image URL instead.",
      );
    } finally {
      setUploading(false);
    }
  }

  function validate(): string | null {
    if (!values.title.trim()) return "Title is required.";
    if (!values.location.trim()) return "Location is required.";
    if (!values.overview.trim()) return "Overview is required.";
    if (!/^(https?:\/\/|\/)/i.test(values.image.trim())) {
      return "Add an image URL starting with http:// or https://, or upload a file.";
    }
    if (!Number.isFinite(Number(values.hourlyRate)) || Number(values.hourlyRate) <= 0) {
      return "Hourly rate must be a positive number.";
    }
    if (
      !Number.isFinite(Number(values.securityDeposit)) ||
      Number(values.securityDeposit) < 0
    ) {
      return "Security deposit cannot be negative.";
    }
    if (
      !Number.isInteger(Number(values.maxCapacity)) ||
      Number(values.maxCapacity) < 1
    ) {
      return "Max capacity must be at least 1 guest.";
    }
    if (values.amenities.length === 0) {
      return "Add at least one amenity so guests know what is included.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Could not save this studio. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
          placeholder="The Daylight Loft"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          className={inputClass}
        >
          {STUDIO_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location / Address
        </label>
        <input
          id="location"
          name="location"
          value={values.location}
          onChange={handleChange}
          required
          placeholder="Downtown, Los Angeles, CA"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="hourlyRate" className={labelClass}>
          Hourly Rate ($)
        </label>
        <input
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          min="1"
          step="0.01"
          value={values.hourlyRate}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="securityDeposit" className={labelClass}>
          Security Deposit ($)
        </label>
        <input
          id="securityDeposit"
          name="securityDeposit"
          type="number"
          min="0"
          step="0.01"
          value={values.securityDeposit}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="maxCapacity" className={labelClass}>
          Max Capacity
        </label>
        <input
          id="maxCapacity"
          name="maxCapacity"
          type="number"
          min="1"
          value={values.maxCapacity}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Amenities</label>
        <div className="flex gap-2">
          <input
            value={amenityInput}
            onChange={(event) => setAmenityInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add a custom amenity"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            aria-label="Add amenity"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-400 text-black transition hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="sm:col-span-2">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium opacity-70">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          Tap to include common amenities
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_AMENITIES.map((amenity) => {
            const active = values.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-amber-400 bg-amber-400 font-semibold text-black"
                    : "border-current/20 hover:border-amber-400"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>

        {values.amenities.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {values.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-sm"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-label={`Remove ${amenity}`}
                  className="rounded-full p-0.5 transition hover:bg-current/10"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs opacity-60">
            Add at least one amenity. Guests use these to compare spaces.
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="image" className={labelClass}>
          Studio Image
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="image"
            name="image"
            value={values.image}
            onChange={handleChange}
            required
            placeholder="https://i.ibb.co.com/... or upload below"
            className={inputClass}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-current/20 px-4 py-2.5 text-sm font-medium transition hover:border-amber-400 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
            )}
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <p className="mt-1.5 text-xs opacity-60">
          Upload to ImgBB when `NEXT_PUBLIC_IMGBB_API_KEY` is set, or paste a
          direct image URL.
        </p>
        {values.image.trim() ? (
          <div className="relative mt-3 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border border-current/10">
            <SafeImage
              src={values.image.trim()}
              alt="Studio preview"
              fill
              sizes="384px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="overview" className={labelClass}>
          Detailed Overview
        </label>
        <textarea
          id="overview"
          name="overview"
          rows={5}
          value={values.overview}
          onChange={handleChange}
          required
          placeholder="Describe the space, light, equipment, and what makes it special."
          className={inputClass}
        />
      </div>

      {host ? (
        <>
          <div>
            <label className={labelClass}>Host Name</label>
            <input
              value={host.name}
              disabled
              className={`${inputClass} opacity-60`}
            />
          </div>
          <div>
            <label className={labelClass}>Host Email</label>
            <input
              value={host.email}
              disabled
              className={`${inputClass} opacity-60`}
            />
          </div>
        </>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400 sm:col-span-2">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-amber-400 px-6 py-2.5 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-current/30 px-6 py-2.5 font-medium transition hover:border-current/60"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
