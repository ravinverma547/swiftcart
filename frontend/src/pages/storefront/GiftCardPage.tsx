import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Gift, Clock, Copy, CheckCircle, Smartphone, Tv, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const GiftCardPage: React.FC = () => {
    const { user } = useAuth();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const { data } = await api.get('/coupons/my');
                if (data.success) {
                    setCoupons(data.coupons);
                }
            } catch (err) {
                console.error('Failed to fetch coupons', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchCoupons();
    }, [user]);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const calculateTimeLeft = (expiry: string) => {
        const difference = +new Date(expiry) - +new Date();
        if (difference <= 0) return 'Expired';

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        return `${hours}h ${minutes}m left`;
    };

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-20">
            {/* Premium Header Banner */}
            <div className="bg-gradient-to-r from-sc-blue-dark to-sc-blue-light text-white py-12 px-4 shadow-lg overflow-hidden relative">
                <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4">
                            <Gift size={48} className="text-sc-yellow" />
                            Your SwiftRewards
                        </h1>
                        <p className="text-lg text-sc-gray-medium max-w-xl">
                            Exclusive 15% OFF coupons earned from your ₹50,000+ daily spends. 
                            Use them before they expire in 48 hours!
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-pulse">
                        <div className="text-sc-yellow font-black text-2xl">UP TO 15% OFF</div>
                        <div className="text-xs uppercase tracking-widest text-white/70">Per Daily Achievement</div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sc-orange/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sc-yellow/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
            </div>

            <div className="max-w-[1240px] mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Rewards Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-sc-blue-dark flex items-center gap-2">
                        <CheckCircle className="text-green-600" />
                        Available Coupons ({coupons.length})
                    </h2>

                    {loading ? (
                        <div className="bg-white p-20 rounded-2xl shadow-sm flex flex-col items-center gap-4 text-gray-400">
                             <div className="w-12 h-12 border-4 border-sc-orange border-t-transparent rounded-full animate-spin"></div>
                             <p className="font-medium">Fetching your rewards...</p>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="bg-white p-20 rounded-2xl shadow-sm border border-gray-200 text-center space-y-6">
                            <div className="bg-sc-gray-light w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                                <Gift size={40} className="text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-sc-blue-dark">No Active Coupons Yet</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Spend over **₹50,000** in a single day to unlock a **15% Discount** coupon code!
                                </p>
                            </div>
                            <Link to="/" className="inline-block px-10 py-3 bg-sc-yellow hover:bg-sc-yellow-hover text-sc-blue-dark font-black rounded-lg transition-all shadow-md">
                                Start Shopping Now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {coupons.map((coupon) => (
                                <div key={coupon.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:scale-[1.02] transition-transform duration-300">
                                    <div className="bg-gradient-to-br from-sc-orange to-red-500 text-white p-8 md:w-48 flex flex-col items-center justify-center text-center">
                                        <div className="text-4xl font-black tracking-tighter">15%</div>
                                        <div className="text-xs font-bold uppercase tracking-widest opacity-80">Discount</div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="space-y-2 text-center md:text-left">
                                            <div className="text-sm font-bold text-sc-blue-light uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                                                <Smartphone size={14} /> Mobiles & More...
                                            </div>
                                            <div className="text-2xl font-black text-sc-blue-dark font-mono bg-sc-gray-light px-4 py-2 rounded-lg border border-dashed border-gray-400 select-all">
                                                {coupon.code}
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-red-600 font-bold text-sm">
                                                <Clock size={16} /> {calculateTimeLeft(coupon.expiresAt)}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(coupon.code)}
                                            className="w-full md:w-auto px-8 py-3 bg-sc-blue-dark hover:bg-sc-blue-light text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                                        >
                                            {copiedCode === coupon.code ? (
                                                <><CheckCircle size={20} className="text-green-400" /> Copied!</>
                                            ) : (
                                                <><Copy size={20} /> Copy Code</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-sc-blue-dark text-white p-8 rounded-2xl shadow-xl space-y-6">
                        <h3 className="text-xl font-bold border-b border-white/20 pb-4">How it works</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="bg-sc-yellow text-sc-blue-dark w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0">1</div>
                                <p className="text-sm">Shop for over **₹50,000** worth of products in one day.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-sc-yellow text-sc-blue-dark w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0">2</div>
                                <p className="text-sm">Receive a unique **15% OFF Coupon** automatically in this section.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-sc-yellow text-sc-blue-dark w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0">3</div>
                                <p className="text-sm">Use the code at checkout! Remember, each code expires in **48 hours**.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-4 text-center">
                        <Tv className="mx-auto text-sc-blue-light" size={48} />
                        <h4 className="font-bold text-sc-blue-dark">Upcoming MiniTV Rewards</h4>
                        <p className="text-xs text-gray-500 italic">Stay tuned for exclusive rewards for our frequent shoppers!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCardPage;
