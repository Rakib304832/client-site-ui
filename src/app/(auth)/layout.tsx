import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 p-4">
      <Image
        src="/map.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-[#BEF452] bg-gray-200 p-6 shadow-lg">
        {children}
      </div>
    </main>
  );
}