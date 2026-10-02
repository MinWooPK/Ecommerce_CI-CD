export type ProjectStatus = "planning" | "in-progress" | "completed";
export type Project = {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  color: string;
};
