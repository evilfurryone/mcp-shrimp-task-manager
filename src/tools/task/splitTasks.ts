import { z } from "zod";
import {
  getAllTasks,
  batchCreateOrUpdateTasks,
  clearAllTasks as modelClearAllTasks,
} from "../../models/taskModel.js";
import { RelatedFileType, Task } from "../../types/index.js";
import { getSplitTasksPrompt } from "../../prompts/index.js";

// Split tasks tool
export const splitTasksSchema = z.object({
  updateMode: z
    .enum(["append", "overwrite", "selective", "clearAllTasks"])
    .describe(
      "Task update mode selection: 'append'(keep all existing tasks and add new tasks)、'overwrite'(clear all incomplete tasks and completely replace, keep completed tasks)、'selective'(smart update: update existing tasks based on task name matching, keep tasks not in the list, recommended for task fine-tuning)、'clearAllTasks'(clear all tasks and create backup)。Default is 'clearAllTasks' mode, only use other modes when user requests changes or modifies the plan content"
    ),
  tasks: z
    .array(
      z.object({
        name: z
          .string()
          .max(100, {
            message: "Task name is too long, please limit it to 100 characters",
          })
          .describe("Brief and clear task name, should be able to express the purpose of the task clearly"),
        description: z
          .string()
          .min(10, {
            message: "Task description is too short, please provide more detailed content to ensure understanding",
          })
          .describe("Detailed task description, including implementation points, technical details, and acceptance criteria"),
        implementationGuide: z
          .string()
          .describe(
            "Specific implementation method and steps for this task, please refer to the previous analysis results to provide concise pseudocode"
          ),
        dependencies: z
          .array(z.string())
          .optional()
          .describe(
            "Dependencies of this task, supports two reference methods, name reference is more intuitive, it is an array of strings"
          ),
        notes: z
          .string()
          .optional()
          .describe("Additional notes, special handling requirements or implementation suggestions (optional)"),
        relatedFiles: z
          .array(
            z.object({
              path: z
                .string()
                .min(1, {
                  message: "File path cannot be empty",
                })
                .describe("File path, can be relative to the project root directory or absolute path"),
              type: z
                .nativeEnum(RelatedFileType)
                .describe(
                  "File type (TO_MODIFY:待修改, REFERENCE: 參考資料, CREATE: 待建立, DEPENDENCY: 依賴文件, OTHER: 其他)"
                ),
              description: z
                .string()
                .min(1, {
                  message: "File description cannot be empty",
                })
                .describe("File description, used to explain the purpose and content of the file"),
              lineStart: z
                .number()
                .int()
                .positive()
                .optional()
                .describe("Start line of related code block (optional)"),
              lineEnd: z
                .number()
                .int()
                .positive()
                .optional()
                .describe("End line of related code block (optional)"),
            })
          )
          .optional()
          .describe(
            "List of related files, used to record related code files, references, and files to be created (optional)"
          ),
        verificationCriteria: z
          .string()
          .optional()
          .describe("Verification criteria and inspection methods for this specific task"),
      })
    )
    .min(1, {
      message: "Please provide at least one task",
    })
    .describe(
      "Structured task list, each task should maintain atomicity and clear completion criteria, avoid过于simple tasks, simple modifications can be integrated with other tasks, avoid too many tasks"
    ),
  globalAnalysisResult: z
    .string()
    .optional()
    .describe(
      "Global analysis result: The complete analysis result from reflect_task, which is common to all tasks analysis result:来自reflect_task的完整分析结果，适用于所有任务的通用部分"
    ),
});

export async function splitTasks({
  updateMode,
  tasks,
  globalAnalysisResult,
}: z.infer<typeof splitTasksSchema>) {
  try {
    // Check if tasks contains duplicate task names
    const nameSet = new Set();
    for (const task of tasks) {
      if (nameSet.has(task.name)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "tasks parameter contains duplicate task names, please ensure each task name is unique",
            },
          ],
        };
      }
      nameSet.add(task.name);
    }

    // Handle tasks based on different update modes
    let message = "";
    let actionSuccess = true;
    let backupFile = null;
    let createdTasks: Task[] = [];
    let allTasks: Task[] = [];

    // Convert task data to format for batchCreateOrUpdateTasks
    const convertedTasks = tasks.map((task) => ({
      name: task.name,
      description: task.description,
      notes: task.notes,
      dependencies: task.dependencies,
      implementationGuide: task.implementationGuide,
      verificationCriteria: task.verificationCriteria,
      relatedFiles: task.relatedFiles?.map((file) => ({
        path: file.path,
        type: file.type as RelatedFileType,
        description: file.description,
        lineStart: file.lineStart,
        lineEnd: file.lineEnd,
      })),
    }));

    // Handle clearAllTasks mode
    if (updateMode === "clearAllTasks") {
      const clearResult = await modelClearAllTasks();

      if (clearResult.success) {
        message = clearResult.message;
        backupFile = clearResult.backupFile;

        try {
          // Clear tasks and create new tasks
          createdTasks = await batchCreateOrUpdateTasks(
            convertedTasks,
            "append",
            globalAnalysisResult
          );
          message += `\nSuccessfully created ${createdTasks.length} new tasks.`;
        } catch (error) {
          actionSuccess = false;
          message += `\nError creating new tasks: ${
            error instanceof Error ? error.message : String(error)
          }`;
        }
      } else {
        actionSuccess = false;
        message = clearResult.message;
      }
    } else {
      // For other modes, directly use batchCreateOrUpdateTasks
      try {
        createdTasks = await batchCreateOrUpdateTasks(
          convertedTasks,
          updateMode,
          globalAnalysisResult
        );

        // Generate message based on different update modes
        switch (updateMode) {
          case "append":
            message = `Successfully appended ${createdTasks.length} new tasks.`;
            break;
          case "overwrite":
            message = `Successfully cleared incomplete tasks and created ${createdTasks.length} new tasks.`;
            break;
          case "selective":
            message = `Successfully selectively updated/created ${createdTasks.length} tasks.`;
            break;
        }
      } catch (error) {
        actionSuccess = false;
        message = `Task creation failed: ${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    }

    // Get all tasks for dependency display
    try {
      allTasks = await getAllTasks();
    } catch (error) {
      allTasks = [...createdTasks]; // If failed to get, at least use the newly created tasks
    }

    // Use prompt generator to get final prompt
    const prompt = getSplitTasksPrompt({
      updateMode,
      createdTasks,
      allTasks,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
      ephemeral: {
        taskCreationResult: {
          success: actionSuccess,
          message,
          backupFilePath: backupFile,
        },
      },
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text:
            "Error executing task split: " +
            (error instanceof Error ? error.message : String(error)),
        },
      ],
    };
  }
}
