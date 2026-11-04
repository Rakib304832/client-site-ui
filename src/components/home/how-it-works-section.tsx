import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  CheckCircle2,
  Clapperboard,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";

const creatorSteps = [
  {
    number: "01",
    title: "Discover spaces",
    description:
      "Search by category, location, budget, capacity, or the kind of light you need. Every listing shows the essentials up front.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select shoot hours",
    description:
      "Pick a date, start time, and duration. The booking request includes your guest count and a clear price breakdown.",
    icon: CalendarRange,
  },
  {
    number: "03",
    title: "Book instantly",
    description:
      "Send the request. The host confirms, and every pending and confirmed booking is checked for time conflicts.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Create & produce",
    description:
      "Load in, make the work, and manage the booking from your dashboard. Cancel a pending request if plans change.",
    icon: Clapperboard,
  },
];

const hostSteps = [
  {
    title: "Create your listing",
    description:
      "Add the space, category, hourly rate, deposit, capacity, amenities, photos, and the details that make the room special.",
  },
  {
    title: "Set the terms",
    description:
      "You control the rate, deposit, and guest capacity. Read-only host details are attached to every listing automatically.",
  },
  {
    title: "Review requests",
    description:
      "Pending requests appear in My Bookings. Confirm the ones that fit your schedule, or decline with one click.",
  },
  {
    title: "Get paid for the hours",
    description:
      "Mark a confirmed booking as completed when the shoot wraps. Keep every listing and reservation in one place.",
  },
];

const assurances = [
  {
    title: "Liability protection",
    description:
      "Confirmed bookings include host liability cover, so the unexpected stays small.",
    icon: ShieldCheck,
  },
  {
    title: "Verified profiles",
    description:
      "Creators and hosts confirm their identity before the first conversation.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment safety",
    description:
      "Condition checklists and deposit protection for the gear that matters.",
    icon: Wrench,
  },
  {
    title: "24/7 host support",
    description:
      "Real humans on call for the last-minute question or the middle-of-the-night worry.",
    icon: Headphones,
  },
];

const faqs = [
  {
    question: "When am I charged?",
    answer:
      "You are not charged when you send a request. The host reviews the date and time first. The booking total is calculated from the hourly rate and duration, with the refundable security deposit shown separately.",
  },
  {
    question: "What happens if a slot is already taken?",
    answer:
      "Every new request is checked against pending and confirmed bookings for that studio. If the time overlaps, the request is rejected with a clear message so you can choose another slot.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes. Pending requests can be cancelled from My Bookings. Confirmed bookings are managed with the host, and the status is always visible on the booking card.",
  },
  {
    question: "How do I list my own space?",
    answer:
      "Create an account, choose Add New Studio, and complete the listing form. You can edit or delete the listing at any time from My Studio Listings.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="flex flex-col">
      <section className="relative isolate overflow-hidden border-b border-current/10 bg-zinc-950 py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            How StudioSpace works
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            From an open tab to a booked room.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            StudioSpace is built around one clear loop: discover a space, choose
            your hours, send a request, and get to work. Hosts get the same
            clarity from the other side of the booking.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Explore studios
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/add-studio"
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Host your space
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            For creators
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps to a production-ready room
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            No group-chat archaeology. No mystery pricing. Just a clear path from
            search to call sheet.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {creatorSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="relative flex h-full flex-col rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60"
              >
                <span className="absolute right-5 top-5 text-4xl font-bold tracking-tight text-amber-400/25">
                  {step.number}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-70">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-current/10 bg-white/60 py-16 dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              For hosts
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Turn the room you already have into a booking calendar.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-70">
              Listing is intentionally simple. You keep control of the rate,
              deposit, capacity, and availability, while guests get the detail
              they need to say yes.
            </p>
            <Link
              href="/add-studio"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              List your first space
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {hostSteps.map((step, index) => (
              <article
                key={step.title}
                className="flex gap-4 rounded-2xl border border-current/10 bg-white p-5 dark:bg-zinc-900/60"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400 text-sm font-bold text-black">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed opacity-70">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            Host guarantee & creator support
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            The safety net around the booking.
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            A marketplace only works when both sides feel covered. These are the
            assurances behind every confirmed booking.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-current/10 bg-white p-6 dark:bg-zinc-900/60"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-70">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-current/10 bg-white/60 py-16 dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
              Good to know
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Questions before the first booking
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-current/10 bg-white p-5 open:border-amber-400/50 dark:bg-zinc-900/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {faq.question}
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-amber-500 transition group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed opacity-70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-amber-400/40 bg-amber-50 px-6 py-10 text-center dark:bg-amber-950/20">
            <Sparkles className="h-7 w-7 text-amber-500" aria-hidden="true" />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to find the room?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed opacity-70">
              Browse the collection, compare the details, and send your first
              booking request in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/studios"
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Explore studios
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-current/25 px-6 py-3 text-sm font-semibold transition hover:border-amber-500"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
