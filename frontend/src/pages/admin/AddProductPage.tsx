import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(null); // Clear error on change
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic Validation
      if (Number(formData.price) <= 0) throw new Error('Price must be greater than zero');
      if (Number(formData.stock) < 0) throw new Error('Stock cannot be negative');

      // Split images by comma and trim
      const imageArray = formData.images.split(',').map(img => img.trim()).filter(img => img !== '');
      
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: imageArray.length > 0 ? imageArray : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]
      };

      await api.post('/products/admin/new', productData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err: any) {
      console.error('Failed to create product', err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred during product creation.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Product Added Successfully!</h2>
        <p className="text-slate-500 mt-2">Redirecting to product list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-slate-500 hover:text-sc-orange transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back to Products</span>
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800">Add New Product</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Package size={16} className="text-slate-400" /> Product Name
              </label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. SwiftTech Wireless Mouse"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Tag size={16} className="text-slate-400" /> Category
              </label>
              <select 
                 name="category"
                 value={formData.category}
                 onChange={handleChange}
                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home & Kitchen</option>
                <option value="Beauty">Beauty & Health</option>
                <option value="Sports">Sports & Outdoors</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileText size={16} className="text-slate-400" /> Product Description
              </label>
              <textarea 
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the product features, specifications, etc..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all resize-none"
              ></textarea>
          </div>

          {/* Section 3: Pricing & Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <IndianRupee size={16} className="text-slate-400" /> Selling Price (₹)
              </label>
              <input 
                type="number" 
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Layers size={16} className="text-slate-400" /> Stock Quantity
              </label>
              <input 
                type="number" 
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all"
              />
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ImageIcon size={16} className="text-slate-400" /> Product Image URLs (comma separated)
              </label>
              <input 
                type="text" 
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sc-orange/50 focus:border-sc-orange transition-all"
              />
              <p className="text-[11px] text-slate-400 italic">Provide direct URL links to images. You can add multiple images separated by a comma.</p>
          </div>

          {/* Section 5: Other Settings */}
          <div className="flex items-center gap-3 py-2 border-t border-slate-100 pt-6">
              <input 
                type="checkbox" 
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 accent-sc-orange rounded border-slate-300 transition-all cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm font-bold text-slate-700 cursor-pointer">
                Feature this product on homepage
              </label>
          </div>

        </div>

        {/* Form Footer Actions */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-end gap-4">
            <button 
               type="button"
               onClick={() => navigate('/admin/products')}
               className="px-6 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
            <button 
               type="submit"
               disabled={loading}
               className="px-8 py-2.5 bg-sc-blue-dark hover:bg-slate-800 text-white rounded-lg text-sm font-extrabold shadow-lg shadow-sc-blue-dark/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Adding...' : 'Save Product'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
