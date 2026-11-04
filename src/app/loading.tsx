import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24"
      aria-busy="true"
    >
      <div className="relative grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/20" />
        <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-amber-400 text-black shadow-lg">
          <Aperture className="h-8 w-8 animate-spin" aria-hidden="true" />
        </span>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" role="status">
          Setting the scene...
        </p>
        <p className="mt-1 text-xs opacity-60">
          Loading the next part of StudioSpace.
        </p>
      </div>
      <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-current/10">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-amber-400" />
      </div>
    </main>
  );
}
