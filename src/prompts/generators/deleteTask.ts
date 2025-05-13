/**
 * deleteTask prompt generator
 * responsible for combining the template and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * deleteTask prompt parameters interface
 */
export interface DeleteTaskPromptParams {
  taskId: string;
  task?: Task;
  success?: boolean;
  message?: string;
  isTaskCompleted?: boolean;
}

/**
 * Get the complete deleteTask prompt
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getDeleteTaskPrompt(params: DeleteTaskPromptParams): string {
  const { taskId, task, success, message, isTaskCompleted } = params;

  // Handle situation where task does not exist
  if (!task) {
    const notFoundTemplate = loadPromptFromTemplate("deleteTask/notFound.md");
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // Handle situation where task is completed
  if (isTaskCompleted) {
    const completedTemplate = loadPromptFromTemplate("deleteTask/completed.md");
    return generatePrompt(completedTemplate, {
      taskId: task.id,
      taskName: task.name,
    });
  }

  // Handle situation where deleting is successful or failed
  const responseTitle = success ? "Success" : "Failure";
  const indexTemplate = loadPromptFromTemplate("deleteTask/index.md");
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "DELETE_TASK");
}
