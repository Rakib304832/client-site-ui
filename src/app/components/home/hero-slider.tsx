"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    eyebrow: "Creative spaces, booked by the hour",
    title: "Find the right space for your next idea.",
    description:
      "Browse photo studios, film stages, podcast lounges, music suites, and workshops. Compare amenities, check availability, and book in minutes.",
    image: "/studios/daylight.jpg",
    primary: { href: "/studios", label: "Explore studios" },
    secondary: { href: "/add-studio", label: "Host your space" },
  },
  {
    eyebrow: "Stages built for moving pictures",
    title: "Shoot bigger. Book a stage that keeps up.",
    description:
      "Sound stages, lighting rigs, and production rooms for crews that need space, power, and a calm place to make the next frame.",
    image: "/studios/studio-film.jpg",
    primary: { href: "/studios?category=Film%20Stage", label: "Browse film stages" },
    secondary: { href: "/how-it-works", label: "How booking works" },
  },
  {
    eyebrow: "Rooms for voices and sound",
    title: "Press record in a room that sounds right.",
    description:
      "Acoustically treated podcast lounges and music suites with broadcast mics, mixing desks, and the quiet you need to get the take.",
    image: "/studios/studio-podcast.jpg",
    primary: {
      href: "/studios?category=Podcast%20Lounge",
      label: "Find a podcast room",
    },
    secondary: { href: "/studios?category=Music%20Suite", label: "Explore music suites" },
  },
];

export default function HeroSlider() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="studio-hero h-[540px] w-full sm:h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-zinc-950/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

              <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4 pb-16 pt-12">
                <p className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300 backdrop-blur">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                  {slide.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={slide.primary.href}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
                  >
                    {slide.primary.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={slide.secondary.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    {slide.secondary.label}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
