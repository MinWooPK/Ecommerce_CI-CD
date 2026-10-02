import { NavLink } from "react-router-dom";
const items = [
  ["⌂", "Dashboard", "/"],
  ["▣", "Categorías", "/projects"],
  ["✓", "Tasks", "/tasks"],
  ["▤", "Shop", "/shop"],
  ["◉", "Profile", "/profile"],
];
export default function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white px-5 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <NavLink
        to="/"
        className="mb-8 flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">
          P
        </span>
        ProjectFlow
      </NavLink>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {items.map(([icon, label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto hidden rounded-2xl bg-slate-900 p-4 text-sm text-slate-300 md:block">
        <p className="font-semibold text-white">Good work, MinWoo!</p>
        <p className="mt-1 text-xs leading-5">
          You completed 3 tasks this week.
        </p>
      </div>
    </aside>
  );
}
