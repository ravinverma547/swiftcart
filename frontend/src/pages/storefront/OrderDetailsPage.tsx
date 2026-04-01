import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  User as UserIcon,
  CreditCard,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">Fetching Order Confirmation...</div>;
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Package size={64} className="text-slate-200" />
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/products" className="text-sc-orange font-bold hover:underline">Back to Storefront</Link>
    </div>
  );

  const statusSteps = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStatusIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 font-sans animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Success Header */}
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sc-orange to-orange-400"></div>
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle size={48} strokeWidth={2.5} />
                </div>
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900">Purchase Confirmed!</h1>
                <p className="text-slate-500 max-w-lg mx-auto">
                    A copy of your receipt for order <span className="font-bold text-slate-800 uppercase">#{order.id.slice(-8)}</span> has been sent to your email.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-50">
               <Link to="/products" className="flex items-center gap-2 px-8 py-3 bg-sc-orange text-white rounded-xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-sc-orange/20">
                  Continue Shopping <ChevronRight size={18} />
               </Link>
               <button onClick={() => window.print()} className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Generate PDF Invoice
               </button>
            </div>
        </div>

        {/* Live Tracking Timeline */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 space-y-10">
          <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                 <Truck size={24} className="text-sc-orange" /> Real-time Logistics
              </h2>
              <span className="text-[10px] uppercase font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 tracking-widest">Live Status</span>
          </div>
          
          <div className="relative flex justify-between items-start pt-2">
             {['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, i) => (
               <div key={step} className="flex flex-col items-center z-10 w-24">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-md transition-all duration-500 ${currentStatusIndex >= i ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-100 text-slate-300'}`}>
                     {currentStatusIndex >= i ? <CheckCircle size={20} strokeWidth={3} /> : <span className="text-xs font-black">{i + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-black text-center uppercase tracking-widest leading-tight ${currentStatusIndex >= i ? 'text-emerald-600' : 'text-slate-400'}`}>{step}</span>
               </div>
             ))}
             {/* Progress Bar Background */}
             <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-slate-100 -z-0"></div>
             {/* Dynamic Progress Bar */}
             <div className={`absolute top-5 left-[10%] h-[3px] bg-emerald-500/30 -z-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]`} style={{ width: `${(currentStatusIndex / 4) * 80}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Recipient Details */}
           <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 space-y-6">
              <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2"><MapPin size={16} /> Shipping Recipient</h3>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                    <UserIcon size={24} />
                 </div>
                 <div className="text-sm space-y-1">
                    <p className="font-black text-slate-900 text-lg uppercase tracking-tighter">{order.user?.name || 'Valued Customer'}</p>
                    <p className="text-slate-500 font-medium">{order.shippingAddress.street}</p>
                    <p className="text-slate-500 font-medium">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    <p className="text-slate-400 font-black text-[10px] pt-1">{order.shippingAddress.country}</p>
                 </div>
              </div>
           </div>

           {/* Financial Summary */}
           <div className="md:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 text-white space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
              <h3 className="font-black text-slate-500 text-xs uppercase tracking-widest flex items-center gap-2"><CreditCard size={16} /> Bill Summary</h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between text-slate-400 font-bold">
                    <span>Transaction Value:</span>
                    <span className="text-white">{formatINR(order.totalAmount)}</span>
                 </div>
                 <div className="flex justify-between text-slate-400 font-bold italic">
                    <span>Shipping Fee:</span>
                    <span className="text-emerald-400 font-black">COMPLIMENTARY</span>
                 </div>
                 <div className="flex justify-between text-4xl font-black pt-6 border-t border-white/10 mt-6 text-sc-orange drop-shadow-lg">
                    <span>Total Bill:</span>
                    <span>{formatINR(order.totalAmount)}</span>
                 </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 text-[11px] text-slate-400 font-medium">
                  <Package size={14} /> This order qualifies for 30-day easy returns & SwiftCart Prime Guarantee.
              </div>
           </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 space-y-8">
          <h3 className="font-black text-slate-800 text-xl flex items-center gap-2"><Calendar size={20} className="text-sc-orange" /> Order Activity Audit</h3>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {order.timeline.map((update: any, i: number) => (
              <div key={i} className="flex gap-6 relative">
                 <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0 z-10 ${i === order.timeline.length - 1 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                 <div className="space-y-1">
                   <div className="flex items-center gap-3">
                     <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{update.status}</p>
                     <p className="text-[10px] text-slate-400 font-bold italic">{new Date(update.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                   </div>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{update.note || 'Internal logistics update processed.'}"</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
            <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-sc-orange font-black text-xs uppercase tracking-widest transition-colors">
                <ArrowLeft size={14} /> Return to Order History
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
