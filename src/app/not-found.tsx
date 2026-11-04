import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
        404
      </p>
      <h1 className="text-3xl font-bold">This page is not available</h1>
      <p className="max-w-md text-sm opacity-70">
        The studio or page you are looking for may have been removed or the link
        may be incorrect.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/studios"
          className="rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-black"
        >
          Explore studios
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-current/20 px-5 py-2.5 font-medium"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
