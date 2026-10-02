import type {
  CategoryRepository,
  CreateCategoryInput,
} from "../../domain/repositories/CategoryRepository";

export const createCategoryUseCases = (repository: CategoryRepository) => ({
  getAll: () => repository.getAll(),
  create: (input: CreateCategoryInput) => repository.create(input),
});
