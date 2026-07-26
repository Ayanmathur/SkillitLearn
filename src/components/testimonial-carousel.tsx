"use client";

import React from "react";

export interface Testimonial {
  name: string;
  path: string;
  quote: string;
  image?: string;
}

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: Props) {
  // Duplicate array for seamless infinite marquee looping
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative w-full overflow-hidden py-4 group">
      {/* Gradient Fades for Left and Right edges */}
      <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 z-10 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 md:w-24 z-10 bg-gradient-to-l from-surface to-transparent pointer-events-none" />

      {/* Infinite Marquee Track */}
      <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max">
        {loopedTestimonials.map((t, idx) => (
          <div
            key={`${t.name}-${idx}`}
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px]
                       bg-surface-raised rounded-2xl p-6
                       border border-border-color
                       shadow-sm hover:shadow-md hover:border-accent/40
                       transition-all duration-300 flex flex-col justify-between"
          >
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-accent/40 mb-3"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>
              <p className="text-text-secondary text-sm leading-relaxed italic">
                &quot;{t.quote}&quot;
              </p>
            </div>

            {/* Clean User Details without Avatar Photo */}
            <div className="pt-3 border-t border-border-color/60">
              <div className="font-bold text-sm text-text-primary">{t.name}</div>
              <div className="text-xs text-accent font-semibold mt-0.5">{t.path}</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
