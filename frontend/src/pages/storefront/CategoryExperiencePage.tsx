import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Play, TrendingUp, Zap, Gift, Smartphone, Clock, ShieldCheck, Headphones, ShoppingBag } from 'lucide-react';
import { getProducts } from '../../services/api';

const CategoryExperiencePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const tag = searchParams.get('tag') || 'all';
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // In a real app, we'd filter by tag in the API
                const data = await getProducts({ category: tag === 'fresh' ? 'Electronics' : tag }); 
                // Mocking data for now if no products found
                if (data.products && data.products.length > 0) {
                    setProducts(data.products);
                } else {
                    // Fallback to some default products for demo
                    const fallback = await getProducts({});
                    setProducts(fallback.products.slice(0, 8));
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [tag]);

    const renderHero = () => {
        switch (tag.toLowerCase()) {
            case 'fresh':
                return (
                    <div className="relative h-[300px] rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-green-600 to-green-400 text-white flex items-center px-12">
                        <div className="z-10 max-w-lg">
                            <span className="bg-white text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">SwiftCart Fresh</span>
                            <h1 className="text-5xl font-black mt-4 leading-tight">Fresh Essentials <br/> Delivered Daily.</h1>
                            <p className="mt-4 text-lg opacity-90">Get high-quality groceries and fresh produce delivered to your doorstep in as little as 2 hours.</p>
                            <button className="mt-6 bg-white text-green-700 px-8 py-3 rounded-md font-bold hover:bg-green-50 transition-colors">Shop Now</button>
                        </div>
                        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 flex items-center justify-center p-8">
                             <ShoppingBag size={250} />
                        </div>
                    </div>
                );
            case 'swiftcart minitv':
                return (
                    <div className="relative h-[400px] rounded-xl overflow-hidden mb-8 bg-black text-white flex items-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                        <img 
                            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
                            className="absolute inset-0 w-full h-full object-cover" 
                            alt="miniTV" 
                        />
                        <div className="z-20 px-12 max-w-xl">
                            <div className="flex items-center gap-2 text-sc-orange font-bold text-xl mb-4">
                                <Play fill="currentColor" size={24} /> miniTV
                            </div>
                            <h1 className="text-5xl font-black leading-tight">Watch Premium <br/> Web Series for FREE.</h1>
                            <p className="mt-4 text-lg text-gray-300">No subscription required. Stream the latest entertainment, reality shows, and comedy specials right here.</p>
                            <div className="mt-8 flex gap-4">
                                <button className="bg-sc-orange hover:bg-sc-orange-hover text-white px-8 py-3 rounded-md font-bold flex items-center gap-2">
                                     Start Watching
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-md font-bold">
                                     My Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'mobiles':
                return (
                    <div className="relative h-[300px] rounded-xl overflow-hidden mb-8 bg-slate-900 text-white flex items-center px-12">
                        <div className="z-10">
                            <h1 className="text-4xl font-bold">The Latest Smartphones</h1>
                            <p className="mt-2 text-sc-gray-medium">Upgrade to the fastest 5G devices with incredible camera systems.</p>
                            <div className="flex gap-4 mt-6">
                                {['Apple', 'Samsung', 'OnePlus', 'Google'].map(brand => (
                                    <span key={brand} className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-medium cursor-pointer hover:bg-white/20">
                                        {brand}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-40">
                             <Smartphone size={180} />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="h-[200px] rounded-xl bg-sc-blue-light text-white flex flex-col justify-center px-12 mb-8">
                         <h1 className="text-3xl font-bold capitalize">{tag}</h1>
                         <p className="text-sc-gray-medium mt-2">Discover curated picks and exclusive deals in this collection.</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-[1500px] mx-auto px-4 py-8">
            {renderHero()}

            {/* Custom Section for miniTV */}
            {tag.toLowerCase() === 'swiftcart minitv' && (
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-sc-orange" /> Trending Picks
                        </h2>
                        <button className="text-blue-600 hover:text-sc-orange font-medium text-sm">See all</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-video bg-gray-800 rounded-md overflow-hidden relative border border-gray-700">
                                    <img 
                                        src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop&sig=${i}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt="Show"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Play fill="white" className="text-white" size={40} />
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-bold px-1.5 py-0.5 rounded text-white italic">miniTV ORIGINAL</span>
                                </div>
                                <h3 className="mt-2 font-bold text-sm text-gray-900">SwiftCart Originals: Ep {i}</h3>
                                <p className="text-xs text-gray-500 italic">Recommended for you</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Grid */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingBag className="text-sc-blue-dark" /> Featured in {tag}
                </h2>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white p-4 border border-transparent hover:border-gray-200 hover:shadow-lg rounded-lg transition-all flex flex-col group">
                            <Link to={`/product/${product.id}`} className="flex-1">
                                <div className="aspect-square bg-gray-50 rounded-md p-4 mb-4 relative overflow-hidden">
                                     <img 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.isFeatured && (
                                        <span className="absolute top-2 left-2 bg-sc-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                                            Top Pick
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 group-hover:text-sc-orange transition-colors line-clamp-2 leading-tight h-10">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-2 text-sc-yellow">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star}>★</span>
                                        ))}
                                    </div>
                                    <span className="text-blue-600 text-xs ml-1 font-medium hover:underline cursor-pointer">4.5 (1,230)</span>
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                    <span className="text-xs text-gray-500 line-through">₹{(product.price * 1.25).toLocaleString('en-IN')}</span>
                                    <span className="text-xs text-green-600 font-bold bg-green-50 px-1 rounded-sm">20% off</span>
                                </div>
                                <p className="text-[12px] text-gray-600 mt-1">Get it by <span className="font-bold">Tomorrow, 11 AM</span></p>
                                <div className="mt-2 flex items-center gap-1">
                                    <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18._CB485936079_.png" alt="Prime" className="h-4" />
                                    <span className="text-xs font-bold text-sc-blue-light">FREE Delivery</span>
                                </div>
                            </Link>
                            <button className="mt-4 w-full a-button-primary py-1.5 text-xs font-bold flex items-center justify-center gap-2">
                                 Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryExperiencePage;
