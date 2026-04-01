import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  ChevronLeft, 
  Package, 
  User as UserIcon, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Printer,
  History
} from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to fetch order', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      await api.put(`/orders/admin/${id}`, { orderStatus: status, note });
      setNote('');
      fetchOrder();
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400 font-medium">Syncing Order Data...</div>;
  if (!order) return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Order Record Not Found</h2>
        <button onClick={() => navigate('/admin/orders')} className="mt-4 text-sc-orange font-bold hover:underline">Back to Order List</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/admin/orders')}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    Order <span className="text-sc-orange uppercase">#{order.id.slice(-8)}</span>
                </h1>
                <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
                    <Clock size={14} /> Received on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
            </div>
        </div>
        <div className="flex gap-3">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                <Printer size={16} /> Print Packing Slip
             </button>
             <div className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider border shadow-sm ${
                order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                order.orderStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                'bg-blue-50 text-sc-blue-dark border-blue-100'
             }`}>
                {order.orderStatus}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order Items & Customer Details */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Items List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <Package size={20} className="text-slate-400" />
                    <h2 className="font-extrabold text-slate-800">Purchased Items ({order.items.length})</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {order.items.map((item: any, i: number) => (
                        <div key={i} className="p-6 flex items-center gap-6 hover:bg-slate-50/30 transition-colors">
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-lg flex-shrink-0 p-2">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter">SKU: {order.id.slice(0, 4)}-{item.productId.slice(-4)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900">{formatINR(item.price)}</p>
                                <p className="text-xs text-slate-500 mt-1">Quantity: <span className="font-bold">{item.quantity}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col items-end gap-2">
                    <div className="flex justify-between w-full max-w-[240px] text-sm text-slate-500 font-medium italic">
                        <span>Net Subtotal:</span>
                        <span>{formatINR(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[240px] text-sm text-emerald-600 font-bold">
                        <span>Shipping (Promotion):</span>
                        <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[240px] text-xl font-black text-slate-900 border-t border-slate-200 pt-2 mt-2">
                        <span>Grand Total:</span>
                        <span>{formatINR(order.totalAmount)}</span>
                    </div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4">
                        <UserIcon size={18} />
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">Contact Details</h3>
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800">{order.user?.name || 'Guest User'}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">{order.user?.email || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4">
                        <MapPin size={18} />
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">Dispatch Address</h3>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed">
                        <p className="font-bold text-slate-700">{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                        <p className="uppercase tracking-tighter font-bold mt-1 text-xs">{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>

        </div>

        {/* Right Column: Actions & Timeline */}
        <div className="space-y-8">
            
            {/* Fulfillment Actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4">
                    <Truck size={18} />
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">Update Fulfillment</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Status</label>
                        <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-sc-orange/50 transition-all cursor-pointer"
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateStatus(e.target.value)}
                            disabled={updating}
                        >
                            <option value="PLACED">Placed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Logistics Note</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            placeholder="Add tracking ID or internal updates here..."
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sc-orange/50 transition-all resize-none"
                        ></textarea>
                    </div>

                    {updating && (
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-sc-orange animate-pulse">
                            <Clock size={14} /> Syncing update to database...
                        </div>
                    )}
                </div>
            </div>

            {/* Audit Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-slate-400 border-b border-slate-100 pb-4">
                    <History size={18} />
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">Activity Audit</h3>
                </div>
                
                <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 before:-z-0">
                    {order.timeline.slice().reverse().map((update: any, i: number) => (
                        <div key={i} className="flex gap-4 relative z-10">
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mt-1 shrink-0 ${i === 0 ? 'bg-sc-orange animate-pulse' : 'bg-slate-300'}`}></div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{update.status}</p>
                                    <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{new Date(update.timestamp).toLocaleDateString()} {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium italic mt-1 leading-relaxed">"{update.note || 'No additional notes logged.'}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
