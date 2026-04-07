"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterSidebar from "@/components/FilterSidebar";
import ExamCard from "@/components/ExamCard";
import FeaturedCertifications from "@/components/FeaturedCertifications";
import DataStatsPanel from "@/components/DataStatsPanel";
import StatsBanner from "@/components/StatsBanner";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { Exam, IndustryCategory, ExamType } from "@/types";
import examsData from "../../data/exams.json";

const exams: Exam[] = examsData as Exam[];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<
    Set<IndustryCategory>
  >(new Set());
  const [selectedExamTypes, setSelectedExamTypes] = useState<Set<ExamType>>(
    new Set()
  );
  const [sortAlpha, setSortAlpha] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState<"next" | "prev">("next");
  const [gridKey, setGridKey] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const goToPage = (next: number) => {
    setPageDirection(next > currentPage ? "next" : "prev");
    setGridKey(k => k + 1);
    setCurrentPage(next);
  };

  // Pick 3 random exams once on mount; must be client-only to avoid hydration mismatch
  const [featuredExams, setFeaturedExams] = useState<Exam[]>([]);
  useEffect(() => {
    const shuffled = [...exams].sort(() => Math.random() - 0.5);
    setFeaturedExams(shuffled.slice(0, 9));
  }, []);

  const filteredExams = useMemo(() => {
    let result = exams;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (exam) =>
          exam.name.toLowerCase().includes(q) ||
          exam.code.toLowerCase().includes(q) ||
          exam.description.toLowerCase().includes(q)
      );
    }

    if (selectedIndustries.size > 0) {
      result = result.filter((exam) =>
        selectedIndustries.has(exam.industry_category)
      );
    }

    if (selectedExamTypes.size > 0) {
      result = result.filter((exam) => selectedExamTypes.has(exam.exam_type));
    }

    if (sortAlpha) {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedIndustries, selectedExamTypes, sortAlpha]);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setPageDirection("next");
    setGridKey(k => k + 1);
    setCurrentPage(1);
  }, [filteredExams]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleIndustryToggle = (industry: IndustryCategory) => {
    setSelectedIndustries((prev) => {
      const next = new Set(prev);
      if (next.has(industry)) next.delete(industry);
      else next.add(industry);
      return next;
    });
  };

  const handleExamTypeToggle = (examType: ExamType) => {
    setSelectedExamTypes((prev) => {
      const next = new Set(prev);
      if (next.has(examType)) next.delete(examType);
      else next.add(examType);
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedIndustries(new Set());
    setSelectedExamTypes(new Set());
    setSortAlpha(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalResults={filteredExams.length}
      />

      <main id="programs" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <DataStatsPanel
            exams={filteredExams}
            totalExams={exams.length}
            selectedIndustries={selectedIndustries}
            onIndustryToggle={handleIndustryToggle}
          />
          <FeaturedCertifications exams={featuredExams} />

          <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar
              selectedIndustries={selectedIndustries}
              onIndustryToggle={handleIndustryToggle}
              selectedExamTypes={selectedExamTypes}
              onExamTypeToggle={handleExamTypeToggle}
              sortAlpha={sortAlpha}
              onSortToggle={() => setSortAlpha((prev) => !prev)}
              onClearFilters={handleClearFilters}
            />

            <div className="flex-1">
              {filteredExams.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-heading text-xl text-gray-400">
                    No programs match your search.
                  </p>
                  <p className="font-body text-sm text-gray-400 mt-2">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <>
                <div className="overflow-hidden">
                  <div
                    key={gridKey}
                    className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${pageDirection === "next" ? "anim-slide-next" : "anim-slide-prev"}`}
                  >
                    {paginatedExams.map((exam) => (
                      <ExamCard key={exam.code} exam={exam} />
                    ))}
                  </div>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-body rounded-md border border-gray-200 text-navy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                        if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) {
                          acc.push("...");
                        }
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-body text-sm">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => goToPage(item as number)}
                            className={`w-9 h-9 text-sm font-body rounded-md border transition-colors ${
                              currentPage === item
                                ? "bg-mint text-white border-mint"
                                : "border-gray-200 text-navy hover:bg-gray-50"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-body rounded-md border border-gray-200 text-navy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}

                <style>{`
                  @keyframes slideNextIn {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                  }
                  @keyframes slidePrevIn {
                    from { opacity: 0; transform: translateX(-40px); }
                    to   { opacity: 1; transform: translateX(0); }
                  }
                  .anim-slide-next { animation: slideNextIn 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
                  .anim-slide-prev { animation: slidePrevIn 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
                `}</style>
                </>              )}
            </div>
          </div>
        </div>
      </main>

      <StatsBanner />
      <Footer />
      <ChatBox />
    </div>
  );
}
