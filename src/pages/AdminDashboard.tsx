import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { Product } from '../types';
import { Box, Plus, Trash2, Edit3, LogOut, LayoutDashboard, ShoppingBag, Settings, LogIn, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const ADMIN_EMAIL = "odjugoedward204@gmail.com";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Smartphones',
    images: '',
    stockStatus: 'In Stock',
    isFeatured: false,
    isFlashSale: false
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email === ADMIN_EMAIL) {
        fetchProducts();
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email !== ADMIN_EMAIL) return;

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
        condition: 'Brand New',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'products'), productData);
      setIsAdding(false);
      setFormData({
        name: '', description: '', price: '', discountPrice: '',
        category: 'Smartphones', images: '', stockStatus: 'In Stock',
        isFeatured: false, isFlashSale: false
      });
      fetchProducts();
    } catch (err) {
      alert("Error adding product. Check console.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-neutral-400">Verifying Admin Access...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 space-y-8 text-center border border-neutral-100">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">ADMIN ACCESS</h1>
            <p className="text-neutral-500 font-medium leading-relaxed">
              This area is restricted to E.E IMPORTATION administrative staff for stock management.
            </p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-xl"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
          <p className="text-xs text-neutral-400">Authorized email: {ADMIN_EMAIL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-2xl font-black text-orange-500 tracking-tighter">ADMIN</h2>
          <p className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Inventory System</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl font-medium transition-all text-neutral-400 hover:text-white">
            <ShoppingBag size={20} /> All Products
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl font-medium transition-all text-neutral-400 hover:text-white">
            <Settings size={20} /> Settings
          </button>
        </nav>

        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3 text-red-400 font-bold p-3 hover:bg-red-950/30 rounded-xl transition-all"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 space-y-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight uppercase">Product Inventory</h1>
            <p className="text-neutral-500 font-medium">Manage your brand new items and pricing</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
          >
            <Plus size={20} /> Add New Entry
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/50">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Stock</p>
            <p className="text-3xl font-black">{products.length} Items</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/50">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Featured Items</p>
            <p className="text-3xl font-black text-orange-600">{products.filter(p => p.isFeatured).length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/50">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Out of Stock</p>
            <p className="text-3xl font-black text-red-600">{products.filter(p => p.stockStatus === 'Out of Stock').length}</p>
          </div>
        </section>

        {/* Products Table/List */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 italic text-neutral-400 text-xs">
                  <th className="px-6 py-4 font-black">PRODUCT</th>
                  <th className="px-6 py-4 font-black">CATEGORY</th>
                  <th className="px-6 py-4 font-black">PRICE</th>
                  <th className="px-6 py-4 font-black">STATUS</th>
                  <th className="px-6 py-4 font-black text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                          <img src={p.images[0] || 'https://placehold.co/100x100'} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-900 leading-tight">{p.name}</span>
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1">
                            {p.condition} {p.isFeatured && <span className="bg-orange-100 px-1 rounded">⭐</span>}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900">
                      {formatCurrency(p.discountPrice || p.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.stockStatus === 'In Stock' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {p.stockStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition-all font-bold"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Box size={48} className="mx-auto text-neutral-200" />
              <p className="text-neutral-500 font-medium">No brand new items in your catalog yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-black text-white p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">New Product Registration</h2>
              <button onClick={() => setIsAdding(false)} className="text-neutral-400 hover:text-white transition-colors uppercase font-black text-xs tracking-widest underline">Cancel</button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Product Name</label>
                <input 
                  required
                  placeholder="iPhone 15 Pro Max 256GB - Natural Titanium"
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Description</label>
                <textarea 
                  placeholder="Factory sealed, brand new, with 1 year warranty..."
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium h-24"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Original Price (₦)</label>
                <input 
                  required type="number"
                  placeholder="1500000"
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Discount Price (₦) - Optional</label>
                <input 
                  type="number"
                  placeholder="1450000"
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={formData.discountPrice}
                  onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Category</label>
                <select 
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {['Smartphones', 'Laptops', 'Accessories', 'Home Appliances', 'Gadgets'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Stock Status</label>
                <select 
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={formData.stockStatus}
                  onChange={e => setFormData({...formData, stockStatus: e.target.value})}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Few Left">Few Left</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Image URLs (comma separated)</label>
                <input 
                  placeholder="https://imgur.com/image1.jpg, https://imgur.com/image2.jpg"
                  className="w-full bg-neutral-100 border-none rounded-xl p-3 focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={formData.images}
                  onChange={e => setFormData({...formData, images: e.target.value})}
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-orange-600 rounded" 
                    checked={formData.isFeatured}
                    onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-orange-600 transition-colors">Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-orange-600 rounded" 
                    checked={formData.isFlashSale}
                    onChange={e => setFormData({...formData, isFlashSale: e.target.checked})}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-orange-600 transition-colors">Flash Sale</span>
                </label>
              </div>

              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit"
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20"
                >
                  PUBLISH BRAND NEW ITEM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
