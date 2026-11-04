import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const values = [
  {
    title: "Rooms with a point of view",
    description:
      "We look for spaces with personality, good light, and the details that make a shoot easier. Not every room needs to look the same.",
    icon: Sparkles,
  },
  {
    title: "Clear terms, both ways",
    description:
      "Rates, deposits, capacity, and status are visible up front. Hosts and creators should never have to guess what happens next.",
    icon: ShieldCheck,
  },
  {
    title: "People before platforms",
    description:
      "Behind every listing is a host with a schedule and a creator with a deadline. Support is staffed by humans who understand both.",
    icon: HeartHandshake,
  },
  {
    title: "Access for the next idea",
    description:
      "A great room should not be locked behind a phone call and a deposit wire. Hourly booking opens production to more people.",
    icon: Users,
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="flex flex-col">
      <section className="relative isolate overflow-hidden border-b border-current/10 bg-zinc-950 py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.2),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            About StudioSpace
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            A marketplace built for the people who make the work.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            StudioSpace is a peer-to-peer home for creative production space.
            Photographers, filmmakers, podcasters, musicians, and workshop hosts
            list the rooms they know; creators book them by the hour.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Explore the collection
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#how-it-works"
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            Why we built it
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            The best production room is often someone else&apos;s.
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed opacity-80 sm:text-base">
          <p>
            A photographer needs a cyc wall for two hours. A podcast team needs a
            quiet room with the right mics. A workshop host has a table and a
            weekend to fill. The space exists; the booking process is usually the
            hard part.
          </p>
          <p>
            StudioSpace turns that inventory into an hourly marketplace with
            transparent pricing, clear availability signals, and a booking record
            both sides can trust. Hosts keep control of their rooms. Creators get
            a fast path from search to shoot.
          </p>
          <p>
            We are not trying to be every venue. We are building a focused
            collection of creative spaces with enough detail to make a confident
            decision — and enough support to handle the day-of surprises.
          </p>
        </div>
      </section>

      <section className="border-y border-current/10 bg-white/60 py-16 dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              What we care about
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Four standards behind every listing
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="flex gap-4 rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed opacity-70">
                      {value.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60">
            <BadgeCheck className="h-6 w-6 text-amber-500" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">Verified people</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              Creators and hosts sign in through a real account. Profiles carry a
              name, email, and optional photo so the first conversation starts
              with context.
            </p>
          </article>
          <article className="rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60">
            <ShieldCheck className="h-6 w-6 text-amber-500" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">Deposits with a paper trail</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              Security deposits are shown separately from the hourly total. The
              booking record keeps the rate, duration, and status in one place.
            </p>
          </article>
          <article className="rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60">
            <HeartHandshake className="h-6 w-6 text-amber-500" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">Support that answers</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              Booking questions, listing issues, and day-of changes go to a real
              support team. The goal is a resolved production, not a ticket
              number.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-current/10 bg-white/60 py-16 dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-2">
          <article id="terms" className="scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              Terms of service
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              A short version of the agreement
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed opacity-75">
              <p>
                StudioSpace connects hosts and creators. The host is responsible
                for the accuracy of the listing, the condition of the space, and
                the terms shown at booking. The creator is responsible for the
                guest count, the agreed hours, and leaving the space as found.
              </p>
              <p>
                A booking request is not a confirmed reservation until the host
                accepts it. Pending requests may be cancelled from My Bookings.
                Confirmed bookings are managed with the host and the platform
                support team.
              </p>
              <p>
                Security deposits are refundable after the space is checked.
                Damage, overtime, or missing equipment may be deducted from the
                deposit according to the listing terms.
              </p>
            </div>
          </article>

          <article id="privacy" className="scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              Privacy policy
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              What we collect and why
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed opacity-75">
              <p>
                We store the account details you provide, the listings you
                publish, and the bookings you create. This information is used to
                run the marketplace, show host details on a listing, and keep a
                record of each reservation.
              </p>
              <p>
                Authentication is handled by Better Auth with a secure session
                cookie. Passwords are never shown back to you or shared with
                hosts. Google sign-in follows the permissions you approve on the
                Google consent screen.
              </p>
              <p>
                We do not sell personal data. Support and safety requests may be
                reviewed by the StudioSpace team to resolve a booking issue or
                enforce the terms above.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-amber-400/40 bg-amber-50 px-6 py-10 text-center dark:bg-amber-950/20">
          <Sparkles className="h-7 w-7 text-amber-500" aria-hidden="true" />
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Find a room that fits the work.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed opacity-70">
            Browse the collection or put your own space on the map. Either way,
            the next production starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/studios"
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Explore studios
            </Link>
            <Link
              href="/add-studio"
              className="rounded-lg border border-current/25 px-6 py-3 text-sm font-semibold transition hover:border-amber-500"
            >
              Host your space
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
