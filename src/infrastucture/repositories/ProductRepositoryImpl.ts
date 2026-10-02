import { api } from "../http/api";
import type { Product } from "../../domain/entities/Product";
import type { ProductRepository } from "../../domain/repositories/ProductRepository";

export const ProductRepositoryImpl: ProductRepository = {
  async getAll() { return (await api.get<Product[]>("/products")).data; },
  async getById(id) { return (await api.get<Product>(`/products/${id}`)).data; },
  async create(input) { return (await api.post<Product>("/products", input)).data; },
  async update(id, input) { return (await api.patch<Product>(`/products/${id}`, input)).data; },
  async delete(id) { await api.delete(`/products/${id}`); },
};
