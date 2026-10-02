import { Link } from "react-router-dom";
import { priceInCents, useProductStore } from "../../store/useProductStore";

const euros = (cents: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);

export const CartPage = () => {
  const { items, setQuantity, removeProduct, clearCart } = useProductStore();
  const total = items.reduce((sum, item) => sum + (priceInCents(item.product.price) ?? 0) * item.quantity, 0);
  return <div className="space-y-6">
    <h1 className="text-2xl font-bold">Carrito</h1>
    <Link to="/shop" className="inline-block text-violet-600">Seguir comprando</Link>
    {items.length === 0 ? <p>Tu carrito está vacío.</p> : <>
      <ul className="space-y-4">
        {items.map(({ product, quantity }) => <li key={product.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-white p-5">
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded object-cover" />}
          <div className="min-w-0 flex-1">
            <Link to={`/shop/${product.id}`} className="font-semibold text-violet-600">{product.name}</Link>
            <p>{euros(priceInCents(product.price) ?? 0)} / unidad</p>
          </div>
          <label className="text-sm">Cantidad de {product.name}
            <select value={quantity} onChange={(event) => setQuantity(product.id, Number(event.target.value))}
              className="ml-2 rounded border p-2">
              {Array.from({ length: 99 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
            </select>
          </label>
          <p className="font-semibold">{euros((priceInCents(product.price) ?? 0) * quantity)}</p>
          <button type="button" onClick={() => removeProduct(product.id)} aria-label={`Quitar ${product.name}`} className="text-red-600">Quitar</button>
        </li>)}
      </ul>
      <section className="space-y-4 rounded-xl border bg-white p-5">
        <p className="text-xl font-bold">Total estimado: {euros(total)}</p>
        <button type="button" onClick={clearCart} className="rounded-lg border px-4 py-2">Vaciar carrito</button>
        <p className="text-sm text-slate-500">La compra todavía no está disponible. No se ha realizado ningún pedido ni cobro.</p>
      </section>
    </>}
  </div>;
};
