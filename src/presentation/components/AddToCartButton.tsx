import { useState } from "react";
import type { Product } from "../../domain/entities/Product";
import { priceInCents, useProductStore } from "../../store/useProductStore";

export const AddToCartButton = ({ product }: { product: Product }) => {
  const addProduct = useProductStore((state) => state.addProduct);
  const quantity = useProductStore((state) => state.items.find((item) => item.product.id === product.id)?.quantity ?? 0);
  const [added, setAdded] = useState(false);
  const validPrice = priceInCents(product.price) !== null;
  return <div>
    <button type="button" disabled={!validPrice || quantity >= 99}
      onClick={() => { addProduct(product); setAdded(true); }}
      className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50">
      {quantity >= 99 ? "Máximo 99 unidades" : "Añadir al carrito"}
    </button>
    {added && quantity > 0 && <p role="status" className="mt-2 text-sm text-green-700">En el carrito: {quantity}</p>}
    {!validPrice && <p className="text-sm text-red-600">Precio no disponible.</p>}
  </div>;
};
