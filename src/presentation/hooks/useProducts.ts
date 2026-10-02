import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productUseCases } from "../../app/productDependencies";
import type { UpdateProductInput } from "../../domain/repositories/ProductRepository";

export const useProducts = () => useQuery({
  queryKey: ["products", "list"], meta: { resource: "products", operation: "list" }, queryFn: productUseCases.getAll,
});
export const useProduct = (id: number) => useQuery({
  queryKey: ["products", "detail", id],
  meta: { resource: "products", operation: "detail" },
  queryFn: () => productUseCases.getById(id),
  enabled: Number.isSafeInteger(id) && id > 0,
});
export const useProductMutations = () => {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: ["products"] });
  const createProduct = useMutation({ meta: { resource: "products", operation: "create" }, mutationFn: productUseCases.create, onSuccess: refresh });
  const updateProduct = useMutation({ meta: { resource: "products", operation: "update" },
    mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) => productUseCases.update(id, input),
    onSuccess: refresh,
  });
  const deleteProduct = useMutation({ meta: { resource: "products", operation: "delete" },
    mutationFn: productUseCases.delete,
    onSuccess: async (_, id) => {
      client.removeQueries({ queryKey: ["products", "detail", id], exact: true });
      await refresh();
    },
  });
  return { createProduct, updateProduct, deleteProduct };
};
