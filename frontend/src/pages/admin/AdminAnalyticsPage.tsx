import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Zap, 
  Users, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  Search,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const AdminAnalyticsPage: React.FC = () => {
  const metrics = [
    { title: 'Gross Revenue', value: '₹12,45,200', trend: '+18.5%', up: true, icon: DollarSign, color: 'text-sc-orange', bg: 'bg-orange-50' },
    { title: 'Total Conversion', value: '3.42%', trend: '+0.8%', up: true, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Avg. Order Value', value: '₹2,500', trend: '-2.1%', up: false, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Visitor Count', value: '45,200', trend: '+24.3%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const categories = [
    { name: 'Electronics', value: 45, color: 'bg-indigo-500' },
    { name: 'Fashion', value: 30, color: 'bg-sc-orange' },
    { name: 'Home & Kitchen', value: 15, color: 'bg-emerald-500' },
    { name: 'Beauty', value: 10, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-10 animate-in gap-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Intelligence Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Advanced data modeling of your shop's digital footprint.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
           <button className="px-4 py-1.5 text-xs font-bold bg-slate-100 text-slate-800 rounded-lg">Last 30 Days</button>
           <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 rounded-lg transition-colors">Quarterly</button>
           <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 rounded-lg transition-colors">Yearly</button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${m.bg} opacity-20 -mr-12 -mt-12 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500`}></div>
            <div className="flex items-center justify-between mb-4 z-10 relative">
              <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                <m.icon size={22} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black ${m.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {m.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {m.trend}
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{m.title}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-black">
                   <TrendingUp size={20} />
                </div>
                <div>
                   <h2 className="font-extrabold text-slate-800">Growth Projection</h2>
                   <p className="text-xs text-slate-400">Monthly revenue trends vs last year.</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                   <div className="w-3 h-3 bg-indigo-500 rounded-full"></div> 2024
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                   <div className="w-3 h-3 bg-slate-200 rounded-full"></div> 2023
                </div>
             </div>
          </div>
          
          <div className="flex-1 flex items-end gap-3 md:gap-5 pb-6 px-2">
             {[30, 45, 35, 60, 50, 75, 90, 85, 70, 95, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-2 group/bar">
                   <div className="bg-slate-50 border border-slate-100 rounded-t-xl h-full w-full relative overflow-hidden">
                      <div 
                         className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-700 delay-100 rounded-t-lg group-hover/bar:from-sc-orange group-hover/bar:to-sc-orange/80" 
                         style={{ height: `${h}%` }}
                      >
                         <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                      </div>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 text-center uppercase">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Category Split Dashboard */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sc-orange/10 text-sc-orange flex items-center justify-center rounded-xl font-black">
                 <PieChart size={20} />
              </div>
              <h2 className="font-extrabold text-slate-800">Revenue by Category</h2>
           </div>

           <div className="relative flex items-center justify-center py-6">
              <div className="w-48 h-48 rounded-full border-[15px] border-slate-100 flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border-[15px] border-indigo-500 border-t-transparent border-l-transparent -rotate-12"></div>
                 <div className="absolute inset-0 rounded-full border-[15px] border-sc-orange border-b-transparent border-r-transparent rotate-45"></div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-slate-800">₹4.5L</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Electronics</p>
                 </div>
              </div>
           </div>

           <div className="space-y-4 mt-auto">
              {categories.map((cat, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                       <span className="text-sm font-bold text-slate-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{cat.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <Globe className="absolute -right-10 -bottom-10 w-40 h-40 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
            <h3 className="font-bold text-emerald-100 text-xs uppercase tracking-widest mb-6">Traffic Acquisition</h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                     <span>Direct Search</span>
                     <span>65%</span>
                  </div>
                  <div className="w-full bg-emerald-900/30 h-2 rounded-full overflow-hidden">
                     <div className="bg-white h-full w-[65%]"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                     <span>Social Referrals</span>
                     <span>24%</span>
                  </div>
                  <div className="w-full bg-emerald-900/30 h-2 rounded-full overflow-hidden">
                     <div className="bg-emerald-300 h-full w-[24%]"></div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-4">Live Performance</h3>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                     <span className="text-2xl font-black tracking-tight">412 Users</span>
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded uppercase">Active Now</div>
               </div>
            </div>
            <div className="flex items-end gap-1.5 h-16 mt-6">
               {[20, 50, 30, 80, 40, 60, 25, 90, 70, 50, 30, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/10 rounded-sm hover:bg-emerald-400 transition-colors" style={{ height: `${h}%` }}></div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center text-center group">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sc-orange/10 group-hover:text-sc-orange transition-colors">
               <Database size={32} />
            </div>
            <h3 className="font-extrabold text-slate-800">Advanced SQL Export</h3>
            <p className="text-sm text-slate-400 mt-2 mb-6">Need raw data for custom modeling? Download your full database snapshot.</p>
            <button className="w-full py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">Download .CSV Archive</button>
         </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
