import { AddToCartButton } from "./AddToCartButton";
import { Link } from "react-router-dom";
import type { Product } from "../../domain/entities/Product";

export default function ProductCard({ product, onEdit, onDelete, disabled }: {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  disabled?: boolean;
}) {
  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <Link to={`/shop/${product.id}`}>
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />}
      <h2 className="px-5 pt-5 text-lg font-semibold">{product.name}</h2>
    </Link>
    <div className="space-y-3 p-5">
      <p className="text-sm text-violet-600">{product.category?.tag}</p>
      <p className="text-sm text-slate-500">{product.shortDescription}</p>
      <p className="font-bold">{product.price} €</p>
      <AddToCartButton product={product} />
      <div className="flex gap-3">
        {onEdit && <button type="button" disabled={disabled} onClick={() => onEdit(product)} className="rounded-lg border px-3 py-2 disabled:opacity-50">Editar</button>}
        {onDelete && <button type="button" disabled={disabled} onClick={() => onDelete(product)} className="rounded-lg border px-3 py-2 text-red-600 disabled:opacity-50">Eliminar</button>}
      </div>
    </div>
  </article>;
}
