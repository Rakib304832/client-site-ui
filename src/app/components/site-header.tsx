"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";
import BrandLogo from "@/app/components/brand-logo";
import SafeImage from "@/app/components/SafeImage";
import ThemeToggle from "@/app/components/theme-toggle";
import { useActiveSection } from "@/app/components/active-section-context";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];

const accountLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: Plus },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { activeSection } = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (pathname === "/login" || pathname === "/register") return null;

  const isActive = (href: string) => {
    if (href === "/#home") {
      return pathname === "/" && (activeSection === "" || activeSection === "home");
    }
    if (href === "/#how-it-works") {
      return pathname === "/" && activeSection === "how-it-works";
    }
    if (href === "/#about") {
      return pathname === "/" && activeSection === "about";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const signOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message ?? "Could not sign out. Please try again.");
        return;
      }
      toast.success("You have been signed out.");
      closeMenus();
      router.push("/");
      router.refresh();
    } catch (signOutError) {
      toast.error(
        signOutError instanceof Error
          ? signOutError.message
          : "Could not sign out. Please try again.",
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-current/10 bg-white/85 backdrop-blur-xl dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link
          href="/"
          aria-label="StudioSpace home"
          className="shrink-0"
          onClick={closeMenus}
        >
          <BrandLogo />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 text-sm lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-amber-400 font-semibold text-black"
                    : "hover:bg-current/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            <span
              className="h-9 w-9 animate-pulse rounded-full bg-current/10"
              aria-hidden="true"
            />
          ) : session?.user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-current/15 py-1 pl-1 pr-2.5 transition hover:border-amber-400"
              >
                <span className="relative h-8 w-8 overflow-hidden rounded-full">
                  {session.user.image ? (
                    <SafeImage
                      src={session.user.image}
                      alt={session.user.name || "Your profile"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-amber-400 text-sm font-bold text-black">
                      {(session.user.name || session.user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
                  {session.user.name || session.user.email}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition ${accountOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-current/10 bg-white p-2 shadow-2xl dark:bg-zinc-900"
                >
                  <div className="border-b border-current/10 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold">
                      {session.user.name || "StudioSpace member"}
                    </p>
                    <p className="truncate text-xs opacity-60">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    {accountLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition hover:bg-amber-400/15"
                        >
                          <Icon className="h-4 w-4 opacity-70" aria-hidden="true" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-current/10 pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={signOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                onClick={closeMenus}
                className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-current/5"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-lg border border-current/20 lg:hidden"
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-current/10 bg-white px-4 py-4 dark:bg-zinc-950 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  isActive(link.href)
                    ? "bg-amber-400 font-semibold text-black"
                    : "hover:bg-current/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!session?.user ? (
            <div className="mt-3 flex gap-2 border-t border-current/10 pt-3 sm:hidden">
              <Link
                href="/login"
                onClick={closeMenus}
                className="flex-1 rounded-lg border border-current/20 px-3 py-2 text-center text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-center text-sm font-semibold text-black"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="mt-3 grid gap-1 border-t border-current/10 pt-3">
              {accountLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:bg-current/5"
                  >
                    <Icon className="h-4 w-4 opacity-70" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
}
