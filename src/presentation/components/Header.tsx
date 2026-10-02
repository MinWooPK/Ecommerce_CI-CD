import { useProductStore } from "../../store/useProductStore";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function Header() {
  const cartCount = useProductStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminamos user y token del estado
    logout();
    useProductStore.getState().clearCart();

    // Eliminamos también el almacenamiento persistido de Zustand
    useAuthStore.persist.clearStorage();

    // Mandamos al usuario al login
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div>
        <p className="text-sm text-slate-400">Welcome back,</p>

        <p className="font-semibold text-slate-800">{user?.name} 👋</p>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/shop/cart" className="text-sm font-semibold text-violet-600">Carrito ({cartCount})</Link>
        <Link to="/profile">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-600">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
