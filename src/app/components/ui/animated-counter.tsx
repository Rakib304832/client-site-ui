"use client"; // এই কম্পোনেন্ট ব্রাউজারে চলে (state ও effect ব্যবহার করে), তাই Next.js-কে এটা জানাতে হয়

import { useEffect, useState, useRef } from "react"; // state, ইফেক্ট ও DOM রেফারেন্সের জন্য React-এর হুক

type AnimatedCounterProps = { // কম্পোনেন্ট কী কী মান নেয় তা TypeScript-কে জানানোর জন্য
  value: number; // শেষে যে সংখ্যায় পৌঁছাবে, এটা ছাড়া গোনা অর্থহীন তাই বাধ্যতামূলক
  suffix?: string; // সংখ্যার পরে বসানোর লেখা (যেমন "+"), না দিলেও চলে তাই ঐচ্ছিক
  prefix?: string; // সংখ্যার আগে বসানোর লেখা (যেমন "$"), না দিলেও চলে তাই ঐচ্ছিক
  duration?: number; // অ্যানিমেশন কত মিলিসেকেন্ড চলবে, না দিলে ডিফল্ট মান ব্যবহার হবে
  decimals?: number; // দশমিকের পরে কয়টি অঙ্ক দেখাবে, না দিলে পূর্ণ সংখ্যা দেখাবে
}; // টাইপ ঘোষণা শেষ

/**
 * Counts up to value once the element becomes visible in the viewport.
 * Falls back to rendering the final value if IntersectionObserver is unavailable.
 */
