"use client";

import { useEffect } from "react";
import { useActiveSection } from "@/app/components/active-section-context";

const SECTION_IDS = new Set(["home", "explore", "how-it-works", "about"]);

export default function ActiveSectionTracker() {
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && SECTION_IDS.has(hash)) {
      setActiveSection(hash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio,
          );
          const id = intersecting[0].target.getAttribute("id");
          if (id && SECTION_IDS.has(id)) {
            setActiveSection(id);
          }
        }
      },
      { rootMargin: "-15% 0px -85% 0px", threshold: 0 },
    );

    document.querySelectorAll("section[id]").forEach((section) =>
      observer.observe(section),
    );
    return () => observer.disconnect();
  }, [setActiveSection]);

  return null;
}
