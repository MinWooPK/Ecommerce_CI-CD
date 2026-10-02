import type { Task } from "../../../../types/Task";

export default function TaskCard({ task, onEdit, disabled = false }: {
  task: Task;
  onEdit?: (task: Task) => void;
  disabled?: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-800">{task.title || task.shortDescription}</h3>
      {task.title && <p className="mt-2 text-sm text-slate-600">{task.shortDescription}</p>}
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">{task.description}</p>
      {onEdit && (
        <button type="button" disabled={disabled} onClick={() => onEdit(task)}
          className="mt-4 rounded-lg border px-3 py-2 text-sm disabled:opacity-50">
          Editar
        </button>
      )}
    </article>
  );
}
