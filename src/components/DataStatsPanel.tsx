import { Exam, IndustryCategory } from "@/types";

interface DataStatsPanelProps {
  exams: Exam[];
  totalExams: number;
  selectedIndustries: Set<IndustryCategory>;
  onIndustryToggle: (cat: IndustryCategory) => void;
}

const CATEGORY_STYLES: Record<string, { pill: string; active: string }> = {
  Healthcare:  { pill: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",   active: "bg-blue-600 text-white border-blue-600" },
  Financial:   { pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", active: "bg-emerald-600 text-white border-emerald-600" },
  Technology:  { pill: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", active: "bg-purple-600 text-white border-purple-600" },
  Government:  { pill: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",       active: "bg-red-600 text-white border-red-600" },
  Education:   { pill: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", active: "bg-amber-500 text-white border-amber-500" },
  Other:       { pill: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",   active: "bg-gray-600 text-white border-gray-600" },
};

export default function DataStatsPanel({ exams, totalExams, selectedIndustries, onIndustryToggle }: DataStatsPanelProps) {
  const categoryCounts = exams.reduce<Record<string, number>>((acc, e) => {
    acc[e.industry_category] = (acc[e.industry_category] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <span className="font-body text-sm text-gray-400 mr-1 shrink-0">
        {totalExams.toLocaleString()} programs &mdash;
      </span>
      {sorted.map(([cat, count]) => {
        const isActive = selectedIndustries.has(cat as IndustryCategory);
        const styles = CATEGORY_STYLES[cat] ?? CATEGORY_STYLES.Other;
        return (
          <button
            key={cat}
            onClick={() => onIndustryToggle(cat as IndustryCategory)}
            className={`font-body text-xs font-medium px-3 py-1 rounded-full border transition-colors cursor-pointer ${
              isActive ? styles.active : styles.pill
            }`}
          >
            {cat} <span className="opacity-70">{count}</span>
          </button>
        );
      })}
      {selectedIndustries.size > 0 && (
        <button
          onClick={() => selectedIndustries.forEach(cat => onIndustryToggle(cat))}
          className="font-body text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors ml-1"
        >
          clear
        </button>
      )}
    </div>
  );
}
