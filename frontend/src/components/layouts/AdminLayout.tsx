import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
  Home
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Inventory Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Product Catalog', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Order Management', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Customer Insights', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Reports & Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
    { name: 'Store Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { name: 'Go to Storefront', icon: <Home size={20} />, path: '/' },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out border-r border-[#334155]`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-[#334155]">
            <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sc-orange rounded flex items-center justify-center font-bold text-white shrink-0">SC</div>
                <span className="text-lg font-extrabold tracking-tight">SwiftCart <span className="text-sc-orange text-xs align-top uppercase">Seller</span></span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <li key={item.path}>
                    <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
                        isActive
                            ? 'bg-sc-orange text-white shadow-md shadow-sc-orange/20 font-semibold'
                            : 'text-slate-400 hover:bg-[#334155] hover:text-white'
                        }`}
                    >
                        <span className={`${isActive ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                    </Link>
                    </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-[#334155] bg-[#0f172a]/50">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-slate-400 hover:bg-sc-danger/10 hover:text-sc-danger transition-all duration-200">
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout Store</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-md text-slate-500">
                <Menu size={20} />
              </button>
            )}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search orders, products, or help..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1">
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 relative">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-sc-danger rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hidden sm:block">
                   <Settings size={20} />
                </button>
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">Ravi Verma</p>
                <p className="text-[11px] text-sc-orange font-bold uppercase mt-1">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-slate-100 overflow-hidden shadow-sm">
                 <img 
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80" 
                    alt="Admin Profile" 
                    className="w-full h-full object-cover"
                 />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
