"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Swiper's base styles. Without these the slides stack vertically instead of sliding.
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  images: string[];
  title: string;
};

export default function GalleryCarousel({ images, title }: Props) {
  return (
    // Swiper needs a parent with a set width. The aspect ratio keeps the image box the same size for every studio.
    <div className="w-full overflow-hidden rounded-2xl">
      <Swiper
        // Navigation adds the prev and next arrows, Pagination adds the dots below.
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        // loop repeats the gallery at the end, so a single-image studio still works without errors.
        loop={images.length > 1}
        className="aspect-[4/3] w-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <img
              src={src}
              // Each slide gets a numbered alt text, so screen readers know which image is which.
              alt={`${title} photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}