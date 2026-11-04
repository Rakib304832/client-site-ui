import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/app/components/brand-logo";
import ThemeToggle from "@/app/components/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 p-4 dark:bg-zinc-950">
      <Image
        src="/map.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
      />
      <div className="absolute left-4 top-4 z-10">
        <Link href="/" aria-label="StudioSpace home">
          <BrandLogo />
        </Link>
      </div>
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-[#BEF452]/70 bg-white/90 p-6 shadow-2xl backdrop-blur-md dark:bg-zinc-900/90 sm:p-8">
        {children}
      </div>
    </main>
  );
}
