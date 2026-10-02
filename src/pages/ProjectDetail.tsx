import { Link } from "react-router-dom";

export default function ProjectDetail() {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-8">
      <h1 className="text-xl font-bold">Detalle de proyecto no disponible</h1>
      <p>Por ahora puedes consultar las categorías y las tareas por separado.</p>
      <Link to="/projects" className="block text-violet-600">Ver categorías</Link>
      <Link to="/tasks" className="block text-violet-600">Ver tareas</Link>
    </section>
  );
}
