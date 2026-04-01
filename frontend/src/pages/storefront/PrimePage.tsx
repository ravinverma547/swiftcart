import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Check, Crown, Zap, Truck, Tag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrimePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleJoinPrime = async () => {
        setLoading(true);
        try {
            const { data } = await api.put('/auth/prime');
            if (data.success) {
                alert('Congratulations! You are now a SwiftCart Prime member.');
                window.location.reload(); // Refresh to update user state globally
            }
        } catch (err) {
            console.error('Failed to join Prime', err);
            alert('Failed to join Prime. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: <Truck className="text-sc-orange" />, title: 'FREE Delivery', desc: 'Unlimited FREE One-Day & Two-Day delivery on eligible items.' },
        { icon: <Tag className="text-sc-yellow" />, title: '5% Extra Savings', desc: 'Automatic 5% discount on all products, every single time.' },
        { icon: <Zap className="text-blue-500" />, title: 'Exclusive Access', desc: 'Get early access to lightening deals and sales.' },
        { icon: <ShieldCheck className="text-green-500" />, title: 'Priority Support', desc: '24/7 dedicated customer support for Prime members.' }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <div className="bg-sc-blue-dark text-white py-20 px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center z-10 relative">
                    <div className="inline-flex items-center gap-2 bg-sc-orange/20 text-sc-orange px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                        <Crown size={18} /> THE ULTIMATE SHOPPING EXPERIENCE
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight">SwiftCart <span className="text-sc-orange">Prime</span></h1>
                    <p className="text-xl text-sc-gray-medium mb-10 max-w-2xl mx-auto">
                        Join millions of members who enjoy free delivery, exclusive deals, and 5% extra savings on everything.
                    </p>
                    
                    {!user?.isPrime ? (
                        <button 
                            onClick={handleJoinPrime}
                            disabled={loading}
                            className="bg-sc-yellow hover:bg-sc-yellow-hover text-sc-blue-dark px-12 py-4 rounded-md font-black text-lg transition-all shadow-xl hover:-translate-y-1 transform active:scale-95"
                        >
                            {loading ? 'Processing...' : 'Join Prime for ₹300/year'}
                        </button>
                    ) : (
                        <div className="bg-green-500/20 text-green-400 border border-green-500/50 inline-flex items-center gap-2 px-8 py-3 rounded-md font-bold">
                            <Check size={20} /> You are a Prime Member
                        </div>
                    )}
                </div>
                
                {/* Abstract background elements */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-sc-orange opacity-5 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-[100px]" />
            </div>

            {/* Benefits Grid */}
            <div className="max-w-[1200px] mx-auto py-20 px-4">
                <h2 className="text-3xl font-bold text-center mb-16">Everything included with Prime</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="p-8 border rounded-2xl hover:shadow-2xl transition-all hover:border-sc-orange/30 group">
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price section */}
            {!user?.isPrime && (
                <div className="bg-gray-50 py-20">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div className="bg-white p-12 rounded-3xl shadow-xl border relative">
                             <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sc-orange text-white px-6 py-2 rounded-full text-sm font-bold">LIMITED TIME OFFER</div>
                             <h3 className="text-2xl font-bold mb-4">Prime Annual Membership</h3>
                             <div className="text-5xl font-black mb-4">₹300<span className="text-lg text-gray-500 font-normal">/year</span></div>
                             <p className="text-gray-600 mb-8 max-w-sm mx-auto">Cancel anytime. Your benefits will start immediately after joining.</p>
                             <button 
                                onClick={handleJoinPrime}
                                disabled={loading}
                                className="w-full max-w-md bg-sc-blue-dark text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors"
                             >
                                Get Started with Prime
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrimePage;
