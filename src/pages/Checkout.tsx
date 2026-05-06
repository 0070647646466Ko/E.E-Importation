import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Phone, MapPin, Truck, ShieldCheck, CheckCircleIcon, ArrowLeft } from 'lucide-react';
import { BUSINESS_NAME, CONTACT_PHONE, getWhatsAppUrl } from '../lib/utils';
import { useState } from 'react';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems] = useState([]); // This would normally come from a cart context

  const whatsappLink = getWhatsAppUrl(CONTACT_PHONE, "Hi E.E IMPORTATION, I've just reviewed my order details and I'm ready to pay and confirm delivery!");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 space-y-12">
      <header className="space-y-4 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-orange-600 transition-colors">
          <ArrowLeft size={14} /> Back to Shopping
        </Link>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">EXPRESS CHECKOUT</h1>
        <p className="text-neutral-500 font-medium">Fast, Secure and Direct to WhatsApp</p>
      </header>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-neutral-200/50 p-8 md:p-14 space-y-12 border border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Why WhatsApp? */}
          <div className="space-y-8">
             <div className="space-y-4">
               <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                 <MessageSquare size={20} className="text-green-500" />
                 WHY WHATSAPP?
               </h3>
               <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                 At E.E IMPORTATION, we prioritize direct communication. Ordering on WhatsApp allows us to:
               </p>
               <ul className="space-y-3">
                 <li className="flex items-start gap-3 text-sm font-bold">
                   <CheckCircleIcon size={18} className="text-green-500 shrink-0 mt-0.5" />
                   Confirm real-time stock availability
                 </li>
                 <li className="flex items-start gap-3 text-sm font-bold">
                   <CheckCircleIcon size={18} className="text-green-500 shrink-0 mt-0.5" />
                   Provide direct bank transfer details securely
                 </li>
                 <li className="flex items-start gap-3 text-sm font-bold">
                   <CheckCircleIcon size={18} className="text-green-500 shrink-0 mt-0.5" />
                   Finalize delivery speed to your specific location
                 </li>
               </ul>
             </div>

             <div className="grid grid-cols-1 gap-4">
               <div className="flex items-center gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                 <MapPin className="text-orange-600" size={24} />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Our Location</p>
                   <p className="text-sm font-bold">Lagos State, Nigeria</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                 <Truck className="text-orange-600" size={24} />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Delivery Scope</p>
                   <p className="text-sm font-bold">Nationwide Shipping Available</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Action Card */}
          <div className="bg-neutral-900 rounded-[2rem] p-8 text-white space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
               <h3 className="text-2xl font-black tracking-tight leading-tight uppercase">READY TO FINALIZE YOUR <span className="text-green-500">BRAND NEW</span> TECH?</h3>
               <p className="text-neutral-400 text-sm font-medium">Your selection of premium gadgets is just one click away from being yours.</p>
            </div>

            <div className="space-y-4">
              <a 
                href={whatsappLink}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.03] shadow-xl shadow-green-500/30"
              >
                <MessageSquare size={24} className="fill-current" />
                CHAT TO CONFIRM & PAY
              </a>
              <p className="text-center text-[10px] uppercase font-bold tracking-widest text-neutral-500">Fast Response: Usually within 5 mins</p>
            </div>

            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Verified Importer</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={14} className="text-neutral-500" />
                <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-tighter">{CONTACT_PHONE}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-neutral-400 text-xs font-medium max-w-lg mx-auto">
        By clicking "Chat to Confirm & Pay", you will be redirected to WhatsApp to speak directly with an E.E IMPORTATION representative. We process all orders manually to ensure 100% security for our customers.
      </div>
    </div>
  );
}
