// Task status enum: Define the current stage of the task in the workflow
export enum TaskStatus {
  PENDING = "pending", // Created but not started execution
  IN_PROGRESS = "in_progress", // Currently executing the task
  COMPLETED = "completed", // Successfully completed and verified the task
  BLOCKED = "blocked", // Temporarily unable to execute due to dependency relationship
}

// Task dependency interface: Define the dependency relationship between tasks
export interface TaskDependency {
  taskId: string; // The unique identifier of the preceding task, the preceding task must be completed before the current task can be executed
}

// Related file type: Define the relationship between files and tasks
export enum RelatedFileType {
  TO_MODIFY = "TO_MODIFY", // Need to modify files in the task
  REFERENCE = "REFERENCE", // Reference materials or related documents for the task
  CREATE = "CREATE", // Need to create files in the task
  DEPENDENCY = "DEPENDENCY", // Component or library files that the task depends on
  OTHER = "OTHER", // Other types of related files
}

// Related file interface: Define the relationship between files and tasks
export interface RelatedFile {
  path: string; // File path, can be relative to the project root directory or absolute path
  type: RelatedFileType; // Relationship type between file and task
  description?: string; // Additional description of the file, explaining its specific relationship or purpose
  lineStart?: number; // Start line of the related code block (optional)
  lineEnd?: number; // End line of the related code block (optional)
}

// Task interface: Define the complete structure of the task
export interface Task {
  id: string; // Task unique identifier
  name: string; // Clear and concise task name
  description: string; // Detailed task description, including implementation points and acceptance criteria
  notes?: string; // Additional notes, special handling requirements or implementation suggestions (optional)
  status: TaskStatus; // Current execution status of the task
  dependencies: TaskDependency[]; // List of task dependencies
  createdAt: Date; // Timestamp when the task was created
  updatedAt: Date; // Timestamp when the task was last updated
  completedAt?: Date; // Timestamp when the task was completed (only applicable to completed tasks)
  summary?: string; // Task completion summary, concise description of implementation results and important decisions (only applicable to completed tasks)
  relatedFiles?: RelatedFile[]; // List of related files to the task (optional)

  // New field: Save the complete technical analysis result
  analysisResult?: string; // Complete technical analysis result from analyze_task and reflect_task stages

  // New field: Save specific implementation guidelines
  implementationGuide?: string; // Specific implementation methods, steps, and suggestions

  // New field: Save verification standards and inspection methods
  verificationCriteria?: string; // Clear verification standards, testing points, and acceptance criteria
}

// Task complexity level: Define the complexity level classification of the task
export enum TaskComplexityLevel {
  LOW = "low_complexity", // Simple and direct tasks, usually do not require special handling
  MEDIUM = "medium_complexity", // Tasks with certain complexity but can be managed
  HIGH = "high_complexity", // Complex and time-consuming tasks, need special attention
  VERY_HIGH = "very_high_complexity", // Extremely complex tasks, recommended to be split into smaller tasks
}

// Task complexity thresholds: Define the reference standards for task complexity assessment
export const TaskComplexityThresholds = {
  DESCRIPTION_LENGTH: {
    MEDIUM: 500, // Tasks with description length exceeding this threshold are classified as medium complexity
    HIGH: 1000, // Tasks with description length exceeding this threshold are classified as high complexity
    VERY_HIGH: 2000, // Tasks with description length exceeding this threshold are classified as very high complexity
  },
  DEPENDENCIES_COUNT: {
    MEDIUM: 2, // Tasks with dependency count exceeding this threshold are classified as medium complexity
    HIGH: 5, // Tasks with dependency count exceeding this threshold are classified as high complexity
    VERY_HIGH: 10, // Tasks with dependency count exceeding this threshold are classified as very high complexity
  },
  NOTES_LENGTH: {
    MEDIUM: 200, // Tasks with notes length exceeding this threshold are classified as medium complexity
    HIGH: 500, // Tasks with notes length exceeding this threshold are classified as high complexity
    VERY_HIGH: 1000, // Tasks with notes length exceeding this threshold are classified as very high complexity
  },
};

// Task complexity assessment result: Record the detailed results of task complexity analysis
export interface TaskComplexityAssessment {
  level: TaskComplexityLevel; // Overall complexity level
  metrics: {
    // Detailed data of each evaluation metric
    descriptionLength: number; // Description length
    dependenciesCount: number; // Dependency count
    notesLength: number; // Note length
    hasNotes: boolean; // Whether there are notes
  };
  recommendations: string[]; // Processing recommendations
}
