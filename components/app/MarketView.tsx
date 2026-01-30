import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Search, Heart, ShoppingCart, Plus, Percent, Tag } from 'lucide-react';
import { Facility, Product, User, CartItem } from '../../types';
import ProductDetailModal from './ProductDetailModal';
import { useToast } from '../ToastContext';

interface MarketViewProps {
  facilities: Facility[];
  products: Product[];
  onAuthTrigger: () => void;
  currentUser: User | null;
  onAddToCart: (item: CartItem) => void;
  cart: CartItem[];
}

const MarketView: React.FC<MarketViewProps> = ({ facilities, products, onAuthTrigger, currentUser, onAddToCart, cart }) => {
  const { id: urlFacilityId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [seeAll, setSeeAll] = useState(false);

  useEffect(() => {
    if (urlFacilityId) {
      setSelectedFacilityId(urlFacilityId);
      setSeeAll(true);
    }
  }, [urlFacilityId]);

  const activeFacilities = facilities.filter(f => f.isActive && f.features?.includes('marketplace'));

  const filteredProducts = products.filter(p => {
    if (p.status !== 'active') return false;
    if (selectedFacilityId !== 'all' && p.facilityId !== selectedFacilityId) return false;
    return true;
  });

  const groupedProducts = activeFacilities.map(f => ({
    facility: f,
    products: products.filter(p => p.facilityId === f.id && p.status === 'active')
  })).filter(g => g.products.length > 0);

  const handleQuickAdd = (product: Product) => {
    if (!currentUser) {
      onAuthTrigger();
      return;
    }

    const firstAvailableSize = product.sizeStocks?.find(s => s.quantity > 0)?.size || 'One Size';
    
    const cartItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      price: product.discountPercent && product.discountPercent > 0 && product.discountedPrice 
        ? product.discountedPrice 
        : product.price,
      size: firstAvailableSize,
      quantity: 1,
      image: product.images[0] || '',
      facilityId: product.facilityId
    };

    onAddToCart(cartItem);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left relative">
      <div className="p-6 pt-10 flex justify-between items-center border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Marketplace</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Facility Gear</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-lg bg-slate-50 border border-slate-200"><Search className="w-4 h-4 text-slate-400" /></button>
          <button 
            onClick={() => navigate('/app/cart')}
            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 relative"
          >
            <ShoppingCart className="w-4 h-4 text-slate-400" />
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <div className="p-4 space-y-6">
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
            <button 
              onClick={() => { setSelectedFacilityId('all'); setSeeAll(false); }}
              className={`shrink-0 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedFacilityId === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
            >
              All
            </button>
            {activeFacilities.map(f => (
              <button 
                key={f.id}
                onClick={() => { setSelectedFacilityId(f.id); setSeeAll(true); }}
                className={`shrink-0 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedFacilityId === f.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {selectedFacilityId === 'all' && !seeAll ? (
            <div className="space-y-10">
              {groupedProducts.map(group => (
                <section key={group.facility.id}>
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{group.facility.name}</h3>
                    <button 
                      onClick={() => { setSelectedFacilityId(group.facility.id); setSeeAll(true); }}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2 px-1 scrollbar-hide">
                    {group.products.map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={() => setViewingProduct(p)} 
                        onPlusClick={() => handleQuickAdd(p)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 px-1">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onClick={() => setViewingProduct(p)} 
                  onPlusClick={() => handleQuickAdd(p)}
                  isGrid 
                />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 py-20 text-center text-slate-300 font-bold italic">No items found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {viewingProduct && (
        <ProductDetailModal 
          product={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
          onAuthTrigger={onAuthTrigger}
          currentUser={currentUser}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onClick: () => void; onPlusClick: () => void; isGrid?: boolean }> = ({ product, onClick, onPlusClick, isGrid = false }) => {
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  
  return (
    <div 
      onClick={onClick}
      className={`${isGrid ? 'w-full' : 'w-40 shrink-0'} bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer flex flex-col aspect-[3/4.2] group`}
    >
      <div className="relative h-[45%] w-full bg-slate-50 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingBag className="w-5 h-5" /></div>
        )}
        
        {hasDiscount && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-600 text-white rounded text-[8px] font-bold uppercase shadow-sm">
            -{product.discountPercent}%
          </div>
        )}
      </div>
      
      <div className="p-3.5 flex-1 flex flex-col text-left">
        <div className="flex-1">
          <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mb-1">{product.category || 'Gear'}</p>
          <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight tracking-tight">{product.name}</h4>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            {hasDiscount && product.discountedPrice ? (
              <>
                <span className="text-[9px] text-slate-400 line-through font-medium decoration-red-400/20">${product.price.toFixed(2)}</span>
                <span className="font-bold text-red-600 text-sm leading-none">${product.discountedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold text-slate-900 text-sm leading-none">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPlusClick();
            }}
            className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm transition-colors hover:bg-blue-600"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketView;