import { createProductUseCases } from "../application/useCases/productUseCases";
import { ProductRepositoryImpl } from "../infrastucture/repositories/ProductRepositoryImpl";

export const productUseCases = createProductUseCases(ProductRepositoryImpl);
