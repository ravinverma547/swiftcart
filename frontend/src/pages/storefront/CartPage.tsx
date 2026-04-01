import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, CheckCircle2, ChevronDown, Info, Minus, Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex justify-center">
                <div className="bg-gray-50 p-6 rounded-full">
                    <ShoppingBag size={120} className="text-sc-blue-light opacity-20" />
                </div>
            </div>
            <div className="flex-1 space-y-4 pt-4 text-center md:text-left">
                <h2 className="text-[28px] font-bold text-[#0F1111]">Your SwiftCart Cart is empty.</h2>
                <p className="text-[14px] text-gray-700">Check your Saved for later items or <Link to="/" className="text-sc-link hover:underline">continue shopping</Link>.</p>
            </div>
        </div>
        <div className="w-full md:w-[300px] bg-white h-48 shadow-sm p-5">
            <h3 className="font-bold text-sm mb-4">Your recently viewed items</h3>
            <p className="text-xs text-gray-400 italic">No recently viewed items yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sc-gray-light min-h-screen py-8">
      <div className="max-w-[1500px] mx-auto px-4 flex flex-col lg:flex-row gap-6">
        
        {/* Cart Items List */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <div className="border-b pb-1 mb-6 flex justify-between items-end">
            <h1 className="text-[28px] font-medium text-[#0F1111]">Shopping Cart</h1>
            <span className="text-[14px] text-gray-600 hidden md:block">Price</span>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-100 last:border-0 relative">
                <div className="w-full md:w-44 h-44 flex items-center justify-center p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <Link to={`/product/${item.id}`} className="text-[18px] font-bold text-[#0F1111] leading-tight hover:text-sc-orange line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-[12px] text-sc-success font-medium">In stock</p>
                  <p className="text-[12px] text-gray-500">Eligible for FREE Shipping</p>
                  <div className="flex items-center gap-1 text-[12px] text-[#0F1111]">
                    <span className="bg-sc-blue-dark text-white px-1 font-bold text-[10px]">SC</span>
                    <span>SwiftCart Fulfilled</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-[12px] text-sc-link pt-2 select-none">
                     <div className="flex items-center border border-gray-300 bg-[#F0F2F2] rounded-lg shadow-sm overflow-hidden h-8">
                        <button 
                            onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`px-2 h-full flex items-center justify-center border-r hover:bg-gray-200 transition-colors ${item.quantity <= 1 ? 'opacity-30 cursor-not-allowed' : 'text-gray-900'}`}
                        >
                            <Minus size={14} strokeWidth={3} />
                        </button>
                        <div className="px-4 font-bold text-gray-900 bg-white h-full flex items-center min-w-[32px] justify-center">
                            {item.quantity}
                        </div>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 h-full flex items-center justify-center border-l hover:bg-gray-200 transition-colors text-gray-900"
                        >
                            <Plus size={14} strokeWidth={3} />
                        </button>
                     </div>
                     <span className="text-gray-300">|</span>
                     <button onClick={() => removeFromCart(item.id)} className="hover:underline flex items-center gap-1">
                        <Trash2 size={14} className="text-gray-500" /> Delete
                     </button>
                     <span className="text-gray-300">|</span>
                     <button className="hover:underline">Save for later</button>
                     <span className="text-gray-300">|</span>
                     <button className="hover:underline">See more like this</button>
                     <span className="text-gray-300">|</span>
                     <button className="hover:underline">Share</button>
                  </div>
                </div>

                <div className="text-[18px] font-bold text-right pt-0 md:pt-1 self-end md:self-auto">
                    {formatINR(item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-right pt-6 text-[18px]">
            <span>Subtotal ({totalItems} items): </span>
            <span className="font-bold">{formatINR(totalPrice)}</span>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className="w-full lg:w-[300px] flex flex-col gap-5">
          <div className="bg-white p-5 shadow-sm space-y-4">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-sc-success font-medium">
                    <CheckCircle2 size={18} className="text-sc-success" strokeWidth={3} />
                    <div className="flex flex-col">
                        <span>Your order qualifies for FREE Shipping.</span>
                        <span className="text-gray-500 font-normal">Choose this option at checkout. See details</span>
                    </div>
                </div>
                <div className="text-[18px] text-[#0F1111] pt-1">
                    Subtotal ({totalItems} items): <span className="font-bold">{formatINR(totalPrice)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0F1111]">
                    <input type="checkbox" id="gift-check" className="w-4 h-4 accent-sc-orange" />
                    <label htmlFor="gift-check">This order contains a gift</label>
                </div>
             </div>

             <button 
                onClick={() => navigate('/checkout')}
                className="w-full a-button-primary py-2 text-sm"
             >
                Proceed to Buy
             </button>

             <div className="p-3 border rounded-lg bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold justify-between cursor-pointer">
                    <span>EMI Available</span>
                    <ChevronDown size={16} />
                </div>
                <p className="text-[11px] text-gray-600 mt-1">Your order is eligible for EMI. Choose EMI at checkout for more details.</p>
             </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[14px]">Shopping Tip</h3>
            <p className="text-[12px] text-[#0F1111]">Did you know that you can save money by choosing <span className="text-sc-link hover:underline cursor-pointer">SwiftCart Pay Later</span> at checkout?</p>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Info size={12} />
                <span>Terms apply.</span>
            </div>
          </div>
          
          <div className="bg-white p-5 shadow-sm rounded-sm">
             <div className="w-full h-24 bg-sc-blue-dark flex items-center justify-center rounded shadow-sm text-sc-yellow font-bold text-lg">
                 SwiftCart PRIME
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
