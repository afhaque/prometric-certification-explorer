import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import examsData from "../../../../data/exams.json";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const examList = examsData
  .map(
    (e: { name: string; industry_category: string; exam_type: string; description: string; link: string }) =>
      `- ${e.name} (${e.industry_category}, ${e.exam_type}): ${e.description} | Learn more: ${e.link}`
  )
  .join("\n");

const SYSTEM_PROMPT = `You are a friendly and knowledgeable certification advisor for Prometric, one of the world's leading test delivery providers.

Your job is to help users find the right professional certification exam for their career goals. Ask clarifying questions about their profession, experience level, and goals to narrow down the best options. When recommending certifications, always include the link so users can learn more.

Here is the full list of Prometric certification exams you can recommend:

${examList}

Guidelines:
- Keep responses concise and conversational
- Ask one or two targeted questions before recommending
- Recommend 2–4 exams at most per response, with a brief reason for each
- Always include the exam link when recommending
- If the user asks something unrelated to certifications, gently redirect them
- Be warm, encouraging, and professional
- DO NOT recommend certifications that are not in the provided list.
- DO NOT talk about any subject not related to certifications `;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
