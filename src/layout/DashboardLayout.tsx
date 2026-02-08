import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, BarChart2 } from 'lucide-react';

export const DashboardLayout = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-full z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">BISSOLF Admin</h2>
        </div>
        <nav className="px-4 space-y-2">
          <NavLink to="/admin" end className={navClass}><LayoutDashboard size={20}/> Dashboard</NavLink>
          <NavLink to="/admin/orders" className={navClass}><ShoppingCart size={20}/> Orders</NavLink>
          <NavLink to="/admin/products" className={navClass}><Package size={20}/> Products</NavLink>
          <NavLink to="/admin/analyzer" className={navClass}><BarChart2 size={20}/> AI Analyzer</NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};