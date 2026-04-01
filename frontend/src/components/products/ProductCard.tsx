import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPriceParts } from '../../utils/formatCurrency';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  reviews?: any[];
}

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useCart();
  const { whole, fraction } = formatPriceParts(product.price);
  
  // Random rating/count for demo purposes if not present
  const rating = 4.5;
  const reviewCount = 1248;

  return (
    <div className="bg-white hover:shadow-sc transition-shadow p-3 flex flex-col h-full border border-transparent hover:border-gray-200">
      <Link to={`/product/${product.id}`} className="block h-52 overflow-hidden mb-3">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain p-2"
        />
      </Link>
      
      <div className="flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="text-[#0F1111] text-[14px] leading-tight line-clamp-2 hover:text-sc-orange mb-1">
          {product.name}
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-1.5 cursor-pointer group">
          <div className="flex">
            {[1, 2, 3, 4].map((s) => (
              <Star key={s} size={14} className="fill-sc-orange text-sc-orange" />
            ))}
            <Star size={14} className="fill-sc-orange text-sc-orange opacity-40" />
            <ChevronDown size={14} className="text-gray-400 group-hover:text-sc-orange" />
          </div>
          <span className="text-sm text-sc-link hover:text-sc-orange ml-1">{reviewCount}</span>
        </div>
        
        {/* Price */}
        <div className="flex items-start mb-1">
            <span className="text-[11px] mt-1 font-medium">₹</span>
            <span className="text-[21px] font-bold leading-none">{whole}</span>
            <span className="text-[11px] mt-1 font-medium">{fraction}</span>
        </div>

        {/* SwiftCart Banner */}
        <div className="flex items-center gap-1 mb-1">
            <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1 py-0.5 rounded-sm tracking-tighter italic">SC Delivery</span>
            <span className="text-[12px] text-gray-500">FREE delivery by </span>
            <span className="text-[12px] font-bold text-gray-700">Tomorrow</span>
        </div>

        <p className="text-[12px] text-gray-500 mb-3">Service is currently available in your location.</p>
        
        <div className="mt-auto">
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, 1);
                }}
                className="a-button-primary w-full text-xs py-1.5"
            >
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
};

// Internal icon for rating
const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export default ProductCard;
