import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../services/api';
import { Check, CreditCard, Home, ShieldCheck } from 'lucide-react';

const CheckoutPage: React.FC = () => {
    const { cart, totalPrice, totalItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form States
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'IN'
    });
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [myCoupons, setMyCoupons] = useState<any[]>([]);

    // Fetch user's coupons
    React.useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const { data } = await api.get('/coupons/my');
                if (data.success) {
                    setMyCoupons(data.coupons);
                }
            } catch (err) {
                console.error('Failed to fetch coupons', err);
            }
        };
        if (user) fetchCoupons();
    }, [user]);

    if (!user) return <Navigate to="/login" />;
    if (cart.length === 0) return <Navigate to="/cart" />;

    // Calculate Discounts / Prime Logic
    const isPrime = (user as any).isPrime;
    const primeDiscount = isPrime ? totalPrice * 0.05 : 0;
    const shippingCharge = isPrime ? 0 : 40; // Flat 40 for non-prime
    const couponDiscount = totalPrice * appliedDiscount;
    const finalTotal = totalPrice - primeDiscount - couponDiscount + shippingCharge;

    const handleApplyCoupon = async () => {
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode });
            if (data.success) {
                setAppliedDiscount(data.discountPercentage / 100);
                alert(data.message);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to apply coupon');
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: isPrime ? item.price * 0.95 : item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingAddress: address,
                totalAmount: finalTotal,
                paymentStatus: 'PAID',
                couponCode: appliedDiscount > 0 ? couponCode : undefined
            };

            const { data } = await api.post('/orders/new', orderData);
            if (data.success) {
                clearCart();
                // If a success message (like Congratulations for Coupon) exists, show it
                if (data.message) {
                    alert(data.message);
                }
                navigate(`/orders/${data.order.id}`);
            }
        } catch (error) {
            console.error('Failed to place order', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Checkout Navbar */}
            <nav className="bg-gray-50 border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-sc-blue-dark">SwiftCart Checkout</div>
                    {isPrime && <span className="bg-sc-orange text-white text-[10px] font-black px-2 py-0.5 rounded-sm">PRIME</span>}
                </div>
                <div className="flex items-center gap-8">
                    <ShieldCheck size={24} className="text-gray-400" />
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest hidden md:block">100% Secure Transaction</div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto py-10 px-4">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-sc-orange text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {step > s ? <Check size={20} /> : s}
                            </div>
                            {s < 3 && <div className={`h-1 w-20 ${step > s ? 'bg-sc-orange' : 'bg-gray-200'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold flex items-center gap-2"><Home /> 1. Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="text" placeholder="Street Address" value={address.street}
                                        onChange={e => setAddress({...address, street: e.target.value})}
                                        className="col-span-2 p-3 border rounded-lg outline-none focus:border-sc-orange"
                                    />
                                    <input 
                                        type="text" placeholder="City" value={address.city}
                                        onChange={e => setAddress({...address, city: e.target.value})}
                                        className="p-3 border rounded-lg outline-none focus:border-sc-orange"
                                    />
                                    <input 
                                        type="text" placeholder="State / Province" value={address.state}
                                        onChange={e => setAddress({...address, state: e.target.value})}
                                        className="p-3 border rounded-lg outline-none focus:border-sc-orange"
                                    />
                                    <input 
                                        type="text" placeholder="Zip / Postal Code" value={address.zip}
                                        onChange={e => setAddress({...address, zip: e.target.value})}
                                        className="p-3 border rounded-lg outline-none focus:border-sc-orange"
                                    />
                                    <select 
                                        value={address.country}
                                        onChange={e => setAddress({...address, country: e.target.value})}
                                        className="p-3 border rounded-lg outline-none focus:border-sc-orange bg-white"
                                    >
                                        <option value="IN">India</option>
                                        <option value="USA">United States</option>
                                        <option value="UK">United Kingdom</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!address.street || !address.city || !address.zip}
                                    className="px-8 py-3 bg-sc-yellow hover:bg-sc-yellow-hover rounded-lg font-bold disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    Use this address
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard /> 2. Payment Method</h2>
                                <div className="space-y-4">
                                    {['Credit Card', 'PayPal', 'SwiftPay Credits'].map(method => (
                                        <label key={method} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-sc-orange transition-colors ${paymentMethod === method ? 'border-sc-orange bg-orange-50' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="radio" name="payment" value={method} checked={paymentMethod === method}
                                                    onChange={() => setPaymentMethod(method)}
                                                    className="w-4 h-4 text-sc-orange"
                                                />
                                                <span className="font-bold">{method}</span>
                                            </div>
                                            <CreditCard size={20} className="text-gray-400" />
                                        </label>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="px-8 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">Back</button>
                                    <button onClick={() => setStep(3)} className="px-8 py-3 bg-sc-yellow hover:bg-sc-yellow-hover rounded-lg font-bold">Continue to Review</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold">3. Review Order & Delivery</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping Address</p>
                                        <div className="text-sm">
                                            <p className="font-bold">{user.name}</p>
                                            <p className="text-gray-600">{address.street}</p>
                                            <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                                            <p className="text-gray-600 font-bold mt-2 uppercase text-[10px]">{address.country}</p>
                                        </div>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Info</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                                <Check size={16} /> <span>Standard Shipping</span>
                                            </div>
                                            <p className="text-sm font-bold mt-4">Estimated Delivery:</p>
                                            <p className="text-xl font-black text-sc-blue-dark">3 - 5 Days</p>
                                            <p className="text-[10px] text-gray-400 italic">Tracking details will be sent via email.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 space-y-4">
                                    <div>
                                        <p className="text-sm font-bold mb-2 flex items-center gap-2">Apply a Coupon Code</p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter Code"
                                                className="flex-1 p-2 border rounded-md uppercase font-mono text-sm outline-none focus:border-sc-orange"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                className="bg-sc-orange text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-sc-orange-hover transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    {/* My Coupons Display */}
                                    {myCoupons.length > 0 && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Your Available Coupons</p>
                                            <div className="flex flex-wrap gap-2">
                                                {myCoupons.map((c) => (
                                                    <button 
                                                        key={c.id}
                                                        onClick={() => setCouponCode(c.code)}
                                                        className="bg-white border border-sc-orange text-sc-orange px-2 py-1 rounded text-xs font-bold hover:bg-orange-50 transition-colors"
                                                    >
                                                        {c.code} (15% OFF)
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center p-3 border-b border-gray-50">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                {isPrime && <p className="text-[10px] text-green-600 font-bold uppercase">Prime Price Applied</p>}
                                                <div className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="px-8 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">Back</button>
                                    <button 
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-sc-orange hover:bg-sc-orange-hover rounded-lg font-bold text-white shadow-lg transition-all"
                                    >
                                        {loading ? 'Processing...' : `Place Your Order - ₹${finalTotal.toLocaleString('en-IN')}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar Summary */}
                    <div className="h-fit sticky top-24">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                            <h3 className="font-bold text-lg">Order Summary</h3>
                            <div className="text-sm space-y-2 border-b pb-4">
                                <div className="flex justify-between"><span>Items ({totalItems}):</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between"><span>Shipping:</span><span className={isPrime ? "text-green-600 font-bold uppercase" : ""}>{isPrime ? "FREE" : `₹${shippingCharge}`}</span></div>
                                
                                {isPrime && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Prime 5% Discount:</span>
                                        <span>-₹{primeDiscount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                {appliedDiscount > 0 && (
                                    <div className="flex justify-between text-orange-600 font-bold">
                                        <span>Gift Card 15% Off:</span>
                                        <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between text-xl font-bold text-red-700 pt-2 border-t border-gray-300">
                                <span>Order Total:</span>
                                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center">By placing your order, you agree to SwiftCart's privacy notice and conditions of use.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
