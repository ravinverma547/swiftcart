import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar, 
  TrendingUp,
  Download
} from 'lucide-react';
import api from '../../services/api';
import { format } from 'date-fns';

const AdminCustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Total Customers', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+0%' },
    { title: 'New (30d)', value: '0', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0%' },
    { title: 'Admins', value: '0', icon: UserCheck, color: 'text-sc-orange', bg: 'bg-orange-50', trend: 'Static' },
    { title: 'Churn Rate', value: '0%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', trend: '0%' },
  ]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/admin/users');
      if (data.success) {
        const users = data.users;
        setCustomers(users);

        // Calculate Stats
        const total = users.length;
        const admins = users.filter((u: any) => u.role === 'ADMIN').length;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = users.filter((u: any) => new Date(u.createdAt) > thirtyDaysAgo).length;

        setStats([
          { title: 'Total Customers', value: total.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: `+${newUsers} new` },
          { title: 'New (30d)', value: newUsers.toString(), icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Growing' },
          { title: 'Admin Staff', value: admins.toString(), icon: UserCheck, color: 'text-sc-orange', bg: 'bg-orange-50', trend: 'Secure' },
          { title: 'Platform Health', value: '100%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Stable' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400 font-medium animate-pulse">
        Fetching secure customer records...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Customer Insights</h1>
          <p className="text-slate-500 text-sm mt-1">Direct view of active users and platform participants.</p>
        </div>
        <button className="bg-sc-orange text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-sc-orange/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
          <Download size={18} />
          Export User List
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange outline-none transition-all font-bold"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
               <Filter size={20} />
             </button>
             <button onClick={() => fetchUsers()} className="text-sm font-bold text-sc-orange hover:underline px-2">Refresh List</button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Verified Profile</th>
                <th className="px-8 py-5">Account Status</th>
                <th className="px-8 py-5">Lifecycle Stage</th>
                <th className="px-8 py-5">Engagement</th>
                <th className="px-8 py-5 text-right font-black">...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sc-blue-dark/5 text-sc-blue-dark rounded-xl flex items-center justify-center font-black shadow-inner text-lg border border-slate-100 uppercase">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                             {c.name}
                             {c.role === 'ADMIN' && <span className="bg-sc-orange/10 text-sc-orange text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase border border-sc-orange/20">Admin</span>}
                          </p>
                          <p className="text-slate-400 text-xs flex items-center gap-1 mt-1 font-medium">
                             <Mail size={12} className="opacity-50" /> {c.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        c.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        Verified {c.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                        <Calendar size={12} /> Joined On
                      </p>
                      <p className="font-bold text-slate-700">{format(new Date(c.createdAt), 'dd MMM yyyy')}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">Low Latency</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-300 group-hover:text-sc-orange transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">No matching customers located in system memory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
