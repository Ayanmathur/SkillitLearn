"use client";

import { useRef } from "react";
import Image from "next/image";

export interface Testimonial {
  name: string;
  path: string;
  quote: string;
  image: string;
}

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 
                   w-12 h-12 rounded-full bg-white dark:bg-surface-overlay border border-[var(--border-color)] shadow-lg 
                   flex items-center justify-center text-text-primary hover:text-accent hover:border-accent
                   transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-4 px-2
                   /* Hide scrollbar */
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="flex-shrink-0 w-[85vw] sm:w-[350px] md:w-[calc(33.333%-1rem)] snap-start
                       bg-surface-raised rounded-2xl p-6
                       border border-[var(--border-color)]
                       shadow-sm hover:shadow-card
                       transition-all duration-300"
          >
            <div className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-accent/30 mb-2"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"></path>
              </svg>
              <p className="text-text-secondary text-sm leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/10 flex-shrink-0 border border-accent/20">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-sm text-text-primary">
                  {t.name}
                </div>
                <div className="text-xs text-accent font-medium">{t.path}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 
                   w-12 h-12 rounded-full bg-white dark:bg-surface-overlay border border-[var(--border-color)] shadow-lg 
                   flex items-center justify-center text-text-primary hover:text-accent hover:border-accent
                   transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
}
