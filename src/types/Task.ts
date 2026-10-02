// src/domain/entities/Task.ts
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title?: string;
  shortDescription: string;
  description: string;
};
