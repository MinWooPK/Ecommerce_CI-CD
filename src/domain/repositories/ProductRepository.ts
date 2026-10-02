import type { Product } from "../entities/Product";

export type CreateProductInput = Omit<Product, "id" | "category">;
export type UpdateProductInput = Partial<CreateProductInput>;
export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: number, input: UpdateProductInput): Promise<Product>;
  delete(id: number): Promise<void>;
}
