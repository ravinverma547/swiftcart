import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Edit, Trash2, Plus, Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { useNavigate, Link } from 'react-router-dom';

const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch admin products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/admin/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400 font-medium">Fetching Catalog...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Inventory Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your storefront catalog and stock levels.</p>
        </div>
        <button 
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-sc-orange text-white rounded-lg font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sc-orange/20"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total SKU</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{products.length}</p>
         </div>
         <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Out of Stock</p>
            <p className="text-2xl font-bold text-sc-danger mt-1">{products.filter(p => p.stock === 0).length}</p>
         </div>
         <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Featured Products</p>
            <p className="text-2xl font-bold text-sc-blue-dark mt-1">{products.filter(p => p.isFeatured).length}</p>
         </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search by name, SKU, or category..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-sc-orange text-slate-700 transition-colors text-sm"
          />
        </div>
        <button className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all"><Filter size={20} /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-sc-orange hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-white p-6 relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px]">
               <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
               <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${p.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                 {p.stock} {p.stock === 0 ? 'OUT OF STOCK' : 'IN STOCK'}
               </div>
               {p.isFeatured && (
                 <div className="absolute top-3 right-3 w-6 h-6 bg-sc-orange rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white">
                    <Plus size={14} className="rotate-45" />
                 </div>
               )}
            </div>
            <div className="p-5 space-y-4 border-t border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[10px] font-bold text-sc-orange uppercase tracking-wider">{p.category}</p>
                    <h3 className="font-bold text-sm line-clamp-1 text-slate-800 mt-0.5">{p.name}</h3>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><MoreVertical size={16} /></button>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-extrabold text-slate-900">{formatINR(p.price)}</span>
                <div className="flex gap-2">
                   <Link to={`/product/${p.id}`} target="_blank" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sc-blue-dark shadow-sm transition-colors border border-slate-100"><ExternalLink size={16} /></Link>
                   <button 
                     onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                     className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sc-orange shadow-sm transition-colors border border-slate-100"
                   >
                    <Edit size={16} />
                   </button>
                   <button 
                     onClick={() => deleteProduct(p.id)}
                     className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-sc-danger shadow-sm transition-colors border border-slate-100"
                   >
                    <Trash2 size={16} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
