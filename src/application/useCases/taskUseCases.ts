import type { Task } from "../../types/Task";
import type { TaskRepository, CreateTaskInput, UpdateTaskInput } from "../../domain/repositories/TaskRepoisotry";

export const createTaskUseCases = (repository: TaskRepository) => ({
  getAll: () => repository.getAll(),
  create: (input: CreateTaskInput) => repository.create(input),
  update: (id: Task["id"], input: UpdateTaskInput) => repository.update(id, input),
});
