"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/studios", label: "Explore" },
  { href: "/my-listings", label: "My Listings" },
  { href: "/my-bookings", label: "My Bookings" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (pathname === "/login" || pathname === "/register") return null;

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-current/10 bg-white/80 backdrop-blur dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Studio<span className="text-amber-500">Space</span>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 transition ${
                  active ? "bg-amber-400 font-semibold text-black" : "hover:bg-current/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {isPending ? null : session?.user ? (
            <>
              <span className="hidden max-w-40 truncate opacity-70 sm:inline">
                {session.user.name || session.user.email}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg border border-current/20 px-3 py-2 font-medium hover:border-amber-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-medium hover:bg-current/5"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
