"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Instagram, Linkedin, Mail, Send } from "lucide-react";
import BrandLogo from "@/app/components/brand-logo";
import { STUDIO_CATEGORIES } from "@/app/types/studio";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-bookings", label: "My Bookings" },
];

function XLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  if (pathname === "/login" || pathname === "/register") return null;

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      toast.error("Enter a valid email address to join the newsletter.");
      return;
    }
    toast.success("You are on the list. Studio drops land in your inbox soon.");
    setEmail("");
  }

  return (
    <footer className="mt-auto border-t border-current/10 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="StudioSpace home">
              <BrandLogo className="text-white" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              StudioSpace connects creators with remarkable photo studios, sound
              stages, podcast rooms, music suites, and workshops — booked by the
              hour, without the friction.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on X"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-amber-400 hover:text-amber-400"
              >
                <XLogo />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-amber-400 hover:text-amber-400"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-amber-400 hover:text-amber-400"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Quick links</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Popular spaces</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {STUDIO_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="text-zinc-400 transition hover:text-amber-400"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Studio notes</h2>
            <p className="mt-4 text-sm text-zinc-400">
              New spaces, host stories, and production tips. One thoughtful email
              a month.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="relative flex-1">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                aria-label="Subscribe to the newsletter"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-400 text-black transition hover:bg-amber-300"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-2 text-xs text-zinc-500">
              No spam. Unsubscribe whenever you like.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about#terms" className="transition hover:text-amber-400">
              Terms of service
            </Link>
            <Link href="/about#privacy" className="transition hover:text-amber-400">
              Privacy policy
            </Link>
            <Link href="/how-it-works#support" className="transition hover:text-amber-400">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
