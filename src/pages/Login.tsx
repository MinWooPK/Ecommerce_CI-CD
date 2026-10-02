import { Link } from "react-router-dom";
export default function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-5">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <Link
          to="/"
          className="flex items-center justify-center gap-3 text-xl font-bold text-slate-900"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-white">
            P
          </span>
          ProjectFlow
        </Link>
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your workspace.
          </p>
        </div>
        <form
          className="mt-7 space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <button className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700">
            Login
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-400">
          Visual demo only. No authentication is configured.
        </p>
      </section>
    </main>
  );
}
