import { useState, type FormEvent } from "react";
import TaskCard from "../features/task/components/TaskCard";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../../types/Task";

const emptyForm = { title: "", shortDescription: "", description: "" };

export const TaskPage = () => {
  const { tasks, createTask, updateTask } = useTasks();
  const [editingId, setEditingId] = useState<Task["id"] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const isSaving = createTask.isPending || updateTask.isPending;
  const saveFailed = createTask.isError || updateTask.isError;

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    createTask.reset();
    updateTask.reset();
    setSaved(false);
  };

  const edit = (task: Task) => {
    reset();
    setEditingId(task.id);
    setForm({ title: task.title ?? "", shortDescription: task.shortDescription, description: task.description });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    setSaved(false);
    const input = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
    };
    if (!input.shortDescription || !input.description) return;
    const onSuccess = () => { reset(); setSaved(true); };
    if (editingId === null) createTask.mutate(input, { onSuccess });
    else updateTask.mutate({ id: editingId, input }, { onSuccess });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tareas</h1>
      <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">{editingId === null ? "Crear tarea" : "Editar tarea"}</h2>
        <fieldset disabled={isSaving} className="space-y-4">
          <label className="block text-sm font-medium">
            Título (opcional)
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2" />
          </label>
          <label className="block text-sm font-medium">
            Descripción breve
            <input required value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2" />
          </label>
          <label className="block text-sm font-medium">
            Descripción
            <textarea required value={form.description} rows={3}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2" />
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={isSaving || !form.shortDescription.trim() || !form.description.trim()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50">
              {isSaving ? "Guardando..." : editingId === null ? "Crear tarea" : "Guardar cambios"}
            </button>
            {editingId !== null && <button type="button" onClick={reset} className="rounded-lg border px-4 py-2">Cancelar</button>}
          </div>
        </fieldset>
        {saveFailed && <p role="alert" className="mt-3 text-red-600">No se pudo guardar la tarea. Revisa los datos e inténtalo de nuevo.</p>}
        {saved && <p role="status" className="mt-3 text-green-700">Tarea guardada.</p>}
      </form>
      {tasks.isPending && <p role="status">Cargando tareas...</p>}
      {tasks.isError && <div role="alert" className="text-red-600">
        No se pudieron cargar las tareas.
        <button type="button" disabled={tasks.isFetching} onClick={() => tasks.refetch()} className="ml-3 underline">Reintentar</button>
      </div>}
      {tasks.isSuccess && tasks.data.length === 0 && <p>Todavía no hay tareas. Crea la primera.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.data?.map((task) => <TaskCard key={task.id} task={task} onEdit={edit} disabled={isSaving} />)}
      </div>
    </div>
  );
};
