import { useState } from "react";
import type { Product } from "../../domain/entities/Product";
import type { CreateProductInput } from "../../domain/repositories/ProductRepository";
import ProductCard from "../components/ProductCard";
import { ProductForm } from "../features/product/components/ProductForm";
import { useProducts, useProductMutations } from "../hooks/useProducts";

export const ShopPage = () => {
  const products = useProducts();
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();
  const [editing, setEditing] = useState<Product | null>(null);
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState("");
  const pending = createProduct.isPending || updateProduct.isPending || deleteProduct.isPending;
  const reset = () => {
    setEditing(null); setVersion((value) => value + 1); setMessage("");
    createProduct.reset(); updateProduct.reset(); deleteProduct.reset();
  };
  const save = (input: CreateProductInput) => {
    if (pending) return;
    setMessage("");
    const onSuccess = () => { reset(); setMessage("Producto guardado."); };
    if (editing) updateProduct.mutate({ id: editing.id, input }, { onSuccess });
    else createProduct.mutate(input, { onSuccess });
  };
  const remove = (product: Product) => {
    if (pending || !window.confirm(`¿Eliminar «${product.name}»?`)) return;
    setMessage("");
    deleteProduct.mutate(product.id, { onSuccess: () => {
      if (editing?.id === product.id) reset();
      setMessage("Producto eliminado.");
    } });
  };
  return <div className="space-y-6">
    <h1 className="text-2xl font-bold">Productos</h1>
    <ProductForm key={`${editing?.id ?? "new"}-${version}`} product={editing} pending={pending} onSave={save} onCancel={reset} />
    {(createProduct.isError || updateProduct.isError || deleteProduct.isError) &&
      <p role="alert" className="text-red-600">No se pudo completar la operación. Revisa los datos y la categoría e inténtalo de nuevo.</p>}
    {message && <p role="status" className="text-green-700">{message}</p>}
    {products.isPending && <p role="status">Cargando productos...</p>}
    {products.isError && <div role="alert">No se pudieron cargar los productos.
      <button type="button" disabled={products.isFetching} onClick={() => products.refetch()} className="ml-3 underline">Reintentar</button>
    </div>}
    {products.isSuccess && products.data.length === 0 && <p>Todavía no hay productos.</p>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.data?.map((product) => <ProductCard key={product.id} product={product} disabled={pending}
        onEdit={(item) => { reset(); setEditing(item); }} onDelete={remove} />)}
    </div>
  </div>;
};