export default function AnimatedCounter({
  value, // শেষ মান, প্রপ থেকে সরাসরি নেওয়া হয়
  suffix = "", // না দিলে খালি লেখা, যাতে পেজে "undefined" না দেখায়
  prefix = "", // না দিলে খালি লেখা, যাতে পেজে "undefined" না দেখায়
  duration = 1400, // ১.৪ সেকেন্ড, গোনা খুব দ্রুত বা ধীর না হওয়ার জন্য একটা ভালো ডিফল্ট
  decimals = 0, // ডিফল্টে পূর্ণ সংখ্যা, কারণ বেশিরভাগ কাউন্টারে দশমিক লাগে না
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState<number>(value); // পর্দায় এখন যে সংখ্যা দেখাচ্ছে, শুরুতে শেষ মান দিলে সার্ভার ও ব্রাউজারের আউটপুট মেলে
  const [started, setStarted] = useState(false); // অ্যানিমেশন একবার শুরু হয়েছে কি না, যাতে বারবার না চলে
  const ref = useRef<HTMLSpanElement>(null); // span-টা ধরে রাখার জন্য, কারণ observer-কে জানতে হবে কোন এলিমেন্ট দেখতে হবে

  useEffect(() => { // রেন্ডারের পরে চলে, তাই এখানে state বদলালে অসীম লুপ হয় না
    const node = ref.current; // span এলিমেন্টটা তুলে নেওয়া
    if (!node || started) return; // এলিমেন্ট না থাকলে বা অ্যানিমেশন আগেই হয়ে গেলে কিছু করার নেই

    if (!("IntersectionObserver" in window)) { // পুরনো ব্রাউজারে observer নেই; useEffect ব্রাউজারেই চলে তাই typeof window চেক লাগে না
      // display already starts at value, so no state update is needed here.
      return; // নিচের observer-এর কোড যেন এই ক্ষেত্রে না চলে
    } // fallback শেষ

    const startTime = Date.now(); // অ্যানিমেশন কখন শুরু হলো তা মনে রাখা, নইলে কতটা সময় গেছে হিসাব হবে না
    const decimalsMultiplier = Math.pow(10, decimals); // দশমিকের অঙ্ক অনুযায়ী গোল করার গুণক (যেমন ২ অঙ্কে ১০০)

    const observerCallback: IntersectionObserverCallback = (entries) => { // এলিমেন্ট দৃশ্যমান হলে এই ফাংশন চলে
      const [entry] = entries; // আমরা একটাই এলিমেন্ট দেখছি, তাই প্রথমটাই যথেষ্ট
      if (!entry.isIntersecting) return; // এখনো পর্দায় আসেনি, তাই অ্যানিমেশন শুরু করা যাবে না
      setStarted(true); // শুরু হয়ে গেছে চিহ্নিত করা, যাতে effect আবার অ্যানিমেশন না চালায়

      function tick() { // প্রতি ফ্রেমে সংখ্যা একটু করে বাড়ানোর ফাংশন
        const elapsed = Date.now() - startTime; // শুরু থেকে এ পর্যন্ত কত মিলিসেকেন্ড গেছে
        const progress = Math.min(elapsed / duration, 1); // অগ্রগতি ০ থেকে ১, ১-এর বেশি হতে দিলে সংখ্যা ছাড়িয়ে যেত
        // ease-out quartic
        const ease = 1 - Math.pow(1 - progress, 4); // শুরুতে দ্রুত, শেষে ধীর, যাতে গোনা স্বাভাবিক দেখায়
        const current =
          Math.round((0 + (value - 0) * ease) * decimalsMultiplier) / // ০ থেকে value পর্যন্ত বর্তমান মান বের করা
          decimalsMultiplier; // গোল করে নির্দিষ্ট দশমিক অঙ্কে আনা
        setDisplay(current); // পর্দায় নতুন সংখ্যা দেখানো, এটা কলব্যাকের ভেতরে তাই লুপ হয় না
        if (progress < 1) { // এখনো শেষ হয়নি
          requestAnimationFrame(tick); // পরের ফ্রেমে আবার চালানো, setInterval-এর চেয়ে মসৃণ দেখায়
        } // অগ্রগতি চেক শেষ
      } // tick শেষ
      requestAnimationFrame(tick); // প্রথম ফ্রেম থেকে অ্যানিমেশন শুরু করা
      observer.disconnect(); // একবার চালু হলে আর পর্দা পর্যবেক্ষণ লাগে না
    }; // কলব্যাক শেষ

    const observer = new IntersectionObserver(observerCallback, { // এলিমেন্ট পর্দায় আসা ধরার জন্য
      threshold: 0.15, // এলিমেন্টের ১৫% দেখা গেলেই শুরু, পুরোটা দেখার অপেক্ষা না করে
      rootMargin: "0px 0px -10% 0px", // নিচের ১০% বাদ দেওয়া, যাতে একদম কিনারায় আসার আগে শুরু না হয়
    }); // observer তৈরি শেষ
    observer.observe(node); // span-টাকে পর্যবেক্ষণ শুরু করা

    return () => observer.disconnect(); // কম্পোনেন্ট সরে গেলে observer বন্ধ করা, নইলে মেমরি লিক হয়
  }, [value, duration, decimals, started]); // এগুলোর কোনোটা বদলালে effect আবার চলবে, কারণ ভেতরে এগুলো ব্যবহার হয়েছে

  return ( // পর্দায় যা দেখাবে
    <span ref={ref} className="font-bold tabular-nums"> {/* ref দিয়ে observer-কে এলিমেন্ট দেওয়া হয়; tabular-nums-এ অঙ্কের প্রস্থ সমান থাকে, তাই গোনার সময় লেখা নড়ে না */}
      {prefix} {/* সংখ্যার আগের লেখা, যেমন "$" */}
      {decimals === 0 ? Math.floor(display) : display.toFixed(decimals)} {/* দশমিক না থাকলে পূর্ণ সংখ্যা, থাকলে নির্দিষ্ট অঙ্কে দেখানো */}
      {suffix} {/* সংখ্যার পরের লেখা, যেমন "+" */}
    </span>
  ); // JSX শেষ
} // কম্পোনেন্ট শেষ