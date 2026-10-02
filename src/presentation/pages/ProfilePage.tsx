import { useAuthStore } from "../../store/useAuthStore";

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <p>No hay una sesión iniciada.</p>;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <dl className="space-y-3">
        <div><dt className="text-sm text-slate-500">Nombre</dt><dd>{user.name}</dd></div>
        <div><dt className="text-sm text-slate-500">Email</dt><dd>{user.email}</dd></div>
        <div><dt className="text-sm text-slate-500">Rol</dt><dd>{user.role}</dd></div>
      </dl>
    </section>
  );
};
