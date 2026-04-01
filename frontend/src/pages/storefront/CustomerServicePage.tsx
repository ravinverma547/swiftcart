import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { MessageSquare, AlertCircle, Package, Truck, Check, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerServicePage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [report, setReport] = useState({
        type: 'DAMAGED',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/reports/submit', report);
            if (data.success) {
                setSubmitted(true);
            }
        } catch (err) {
            console.error('Failed to submit report', err);
            alert('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                     <Check size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4">Report Submitted Successfully</h1>
                <p className="text-xl text-gray-600 mb-8 italic">
                    "We understand your issue. A new product will be provided, or it will be returned/fixed soon."
                </p>
                <div className="bg-sc-gray-light p-6 rounded-xl border border-dashed border-gray-300 mb-8">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-bold">SOLVING YOUR ISSUE</p>
                </div>
                <Link to="/orders" className="a-button-primary px-8 py-3 rounded-md font-bold">
                    Go to Your Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-sc-gray-light min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <HelpCircle size={32} className="text-sc-blue-light" /> Hello. What can we help you with?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                   {[
                       { icon: <Package size={30} className="text-sc-orange" />, label: 'A delivery, order or return' },
                       { icon: <Check size={30} className="text-green-500" />, label: 'Prime' },
                       { icon: <Truck size={30} className="text-blue-500" />, label: 'Payment settings' }
                   ].map((item, i) => (
                       <div key={item.label} className="bg-white p-6 rounded-xl shadow-sm border hover:border-sc-orange transition-all cursor-pointer flex items-center gap-4">
                           {item.icon}
                           <span className="font-bold text-sm">{item.label}</span>
                       </div>
                   ))}
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-sc-blue-dark text-white p-8">
                         <h2 className="text-2xl font-bold flex items-center gap-2">
                             <MessageSquare size={24} className="text-sc-orange" /> Report an Issue
                         </h2>
                         <p className="text-sc-gray-medium mt-2">Our team will prioritize your report and resolve it immediately.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Issue Type</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${report.type === 'DAMAGED' ? 'border-sc-orange bg-sc-orange/5' : 'hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" name="type" value="DAMAGED" 
                                        checked={report.type === 'DAMAGED'}
                                        onChange={() => setReport({ ...report, type: 'DAMAGED' })}
                                        className="w-4 h-4 text-sc-orange"
                                    />
                                    <span className="font-bold">Product Damaged or Wrong</span>
                                </label>
                                <label className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${report.type === 'NOT_ARRIVED' ? 'border-sc-orange bg-sc-orange/5' : 'hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" name="type" value="NOT_ARRIVED" 
                                        checked={report.type === 'NOT_ARRIVED'}
                                        onChange={() => setReport({ ...report, type: 'NOT_ARRIVED' })}
                                        className="w-4 h-4 text-sc-orange"
                                    />
                                    <span className="font-bold">Product Not Arrived Yet</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Tell us more</label>
                            <textarea 
                                required
                                rows={5}
                                placeholder="Please describe the issue in detail. e.g. 'I received a broken screen' or 'Order was marked as delivered but I didn't receive it'."
                                className="w-full p-4 border rounded-xl outline-none focus:border-sc-orange transition-all resize-none"
                                value={report.message}
                                onChange={(e) => setReport({ ...report, message: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit"
                                disabled={loading || !report.message}
                                className="bg-sc-orange hover:bg-sc-orange-hover text-white px-10 py-3 rounded-lg font-bold text-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending Report...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* FAQ section for professional look */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                   Need immediate assistance? <button className="text-blue-600 hover:underline font-medium">Chat with us now</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerServicePage;
