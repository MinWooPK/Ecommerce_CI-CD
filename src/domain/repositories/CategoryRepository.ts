import type { Category } from "../entities/Category";

export type CreateCategoryInput = Pick<Category, "tag">;

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  create(input: CreateCategoryInput): Promise<Category>;
}
