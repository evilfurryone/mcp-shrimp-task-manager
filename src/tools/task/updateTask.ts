import { z } from "zod";
import {
  getTaskById,
  updateTaskContent as modelUpdateTaskContent,
} from "../../models/taskModel.js";
import { RelatedFileType } from "../../types/index.js";
import { getUpdateTaskContentPrompt } from "../../prompts/index.js";

// 更新任務內容工具
export const updateTaskContentSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID format" })
    .describe("The unique identifier of the task to be updated, must be an existing and incomplete task ID in the system"),
  name: z.string().optional().describe("The new name of the task (optional)"),
  description: z.string().optional().describe("The new description of the task (optional)"),
  notes: z.string().optional().describe("The new additional notes of the task (optional)"),
  dependencies: z
    .array(z.string())
    .optional()
    .describe("The new dependencies of the task (optional)"),
  relatedFiles: z
    .array(
      z.object({
        path: z
          .string()
          .min(1, { message: "File path cannot be empty, please provide a valid file path" })
          .describe("File path, can be relative to the project root directory or absolute path"),
        type: z
          .nativeEnum(RelatedFileType)
          .describe(
            "File relationship type with the task (TO_MODIFY, REFERENCE, CREATE, DEPENDENCY, OTHER)"
          ),
        description: z.string().optional().describe("The additional description of the related file (optional)"),
        lineStart: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("The start line of the related code block (optional)"),
        lineEnd: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("The end line of the related code block (optional)"),
      })
    )
    .optional()
    .describe(
      "List of related files, used to record related code files, references, and files to be created (optional)"
    ),
  implementationGuide: z
    .string()
    .optional()
    .describe("The new implementation guide of the task (optional)"),
  verificationCriteria: z
    .string()
    .optional()
    .describe("The new verification criteria of the task (optional)"),
});

export async function updateTaskContent({
  taskId,
  name,
  description,
  notes,
  relatedFiles,
  dependencies,
  implementationGuide,
  verificationCriteria,
}: z.infer<typeof updateTaskContentSchema>) {
  if (relatedFiles) {
    for (const file of relatedFiles) {
      if (
        (file.lineStart && !file.lineEnd) ||
        (!file.lineStart && file.lineEnd) ||
        (file.lineStart && file.lineEnd && file.lineStart > file.lineEnd)
      ) {
        return {
          content: [
            {
              type: "text" as const,
              text: getUpdateTaskContentPrompt({
                taskId,
                validationError:
                  "Invalid line number setting: must set both start and end lines, and start line must be less than end line",
              }),
            },
          ],
        };
      }
    }
  }

  if (
    !(
      name ||
      description ||
      notes ||
      dependencies ||
      implementationGuide ||
      verificationCriteria ||
      relatedFiles
    )
  ) {
    return {
      content: [
        {
          type: "text" as const,
          text: getUpdateTaskContentPrompt({
            taskId,
            emptyUpdate: true,
          }),
        },
      ],
    };
  }

  // Get task to check if it exists
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: getUpdateTaskContentPrompt({
            taskId,
          }),
        },
      ],
      isError: true,
    };
  }

  // Record the task to be updated and its content
  let updateSummary = `Preparing to update task: ${task.name} (ID: ${task.id})`;
  if (name) updateSummary += `，New name: ${name}`;
  if (description) updateSummary += `，Update description`;
  if (notes) updateSummary += `，Update notes`;
  if (relatedFiles)
    updateSummary += `，Update related files (${relatedFiles.length} files)`;
  if (dependencies)
    updateSummary += `，Update dependencies (${dependencies.length} dependencies)`;
  if (implementationGuide) updateSummary += `，Update implementation guide`;
  if (verificationCriteria) updateSummary += `，Update verification criteria`;

  // Execute update operation
  const result = await modelUpdateTaskContent(taskId, {
    name,
    description,
    notes,
    relatedFiles,
    dependencies,
    implementationGuide,
    verificationCriteria,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: getUpdateTaskContentPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
          updatedTask: result.task,
        }),
      },
    ],
    isError: !result.success,
  };
}
