/**
 * initProjectRules prompt generator
 * responsible for combining the template and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { getRulesFilePath } from "../../utils/pathUtils.js";
/**
 * initProjectRules prompt parameters interface
 */
export interface InitProjectRulesPromptParams {
  // Currently no additional parameters, future expansion is possible
}

/**
 * Get the complete initProjectRules prompt
 * @param params prompt parameters (optional)
 * @returns generated prompt
 */
export function getInitProjectRulesPrompt(
  params?: InitProjectRulesPromptParams
): string {
  // Use basic template
  const rulesPath = getRulesFilePath();
  const indexTemplate = loadPromptFromTemplate("initProjectRules/index.md");
  const basePrompt = generatePrompt(indexTemplate, {
    rulesPath,
  });

  // Load possible custom prompt (through environment v ariables to override or append)
  return loadPrompt(basePrompt, "INIT_PROJECT_RULES");
}
