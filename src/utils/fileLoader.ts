import { RelatedFile, RelatedFileType } from "../types/index.js";

/**
 * Generate task related files content summary
 *
 * This function generates file summary information based on the provided RelatedFile object list,
 * without actually reading the file content. It is a lightweight implementation that generates
 * formatted summaries based on file metadata (such as path, type, description, etc.),
 * suitable for providing file context information but not accessing actual file content.
 *
 * @param relatedFiles related files list - RelatedFile object array, containing file path, type, description, etc.
 * @param maxTotalLength summary content maximum total length - controls the total character count of the summary, avoiding too large return content
 * @returns an object containing two fields:
 *   - content: detailed file information, containing basic information and prompts for each file
 *   - summary: concise file list overview, suitable for quick browsing
 */
export async function loadTaskRelatedFiles(
  relatedFiles: RelatedFile[],
  maxTotalLength: number = 15000 // controls the total length of the generated content
): Promise<{ content: string; summary: string }> {
  if (!relatedFiles || relatedFiles.length === 0) {
    return {
      content: "",
      summary: "No related files",
    };
  }

  let totalContent = "";
  let filesSummary = `## Related file content summary (Total ${relatedFiles.length} files)\n\n`;
  let totalLength = 0;

  // Sort files by priority order (first handle files to modify)
  const priorityOrder: Record<RelatedFileType, number> = {
    [RelatedFileType.TO_MODIFY]: 1,
    [RelatedFileType.REFERENCE]: 2,
    [RelatedFileType.DEPENDENCY]: 3,
    [RelatedFileType.CREATE]: 4,
    [RelatedFileType.OTHER]: 5,
  };

  const sortedFiles = [...relatedFiles].sort(
    (a, b) => priorityOrder[a.type] - priorityOrder[b.type]
  );

  // Process each file
  for (const file of sortedFiles) {
    if (totalLength >= maxTotalLength) {
      filesSummary += `\n### Reaching context length limit, some files not loaded\n`;
      break;
    }

    // 生成文件基本資訊
    const fileInfo = generateFileInfo(file);

    // 添加到總內容
    const fileHeader = `\n### ${file.type}: ${file.path}${
      file.description ? ` - ${file.description}` : ""
    }${
      file.lineStart && file.lineEnd
        ? ` (line ${file.lineStart}-${file.lineEnd})`
        : ""
    }\n\n`;

    totalContent += fileHeader + "```\n" + fileInfo + "\n```\n\n";
    filesSummary += `- **${file.path}**${
      file.description ? ` - ${file.description}` : ""
    } (${fileInfo.length} characters)\n`;

    totalLength += fileInfo.length + fileHeader.length + 8; // 8 for "```\n" and "\n```"
  }

  return {
    content: totalContent,
    summary: filesSummary,
  };
}

/**
 * Generate file basic information summary
 *
 * Generate formatted information summary based on file metadata, including file path, type, and related prompts.
 * Does not read actual file content, only generates information based on the provided RelatedFile object.
 *
 * @param file related file object - containing file path, type, description, etc. basic information
 * @returns formatted file information summary text
 */
function generateFileInfo(file: RelatedFile): string {
  let fileInfo = `File: ${file.path}\n`;
  fileInfo += `Type: ${file.type}\n`;

  if (file.description) {
    fileInfo += `Description: ${file.description}\n`;
  }

  if (file.lineStart && file.lineEnd) {
    fileInfo += `Line range: ${file.lineStart}-${file.lineEnd}\n`;
  }

  fileInfo += `If you need to view the actual content, please directly view the file: ${file.path}\n`;

  return fileInfo;
}
