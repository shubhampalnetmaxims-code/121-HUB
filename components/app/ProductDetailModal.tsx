import React, { useState } from 'react';
import { X, Heart, ShoppingCart, ShieldCheck, Tag, Info, Layers, Percent, ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { Product, User as UserType, CartItem } from '../../types';
import { useToast } from '../ToastContext';
import { useNavigate } from 'react-router-dom';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAuthTrigger: () => void;
  currentUser: UserType | null;
  onAddToCart?: (item: CartItem) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, onClose, onAuthTrigger, currentUser, onAddToCart 
}) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isSuccessPromptOpen, setIsSuccessPromptOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizeStocks?.[0]?.size || '');

  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const currentSizeStock = product.sizeStocks?.find(ss => ss.size === selectedSize);
  const isOutOfStock = !currentSizeStock || currentSizeStock.quantity === 0;

  const handleAction = (type: 'wishlist' | 'cart') => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
    } else {
      if (type === 'cart') {
        if (isOutOfStock) {
          showToast('This size is currently out of stock', 'error');
          return;
        }
        
        const cartItem: CartItem = {
          id: Math.random().toString(36).substr(2, 9),
          productId: product.id,
          name: product.name,
          price: hasDiscount ? (product.discountedPrice || product.price) : product.price,
          size: selectedSize,
          quantity: 1,
          image: product.images[0] || '',
          facilityId: product.facilityId
        };
        
        onAddToCart?.(cartItem);
        setIsSuccessPromptOpen(true);
      } else {
        showToast('Item added to wishlist', 'success');
      }
    }
  };

  return (
    <div className="absolute inset-0 z-[80] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
      {/* Ultra-Wide Hero Section */}
      <div className="relative aspect-[2.5/1] w-full bg-slate-50 shrink-0 border-b border-slate-100 overflow-hidden">
        {product.images?.[activeImage] ? (
          <img src={product.images[activeImage]} className="w-full h-full object-cover" alt={product.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-100">
            <Layers className="w-12 h-12" />
          </div>
        )}
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button onClick={onClose} className="p-2 bg-white/95 backdrop-blur rounded-xl text-slate-900 shadow-md border border-slate-200 active:scale-90 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => handleAction('wishlist')} className="p-2 bg-white/95 backdrop-blur rounded-xl text-slate-900 shadow-md border border-slate-200 active:text-red-500 active:scale-90 transition-all">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {hasDiscount && (
          <div className="absolute bottom-4 left-4 px-2 py-0.5 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shadow-lg z-10">
            <Percent className="w-2.5 h-2.5" /> -{product.discountPercent}%
          </div>
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {product.images.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`h-0.5 rounded-full transition-all ${i === activeImage ? 'bg-slate-900 w-3' : 'bg-slate-300 w-1'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-44 scrollbar-hide">
        <section>
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">{product.category || 'Premium Gear'}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">{product.name}</h3>
            </div>
            <div className="text-right shrink-0">
              {hasDiscount && product.discountedPrice ? (
                <>
                  <div className="text-[11px] text-slate-400 line-through font-bold decoration-red-400/50 leading-none mb-1">${product.price.toFixed(2)}</div>
                  <div className="text-2xl font-black text-red-600 tracking-tighter leading-none">${product.discountedPrice.toFixed(2)}</div>
                </>
              ) : (
                <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${!isOutOfStock ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {!isOutOfStock ? `${currentSizeStock.quantity} In Stock` : `Sold Out`}
             </span>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <h4 className="text-[9px] font-black uppercase tracking-widest">About this product</h4>
          </div>
          <div className="bg-slate-50/70 p-6 rounded-[32px] border border-slate-100 shadow-inner">
            <p className="text-slate-800 leading-[1.6] text-lg font-semibold tracking-tight">
              {product.description}
            </p>
          </div>
        </section>

        {product.sizeStocks && product.sizeStocks.length > 0 && (
          <section className="space-y-5">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Select Size</h4>
            <div className="grid grid-cols-4 gap-2">
              {product.sizeStocks.map(ss => {
                const outOfStock = ss.quantity === 0;
                return (
                  <button
                    key={ss.size}
                    disabled={outOfStock}
                    onClick={() => setSelectedSize(ss.size)}
                    className={`py-3 rounded-2xl border-2 font-black text-[11px] transition-all relative ${
                      selectedSize === ss.size 
                      ? 'border-blue-600 bg-blue-50 text-blue-600' 
                      : outOfStock ? 'border-slate-50 bg-slate-50/50 text-slate-200 cursor-not-allowed' : 'border-slate-100 bg-white text-slate-500'
                    }`}
                  >
                    {ss.size}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-3">
          {product.color && (
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-[24px] flex justify-between items-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Colorway</p>
              <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">{product.color}</p>
            </div>
          )}
        </div>

        <section className="p-7 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">Facility Pickup</p>
              <h5 className="text-lg font-black mb-1 leading-tight tracking-tight">Ready in 60 mins</h5>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-[85%]">
                Digital fulfillment enabled. Collect your purchase from the front desk upon your next arrival.
              </p>
           </div>
           <Tag className="absolute -right-5 -bottom-5 w-28 h-28 text-white/5 rotate-12" />
        </section>
      </div>

      {/* Action Bar */}
      <div className="p-6 pt-4 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
        <button 
          onClick={() => handleAction('cart')}
          disabled={isOutOfStock}
          className={`w-full py-4.5 rounded-2xl font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${
            isOutOfStock 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-slate-800 active:scale-95 shadow-black/20'
          }`}
        >
          {isOutOfStock ? (
            'Not Available'
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart • ${hasDiscount ? product.discountedPrice?.toFixed(2) : product.price.toFixed(2)}
            </>
          )}
        </button>
      </div>

      {/* Success Modal */}
      {isSuccessPromptOpen && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 text-center space-y-6 max-w-xs shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[28px] flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Item Added!</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">Your gear is in the cart. Continue exploring or finalize your purchase.</p>
            </div>
            <div className="space-y-3 pt-2">
              <button onClick={() => { setIsSuccessPromptOpen(false); onClose(); }} className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 active:scale-95 transition-all">Continue Shopping</button>
              <button onClick={() => { setIsSuccessPromptOpen(false); navigate('/app/cart'); }} className="w-full py-4 bg-black text-white rounded-2xl font-black shadow-xl shadow-black/20 active:scale-95 transition-all">Go to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Overlay */}
      {isLoginPromptOpen && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 text-center space-y-6 max-w-xs shadow-2xl">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Save Your Bag</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">Please sign in to your account to save items and complete your purchase.</p>
            </div>
            <div className="space-y-3 pt-2">
              <button onClick={onAuthTrigger} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Sign In Now</button>
              <button onClick={() => setIsLoginPromptOpen(false)} className="w-full py-2.5 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailModal;