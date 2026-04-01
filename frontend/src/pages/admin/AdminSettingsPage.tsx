import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Trash2, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
     setIsSaved(true);
     setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'General', label: 'Store Profile', icon: Store },
    { id: 'Governance', label: 'Security & Access', icon: ShieldCheck },
    { id: 'Communications', label: 'Notifications', icon: Bell },
    { id: 'Financial', label: 'Payments & Tax', icon: CreditCard },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Operational Configuration</h1>
          <p className="text-slate-500 text-sm mt-1">Fine-tune your SwiftCart seller instance and business rules.</p>
        </div>
        <div className="flex items-center gap-4">
           {isSaved && (
              <div className="animate-in fade-in zoom-in slide-in-from-right-2 duration-300 flex items-center gap-2 text-emerald-600 font-black text-xs bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                 <CheckCircle2 size={16} /> Configuration Updated
              </div>
           )}
           <button 
              onClick={handleSave}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-sc-orange hover:shadow-xl hover:shadow-sc-orange/20 transition-all flex items-center gap-2 group"
           >
             <Save size={18} className="group-hover:rotate-12 transition-transform" /> Save Changes
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 space-y-2">
           {tabs.map((tab) => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === tab.id 
                    ? 'bg-white shadow-xl shadow-slate-200/50 text-sc-orange border border-slate-100' 
                    : 'text-slate-500 hover:bg-slate-100'
                 }`}
              >
                 <div className="flex items-center gap-3">
                    <tab.icon size={20} className={activeTab === tab.id ? 'text-sc-orange' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span className="text-sm font-extrabold">{tab.label}</span>
                 </div>
                 <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
              </button>
           ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
           <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">{activeTab} Details</h2>
              <p className="text-sm text-slate-400 mt-1">Configure your primary business identity and front-facing information.</p>
           </div>

           <div className="p-10 space-y-10 flex-1">
              {activeTab === 'General' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Store Display Name</label>
                          <input type="text" defaultValue="SwiftCart Seller Hub" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sc-orange/50 outline-none transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Support Email</label>
                          <input type="email" defaultValue="seller@swiftcart.in" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sc-orange/50 outline-none transition-all" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Seller Identity Status</label>
                       <div className="p-6 bg-sc-orange/5 border border-sc-orange/10 rounded-3xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-sc-orange text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-sc-orange/20">
                                SC
                             </div>
                             <div>
                                <p className="font-extrabold text-slate-800">Verified Marketplace Seller</p>
                                <p className="text-xs text-slate-500">Your profile is fully compliant with SwiftCart 2024 standards.</p>
                             </div>
                          </div>
                          <button className="text-sc-orange font-black text-xs hover:underline flex items-center gap-1">
                             View Certificate <ExternalLink size={14} />
                          </button>
                       </div>
                    </div>

                    <div className="pt-4 space-y-4 border-t border-slate-100">
                       <h4 className="font-extrabold text-slate-800">Dangerous Actions</h4>
                       <div className="flex items-center justify-between p-6 bg-rose-50 border border-rose-100 rounded-3xl group cursor-pointer hover:bg-rose-100/50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center font-black">
                                <Trash2 size={20} />
                             </div>
                             <div>
                                <p className="font-extrabold text-rose-600">Offboard Seller Account</p>
                                <p className="text-xs text-rose-400">This will permanently delete your store and catalog data.</p>
                             </div>
                          </div>
                          <button className="px-4 py-2 bg-white text-rose-600 font-bold border border-rose-200 rounded-lg text-xs shadow-sm hover:bg-rose-600 hover:text-white transition-all">Deactivate</button>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'Financial' && (
                 <div className="space-y-8 animate-in fade-in duration-500 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Info size={40} className="text-slate-300 mx-auto" />
                    <div>
                       <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">Module Maintenance</h3>
                       <p className="text-sm text-slate-400 mt-2">Financial systems are handled via Stripe Connect. Configuration is managed in a separate secure dashboard.</p>
                       <button className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto shadow-xl shadow-slate-900/10">Go to Financial Hub <ExternalLink size={16} /></button>
                    </div>
                 </div>
              )}

              {activeTab !== 'General' && activeTab !== 'Financial' && (
                 <div className="flex flex-col items-center justify-center h-full text-center py-20 grayscale opacity-40">
                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                       <Settings size={48} className="animate-spin-slow" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">Advanced Parameters Only</h3>
                    <p className="text-sm text-slate-400 max-w-sm mt-3">This configuration panel is reserved for system architects and senior sellers. Please proceed with caution.</p>
                 </div>
              )}
           </div>

           <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SwiftCart OS v4.2.1 • Managed Seller Instance</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
