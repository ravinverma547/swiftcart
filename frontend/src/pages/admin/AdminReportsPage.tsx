import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Package, Truck, AlertCircle, CheckCircle, Clock, Save, Trash2, Filter } from 'lucide-react';

const AdminReportsPage: React.FC = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await api.get('/reports/admin/all');
            if (data.success) {
                setReports(data.reports);
            }
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string, adminResponse: string) => {
        try {
            const { data } = await api.put(`/reports/admin/${id}`, { status, adminResponse });
            if (data.success) {
                alert('Report updated successfully');
                fetchReports();
            }
        } catch (err) {
            alert('Failed to update report');
        }
    };

    const filteredReports = filter === 'ALL' ? reports : reports.filter(r => r.status === filter);

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading reports...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-3xl font-black text-gray-900 uppercase">Customer Issues</h1>
                   <p className="text-gray-500 font-medium">Manage and solve reports from customers</p>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {['ALL', 'PENDING', 'SOLVED'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${filter === f ? 'bg-white shadow-sm text-sc-orange' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} onUpdate={handleUpdateStatus} />
                ))}
                {filteredReports.length === 0 && (
                   <div className="p-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                       <CheckCircle size={48} className="mx-auto text-green-200 mb-4" />
                       <p className="text-gray-400 font-bold">ALL CLEAR! NO PENDING REPORTS.</p>
                   </div>
                )}
            </div>
        </div>
    );
};

const ReportCard: React.FC<{ report: any, onUpdate: any }> = ({ report, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [response, setResponse] = useState(report.adminResponse || '');

    const isPending = report.status === 'PENDING';

    return (
        <div className={`bg-white rounded-2xl border-l-8 shadow-sm p-6 overflow-hidden transition-all hover:shadow-lg ${isPending ? 'border-l-red-500' : 'border-l-green-500 opacity-80'}`}>
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPending ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {report.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                             <Clock size={12} /> {new Date(report.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{report.type.replace('_', ' ')}</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border mb-4">
                         <p className="text-gray-700 leading-relaxed italic">"{report.message}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sc-orange rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                             {report.userName[0]}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{report.userName}</span>
                        <span className="text-xs text-gray-500">({report.user.email})</span>
                    </div>
                </div>

                <div className="w-full lg:w-96 flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8">
                     <div className="space-y-4">
                         <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Resolution Notes</label>
                         {editMode ? (
                             <textarea 
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                className="w-full p-3 border rounded-xl outline-none focus:border-sc-orange text-sm min-h-[100px]"
                                placeholder="Details about what was done to fix this..."
                             />
                         ) : (
                            <p className="text-sm font-medium text-gray-600">
                                {report.adminResponse || "NO RESOLUTION NOTES YET."}
                            </p>
                         )}
                     </div>

                     <div className="flex gap-2 mt-6">
                        {editMode ? (
                            <>
                               <button 
                                  onClick={() => { onUpdate(report.id, 'SOLVED', response); setEditMode(false); }}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                               >
                                  <Save size={16} /> Mark as Solved
                               </button>
                               <button 
                                  onClick={() => setEditMode(false)}
                                  className="px-4 py-2 border rounded-lg font-bold text-sm hover:bg-gray-50"
                               >
                                  Cancel
                               </button>
                            </>
                        ) : (
                            <button 
                               onClick={() => setEditMode(true)}
                               className="flex-1 bg-sc-blue-dark hover:bg-black text-white py-2 rounded-lg font-bold text-sm"
                            >
                               Edit Resolution
                            </button>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
