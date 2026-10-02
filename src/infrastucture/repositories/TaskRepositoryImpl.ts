// src/infrastucture/repositories/TaskRepositoryImpl.ts
import { api } from "../http/api";
import type { Task } from "../../types/Task";
import type {
  TaskRepository,
  CreateTaskInput,
  UpdateTaskInput,
} from "../../domain/repositories/TaskRepoisotry";

export const TaskRepositoryImpl: TaskRepository = {
  async getAll(): Promise<Task[]> {
    const response = await api.get<Task[]>("/task");
    return response.data;
  },

  async getById(id: Task["id"]): Promise<Task> {
    const response = await api.get<Task>(`/task/${id}`);
    return response.data;
  },

  async create(data: CreateTaskInput): Promise<Task> {
    const response = await api.post<Task>("/task", data);
    return response.data;
  },

  async update(id: Task["id"], data: UpdateTaskInput): Promise<Task> {
    const response = await api.put<Task>(`/task/${id}`, data);
    return response.data;
  },

  async delete(id: Task["id"]): Promise<void> {
    await api.delete(`/task/${id}`);
  },
};
