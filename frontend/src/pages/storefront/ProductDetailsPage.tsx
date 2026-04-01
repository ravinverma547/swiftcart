import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductDetails } from '../../services/api';
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingCart, Zap, ChevronDown, MapPin, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatPriceParts } from '../../utils/formatCurrency';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { product } = await getProductDetails(id!);
        setProduct(product);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sc-orange"></div>
  </div>;
  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const { whole, fraction } = formatPriceParts(product.price);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-[1500px] mx-auto px-4 py-3 text-[12px] text-gray-600 flex gap-2">
            <Link to="/products" className="hover:underline">Products</Link>
            <span>›</span>
            <Link to={`/products?category=${product.category}`} className="hover:underline capitalize">{product.category}</Link>
            <span>›</span>
            <span className="font-bold text-sc-orange truncate max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Image Gallery */}
            <div className="lg:w-[40%] flex flex-col md:flex-row gap-4">
                {/* Thumbnails */}
                <div className="order-2 md:order-1 flex md:flex-col gap-2">
                    {product.images.map((img: string, i: number) => (
                        <div 
                            key={i} 
                            onMouseEnter={() => setActiveImage(i)}
                            className={`w-12 h-12 border-2 rounded p-1 cursor-pointer overflow-hidden bg-white ${activeImage === i ? 'border-sc-orange shadow-sc-focus' : 'border-gray-200'}`}
                        >
                            <img src={img} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
                {/* Main Image */}
                <div className="order-1 md:order-2 flex-1 h-[300px] md:h-[500px] flex items-center justify-center p-4 sticky top-24">
                    <img src={product.images[activeImage]} alt={product.name} className="max-h-full object-contain" />
                </div>
            </div>

            {/* Center: Product Info */}
            <div className="lg:w-[35%] space-y-4">
                <div className="border-b pb-4">
                    <h1 className="text-[24px] font-medium text-[#0F1111] leading-tight mb-1">{product.name}</h1>
                    <Link to="/" className="text-sc-link hover:text-sc-orange text-sm font-medium">Visit the SwiftCart Store</Link>
                    
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center group cursor-pointer">
                            <span className="text-sm font-bold mr-1">4.5</span>
                            {[1, 2, 3, 4].map((s) => (
                                <Star key={s} size={16} className="fill-sc-orange text-sc-orange" />
                            ))}
                            <Star size={16} className="fill-sc-orange text-sc-orange opacity-40" />
                            <ChevronDown size={14} className="ml-1 text-gray-500" />
                        </div>
                        <span className="text-sc-link hover:text-sc-orange text-sm ml-2">12,456 ratings</span>
                    </div>

                    {/* Badge */}
                    <div className="mt-2 inline-flex items-center bg-[#232F3E] text-white px-2 py-0.5 rounded-sm">
                        <span className="text-[11px] font-bold">Swift's Choice</span>
                    </div>
                </div>

                {/* Pricing & Deals */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="bg-sc-danger text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Limited time deal</span>
                    </div>
                    <div className="flex items-start text-sc-danger">
                        <span className="text-[28px] font-light">-24%</span>
                        <div className="ml-2 flex items-start mt-1">
                            <span className="text-sm mt-1.5 font-medium">₹</span>
                            <span className="text-[28px] font-medium leading-none">{whole}</span>
                            <span className="text-sm mt-1.5 font-medium">{fraction}</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        M.R.P.: <span className="line-through">{formatINR(product.price * 1.3)}</span>
                    </div>
                    <p className="text-sm">Inclusive of all taxes</p>
                </div>

                {/* Offer Container */}
                <div className="grid grid-cols-1 gap-3 py-4 border-y">
                    <div className="flex items-start gap-3">
                         <div className="flex flex-col items-center flex-shrink-0 w-16">
                            <Truck size={24} className="text-sc-blue-dark mb-1" />
                            <span className="text-[11px] text-sc-link hover:text-sc-orange text-center leading-tight">Free Delivery</span>
                         </div>
                         <div className="flex flex-col items-center flex-shrink-0 w-16">
                            <RotateCcw size={24} className="text-sc-blue-dark mb-1" />
                            <span className="text-[11px] text-sc-link hover:text-sc-orange text-center leading-tight">7 Days Replacement</span>
                         </div>
                         <div className="flex flex-col items-center flex-shrink-0 w-16">
                            <ShieldCheck size={24} className="text-sc-blue-dark mb-1" />
                            <span className="text-[11px] text-sc-link hover:text-sc-orange text-center leading-tight">1 Year Warranty</span>
                         </div>
                         <div className="flex flex-col items-center flex-shrink-0 w-16">
                            <Zap size={24} className="text-sc-blue-dark mb-1" />
                            <span className="text-[11px] text-sc-link hover:text-sc-orange text-center leading-tight">Top Brand</span>
                         </div>
                    </div>
                </div>

                {/* Description Bullets */}
                <div className="space-y-4 pt-4">
                    <h4 className="font-bold text-sm">About this item</h4>
                    <ul className="text-sm space-y-2 list-disc pl-5 text-[#0F1111]">
                        {product.description.split('.').filter((s: string) => s.trim().length > 5).map((point: string, i: number) => (
                            <li key={i}>{point.trim()}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right: Buy Box */}
            <div className="lg:w-[25%]">
                <div className="border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm sticky top-24">
                    <div className="flex items-start">
                        <span className="text-sm mt-1 font-medium">₹</span>
                        <span className="text-2xl font-medium leading-none">{whole}{fraction !== '00' && <span className="text-sm">.{fraction}</span>}</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <span className="text-sc-link hover:text-sc-orange text-sm">FREE delivery</span>
                            <span className="font-bold text-sm">Tomorrow, March 26</span>
                        </div>
                        <div className="flex flex-col text-sm text-[#0F1111]">
                            <span>Order within <span className="text-sc-success font-bold">12 hrs 34 mins</span></span>
                            <Link to="/" className="text-sc-link hover:text-sc-orange text-xs mt-1 flex items-center gap-1"><MapPin size={12} /> Deliver to India</Link>
                        </div>
                    </div>

                    <div className={`text-[18px] font-medium ${product.stock > 0 ? 'text-sc-success' : 'text-sc-danger'}`}>
                        {product.stock > 0 ? 'In stock' : 'Currently unavailable'}
                    </div>

                    {product.stock > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">Quantity:</span>
                                <select 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="bg-gray-100 border border-gray-300 rounded shadow-sm px-2 py-1 text-xs outline-none hover:bg-gray-200"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                            </div>

                            <button 
                                onClick={() => addToCart(product, quantity)}
                                className="w-full a-button-primary py-2 rounded-full text-sm"
                            >
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="w-full a-button-buy py-2 rounded-full text-sm"
                            >
                                Buy Now
                            </button>
                            
                            <div className="pt-2 text-[12px] space-y-1">
                                <div className="flex gap-2">
                                    <span className="text-gray-500 min-w-[70px]">Ships from</span>
                                    <span className="text-sc-link">SwiftCart</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gray-500 min-w-[70px]">Sold by</span>
                                    <span className="text-sc-link underline">SwiftCart Global Store</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-4 border-t">
                         <button className="flex items-center gap-2 text-sm text-[#0F1111] hover:text-sc-orange">
                            <span className="bg-gray-100 p-1 rounded-sm"><ShieldCheck size={14} /></span> Secure transaction
                         </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
