import { Exam } from "@/types";

const INDUSTRY_COLORS: Record<string, string> = {
  Healthcare: "bg-blue-100 text-blue-800",
  Financial: "bg-emerald-100 text-emerald-800",
  Technology: "bg-purple-100 text-purple-800",
  Education: "bg-amber-100 text-amber-800",
  Government: "bg-red-100 text-red-800",
  Other: "bg-gray-100 text-gray-800",
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

interface FeaturedCertificationsProps {
  exams: Exam[];
}

export default function FeaturedCertifications({
  exams,
}: FeaturedCertificationsProps) {
  return (
    <section aria-labelledby="featured-heading" className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <StarIcon className="w-5 h-5 text-amber-400" />
        <h2
          id="featured-heading"
          className="font-heading font-bold text-xl text-navy"
        >
          Featured Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {exams.map((exam) => (
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
            <span
              className={`self-start text-xs font-medium px-2 py-1 rounded-full mb-3 ${
                INDUSTRY_COLORS[exam.industry_category] ||
                INDUSTRY_COLORS.Other
              }`}
            >
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
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
