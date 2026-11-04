"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import SafeImage from "@/app/components/SafeImage";
import { STUDIO_CATEGORIES } from "@/app/types/studio";

export type StudioFormValues = {
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
  amenities: "",
};

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
      ? initial.amenities.join(", ")
      : (initial?.amenities ?? ""),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function validate(): string | null {
    if (!values.title.trim()) return "Title is required.";
    if (!values.location.trim()) return "Location is required.";
    if (!values.overview.trim()) return "Overview is required.";
    if (!/^(https?:\/\/|\/)/i.test(values.image.trim())) {
      return "Enter a valid image URL starting with http:// or https://.";
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
        <label htmlFor="amenities" className={labelClass}>
          Amenities (comma separated)
        </label>
        <input
          id="amenities"
          name="amenities"
          value={values.amenities}
          onChange={handleChange}
          placeholder="Wi-Fi, Parking, Natural Light"
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="image" className={labelClass}>
          Image URL (direct image link)
        </label>
        <input
          id="image"
          name="image"
          value={values.image}
          onChange={handleChange}
          required
          placeholder="https://i.ibb.co.com/..."
          className={inputClass}
        />
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
        <p role="alert" className="text-sm text-red-600 sm:col-span-2">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-amber-400 px-6 py-2.5 font-semibold text-black disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-current/30 px-6 py-2.5 font-medium"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
