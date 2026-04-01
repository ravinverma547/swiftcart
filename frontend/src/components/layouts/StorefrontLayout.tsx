import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, LogOut, MapPin, ChevronDown, X, ChevronRight, Tablet, Shirt, Home as HomeIcon, Book, Smartphone, Tv } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const StorefrontLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  return (
    <div className="min-h-screen flex flex-col bg-sc-gray-light relative overflow-x-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[100] transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[350px] bg-white z-[110] transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-sc-blue-dark text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User size={20} />
            </div>
            <span className="font-bold text-lg">Hello, {user ? user.name.split(' ')[0] : 'Sign In'}</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)] py-4">
          <div className="px-6 mb-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-2">Main Menu</h3>
            <div className="space-y-1">
                <button 
                    onClick={() => { navigate('/'); setIsSidebarOpen(false); }}
                    className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 group-hover:text-sc-orange transition-colors"><HomeIcon size={18} /></span>
                    Home Page
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
            </div>
          </div>

          <hr className="mx-6 border-gray-100 my-4" />

          <div className="px-6 pb-12">
            <h3 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-2">Help & Settings</h3>
            <div className="space-y-1">
              <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="block py-3 px-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium">Your Account</Link>
              <Link to="/customer-service" onClick={() => setIsSidebarOpen(false)} className="block py-3 px-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium">Customer Service</Link>
              {!user ? (
                 <Link to="/login" onClick={() => setIsSidebarOpen(false)} className="block py-3 px-2 hover:bg-gray-100 rounded-lg text-sc-orange font-bold">Sign In</Link>
              ) : (
                 <button onClick={() => { logout(); setIsSidebarOpen(false); }} className="w-full text-left py-3 px-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium">Sign Out</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Navbar */}
      <nav className="bg-sc-blue-dark text-white sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-4 py-1 flex items-center gap-2 lg:gap-4 h-16">
          {/* Logo */}
          <div className="flex items-center px-2 py-1 border border-transparent rounded h-full mr-2 z-10 relative cursor-default">
            <span className="text-2xl font-bold text-white tracking-tight">swift</span>
            <span className="text-2xl font-bold text-sc-orange tracking-tight">cart</span>
            <span className="text-xs mt-2 ml-0.5 text-sc-gray-medium">.in</span>
          </div>
          
          {/* Deliver To */}
          <div className="hidden lg:flex flex-col px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer leading-tight">
            <span className="text-[12px] text-sc-gray-medium ml-4">Deliver to</span>
            <div className="flex items-center gap-1 font-bold text-sm">
              <MapPin size={16} /> India
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex h-10 ml-2">
            <div className="flex w-full rounded-md overflow-hidden bg-white a-search-focus">
              <select className="bg-sc-gray-medium text-[#555] text-xs px-3 border-r border-sc-gray-medium outline-none cursor-pointer hover:bg-gray-300">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home</option>
                <option>Books</option>
              </select>
              <input 
                type="text" 
                placeholder="Search SwiftCart.in" 
                className="flex-1 px-3 text-black text-[14px] outline-none border-none placeholder:text-gray-500"
              />
              <button className="bg-sc-yellow hover:bg-sc-yellow-hover px-4 flex items-center justify-center text-sc-blue-dark transition-colors">
                <Search size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right Side Nav */}
          <div className="flex items-center h-full">
             {/* Language/Flag */}
             <div className="hidden md:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer h-10 ml-4">
                <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="w-5 h-3.5 object-cover" />
                <span className="text-xs font-bold leading-none mt-1">EN</span>
                <ChevronDown size={12} className="text-sc-gray-medium mt-1" />
             </div>

            {/* Account & Lists */}
            <div className="group relative flex flex-col justify-center px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer leading-tight h-10 ml-2">
                <span className="text-[12px] whitespace-nowrap">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
                <div className="flex items-center font-bold text-[14px]">
                    Account & Lists <ChevronDown size={12} className="ml-0.5 text-sc-gray-medium" />
                </div>
                
                {/* Dropdown */}
                <div className="absolute top-10 right-0 w-64 bg-white text-black shadow-2xl border rounded-sm hidden group-hover:block z-[60] mt-1 overflow-hidden">
                   <div className="p-4 space-y-3">
                     {!user && (
                        <div className="flex flex-col items-center border-b pb-3 mb-3">
                            <button onClick={() => navigate('/login')} className="w-full a-button-primary py-2 text-center">Sign in</button>
                            <span className="text-[11px] mt-1">New customer? <Link to="/register" className="text-blue-600 hover:underline">Start here.</Link></span>
                        </div>
                     )}
                     <div className="flex justify-between gap-4">
                        <div className="flex-1 border-r pr-4">
                            <h4 className="font-bold text-sm mb-2">Your Lists</h4>
                            <ul className="text-xs space-y-1 text-gray-700">
                                <li className="hover:text-sc-orange hover:underline">Create a Wish List</li>
                                <li className="hover:text-sc-orange hover:underline">Wish from Any Website</li>
                            </ul>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2">Your Account</h4>
                            <ul className="text-xs space-y-2 text-gray-700">
                                <li><Link to="/profile" className="hover:text-sc-orange hover:underline">Your Account</Link></li>
                                <li><Link to="/orders" className="hover:text-sc-orange hover:underline">Your Orders</Link></li>
                                {user?.role === 'ADMIN' && <li><Link to="/admin" className="font-bold text-sc-orange hover:underline">Admin Dashboard</Link></li>}
                                {user && (
                                    <>
                                        <hr className="my-2" />
                                        <li><button onClick={logout} className="flex items-center gap-1 hover:text-sc-orange hover:underline"><LogOut size={12} /> Sign Out</button></li>
                                    </>
                                )}
                            </ul>
                        </div>
                     </div>
                   </div>
                </div>
            </div>

            {/* Admin Dashboard Link (Visible only to Admins) */}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="flex flex-col justify-center px-2 py-1 border border-sc-orange hover:bg-sc-orange/10 rounded cursor-pointer leading-tight h-10 ml-2 animate-pulse bg-sc-orange/5">
                <span className="text-[10px] text-sc-orange font-bold uppercase tracking-widest leading-none">SwiftCart</span>
                <span className="font-black text-[13px] text-white">ADMIN DASH</span>
              </Link>
            )}

            {/* Orders */}
            <Link to="/orders" className="hidden sm:flex flex-col justify-center px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer leading-tight h-10 ml-2">
              <span className="text-[12px]">Returns</span>
              <span className="font-bold text-[14px]">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center px-2 py-1 border border-transparent hover:border-white rounded h-10 ml-2">
                <div className="relative">
                    <ShoppingCart size={32} strokeWidth={1.5} className="text-white" />
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-transparent text-sc-orange rounded-full px-1 text-[16px] font-bold mt-[-4px]">
                        {totalItems}
                    </span>
                </div>
                <span className="font-bold text-[14px] self-end mb-1 ml-1 leading-none">Cart</span>
            </Link>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="bg-sc-blue-light text-white text-[14px] h-10 flex items-center gap-1 lg:gap-3 px-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded font-bold h-full transition-all"
          >
            <Menu size={20} /> All
          </button>
          <div className="flex items-center h-full overflow-hidden whitespace-nowrap">
            {['Fresh', 'Gift Cards', "Today's Deals", 'Prime', 'Customer Service'].map((item) => (
                <Link 
                    key={item} 
                    to={
                        item === 'Customer Service' ? '/customer-service' : 
                        item === 'Prime' ? '/prime' : 
                        item === 'Gift Cards' ? '/gift-cards' : 
                        `/experience?tag=${item.toLowerCase().replace(/\s+/g, '-')}`
                    } 
                    className="px-2 py-1 border border-transparent hover:border-white rounded h-full flex items-center"
                >
                    {item}
                </Link>
            ))}
          </div>
          <div className="ml-auto hidden xl:block">
            <div className="h-8 flex items-center bg-sc-blue-highlight px-4 rounded text-xs font-bold text-sc-yellow cursor-pointer hover:text-white transition-colors">
                 Experience the Premium SwiftCart App
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sc-blue-light text-white mt-auto">
        <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full bg-[#37475a] hover:bg-[#485769] transition-colors py-3.5 text-xs font-bold"
        >
            Back to top
        </button>
        
        <div className="max-w-[1000px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="font-bold mb-3 text-[16px]">Get to Know Us</h4>
            <ul className="text-sm space-y-2 text-sc-gray-medium">
              <li className="hover:underline cursor-pointer">About Us</li>
              <li className="hover:underline cursor-pointer">Careers</li>
              <li className="hover:underline cursor-pointer">Press Releases</li>
              <li className="hover:underline cursor-pointer">SwiftCart Science</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-[16px]">Connect with Us</h4>
            <ul className="text-sm space-y-2 text-sc-gray-medium">
              <li className="hover:underline cursor-pointer">Facebook</li>
              <li className="hover:underline cursor-pointer">Twitter</li>
              <li className="hover:underline cursor-pointer">Instagram</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-[16px]">Make Money with Us</h4>
            <ul className="text-sm space-y-2 text-sc-gray-medium">
              <li className="hover:underline cursor-pointer">Sell on SwiftCart</li>
              <li className="hover:underline cursor-pointer">Supply to SwiftCart</li>
              <li className="hover:underline cursor-pointer">Become an Affiliate</li>
              <li className="hover:underline cursor-pointer">Fulfilment by SwiftCart</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-[16px]">Let Us Help You</h4>
            <ul className="text-sm space-y-2 text-sc-gray-medium">
              <li className="hover:underline cursor-pointer">Your Account</li>
              <li className="hover:underline cursor-pointer">Returns Centre</li>
              <li className="hover:underline cursor-pointer">100% Purchase Protection</li>
              <li className="hover:underline cursor-pointer">Help</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sc-blue-highlight py-8 flex flex-col items-center gap-4">
           <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-white tracking-tight">swift</span>
                <span className="text-2xl font-bold text-sc-orange tracking-tight">cart</span>
           </Link>
           <div className="flex gap-4 text-xs text-sc-gray-medium">
                <span className="border border-sc-gray-dark px-3 py-1.5 rounded-sm">English</span>
                <span className="border border-sc-gray-dark px-3 py-1.5 rounded-sm flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="w-4" /> India
                </span>
           </div>
        </div>

        <div className="bg-sc-blue-dark py-10 flex flex-col items-center text-[12px] text-sc-gray-medium">
           <div className="flex flex-wrap justify-center gap-4 mb-1">
                {['Conditions of Use & Sale', 'Privacy Notice', 'Interest-Based Ads'].map(i => (
                    <span key={i} className="hover:underline cursor-pointer">{i}</span>
                ))}
           </div>
           <p>© 2026-2027, SwiftCart.com, Inc. or its affiliates</p>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
