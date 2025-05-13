import { z } from "zod";
import {
  getTaskById,
  updateTaskStatus,
  updateTaskSummary,
} from "../../models/taskModel.js";
import { TaskStatus } from "../../types/index.js";
import { getVerifyTaskPrompt } from "../../prompts/index.js";

// Verify task tool
export const verifyTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID format" })
    .describe("The unique identifier of the task to be verified, must be an existing valid task ID in the system"),
  summary: z
    .string()
    .min(30, {
      message: "Least 30 characters",
    })
    .describe(
      "When the score is greater than or equal to 80, it represents the task completion summary, briefly describe the implementation results and important decisions. When the score is less than 80, it represents the missing or needs correction part of the explanation. Least 30 characters"
    ),
  score: z
    .number()
    .min(0, { message: "Score cannot be less than 0" })
    .max(100, { message: "Score cannot be greater than 100" })
    .describe("The score for the task, when the score is equal to or greater than 80, the task will be automatically completed"),
});

export async function verifyTask({
  taskId,
  summary,
  score,
}: z.infer<typeof verifyTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nTask ID \`${taskId}\` not found. Please use the 'list_tasks' tool to confirm a valid task ID and try again.`,
        },
      ],
      isError: true,
    };
  }

  if (task.status !== TaskStatus.IN_PROGRESS) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## Status Error\n\nTask "${task.name}" (ID: \`${task.id}\`) is currently in "${task.status}" status, not in progress status, cannot be verified.\n\nOnly tasks in 'in_progress' status can be verified. Please use the 'execute_task' tool to start task execution first.`,
        },
      ],
      isError: true,
    };
  }

  if (score >= 80) {
    // Update task status to completed and add summary
    await updateTaskSummary(taskId, summary);
    await updateTaskStatus(taskId, TaskStatus.COMPLETED);
  }

  // Use prompt generator to get final prompt
  const prompt = getVerifyTaskPrompt({ task, score, summary });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
