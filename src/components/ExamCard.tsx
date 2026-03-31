import { Exam } from "@/types";

const INDUSTRY_COLORS: Record<string, string> = {
  Healthcare: "bg-blue-100 text-blue-800",
  Financial: "bg-emerald-100 text-emerald-800",
  Technology: "bg-purple-100 text-purple-800",
  Education: "bg-amber-100 text-amber-800",
  Government: "bg-red-100 text-red-800",
  Other: "bg-gray-100 text-gray-800",
};

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-5 flex flex-col hover:shadow-md hover:border-mint/40 transition-all duration-200">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-heading font-semibold text-base text-navy leading-snug">
          {exam.name}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
            INDUSTRY_COLORS[exam.industry_category] || INDUSTRY_COLORS.Other
          }`}
        >
          {exam.industry_category}
        </span>
      </div>
      <p className="text-sm font-body text-gray-600 mb-4 leading-relaxed flex-1">
        {exam.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-xs font-body text-gray-400 uppercase tracking-wide">
          {exam.exam_type}
        </span>
        <a
          href={exam.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-mint hover:text-navy transition-colors font-body"
        >
          Learn More
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
  );
}
