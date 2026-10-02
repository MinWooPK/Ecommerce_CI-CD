import { createCategoryUseCases } from "../application/useCases/categoryUseCases";
import { CategoryRepositoryImpl } from "../infrastucture/repositories/CategoryRepositoryImpl";

export const categoryUseCases = createCategoryUseCases(CategoryRepositoryImpl);
