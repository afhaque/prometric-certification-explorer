"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterSidebar from "@/components/FilterSidebar";
import ExamCard from "@/components/ExamCard";
import StatsBanner from "@/components/StatsBanner";
import Footer from "@/components/Footer";
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredExams.map((exam) => (
                    <ExamCard key={exam.code} exam={exam} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <StatsBanner />
      <Footer />
    </div>
  );
}
