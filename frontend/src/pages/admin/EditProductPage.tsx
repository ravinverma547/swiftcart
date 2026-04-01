import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { 
  Package, 
  Tag, 
  IndianRupee, 
  Layers, 
  Image as ImageIcon, 
  FileText, 
  Save, 
  X,
  ChevronLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    images: '',
    isFeatured: false
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          category: p.category,
          stock: p.stock.toString(),
          images: p.images.join(', '),
          isFeatured: p.isFeatured
        });
      } catch (err: any) {
        console.error('Failed to fetch product', err);
        setError('Failed to load product data. It may no longer exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(null);
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (Number(formData.price) <= 0) throw new Error('Price must be greater than zero');
      if (Number(formData.stock) < 0) throw new Error('Stock cannot be negative');

      const imageArray = formData.images.split(',').map(img => img.trim()).filter(img => img !== '');
      
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: imageArray.length > 0 ? imageArray : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]
      };

      await api.put(`/products/admin/${id}`, productData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err: any) {
      console.error('Failed to update product', err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred during product update.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400 font-medium">Fetching Registry Data...</div>;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Changes Saved Successfully!</h2>
        <p className="text-slate-500 mt-2">Updating dashboard registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-slate-500 hover:text-sc-orange transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Discard Changes</span>
        </button>
        <div className="text-right">
            <h1 className="text-2xl font-black text-slate-800">Maintain Listing</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">UUID: {id}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Name</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all font-bold text-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all cursor-pointer font-bold text-slate-700"
              >
                {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Specifications</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} rows={5}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all resize-none text-sm text-slate-600 leading-relaxed"
              ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price (₹)</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" name="price" required value={formData.price} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all font-black text-slate-900"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Level</label>
              <div className="relative">
                <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" name="stock" required value={formData.stock} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all font-black text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High-Res Image Assets (CSV)</label>
              <div className="relative">
                <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="images" value={formData.images} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all text-xs font-mono text-slate-500"
                />
              </div>
          </div>

          <div className="flex items-center gap-4 py-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                className="w-6 h-6 accent-sc-orange rounded-lg cursor-pointer"
              />
              <div className="leading-tight">
                  <label htmlFor="isFeatured" className="text-sm font-black text-slate-800 cursor-pointer block">Highlight Listing</label>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Feature this product on the primary storefront dashboard</span>
              </div>
          </div>

        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 italic">Last physical sync: {new Date().toLocaleDateString()}</p>
            <div className="flex gap-4">
                <button type="submit" disabled={saving}
                className="px-10 py-3 bg-sc-orange hover:bg-orange-600 text-white rounded-xl font-black shadow-xl shadow-sc-orange/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                {saving ? 'UPDATING...' : 'SYNC CHANGES'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
