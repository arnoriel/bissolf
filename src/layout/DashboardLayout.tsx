import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, BarChart2, Menu, X } from 'lucide-react';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`;

  // Tutup sidebar otomatis saat pindah halaman (khusus mobile)
  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white p-4 shadow-sm z-30 flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-600">BISSOLF Admin</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Background for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:shadow-md
      `}>
        <div className="p-6 hidden lg:block">
          <h2 className="text-2xl font-bold text-blue-600">BISSOLF Admin</h2>
        </div>
        
        {/* Mobile Sidebar Header */}
        <div className="p-6 lg:hidden flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)}><X className="text-gray-500"/></button>
        </div>

        <nav className="px-4 space-y-2 mt-4 lg:mt-0">
          <NavLink to="/admin" end className={navClass} onClick={handleNavClick}><LayoutDashboard size={20}/> Dashboard</NavLink>
          <NavLink to="/admin/orders" className={navClass} onClick={handleNavClick}><ShoppingCart size={20}/> Orders</NavLink>
          <NavLink to="/admin/products" className={navClass} onClick={handleNavClick}><Package size={20}/> Products</NavLink>
          <NavLink to="/admin/analyzer" className={navClass} onClick={handleNavClick}><BarChart2 size={20}/> AI Analyzer</NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};
