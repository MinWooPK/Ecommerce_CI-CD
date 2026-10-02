import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryUseCases } from "../../app/categoryDependencies";

const queryKey = ["categories"];

export const useCategories = () => {
  const client = useQueryClient();
  const categories = useQuery({ queryKey, meta: { resource: "categories", operation: "list" }, queryFn: categoryUseCases.getAll });
  const createCategory = useMutation({ meta: { resource: "categories", operation: "create" },
    mutationFn: categoryUseCases.create,
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
  return { categories, createCategory };
};
