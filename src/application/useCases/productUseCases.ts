import type { ProductRepository, CreateProductInput, UpdateProductInput } from "../../domain/repositories/ProductRepository";

export const createProductUseCases = (repository: ProductRepository) => ({
  getAll: () => repository.getAll(),
  getById: (id: number) => repository.getById(id),
  create: (input: CreateProductInput) => repository.create(input),
  update: (id: number, input: UpdateProductInput) => repository.update(id, input),
  delete: (id: number) => repository.delete(id),
});
