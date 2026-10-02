// src/domain/repositories/TaskRepository.ts
import type { Task } from "../../types/Task";

export type CreateTaskInput = Omit<Task, "id">;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: Task["id"]): Promise<Task>;
  create(data: CreateTaskInput): Promise<Task>;
  update(id: Task["id"], data: UpdateTaskInput): Promise<Task>;
  delete(id: Task["id"]): Promise<void>;
}
