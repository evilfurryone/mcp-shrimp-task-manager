import { z } from "zod";
import { getAnalyzeTaskPrompt } from "../../prompts/index.js";

// Analyze task tool
export const analyzeTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "Task summary must be at least 10 characters long, please provide a more detailed description to ensure clear task objectives",
    })
    .describe(
      "Structured task summary, including task objectives, scope, and key technical challenges, minimum 10 characters"
    ),
  initialConcept: z
    .string()
    .min(50, {
      message:
        "Initial concept cannot be less than 50 characters, please provide more detailed content to ensure clear technical solutions",
    })
    .describe(
      "Least 50 characters of initial concept, including technical solutions, architecture design, and implementation strategy, if code is needed, use pseudocode format and only provide high-level logic flow and key steps to avoid complete code"
    ),
  previousAnalysis: z
    .string()
    .optional()
    .describe("Previous iteration analysis result, used to improve the solution (only provide when re-analyzing)")
});

export async function analyzeTask({
  summary,
  initialConcept,
  previousAnalysis,
}: z.infer<typeof analyzeTaskSchema>) {
  // Use prompt generator to get final prompt
  const prompt = getAnalyzeTaskPrompt({
    summary,
    initialConcept,
    previousAnalysis,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
