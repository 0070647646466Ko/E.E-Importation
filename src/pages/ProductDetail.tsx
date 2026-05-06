import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Star, MessageSquare, ArrowLeft, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import { formatCurrency, getWhatsAppUrl, CONTACT_PHONE } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() } as Product);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-orange-600 animate-pulse">LOADING BRAND NEW PRODUCT...</div>;
  if (!product) return <div className="h-screen flex flex-col items-center justify-center space-y-4">
    <h2 className="text-2xl font-bold">Product not found</h2>
    <Link to="/" className="text-orange-600 underline">Return to Shop</Link>
  </div>;

  const whatsappMsg = `Hello E.E IMPORTATION, I want to buy the BRAND NEW ${product.name} (${formatCurrency(product.discountPrice || product.price)}). Is it still in stock?`;
  const whatsappUrl = getWhatsAppUrl(CONTACT_PHONE, whatsappMsg);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest overflow-hidden whitespace-nowrap">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/category/${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-neutral-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Images Section */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-2xl p-8"
          >
            <img 
              src={product.images[activeImage] || 'https://placehold.co/800x800?text=Brand+New+Items'} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${activeImage === i ? 'border-orange-500 scale-105' : 'border-neutral-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                100% Brand New
              </span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${product.stockStatus === 'In Stock' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {product.stockStatus}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 pt-2">
              {product.discountPrice ? (
                <>
                  <span className="text-4xl font-black text-orange-600 tracking-tighter">{formatCurrency(product.discountPrice)}</span>
                  <span className="text-xl text-neutral-400 line-through font-bold">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-4xl font-black text-black tracking-tighter">{formatCurrency(product.price)}</span>
              )}
            </div>
          </div>

          {/* Key Trust Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <Truck className="text-orange-600" size={24} />
              <div>
                <p className="text-xs font-bold uppercase tracking-tight">Nigeria Nationwide</p>
                <p className="text-[10px] text-neutral-500 font-bold">Fast & Secure Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
              <ShieldCheck className="text-green-600" size={24} />
              <div>
                <p className="text-xs font-bold uppercase tracking-tight">Official Warranty</p>
                <p className="text-[10px] text-neutral-500 font-bold">Direct OEM Coverage</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 border-t border-neutral-100 pt-8">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Info size={16} />
              Product Description
            </h3>
            <p className="text-neutral-600 leading-relaxed text-sm font-medium">
              {product.description || `Experience the power of the brand new ${product.name}. Direct import, never opened, complete with all original accessories.`}
            </p>
          </div>

          {/* Specs List */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="border-b border-neutral-50 pb-2">
                  <dt className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{key}</dt>
                  <dd className="text-xs font-bold text-neutral-900">{val}</dd>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-8 space-y-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-green-500/20 shadow-lg"
            >
              <MessageSquare size={24} className="fill-current" />
              ORDER VIA WHATSAPP NOW
            </a>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-neutral-400 py-2">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Secure Payment</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Verified Seller</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> 24h Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Us Redux */}
      <section className="bg-black text-white p-12 md:p-24 rounded-[3rem] space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase mb-6">WHY BUY FROM <span className="text-orange-500">E.E IMPORTATION?</span></h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full shrink-0 flex items-center justify-center font-bold">1</div>
              <p className="text-neutral-300 font-medium">We specialize in DIRECT factory imports. No middle-men in Nigeria, which means the best wholesale prices for you.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full shrink-0 flex items-center justify-center font-bold">2</div>
              <p className="text-neutral-300 font-medium">Strict "No UK-Used" policy. We only sell Brand New, sealed items to ensure our customers get maximum longevity from their tech.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full shrink-0 flex items-center justify-center font-bold">3</div>
              <p className="text-neutral-300 font-medium">Nationwide shipping with insurance. We've shipped thousands of items to every state in Nigeria safely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
