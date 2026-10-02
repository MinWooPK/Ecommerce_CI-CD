import { useState, type FormEvent } from "react";
import type { Product } from "../../../../domain/entities/Product";
import type { CreateProductInput } from "../../../../domain/repositories/ProductRepository";

export const ProductForm = ({ product, pending, onSave, onCancel }: {
  product: Product | null;
  pending: boolean;
  onSave: (input: CreateProductInput) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState({
    name: product?.name ?? "", price: product?.price ?? "",
    shortDescription: product?.shortDescription ?? "", description: product?.description ?? "",
    categoryId: product ? String(product.categoryId) : "", imageUrl: product?.imageUrl ?? "",
  });
  const valid = form.name.trim() && form.shortDescription.trim() && form.description.trim()
    && form.price.trim() && Number.isFinite(Number(form.price)) && Number(form.price) >= 0
    && Number.isSafeInteger(Number(form.categoryId)) && Number(form.categoryId) > 0;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid || pending) return;
    onSave({ ...form, name: form.name.trim(), shortDescription: form.shortDescription.trim(),
      description: form.description.trim(), price: form.price.trim(),
      imageUrl: form.imageUrl.trim(), categoryId: Number(form.categoryId) });
  };
  return <form onSubmit={submit} className="rounded-xl border bg-white p-5">
    <h2 className="mb-4 text-lg font-semibold">{product ? "Editar producto" : "Crear producto"}</h2>
    <fieldset disabled={pending} className="grid gap-4 md:grid-cols-2">
      {([
        ["name", "Nombre", "text"], ["price", "Precio", "number"],
        ["shortDescription", "Descripción breve", "text"],
        ["categoryId", "ID de categoría", "number"], ["imageUrl", "URL de imagen (opcional)", "url"],
      ] as const).map(([key, label, type]) => <label key={key} className="block text-sm font-medium">
        {label}
        <input type={type} required={key !== "imageUrl"} value={form[key]}
          min={key === "price" ? 0 : key === "categoryId" ? 1 : undefined}
          step={key === "price" ? "0.01" : key === "categoryId" ? "1" : undefined}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="mt-1 block w-full rounded-lg border p-2" />
      </label>)}
      <label className="block text-sm font-medium">Descripción
        <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full rounded-lg border p-2" rows={3} />
      </label>
      <div className="flex gap-3 md:col-span-2">
        <button disabled={!valid || pending} className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50">
          {pending ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
        </button>
        {product && <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2">Cancelar</button>}
      </div>
    </fieldset>
  </form>;
};
