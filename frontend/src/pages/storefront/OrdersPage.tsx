import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, RotateCcw, ChevronRight, Search, AlertCircle, Clock, X, Star } from 'lucide-react';
import { getMyOrders, returnOrder, cancelOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const OrdersPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Orders');

    // Modal States
    const [returnModal, setReturnModal] = useState<{ isOpen: boolean, orderId: string, reason: string }>({
        isOpen: false,
        orderId: '',
        reason: ''
    });
    const [trackModal, setTrackModal] = useState<{ isOpen: boolean, order: any | null }>({
        isOpen: false,
        order: null
    });
    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean, product: any | null, rating: number, comment: string }>({
        isOpen: false,
        product: null,
        rating: 5,
        comment: ''
    });
    const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean, orderId: string, feedback: string }>({
        isOpen: false,
        orderId: '',
        feedback: ''
    });
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean, orderId: string, reason: string }>({
        isOpen: false,
        orderId: '',
        reason: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getMyOrders();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async () => {
        try {
            const data = await returnOrder(returnModal.orderId, returnModal.reason);
            if (data.success) {
                setReturnModal({ isOpen: false, orderId: '', reason: '' });
                fetchOrders();
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to process return');
        }
    };

    const handleCancel = async () => {
        try {
            const data = await cancelOrder(cancelModal.orderId, cancelModal.reason);
            if (data.success) {
                setCancelModal({ isOpen: false, orderId: '', reason: '' });
                fetchOrders();
                alert('Order cancelled successfully. Stock has been restored.');
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PLACED': return { icon: <Clock className="text-blue-500" size={18} />, text: 'Order Placed', color: 'bg-blue-50 text-blue-700' };
            case 'PROCESSING': return { icon: <Package className="text-yellow-600" size={18} />, text: 'Processing', color: 'bg-yellow-50 text-yellow-700' };
            case 'SHIPPED': return { icon: <Truck className="text-purple-600" size={18} />, text: 'Shipped', color: 'bg-purple-50 text-purple-700' };
            case 'OUT_FOR_DELIVERY': return { icon: <Truck className="text-indigo-600" size={18} />, text: 'Out for delivery', color: 'bg-indigo-50 text-indigo-700' };
            case 'DELIVERED': return { icon: <CheckCircle className="text-green-600" size={18} />, text: 'Delivered', color: 'bg-green-50 text-green-700' };
            case 'CANCELLED': return { icon: <AlertCircle className="text-red-500" size={18} />, text: 'Cancelled', color: 'bg-red-50 text-red-700' };
            case 'RETURNED': return { icon: <RotateCcw className="text-orange-500" size={18} />, text: 'Returned', color: 'bg-orange-50 text-orange-700' };
            default: return { icon: <Package size={18} />, text: status, color: 'bg-gray-50 text-gray-700' };
        }
    };

    const getFilteredOrders = () => {
        switch(activeTab) {
            case 'Buy Again':
                return orders.filter(o => o.orderStatus === 'DELIVERED');
            case 'Not Yet Shipped':
                return orders.filter(o => ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.orderStatus));
            case 'Cancelled':
                return orders.filter(o => o.orderStatus === 'CANCELLED');
            default:
                return orders;
        }
    };

    const filteredOrders = getFilteredOrders();

    if (loading) {
        return (
            <div className="max-w-[1100px] mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 w-48 mb-6 rounded"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-gray-100 mb-6 rounded-lg"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 py-8">
            <nav className="flex items-center text-sm text-gray-500 mb-4">
                <Link to="/profile" className="hover:text-sc-orange hover:underline">Your Account</Link>
                <ChevronRight size={14} className="mx-2" />
                <span className="text-sc-orange font-medium">Your Orders</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-medium text-gray-900">Your Orders</h1>
                <div className="relative flex-1 max-w-md">
                    <input 
                        type="text" 
                        placeholder="Search all orders" 
                        className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded shadow-sm focus:ring-1 focus:ring-sc-blue-light focus:border-sc-blue-light outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            <div className="border-b border-gray-300 mb-6 flex gap-8">
                {['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 transition-colors ${activeTab === tab ? 'border-b-2 border-sc-orange font-bold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-lg border text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4">{activeTab === 'Orders' ? "Looks like you haven't placed any orders yet." : `No ${activeTab.toLowerCase()} orders found.`}</p>
                    {activeTab === 'Orders' && (
                        <Link to="/" className="a-button-primary inline-flex items-center px-6 py-2">
                            Start Shopping
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const status = getStatusInfo(order.orderStatus);
                        return (
                            <div key={order.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="bg-[#f0f2f2] px-6 py-3 border-b flex flex-wrap justify-between items-center text-[12px] text-gray-600 gap-y-2">
                                    <div className="flex gap-10">
                                        <div>
                                            <p className="uppercase font-medium mb-1">Order Placed</p>
                                            <p className="text-gray-900 font-bold">{format(new Date(order.createdAt), 'dd MMMM yyyy')}</p>
                                        </div>
                                        <div>
                                            <p className="uppercase font-medium mb-1">Total</p>
                                            <p className="text-gray-900 font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="uppercase font-medium mb-1">Ship To</p>
                                            <div className="group relative">
                                                <p className="text-blue-600 hover:text-sc-orange cursor-pointer flex items-center">
                                                    {user?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="uppercase font-medium mb-1">Order # {order.id.slice(-12).toUpperCase()}</p>
                                        <div className="flex gap-2 justify-end">
                                            <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-sc-orange hover:underline">View order details</Link>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-blue-600 hover:text-sc-orange hover:underline cursor-pointer">Invoices</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        {status.icon}
                                        <h3 className="font-bold text-lg text-gray-900">{status.text}</h3>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="w-24 h-24 object-contain border rounded p-1"
                                                    />
                                                    <div>
                                                        <Link to={`/product/${item.productId}`} className="text-blue-600 hover:text-sc-orange font-medium line-clamp-2">
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                                        <button 
                                                            onClick={() => { /* Re-add logic or Buy Now logic */ }}
                                                            className="mt-2 a-button-secondary text-xs px-3 py-1 flex items-center gap-1"
                                                        >
                                                            <RotateCcw size={12} /> Buy it again
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="w-full md:w-64 space-y-2 flex flex-col">
                                            <button 
                                                onClick={() => setTrackModal({ isOpen: true, order })}
                                                className="a-button-primary text-center py-1.5 text-sm"
                                            >
                                                Track package
                                            </button>
                                            {order.orderStatus === 'DELIVERED' ? (
                                                <button 
                                                    onClick={() => setReturnModal({ isOpen: true, orderId: order.id, reason: '' })}
                                                    className="a-button-secondary text-center py-1.5 text-sm"
                                                >
                                                    Return items
                                                </button>
                                            ) : order.orderStatus === 'RETURNED' ? (
                                                <button className="bg-green-50 text-green-700 font-bold border border-green-200 text-center py-1.5 text-sm rounded cursor-default">
                                                    Return Successful
                                                </button>
                                            ) : (['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.orderStatus)) ? (
                                                <button 
                                                    onClick={() => setCancelModal({ isOpen: true, orderId: order.id, reason: '' })}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium border border-red-100 rounded py-1.5 hover:bg-red-50 transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            ) : null}
                                            <button className="a-button-secondary text-center py-1.5 text-sm">
                                                Share gift receipt
                                            </button>
                                            <button 
                                                onClick={() => setFeedbackModal({ isOpen: true, orderId: order.id, feedback: '' })}
                                                className="a-button-secondary text-center py-1.5 text-sm"
                                            >
                                                Leave seller feedback
                                            </button>
                                            <button 
                                                onClick={() => setReviewModal({ isOpen: true, product: order.items[0], rating: 5, comment: '' })}
                                                className="a-button-secondary text-center py-1.5 text-sm"
                                            >
                                                Write a product review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            
            {/* Return Modal */}
            {returnModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
                        <h2 className="text-xl font-bold mb-4">Return Item</h2>
                        <div className="space-y-4">
                            <select 
                                className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-sc-orange"
                                value={returnModal.reason}
                                onChange={(e) => setReturnModal({ ...returnModal, reason: e.target.value })}
                            >
                                <option value="">Select a reason</option>
                                <option value="Defective">Defective</option>
                                <option value="Wrong Item">Wrong Item</option>
                                <option value="No longer needed">No longer needed</option>
                            </select>
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setReturnModal({ ...returnModal, isOpen: false })} className="px-4 py-2 text-sm border rounded">Cancel</button>
                                <button onClick={handleReturn} disabled={!returnModal.reason} className="px-4 py-2 text-sm bg-sc-orange text-white rounded disabled:opacity-50">Confirm Return</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 text-red-600 mb-4">
                            <AlertCircle size={24} />
                            <h2 className="text-xl font-bold">Cancel Order?</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Arriving Tomorrow. Are you sure you want to cancel?</p>
                        <div className="space-y-4">
                            <select 
                                className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
                                value={cancelModal.reason}
                                onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                            >
                                <option value="">Select a reason</option>
                                <option value="By mistake">Ordered by mistake</option>
                                <option value="Price too high">Price too high</option>
                                <option value="Changed mind">Changed my mind</option>
                            </select>
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setCancelModal({ ...cancelModal, isOpen: false })} className="px-4 py-2 text-sm border rounded">Don't Cancel</button>
                                <button onClick={handleCancel} disabled={!cancelModal.reason} className="px-4 py-2 text-sm bg-red-600 text-white rounded">Confirm Cancellation</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Modal */}
            {trackModal.isOpen && trackModal.order && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Track Package</h2>
                            <button onClick={() => setTrackModal({ isOpen: false, order: null })}><X size={24} /></button>
                        </div>
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 mt-6">
                            {['PLACED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status) => {
                                const currentIndex = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].indexOf(trackModal.order.orderStatus);
                                const itemIndex = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].indexOf(status);
                                const isCompleted = itemIndex <= currentIndex;
                                return (
                                    <div key={status} className="relative">
                                        <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full border-4 border-white z-10 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`}>
                                            {isCompleted && <CheckCircle size={14} className="text-white absolute inset-0 m-auto" />}
                                        </div>
                                        <p className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{status.replace(/_/g, ' ')}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal (Truncated for simplicity) */}
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl text-center">
                        <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-4">Feedback Received</h2>
                        <button onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })} className="a-button-primary px-8 py-2">Close</button>
                    </div>
                </div>
            )}

            {/* Review Modal (Truncated for simplicity) */}
            {reviewModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Create Review</h2>
                        <div className="flex gap-2 text-sc-orange mb-6">
                            {[1,2,3,4,5].map(s => <Star key={s} size={32} className={s <= reviewModal.rating ? 'fill-sc-orange' : ''} onClick={() => setReviewModal({...reviewModal, rating: s})} />)}
                        </div>
                        <button onClick={() => { alert('Submitted!'); setReviewModal({ ...reviewModal, isOpen: false }); }} className="a-button-primary w-full py-2">Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
