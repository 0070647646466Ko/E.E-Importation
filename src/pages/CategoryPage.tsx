import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { ProductCard } from './Home';
import { Filter, Grid2X2, List, ChevronDown, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!category) return;
      try {
        const q = query(
          collection(db, 'products'),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black">Categories</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{category}</h1>
            <p className="text-neutral-500 font-medium italic">Premium selection of 100% BRAND NEW gadgets</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2.5 rounded-full text-xs font-bold hover:border-orange-500 transition-all">
              <Filter size={16} /> Filters <ChevronDown size={14} />
            </button>
            <div className="hidden sm:flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200">
              <button className="p-2 bg-white rounded-full shadow-sm text-orange-600"><Grid2X2 size={18} /></button>
              <button className="p-2 text-neutral-400"><List size={18} /></button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-[2.5rem]" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-white rounded-[3rem] border border-neutral-100 shadow-sm">
           <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200">
             <ShoppingBag size={40} />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-black tracking-tight">NO ITEMS IN {category?.toUpperCase()}</h3>
             <p className="text-neutral-500 font-medium">We're currently importing new stock. Check back soon!</p>
           </div>
           <Link to="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all">
             Back to Shop
           </Link>
        </div>
      )}

      {/* Trust Quote */}
      <section className="bg-orange-50 border border-orange-100 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-xl font-black uppercase tracking-tight">Official Manufacturer Warranty</h4>
          <p className="text-neutral-600 text-sm font-medium">All our brand new items come with standard 12-month merchant warranty and 7-day swap policy.</p>
        </div>
        <ShieldCheck size={64} className="text-orange-600 opacity-20 hidden md:block" />
      </section>
    </div>
  );
}
