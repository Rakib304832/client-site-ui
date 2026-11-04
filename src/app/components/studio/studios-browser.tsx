"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import StudioCard from "@/app/components/studio/StudioCard";
import EmptyState from "@/app/components/ui/empty-state";
import { STUDIO_CATEGORIES, type Studio } from "@/app/types/studio";

type StudiosBrowserProps = {
  studios: Studio[];
  initialCategory?: string;
};

type SortOption = "recommended" | "price-asc" | "price-desc" | "rating" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const categories = ["All", ...STUDIO_CATEGORIES];

const inputClass =
  "w-full rounded-lg border border-current/20 bg-transparent px-3 py-2 text-sm focus:border-amber-400 focus:outline-none";

export default function StudiosBrowser({
  studios,
  initialCategory,
}: StudiosBrowserProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : "All",
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (capacity) params.set("capacity", capacity);
    if (sort !== "recommended") params.set("sort", sort);
    const search = params.toString();
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  }, [category, query, minPrice, maxPrice, capacity, sort, pathname]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    const minCapacity = capacity === "" ? null : Number(capacity);

    const result = studios.filter((studio) => {
      if (category !== "All" && studio.category !== category) return false;
      if (min !== null && Number.isFinite(min) && studio.hourlyRate < min) {
        return false;
      }
      if (max !== null && Number.isFinite(max) && studio.hourlyRate > max) {
        return false;
      }
      if (
        minCapacity !== null &&
        Number.isFinite(minCapacity) &&
        studio.maxCapacity < minCapacity
      ) {
        return false;
      }
      if (normalizedQuery) {
        const haystack = [
          studio.title,
          studio.category,
          studio.location,
          studio.overview,
          ...(studio.amenities ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.hourlyRate - b.hourlyRate;
        case "price-desc":
          return b.hourlyRate - a.hourlyRate;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  }, [studios, category, query, minPrice, maxPrice, capacity, sort]);

  const hasFilters =
    query.trim() !== "" ||
    category !== "All" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    capacity !== "" ||
    sort !== "recommended";

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setCapacity("");
    setSort("recommended");
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-current/10 bg-white p-4 dark:bg-zinc-900/60 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
              aria-hidden="true"
            />
            <label htmlFor="studio-search" className="sr-only">
              Search studios
            </label>
            <input
              id="studio-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, location, amenity, or mood..."
              className={`${inputClass} py-3 pl-10`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((item) => {
              const active = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    active
                      ? "border-amber-400 bg-amber-400 font-semibold text-black"
                      : "border-current/20 hover:border-amber-400"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="min-price" className="mb-1 block text-xs font-medium opacity-70">
                Min $ / hr
              </label>
              <input
                id="min-price"
                type="number"
                min={0}
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="max-price" className="mb-1 block text-xs font-medium opacity-70">
                Max $ / hr
              </label>
              <input
                id="max-price"
                type="number"
                min={0}
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="500"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="capacity" className="mb-1 block text-xs font-medium opacity-70">
                Guests
              </label>
              <select
                id="capacity"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                className={inputClass}
              >
                <option value="">Any</option>
                <option value="2">2+</option>
                <option value="4">4+</option>
                <option value="6">6+</option>
                <option value="10">10+</option>
                <option value="20">20+</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="sort" className="mb-1 flex items-center gap-1 text-xs font-medium opacity-70">
                <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className={inputClass}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/10 pt-3">
            <p className="text-sm opacity-70" role="status">
              {filtered.length} {filtered.length === 1 ? "studio" : "studios"}{" "}
              available
              {category !== "All" ? ` in ${category}` : ""}.
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-current/20 px-3 py-1.5 text-xs font-medium transition hover:border-amber-400"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No studios match those filters"
          description="Try a different category, widen the price range, or clear the search to see every space again."
          actionLabel="Clear all filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((studio, index) => (
            <StudioCard key={studio._id} studio={studio} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
