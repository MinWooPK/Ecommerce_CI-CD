import { Outlet } from "react-router-dom";
import Header from "../../presentation/components/Header";
import Sidebar from "../../presentation/components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto max-w-7xl p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
