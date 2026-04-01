import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import { Filter, Search as SearchIcon } from 'lucide-react';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products } = await getProducts({ category, keyword });
      setProducts(products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-7-xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-6">
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Department</h3>
          <ul className="space-y-2 text-sm">
            {['Electronics', 'Fashion', 'Home Appliences', 'Wearables', 'Sports'].map((cat) => (
              <li key={cat}>
                <button 
                  onClick={() => setCategory(cat === category ? '' : cat)}
                  className={`hover:text-orange-500 font-medium ${category === cat ? 'text-orange-500 underline' : 'text-gray-700'}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Product Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{products.length} results found</p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Search in category..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="px-4 py-1.5 border rounded-md text-sm outline-none focus:border-orange-500"
            />
            <button onClick={fetchProducts} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"><SearchIcon size={16} /></button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
