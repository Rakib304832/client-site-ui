"use client"; // Next.js: makes this a client component (remove if not using Next.js)

import { useState, useEffect, useRef } from "react"; // React hooks for state, side effects, and DOM refs

const LOGO_SRC = ""; // PUT YOUR LOGO IMAGE PATH HERE, e.g. "/logo.png" (file inside the public folder)

type User = { name?: string; email?: string; image?: string };
type NavbarProps = {
  user?: User | null;
  currentPath?: string;
  onLogout?: () => void;
};

// Navigation links shown in the center
const LINKS = [
  { label: "Home", href: "/" }, // Home page link
  { label: "Explore Studios", href: "/studios" }, // Studios listing link
  { label: "How It Works", href: "/how-it-works" }, // Info page link
  { label: "About Us", href: "/about" }, // About page link
];

// Avatar: shows profile picture, or the first letter of the name if no picture
function Avatar({ user }: { user: User }) {
  const [broken, setBroken] = useState(false); // True if the image fails to load
  const letter = (user.name || user.email || "?").trim().charAt(0).toUpperCase(); // First letter of name (fallback: email)

  if (user.image && !broken) {
    return (
      <img
        src={user.image} // Profile picture URL (Google login gives this)
        alt={user.name || "Profile"} // Accessibility text
        referrerPolicy="no-referrer" // Needed so Google profile images load correctly
        onError={() => setBroken(true)} // If the image fails, switch to the letter avatar
        className="h-9 w-9 rounded-full object-cover" // Round 36px image
      />
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB43F] text-sm font-bold text-[#121115]">
      {letter /* Show the first letter inside an amber circle */}
    </span>
  );
}

// Main navbar. Props: user (null if logged out), currentPath, onLogout
export default function Navbar({ user = null, currentPath = "/", onLogout = () => {} }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu open/closed
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown open/closed
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggleTheme = () => setTheme((current) => {
    const next = current === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    return next;
  });
  const profileRef = useRef<HTMLDivElement>(null); // Reference to the dropdown wrapper (for outside-click)

  // Close the dropdown when clicking outside it or pressing Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false); // Click outside -> close
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false); // Escape key -> close
    document.addEventListener("mousedown", onClick); // Listen for clicks
    document.addEventListener("keydown", onKey); // Listen for key presses
    return () => {
      document.removeEventListener("mousedown", onClick); // Cleanup listener
      document.removeEventListener("keydown", onKey); // Cleanup listener
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#121115]/95 backdrop-blur"> {/* Sticky dark bar */}
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6"> {/* Layout row */}
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-white"> {/* Logo links home */}
          {LOGO_SRC && (
            <img
              src={LOGO_SRC} // Your logo picture path (set LOGO_SRC at the top)
              alt="StudioSpace logo" // Accessibility text
              className="h-9 w-9 object-contain" // Logo size 36px; change h-9 w-9 to resize
            />
          )}
          <span className="text-xl font-semibold tracking-tight">StudioSpace</span> {/* Brand name */}
        </a>

        {/* Center links (hidden on mobile) */}
        <ul className="hidden items-center gap-8 md:flex"> {/* Desktop-only list */}
          {LINKS.map((l) => {
            const active = currentPath === l.href; // Is this the current page?
            return (
              <li key={l.href}>
                <a
                  href={l.href} // Link destination
                  className={`relative pb-1 text-sm transition-colors ${
                    active ? "font-semibold text-white" : "text-white/60 hover:text-white" // Active = bright, others = dim
                  }`}
                >
                  {l.label} {/* Link text */}
                  {active && <span className="absolute inset-x-0 -bottom-1.5 h-0.5 rounded bg-[#FFB43F]" />} {/* Orange underline */}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} aria-label="Toggle theme"> {/* Your hook's toggle: switches the whole page theme */}
            {theme === "light" ? "🌙" : "☀️"} {/* Light theme -> moon icon, dark theme -> sun icon */}
          </button>

          {user ? (
            // ---------- LOGGED IN: avatar + dropdown ----------
            <div className="relative" ref={profileRef}> {/* Wrapper for dropdown positioning */}
              <button
                onClick={() => setProfileOpen((v) => !v)} // Click avatar -> open/close dropdown
                aria-haspopup="menu" // Tells screen readers a menu opens
                aria-expanded={profileOpen} // Current open state
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-white/5"
              >
                <Avatar user={user} /> {/* Picture or first letter */}
                <span className="hidden max-w-30 truncate text-sm font-medium text-white sm:block">
                  {user.name /* Show the user's name */}
                </span>
              </button>

              {profileOpen && (
                <div
                  role="menu" // Menu semantics
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#1b1a20] shadow-xl"
                >
                  <div className="border-b border-white/10 px-4 py-3"> {/* User info header */}
                    <p className="truncate text-sm font-semibold text-white">{user.name}</p> {/* Name */}
                    <p className="truncate text-xs text-white/50">{user.email}</p> {/* Email */}
                  </div>
                  <a
                    href="/profile" // View profile page
                    role="menuitem"
                    onClick={() => setProfileOpen(false)} // Close dropdown after click
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg> View profile {/* Profile option */}
                  </a>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false); // Close dropdown
                      onLogout(); // Run your logout function
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/5"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></svg> Logout {/* Logout option */}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ---------- LOGGED OUT: Login + Register ----------
            <>
              <a href="/login" className="hidden text-sm font-semibold text-white sm:block"> {/* Login link */}
                Login
              </a>
              <a
                href="/register" // Register page
                className="hidden rounded-lg bg-[#FFB43F] px-5 py-2.5 text-sm font-semibold text-[#121115] transition-colors hover:bg-[#ffc366] sm:block" // Amber button
              >
                Register
              </a>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)} // Open/close mobile menu
            aria-label="Toggle menu" // Accessibility label
            className="text-white md:hidden" // Only on mobile
          >
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            )} {/* Hamburger / close icon */}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-[#121115] px-6 py-4 md:hidden"> {/* Shown only on mobile */}
          <ul className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href} // Link destination
                  onClick={() => setMenuOpen(false)} // Close menu after tap
                  className={currentPath === l.href ? "font-semibold text-[#FFB43F]" : "text-white/70"} // Highlight active link
                >
                  {l.label}
                </a>
              </li>
            ))}
            {!user && ( // Login/Register inside mobile menu when logged out
              <li className="flex gap-3 pt-2">
                <a href="/login" className="font-semibold text-white">Login</a> {/* Login */}
                <a href="/register" className="rounded-lg bg-[#FFB43F] px-4 py-2 font-semibold text-[#121115]">Register</a> {/* Register */}
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

