"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-black shadow-lg transition opacity-100 translate-y-0 hover:scale-105 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">Scroll to top</span>
    </button>
  );
}
