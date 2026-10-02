import { AddToCartButton } from "../components/AddToCartButton";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";

export const ShopDetailPage = () => {
  const { id } = useParams();
  const productId = Number(id);
  const product = useProduct(productId);
  if (!Number.isSafeInteger(productId) || productId <= 0) return <p>ID de producto inválido. <Link to="/shop">Volver</Link></p>;
  if (product.isPending) return <p role="status">Cargando producto...</p>;
  if (product.isError) return <div role="alert">No se pudo cargar el producto.
    <button disabled={product.isFetching} onClick={() => product.refetch()} className="mx-3 underline">Reintentar</button>
    <Link to="/shop">Volver a productos</Link>
  </div>;
  const item = product.data;
  return <article className="space-y-4 rounded-xl border bg-white p-6">
    <Link to="/shop" className="text-violet-600">Volver a productos</Link>
    <h1 className="text-2xl font-bold">{item.name}</h1>
    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="max-h-96 w-full object-contain" />}
    <p className="text-violet-600">{item.category?.tag}</p>
    <p className="text-xl font-semibold">{item.price} €</p>
    <AddToCartButton product={item} />
    <p>{item.shortDescription}</p>
    <p className="whitespace-pre-wrap text-slate-600">{item.description}</p>
  </article>;
};
