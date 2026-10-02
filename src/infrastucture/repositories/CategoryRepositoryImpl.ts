import { api } from "../http/api";
import type { Category } from "../../domain/entities/Category";
import type { CategoryRepository } from "../../domain/repositories/CategoryRepository";

// El backend expone actualmente los controllers de categorías en /project.
export const CategoryRepositoryImpl: CategoryRepository = {
  async getAll() {
    return (await api.get<Category[]>("/project")).data;
  },
  async create(input) {
    return (await api.post<Category>("/project", input)).data;
  },
};
