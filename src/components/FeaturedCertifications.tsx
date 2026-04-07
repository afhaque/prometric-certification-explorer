"use client";

import { useState, useRef } from "react";
import { Exam } from "@/types";

const INDUSTRY_COLORS: Record<string, string> = {
  Healthcare: "bg-blue-100 text-blue-800",
  Financial: "bg-emerald-100 text-emerald-800",
  Technology: "bg-purple-100 text-purple-800",
  Education: "bg-amber-100 text-amber-800",
  Government: "bg-red-100 text-red-800",
  Other: "bg-gray-100 text-gray-800",
};

const PAGE_SIZE = 3;

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
  </svg>
);

interface FeaturedCertificationsProps {
  exams: Exam[];
}

export default function FeaturedCertifications({ exams }: FeaturedCertificationsProps) {
  const [page, setPage] = useState(0);
  // "enter-left" = new page slides in from left (going back)
  // "enter-right" = new page slides in from right (going forward)
  const [animClass, setAnimClass] = useState("");
  const animating = useRef(false);
  const totalPages = Math.ceil(exams.length / PAGE_SIZE);

  const navigate = (dir: "prev" | "next") => {
    if (animating.current) return;
    animating.current = true;

    const entering = dir === "next" ? "enter-right" : "enter-left";
    setAnimClass(entering);

    setPage(p => dir === "next"
      ? (p + 1) % totalPages
      : (p - 1 + totalPages) % totalPages
    );

    // Clear animation class after transition ends
    setTimeout(() => {
      setAnimClass("");
      animating.current = false;
    }, 340);
  };

  const visible = exams.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section aria-labelledby="featured-heading" className="mb-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-amber-400" />
          <h2 id="featured-heading" className="font-heading font-bold text-xl text-navy">
            Featured Certifications
          </h2>
        </div>

        {/* Arrows + page indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("prev")}
            aria-label="Previous certifications"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-navy hover:text-navy hover:bg-gray-50 transition-colors disabled:opacity-30"
            disabled={totalPages <= 1}
          >
            <ChevronIcon direction="left" />
          </button>

          <span className="font-body text-xs text-gray-400 tabular-nums w-10 text-center">
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => navigate("next")}
            aria-label="Next certifications"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-navy hover:text-navy hover:bg-gray-50 transition-colors disabled:opacity-30"
            disabled={totalPages <= 1}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      {/* Carousel viewport */}
      <div className="overflow-hidden">
        <div
          key={page}
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${animClass}`}
          style={{ animation: animClass ? undefined : "none" }}
        >
          {visible.map((exam) => (
            <div
              key={exam.code}
              className="relative bg-gradient-to-br from-white to-mint/5 rounded-lg border border-mint/30 p-6 flex flex-col shadow-sm hover:shadow-md hover:border-mint/60 transition-all duration-200"
            >
              {/* Featured badge */}
              <span className="absolute top-4 right-4 flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-200">
                <StarIcon className="w-3 h-3" />
                Featured
              </span>

              {/* Industry badge */}
              <span className={`self-start text-xs font-medium px-2 py-1 rounded-full mb-3 ${INDUSTRY_COLORS[exam.industry_category] ?? INDUSTRY_COLORS.Other}`}>
                {exam.industry_category}
              </span>

              <h3 className="font-heading font-semibold text-lg text-navy leading-snug mb-2 pr-16">
                {exam.name}
              </h3>

              <p className="text-sm font-body text-gray-600 mb-5 leading-relaxed flex-1">
                {exam.description}
              </p>

              <div className="mt-auto pt-4 border-t border-mint/20 flex items-center justify-between">
                <span className="text-xs font-body text-gray-400 uppercase tracking-wide">
                  {exam.exam_type}
                </span>
                <a
                  href={exam.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium font-body bg-mint text-white px-3 py-1.5 rounded-md hover:bg-navy transition-colors"
                >
                  Learn More
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i > page ? "next" : "prev")}
            aria-label={`Go to page ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              i === page ? "bg-navy w-4" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .enter-right { animation: slideInRight 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .enter-left  { animation: slideInLeft  0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      `}</style>
    </section>
  );
}
