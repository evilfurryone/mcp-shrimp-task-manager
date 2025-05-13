import { z } from "zod";
import { searchTasksWithCommand } from "../../models/taskModel.js";
import { getQueryTaskPrompt } from "../../prompts/index.js";

// Query task tool
export const queryTaskSchema = z.object({
  query: z
    .string()
    .min(1, {
      message: "Query content cannot be empty, please provide task ID or search keywords",
    })
    .describe("Search query text, can be task ID or multiple keywords (space separated)",
  isId: z
    .boolean()
    .optional()
    .default(false)
    .describe("Specify whether it is an ID query mode, default is no (keyword mode)",
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1)
    .describe("Page number, default is 1"),
  pageSize: z
    .number()
    .int()
    .positive()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("Number of tasks per page, default is 5, maximum is 20"),
});

export async function queryTask({
  query,
  isId = false,
  page = 1,
  pageSize = 5,
}: z.infer<typeof queryTaskSchema>) {
  try {
    // Use system command search function
    const results = await searchTasksWithCommand(query, isId, page, pageSize);

    // Use prompt generator to get final prompt
    const prompt = getQueryTaskPrompt({
      query,
      isId,
      tasks: results.tasks,
      totalTasks: results.pagination.totalResults,
      page: results.pagination.currentPage,
      pageSize,
      totalPages: results.pagination.totalPages,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nError querying tasks: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}
