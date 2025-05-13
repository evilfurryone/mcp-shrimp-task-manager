import { z } from "zod";
import { getInitProjectRulesPrompt } from "../../prompts/index.js";
import {
  getRulesFilePath,
  ensureRulesFileExists,
} from "../../utils/pathUtils.js";

// Define schema
export const initProjectRulesSchema = z.object({});

/**
 * Initialize project rules tool function
 * Provide guidance for creating a rules file
 */
export async function initProjectRules() {
  try {
    // Get prompt from generator
    const promptContent = getInitProjectRulesPrompt();

    // Ensure DATA_DIR directory contains rules.md file
    await ensureRulesFileExists();

    // Output rules file path to help user find the file
    const rulesPath = getRulesFilePath();

    // Return success response
    return {
      content: [
        {
          type: "text" as const,
          text: promptContent + `\n\nThe rules file will be located at: ${rulesPath}`,
        },
      ],
    };
  } catch (error) {
    // Error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text" as const,
          text: `Error initializing project rules: ${errorMessage}`,
        },
      ],
    };
  }
}
