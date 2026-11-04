import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Photo Studio",
    description: "Natural light, cyc walls, and styled sets.",
    image: "/studios/daylight.jpg",
  },
  {
    name: "Film Stage",
    description: "Sound stages, lighting rigs, and production rooms.",
    image: "/studios/studio-film.jpg",
  },
  {
    name: "Podcast Lounge",
    description: "Quiet rooms with broadcast mics and mixing desks.",
    image: "/studios/studio-podcast.jpg",
  },
  {
    name: "Music Suite",
    description: "Writing rooms, consoles, and live-ready gear.",
    image: "/studios/studio-music.jpg",
  },
  {
    name: "Workshop",
    description: "Open tables, tools, and room to get messy.",
    image: "/studios/studio-art.jpg",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <Image
          src="/studios/daylight.jpg"
          alt="A bright creative studio with natural light"
          fill
          priority
          loading="eager"
          className="object-cover opacity-35"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:py-32">
          <p className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
            Creative spaces, booked by the hour
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
            Find the right space for your next idea.
          </h1>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">
            Browse photo studios, film stages, podcast lounges, music suites, and
            workshops. Compare amenities, check availability, and book in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/studios"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Explore studios
            </Link>
            <Link
              href="/add-studio"
              className="rounded-xl border border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              List your space
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Browse by space type</h2>
            <p className="mt-1 text-sm opacity-70">
              Five categories, one place to book them all.
            </p>
          </div>
          <Link href="/studios" className="text-sm font-semibold underline">
            See all studios
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/studios?category=${encodeURIComponent(category.name)}`}
              className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white"
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="relative">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}

          <div className="flex min-h-56 flex-col justify-between rounded-2xl border border-amber-400 bg-amber-50 p-6 text-black">
            <div>
              <h3 className="text-xl font-semibold">Have a space?</h3>
              <p className="mt-1 text-sm text-black/70">
                Turn an empty room into income. List it in a few minutes and manage
                every booking from one dashboard.
              </p>
            </div>
            <Link
              href="/add-studio"
              className="mt-6 inline-flex w-fit rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white"
            >
              Start hosting
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
