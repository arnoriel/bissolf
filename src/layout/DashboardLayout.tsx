import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Settings,
  LogOut,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../lib/supabase';

export const DashboardLayout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/analyzer', label: 'AI Analyzer', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 fixed h-full hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">BISSOLF</h1>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
              {profile?.image_profile ? (
                <img 
                  src={getProfileImageUrl(profile.image_profile)} 
                  alt={profile.store_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <Store size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate text-sm">{profile?.store_name || 'My Store'}</p>
              <p className="text-xs text-gray-400 truncate">Seller Account</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-black text-gray-900">BISSOLF</h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
            {profile?.image_profile ? (
              <img 
                src={getProfileImageUrl(profile.image_profile)} 
                alt={profile.store_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                <Store size={16} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around z-50">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                         (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};