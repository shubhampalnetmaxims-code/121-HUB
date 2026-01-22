
import React, { useState } from 'react';
import { X, Heart, ShoppingCart, ShieldCheck, Tag, Info, Layers } from 'lucide-react';
import { Product, User as UserType } from '../../types';
import { useToast } from '../ToastContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAuthTrigger: () => void;
  currentUser: UserType | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, onClose, onAuthTrigger, currentUser 
}) => {
  const { showToast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [promptType, setPromptType] = useState<'wishlist' | 'cart'>('cart');

  const handleAction = (type: 'wishlist' | 'cart') => {
    if (!currentUser) {
      setPromptType(type);
      setIsLoginPromptOpen(true);
    } else {
      showToast(`Item added to ${type === 'wishlist' ? 'wishlist' : 'cart'}`, 'success');
    }
  };

  return (
    <div className="absolute inset-0 z-[80] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
      {/* Hero Section */}
      <div className="relative aspect-square w-full bg-slate-50 shrink-0">
        {product.images?.[activeImage] ? (
          <img src={product.images[activeImage]} className="w-full h-full object-cover" alt={product.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-100"><Layers className="w-24 h-24" /></div>
        )}
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button onClick={onClose} className="p-3 bg-white/20 backdrop-blur rounded-2xl text-white shadow-2xl"><X className="w-6 h-6" /></button>
          <button onClick={() => handleAction('wishlist')} className="p-3 bg-white/20 backdrop-blur rounded-2xl text-white shadow-2xl active:text-red-500"><Heart className="w-6 h-6" /></button>
        </div>

        {product.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40 scrollbar-hide">
        <section>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.category || 'Essential Gear'}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{product.name}</h3>
            </div>
            <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
             <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${product.quantity > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {product.quantity > 0 ? `${product.quantity} in Stock` : 'Out of Stock'}
             </span>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3.5 h-3.5" /> Product Info
          </h4>
          <p className="text-slate-600 leading-relaxed font-medium">{product.description}</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
           {product.size && (
             <div className="p-5 bg-slate-50 border border-slate-100 rounded-[28px]">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Sizes</p>
               <p className="font-extrabold text-slate-900 text-sm">{product.size}</p>
             </div>
           )}
           {product.color && (
             <div className="p-5 bg-slate-50 border border-slate-100 rounded-[28px]">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Colors</p>
               <p className="font-extrabold text-slate-900 text-sm">{product.color}</p>
             </div>
           )}
        </div>

        <section className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100">
           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none flex items-center gap-2">
             <Tag className="w-3 h-3" /> Digital Receipt
           </p>
           <p className="text-xs font-bold text-slate-600 leading-relaxed">
             Purchased items are ready for pickup at the facility desk within 2 hours of order.
           </p>
        </section>
      </div>

      {/* Sticky Bottom Action */}
      <div className="p-6 pt-2 pb-10 border-t border-slate-50 bg-white/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
        <button 
          onClick={() => handleAction('cart')}
          disabled={product.quantity === 0}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <ShoppingCart className="w-6 h-6" />
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Login Prompt Overlay */}
      {isLoginPromptOpen && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-8 text-center space-y-6 max-w-xs shadow-2xl">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Login Required</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Please sign in to add items to your {promptType === 'wishlist' ? 'wishlist' : 'cart'}.</p>
            <div className="space-y-3">
              <button onClick={onAuthTrigger} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Log In & Proceed</button>
              <button onClick={() => setIsLoginPromptOpen(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Maybe Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModal;
