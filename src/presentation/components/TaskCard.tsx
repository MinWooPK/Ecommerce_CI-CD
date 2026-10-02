import type { Task } from "../../types/Task";
// const priority = {
//   low: "bg-sky-50 text-sky-700",
//   medium: "bg-amber-50 text-amber-700",
//   high: "bg-rose-50 text-rose-700",
// };
export default function TaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{task.title}</h3>
        {/* <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${priority[task.priority]}`}
        >
          {task.priority}
        </span> */}
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-500">
        {task.description}
      </p>
      <p className="mt-4 text-xs font-medium text-slate-400">
        Project #{task.id}
      </p>
    </article>
  );
}
