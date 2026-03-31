export interface Exam {
  code: string;
  name: string;
  industry_category: IndustryCategory;
  exam_type: ExamType;
  description: string;
  link: string;
}

export type IndustryCategory =
  | "Healthcare"
  | "Financial"
  | "Technology"
  | "Education"
  | "Government"
  | "Other";

export type ExamType = "In-Center" | "Remote" | "Hybrid";
