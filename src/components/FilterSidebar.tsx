"use client";

import { IndustryCategory, ExamType } from "@/types";

const INDUSTRIES: IndustryCategory[] = [
  "Healthcare",
  "Financial",
  "Technology",
  "Education",
  "Government",
  "Other",
];

const EXAM_TYPES: ExamType[] = ["In-Center", "Remote", "Hybrid"];

interface FilterSidebarProps {
  selectedIndustries: Set<IndustryCategory>;
  onIndustryToggle: (industry: IndustryCategory) => void;
  selectedExamTypes: Set<ExamType>;
  onExamTypeToggle: (examType: ExamType) => void;
  sortAlpha: boolean;
  onSortToggle: () => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  selectedIndustries,
  onIndustryToggle,
  selectedExamTypes,
  onExamTypeToggle,
  sortAlpha,
  onSortToggle,
  onClearFilters,
}: FilterSidebarProps) {
  const hasFilters = selectedIndustries.size > 0 || selectedExamTypes.size > 0;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-md border border-gray-200 p-5 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-navy">
            Filters
          </h2>
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-mint hover:text-navy transition-colors font-body"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Industry */}
        <div className="mb-6">
          <h3 className="font-heading font-medium text-sm text-navy mb-3 uppercase tracking-wide">
            Industry
          </h3>
          <div className="space-y-2">
            {INDUSTRIES.map((industry) => (
              <label
                key={industry}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedIndustries.has(industry)}
                  onChange={() => onIndustryToggle(industry)}
                  className="w-4 h-4 rounded border-gray-300 text-mint focus:ring-mint accent-mint"
                />
                <span className="text-sm font-body text-gray-700 group-hover:text-navy transition-colors">
                  {industry}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Exam Type */}
        <div className="mb-6">
          <h3 className="font-heading font-medium text-sm text-navy mb-3 uppercase tracking-wide">
            Exam Type
          </h3>
          <div className="space-y-2">
            {EXAM_TYPES.map((examType) => (
              <label
                key={examType}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedExamTypes.has(examType)}
                  onChange={() => onExamTypeToggle(examType)}
                  className="w-4 h-4 rounded border-gray-300 text-mint focus:ring-mint accent-mint"
                />
                <span className="text-sm font-body text-gray-700 group-hover:text-navy transition-colors">
                  {examType}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={sortAlpha}
              onChange={onSortToggle}
              className="w-4 h-4 rounded border-gray-300 text-mint focus:ring-mint accent-mint"
            />
            <span className="text-sm font-body text-gray-700 group-hover:text-navy transition-colors">
              Sort A–Z
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
