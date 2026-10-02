import { Link } from "react-router-dom";
import type { Project } from "../../types/Project";
const labels = {
  planning: "Planning",
  "in-progress": "In progress",
  completed: "Completed",
};
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex justify-between gap-3">
        <span className={`h-3 w-3 rounded-full ${project.color}`} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {labels[project.status]}
        </span>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        {project.title}
      </h2>
      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
        {project.description}
      </p>
      <div className="mt-6 flex justify-between text-sm">
        <span className="font-medium text-slate-700">Progress</span>
        <span className="font-semibold text-violet-600">
          {project.progress}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${project.color}`}
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <p className="mt-4 text-xs text-slate-400">
        {project.completedTasks} of {project.totalTasks} tasks completed
      </p>
    </Link>
  );
}
