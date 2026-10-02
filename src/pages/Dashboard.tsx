import { Link } from "react-router-dom";
import * as Sentry from "@sentry/react";

import { useProducts } from "../presentation/hooks/useProducts";
import { useTasks } from "../presentation/hooks/useTasks";
import ProductCard from "../presentation/components/ProductCard";
import TaskCard from "../presentation/features/task/components/TaskCard";

export default function Dashboard() {
  const products = useProducts();
  const { tasks } = useTasks();

  const handleSentryTest = () => {
    Sentry.setUser({
      id: "123",
      username: "test",
    });

    Sentry.setTag("feature", "dashboard");

    Sentry.setContext("dashboard", {
      productsLoaded: products.data?.length ?? 0,
      tasksLoaded: tasks.data?.length ?? 0,
    });

    Sentry.addBreadcrumb({
      category: "user-action",
      message: "Usuario pulsó Probar Sentry",
      level: "info",
    });

    throw new Error("Error real de prueba desde Dashboard");
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Resumen</h1>
        <p className="mt-1 text-slate-500">Tus productos y tareas.</p>
        <button
          type="button"
          onClick={handleSentryTest}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
        >
          Probar error real
        </button>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Productos
            {products.isSuccess ? ` (${products.data.length})` : ""}
          </h2>

          <Link to="/shop" className="text-violet-600">
            Ver todos →
          </Link>
        </div>

        {products.isPending && <p role="status">Cargando productos...</p>}

        {products.isError && (
          <div role="alert">
            No se pudieron cargar los productos.
            <button
              type="button"
              disabled={products.isFetching}
              onClick={() => products.refetch()}
              className="ml-3 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {products.isSuccess && products.data.length === 0 && (
          <p>Todavía no hay productos.</p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {products.data?.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Tareas
            {tasks.isSuccess ? ` (${tasks.data.length})` : ""}
          </h2>

          <Link to="/tasks" className="text-violet-600">
            Ver todas →
          </Link>
        </div>

        {tasks.isPending && <p role="status">Cargando tareas...</p>}

        {tasks.isError && (
          <div role="alert">
            No se pudieron cargar las tareas.
            <button
              type="button"
              disabled={tasks.isFetching}
              onClick={() => tasks.refetch()}
              className="ml-3 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {tasks.isSuccess && tasks.data.length === 0 && (
          <p>Todavía no hay tareas.</p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {tasks.data?.slice(0, 3).map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  );
}
