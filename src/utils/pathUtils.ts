import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get project root directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// Get data directory path
const DATA_DIR = process.env.DATA_DIR || path.join(PROJECT_ROOT, "data");

/**
 * Get rules file path
 * @returns The complete path of the rules file
 */
export function getRulesFilePath(): string {
  return path.join(DATA_DIR, "rules.md");
}

/**
 * Ensure rules file exists
 * If the file does not exist, it will try to copy from the root directory or create an empty file
 */
export async function ensureRulesFileExists(): Promise<void> {
  const dataRulesPath = getRulesFilePath();

  try {
    // Check if the rules file exists in the DATA_DIR directory
    await fs.access(dataRulesPath);
  } catch (error) {
    // DATA_DIR directory does not exist
    await fs.mkdir(path.dirname(dataRulesPath), { recursive: true });
    await fs.writeFile(
      dataRulesPath,
      "# Development Rules\n\nPlease define project rules in this file.",
      "utf-8"
    );
  }
}
