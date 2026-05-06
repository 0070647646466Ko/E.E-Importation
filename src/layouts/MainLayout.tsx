import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, MessageCircle, Phone, Truck, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_PHONE, BUSINESS_NAME, getWhatsAppUrl } from '../lib/utils';

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const whatsappLink = getWhatsAppUrl(CONTACT_PHONE, "Hello E.E IMPORTATION, I'm interested in your brand new products!");

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Top Bar */}
      <div className="bg-black text-white text-[10px] md:text-xs py-1.5 px-4 flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-2">
          <Truck size={12} className="text-orange-500" />
          <span>NATIONWIDE DELIVERY IN NIGERIA</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-orange-500" />
            <span>100% BRAND NEW ITEMS ONLY</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-orange-500 fill-orange-500" />
            <span>TOP RATED IMPORTER</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(true)}
              id="mobile-menu-btn"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex flex-col shrink-0" id="main-logo">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-orange-600 leading-none">E.E</span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-black">IMPORTATION</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <input 
                type="text" 
                placeholder="Search for Brand New iPhones, Samsung, Generators..." 
                className="w-full bg-neutral-100 border-none rounded-full py-2.5 px-6 pr-12 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-600 transition-colors">
                <Search size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              <Link to="/account" className="hidden sm:flex flex-col items-center group">
                <User size={22} className="group-hover:text-orange-600 transition-colors" />
                <span className="text-[10px] font-medium mt-0.5">Account</span>
              </Link>
              <Link to="/cart" className="flex flex-col items-center group relative">
                <ShoppingCart size={22} className="group-hover:text-orange-600 transition-colors" />
                <span className="text-[10px] font-medium mt-0.5">Cart</span>
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white pt-12 pb-24 md:pb-12 mt-12 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-orange-500 leading-none">E.E</span>
              <span className="text-xs font-bold tracking-[0.2em]">IMPORTATION</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your most trusted direct importer in Nigeria. We specialize in bringing you the latest BRAND NEW gadgets and appliances at competitive prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-orange-500">Shop Categories</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link to="/category/Smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/category/Laptops" className="hover:text-white transition-colors">Laptops</Link></li>
              <li><Link to="/category/Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/category/Home Appliances" className="hover:text-white transition-colors">Home Appliances</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-orange-500">Customer Care</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-orange-500">Get in Touch</h4>
            <div className="space-y-3 text-neutral-400 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-orange-500" />
                <span>{CONTACT_PHONE}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={16} className="text-green-500" />
                <span>Available on WhatsApp</span>
              </div>
              <p className="pt-2 italic text-xs">Based in Lagos, Shipping Nationwide</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500 text-xs">
          <p>© {new Date().getFullYear()} {BUSINESS_NAME}. All items are 100% BRAND NEW. Powered by Trust.</p>
        </div>
      </footer>

      {/* Sticky WhatsApp Floating Button - Mobile */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-green-600 transition-all transform hover:scale-110 active:scale-95 group"
        id="whatsapp-sticky"
      >
        <span className="hidden md:block font-bold text-sm whitespace-nowrap">Order on WhatsApp</span>
        <MessageCircle size={24} className="fill-current" />
      </a>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-[70] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="flex flex-col" onClick={() => setIsMenuOpen(false)}>
                  <span className="text-2xl font-black tracking-tighter text-orange-600 leading-none">E.E</span>
                  <span className="text-xs font-bold tracking-[0.2em]">IMPORTATION</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
              </div>
              
              <nav className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Categories</h3>
                  <div className="grid grid-cols-1 gap-4 font-semibold text-lg">
                    {['Smartphones', 'Laptops', 'Accessories', 'Home Appliances', 'Gadgets'].map((cat) => (
                      <Link 
                        key={cat}
                        to={`/category/${cat}`}
                        className="flex items-center justify-between group hover:text-orange-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {cat}
                        <Truck size={16} className="text-neutral-200 group-hover:text-orange-300 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-neutral-100">
                  <a 
                    href={whatsappLink}
                    className="w-full bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3"
                  >
                    <MessageCircle size={20} />
                    WhatsApp Us Now
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
