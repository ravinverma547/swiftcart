import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ArrowRight,
  IndianRupee,
  Wallet
} from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: orderData } = await api.get('/orders/admin/all');
        const { data: productData } = await api.get('/products');
        
        const orders = orderData.orders || [];
        const products = productData.products || [];
        const totalSales = orders.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0);
        
        setStats({
          totalSales,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: 148, // Placeholder for real user count
          recentOrders: orders.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400 font-medium">Loading Analytics...</div>;

  const cards = [
    { title: 'Global Sales', value: formatINR(stats.totalSales), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', up: true },
    { title: 'Units Ordered', value: stats.totalOrders, icon: ShoppingCart, color: 'text-sc-blue-dark', bg: 'bg-blue-50', trend: '+5.2%', up: true },
    { title: 'Active Listings', value: stats.totalProducts, icon: Package, color: 'text-sc-orange', bg: 'bg-orange-50', trend: '-2.1%', up: false },
    { title: 'Customer Base', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+18.3%', up: true },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Business Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time snapshots of your SwiftCart shop performance.</p>
        </div>
        <div className="text-[11px] font-bold text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
               <div className={`p-4 rounded-xl ${card.bg} ${card.color} transition-transform group-hover:scale-110 duration-300`}>
                 <card.icon size={26} strokeWidth={2.5} />
               </div>
               <div className={`flex items-center gap-1.5 text-xs font-extrabold px-2 py-1 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                 {card.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                 {card.trend}
               </div>
            </div>
            <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">{card.title}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sc-orange/10 text-sc-orange flex items-center justify-center rounded-lg">
                    <Wallet size={20} />
                </div>
                <h2 className="font-extrabold text-slate-800">Latest Purchase Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-sc-orange hover:text-orange-600 flex items-center gap-1 group transition-colors">
                Manage All Orders <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((o: any) => (
                    <tr key={o.id} className="text-sm hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">#{o.id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-5 text-slate-700 font-semibold">{o.user?.name || 'Guest User'}</td>
                        <td className="px-6 py-5 font-bold text-slate-900">{formatINR(o.totalAmount)}</td>
                        <td className="px-6 py-5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                o.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                o.orderStatus === 'PROCESSING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-sc-blue-dark/5 text-sc-blue-dark border-sc-blue-dark/10'
                            }`}>{o.orderStatus}</span>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">No orders found in recent cycles.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini Chart Area */}
        <div className="bg-sc-blue-dark rounded-2xl p-8 flex flex-col justify-between text-white shadow-xl shadow-sc-blue-dark/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
           <div className="z-10">
               <h2 className="font-bold text-blue-200 text-xs uppercase tracking-widest">Revenue Forecast</h2>
               <div className="flex items-baseline gap-2 mt-2">
                   <span className="text-4xl font-black">{formatINR(stats.totalSales * 1.2)}</span>
                   <span className="text-[10px] text-emerald-400 font-bold opacity-80">+20% projected</span>
               </div>
           </div>
           
           <div className="z-10 flex-1 w-full flex items-end gap-2 py-10">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white/10 rounded-t-lg hover:bg-sc-orange transition-all duration-300 cursor-pointer relative group/bar" style={{ height: `${h}%` }}>
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-sc-blue-dark text-[10px] px-2 py-1 rounded-lg font-black shadow-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap">
                     {formatINR(h * 4500)}
                   </div>
                </div>
              ))}
           </div>
           
           <div className="z-10 flex justify-between w-full text-[10px] text-blue-200 font-black opacity-60">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4 ACTIVE</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
