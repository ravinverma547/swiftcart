import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Eye, Filter, Download, MoreHorizontal, Calendar, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../utils/formatCurrency';

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/admin/all');
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch admin orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/admin/${id}`, { orderStatus: status });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400 font-medium font-sans">Syncing Orders...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Order Management</h1>
            <p className="text-slate-500 text-sm mt-1">Track, manage and fulfill customer purchase requests.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
             <Download size={16} /> Export CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-sc-blue-dark text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-sc-blue-dark/20 transition-all">
             <Filter size={16} /> Advanced Filter
           </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {orders.length > 0 ? (
                    orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-6">
                            <div className="flex flex-col">
                                <span className="font-mono text-xs text-sc-orange font-bold bg-orange-50 px-2 py-0.5 rounded w-fit capitalize">#{order.id.slice(-8).toUpperCase()}</span>
                                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><CreditCard size={10} /> Online Payment</span>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{order.user?.name || 'Guest Customer'}</p>
                                    <p className="text-[11px] text-slate-400">{order.user?.email || 'No email provided'}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                        </td>
                        <td className="px-6 py-6 font-extrabold text-slate-900">{formatINR(order.totalAmount)}</td>
                        <td className="px-6 py-6">
                            <select 
                                className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all appearance-none ${
                                    order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    order.orderStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    order.orderStatus === 'PROCESSING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-blue-50 text-sc-blue-dark border-blue-100'
                                }`}
                                value={order.orderStatus}
                                onChange={(e) => updateStatus(order.id, e.target.value)}
                            >
                                <option value="PLACED">Placed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </td>
                        <td className="px-6 py-6 text-right">
                            <div className="flex justify-end gap-2 text-slate-400">
                                <Link to={`/admin/orders/${order.id}`} className="p-2 hover:text-sc-orange hover:bg-orange-50 rounded-lg transition-all border border-transparent hover:border-orange-100">
                                    <Eye size={18} />
                                </Link>
                                <button className="p-2 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">No customer orders available to display.</td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
        
        {/* Table Footer / Pagination Placeholder */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <p>Showing {orders.length} orders</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;
