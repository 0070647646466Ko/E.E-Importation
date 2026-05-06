import { motion } from 'motion/react';
import { Truck, ShieldCheck, Zap, Star, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, getWhatsAppUrl, CONTACT_PHONE } from '../lib/utils';
import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [flashSales, setFlashSales] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const featuredQuery = query(
          collection(db, 'products'),
          where('isFeatured', '==', true),
          limit(8)
        );
        const flashQuery = query(
          collection(db, 'products'),
          where('isFlashSale', '==', true),
          limit(4)
        );

        const [featuredSnap, flashSnap] = await Promise.all([
          getDocs(featuredQuery),
          getDocs(flashQuery)
        ]);

        setFeaturedProducts(featuredSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        setFlashSales(flashSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12 md:space-y-24">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop" 
            alt="Premium Gadgets" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6 md:space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              <Zap size={14} className="fill-current" />
              Direct UK/US Imports
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9]">
              ONLY THE <span className="text-orange-500">LATEST</span> BRAND NEW GADGETS.
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              We skip the UK-Used market. Every item we sell is 100% factory sealed with official warranty. Guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/category/Smartphones"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                Start Shopping
                <ArrowRight size={20} />
              </Link>
              <a 
                href={getWhatsAppUrl(CONTACT_PHONE, "Hi E.E IMPORTATION, I want to check availability for brand new iPhones/Samsung.")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Wrapper */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-neutral-200/50 border border-neutral-100">
          <TrustBadge 
            icon={<ShieldCheck className="text-orange-600" size={28} />}
            title="100% Brand New"
            desc="No UK Used items. Ever."
          />
          <TrustBadge 
            icon={<Truck className="text-orange-600" size={28} />}
            title="Fast Delivery"
            desc="Lagos to Nationwide"
          />
          <TrustBadge 
            icon={<Star className="text-orange-600 fill-orange-600" size={28} />}
            title="Direct Import"
            desc="Unbeatable Pricing"
          />
          <TrustBadge 
            icon={<Clock className="text-orange-600" size={28} />}
            title="24/7 Support"
            desc="Quick WhatsApp replies"
          />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">SHOP CATEGORIES</h2>
            <p className="text-neutral-500 font-medium">Explore our premium collection of new arrivals</p>
          </div>
          <Link to="/categories" className="text-orange-600 font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          <CategoryCard name="Smartphones" image="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600" />
          <CategoryCard name="Laptops" image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600" />
          <CategoryCard name="Home Appliances" image="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600" />
          <CategoryCard name="Accessories" image="https://images.unsplash.com/photo-1583394838336-acd977730f9a?q=80&w=600" />
          <CategoryCard name="Gadgets" image="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=600" />
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">BEST SELLERS</h2>
          <p className="text-neutral-500 font-medium">Direct imports arriving weekly</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-100 p-12 rounded-3xl text-center space-y-4 border-2 border-dashed border-neutral-300">
            <p className="text-neutral-600 font-bold">New stock is arriving! Currently updating the catalog.</p>
            <Link to="/admin" className="text-orange-600 font-bold underline">Admin: Add your first product</Link>
          </div>
        )}
      </section>

      {/* Social Proof Section */}
      <section className="bg-neutral-100 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">What Customers Say</h2>
            <p className="text-neutral-500 font-medium italic">Join 10,000+ satisfied customers nationwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              name="Chinedu O."
              text="I was skeptical about buying an iPhone online in Nigeria, but E.E Importation delivered a factory-sealed iPhone 15 Pro Max. Brand new indeed!"
              location="Lagos"
            />
            <TestimonialCard 
              name="Amina B."
              text="Their delivery to Abuja was surprisingly fast. The home appliances I bought were in perfect condition. Best price for brand new items."
              location="Abuja"
            />
            <TestimonialCard 
              name="Segun A."
              text="Excellent customer service via WhatsApp. They answered all my questions before I made payment. Highly recommended seller."
              location="Port Harcourt"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ name, image }: { name: string, image: string }) {
  return (
    <Link 
      to={`/category/${name}`}
      className="group relative h-40 md:h-64 rounded-3xl overflow-hidden block shadow-lg hover:shadow-xl transition-all"
    >
      <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <span className="text-white font-black text-sm md:text-lg uppercase tracking-tight leading-tight">{name}</span>
      </div>
    </Link>
  );
}

export function ProductCard({ product, index }: { product: Product, index: number }) {
  const whatsappMsg = `Hi E.E IMPORTATION, I'm interested in buying the BRAND NEW ${product.name} priced at ${formatCurrency(product.price)}. Is it available?`;
  const whatsappUrl = getWhatsAppUrl(CONTACT_PHONE, whatsappMsg);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-neutral-100 hover:border-orange-500/30 transition-all hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-neutral-50 block shrink-0">
        <img 
          src={product.images[0] || 'https://placehold.co/600x600?text=Brand+New+Items'} 
          alt={product.name} 
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPrice && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
            Save {Math.round((1 - product.discountPrice / product.price) * 100)}%
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
          Brand New
        </div>
      </Link>
      
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{product.category}</span>
          <h3 className="font-bold text-sm md:text-base leading-tight line-clamp-2 md:group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              {product.stockStatus}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-xl font-black text-black tracking-tight">{formatCurrency(product.discountPrice)}</span>
                <span className="text-xs text-neutral-400 line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="text-xl font-black text-black tracking-tight">{formatCurrency(product.price)}</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2 pt-1">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} className="fill-current" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrustBadge({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 md:space-y-3 md:items-start md:text-left">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-black text-xs md:text-sm uppercase tracking-tight">{title}</h4>
        <p className="text-[10px] md:text-xs text-neutral-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ name, text, location }: { name: string, text: string, location: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-4 border border-neutral-100">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-orange-500 fill-orange-500" />)}
      </div>
      <p className="text-neutral-700 text-sm leading-relaxed italic font-medium">"{text}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-neutral-50">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
          {name[0]}
        </div>
        <div>
          <h5 className="font-bold text-sm tracking-tight">{name}</h5>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{location}, Nigeria</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-neutral-100 animate-pulse rounded-[2rem] aspect-[3/4]" />
  );
}
