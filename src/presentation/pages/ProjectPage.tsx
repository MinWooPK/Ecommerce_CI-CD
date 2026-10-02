import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useCategories } from "../hooks/useCategories";
import { useAuthStore } from "../../store/useAuthStore";

const errorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 400: return "Revisa el nombre de la categoría.";
      case 401: return "Tu sesión no es válida. Vuelve a iniciar sesión.";
      case 403: return "Necesitas el rol ADMIN para crear categorías.";
    }
  }
  return "No se pudo crear la categoría. Inténtalo de nuevo.";
};

export const ProjectPage = () => {
  const { categories, createCategory } = useCategories();
  const isAdmin = useAuthStore((state) => state.user?.role === "ADMIN");
  const [tag, setTag] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin || !tag.trim() || createCategory.isPending) return;
    setSaved(false);
    createCategory.mutate({ tag: tag.trim() }, {
      onSuccess: () => { setTag(""); setSaved(true); },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
      {isAdmin ? (
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Crear categoría</h2>
          <label className="block text-sm font-medium" htmlFor="category-tag">Nombre</label>
          <input id="category-tag" required value={tag} disabled={createCategory.isPending}
            onChange={(event) => { setTag(event.target.value); setSaved(false); createCategory.reset(); }}
            className="block w-full rounded-lg border border-slate-300 p-2" />
          <button type="submit" disabled={!tag.trim() || createCategory.isPending}
            className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50">
            {createCategory.isPending ? "Guardando..." : "Crear categoría"}
          </button>
          {createCategory.isError && <p role="alert" className="text-red-600">{errorMessage(createCategory.error)}</p>}
          {saved && <p role="status" className="text-green-700">Categoría creada.</p>}
        </form>
      ) : <p className="text-sm text-slate-500">Solo los administradores pueden crear categorías.</p>}

      {categories.isPending && <p role="status">Cargando categorías...</p>}
      {categories.isError && <div role="alert" className="text-red-600">
        No se pudieron cargar las categorías.
        <button type="button" disabled={categories.isFetching} onClick={() => categories.refetch()}
          className="ml-3 underline">Reintentar</button>
      </div>}
      {categories.isSuccess && categories.data.length === 0 && <p>Todavía no hay categorías.</p>}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.data?.map((category) => (
          <li key={category.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800">{category.tag}</h2>
            <p className="mt-2 text-sm text-slate-500">ID: {category.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
