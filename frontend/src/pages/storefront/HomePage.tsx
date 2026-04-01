import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const banners = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1500&q=80"
];

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await getProducts({ limit: 12 });
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner(prev => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner(prev => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="bg-sc-gray-light min-h-screen pb-10">
      {/* Hero Carousel */}
      <div className="relative h-[250px] sm:h-[400px] md:h-[600px] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentBanner}
            src={banners[currentBanner]} 
            alt="Hero Banner" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-sc-gray-light via-transparent to-transparent"></div>
        
        {/* Carousel Controls */}
        <button onClick={prevBanner} className="absolute left-0 top-0 bottom-[20%] px-4 flex items-center bg-transparent group-hover:bg-black/5 transition-colors">
            <ChevronLeft size={48} className="text-sc-blue-dark opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button onClick={nextBanner} className="absolute right-0 top-0 bottom-[20%] px-4 flex items-center bg-transparent group-hover:bg-black/5 transition-colors">
            <ChevronRight size={48} className="text-sc-blue-dark opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Content Grid Overlay */}
      <div className="max-w-[1500px] mx-auto px-4 relative z-10 -mt-20 md:-mt-64 space-y-6">
        
        {/* Top Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {/* Category Card 1 */}
            <div className="bg-white p-5 shadow-sm flex flex-col h-full">
                <h3 className="text-[21px] font-bold text-[#0F1111] mb-2 leading-none">Up to 70% off | Kitchen</h3>
                <div className="flex-1 overflow-hidden grid grid-cols-2 gap-2 mt-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="h-28 bg-gray-50 flex items-center justify-center p-1">
                                <img src={`https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&h=200&q=80`} alt="Kitchen" className="max-h-full object-contain" />
                            </div>
                            <span className="text-[12px] text-gray-700">Kitchen tools</span>
                        </div>
                    ))}
                </div>
                <Link to="/products?category=home" className="text-sc-link hover:text-sc-orange text-sm mt-4 inline-block">See more</Link>
            </div>

            {/* Category Card 2 */}
            <div className="bg-white p-5 shadow-sm flex flex-col h-full">
                <h3 className="text-[21px] font-bold text-[#0F1111] mb-2 leading-none">Starting ₹99 | Fashion</h3>
                <div className="flex-1 overflow-hidden grid grid-cols-2 gap-2 mt-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="h-28 bg-gray-50 flex items-center justify-center p-1">
                                <img src={`https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&h=200&q=80`} alt="Fashion" className="max-h-full object-contain" />
                            </div>
                            <span className="text-[12px] text-gray-700">Accessories</span>
                        </div>
                    ))}
                </div>
                <Link to="/products?category=fashion" className="text-sc-link hover:text-sc-orange text-sm mt-4 inline-block">Explore all</Link>
            </div>

            {/* Account Card */}
            <div className="bg-white p-5 shadow-sm flex flex-col h-full space-y-4">
                {user ? (
                    <>
                        <h3 className="text-[21px] font-bold text-[#0F1111] leading-none mb-2">Hi, {user.name}</h3>
                        <p className="text-[14px]">Customer since 2026. Enjoy your shopping!</p>
                        <hr />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Link to="/orders" className="text-center p-2 bg-gray-50 border rounded hover:bg-gray-100 transition-colors">
                                <div className="text-xs font-bold">Your Orders</div>
                            </Link>
                            <Link to="/profile" className="text-center p-2 bg-gray-50 border rounded hover:bg-gray-100 transition-colors">
                                <div className="text-xs font-bold">Your Profile</div>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-[21px] font-bold text-[#0F1111] leading-none">Sign in for your best experience</h3>
                        <Link to="/login" className="w-full bg-sc-yellow hover:bg-sc-yellow-hover py-2.5 rounded shadow-sm text-sm text-center font-medium border border-sc-yellow-dark">Sign in securely</Link>
                        <div className="bg-gray-100 -mx-5 px-5 py-4 border-t border-gray-200 mt-auto">
                            <div className="w-full h-24 bg-sc-blue-dark flex items-center justify-center rounded shadow text-sc-yellow font-bold text-lg">
                                 SwiftCart PRIME
                            </div>
                        </div>
                    </>
                )}
            </div>

             {/* Category Card 4 */}
             <div className="bg-white p-5 shadow-sm flex flex-col h-full">
                <h3 className="text-[21px] font-bold text-[#0F1111] mb-2 leading-none">Electronic Deals</h3>
                <div className="h-64 bg-gray-50 mb-4 overflow-hidden p-2 flex items-center justify-center">
                    <img 
                      src={`https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80`} 
                      alt="Electronics" 
                      className="max-h-full object-contain"
                    />
                </div>
                <Link to="/products?category=electronics" className="text-sc-link hover:text-sc-orange text-sm font-semibold mt-auto">Shop now</Link>
            </div>
        </div>

        {/* Product Carousel Row */}
        <div className="bg-white p-5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-[#0F1111]">Best Sellers in Electronics</h2>
            <Link to="/products" className="text-sc-link hover:text-sc-orange text-sm">See all</Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {loading ? (
               [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="min-w-[200px] h-64 bg-gray-100 animate-pulse"></div>)
            ) : (
                products.map((product) => (
                    <div key={product.id} className="min-w-[200px] max-w-[200px]">
                        <ProductCard product={product} />
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Secondary Banner */}
        <div className="h-32 bg-sc-blue-highlight flex items-center justify-center overflow-hidden shadow-sm text-white font-bold italic text-xl">
             BIG SAVINGS ON LAPTOPS | UP TO 40% OFF
        </div>

         {/* Another Product Grid */}
         <div className="bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-bold text-[#0F1111] mb-6">Today's Deals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
               [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse"></div>)
            ) : (
                products.slice(0, 6).map((product) => (
                    <div key={product.id}>
                        <div className="h-40 bg-gray-50 flex items-center justify-center p-4 mb-2">
                             <img src={product.images[0]} alt={product.name} className="max-h-full object-contain" />
                        </div>
                        <div className="flex gap-2 items-center mb-1">
                             <span className="bg-sc-danger text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">Up to 40% off</span>
                             <span className="text-sc-danger text-[12px] font-bold">Deal of the Day</span>
                        </div>
                        <Link to={`/product/${product.id}`} className="text-xs font-bold line-clamp-1 hover:text-sc-orange">{product.name}</Link>
                    </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
