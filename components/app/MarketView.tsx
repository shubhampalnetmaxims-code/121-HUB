
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Search, Heart, ShoppingCart, Plus } from 'lucide-react';
import { Facility, Product, User } from '../../types';
import ProductDetailModal from './ProductDetailModal';

interface MarketViewProps {
  facilities: Facility[];
  products: Product[];
  onAuthTrigger: () => void;
  currentUser: User | null;
}

const MarketView: React.FC<MarketViewProps> = ({ facilities, products, onAuthTrigger, currentUser }) => {
  const { id: urlFacilityId } = useParams();
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

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="p-6 pt-12 flex justify-between items-center border-b border-slate-50 shrink-0">
        <div className="text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Marketplace</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Performance Gear</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><Search className="w-5 h-5 text-slate-400" /></button>
          <button className="p-3 rounded-2xl bg-slate-50 border border-slate-100 relative">
            <ShoppingCart className="w-5 h-5 text-slate-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center">0</div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
        <div className="p-4 space-y-8">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            <button 
              onClick={() => { setSelectedFacilityId('all'); setSeeAll(false); }}
              className={`shrink-0 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedFacilityId === 'all' ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              See All
            </button>
            {activeFacilities.map(f => (
              <button 
                key={f.id}
                onClick={() => { setSelectedFacilityId(f.id); setSeeAll(true); }}
                className={`shrink-0 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedFacilityId === f.id ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {selectedFacilityId === 'all' && !seeAll ? (
            <div className="space-y-10">
              {groupedProducts.map(group => (
                <section key={group.facility.id}>
                  <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{group.facility.name}</h3>
                    <button 
                      onClick={() => { setSelectedFacilityId(group.facility.id); setSeeAll(true); }}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1"
                    >
                      Explore All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide">
                    {group.products.map(p => (
                      <ProductCard key={p.id} product={p} onClick={() => setViewingProduct(p)} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 px-2">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setViewingProduct(p)} isGrid />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 py-20 text-center text-slate-300 font-bold italic">No products found in this hub.</div>
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
        />
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onClick: () => void; isGrid?: boolean }> = ({ product, onClick, isGrid = false }) => (
  <div 
    onClick={onClick}
    className={`${isGrid ? 'w-full' : 'w-40 shrink-0'} bg-white rounded-[60px] border border-slate-100 overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer flex flex-col aspect-[4/7]`}
  >
    <div className="relative h-2/5 w-full bg-slate-50 overflow-hidden">
      {product.images?.[0] ? (
        <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingBag className="w-8 h-8" /></div>
      )}
      <button 
        className="absolute top-4 right-4 p-2 bg-white/40 backdrop-blur rounded-full text-white hover:text-red-500 transition-colors"
        onClick={(e) => { e.stopPropagation(); }}
      >
        <Heart className="w-4 h-4" />
      </button>
    </div>
    <div className="p-4 flex-1 flex flex-col text-left justify-between items-center">
      <div className="w-full text-center space-y-1">
        <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{product.category || 'Gear'}</p>
        <h4 className="font-bold text-slate-900 text-xs line-clamp-2 px-1">{product.name}</h4>
      </div>
      
      <div className="w-full flex justify-between items-center mt-2 px-1">
        <span className="font-black text-slate-900 text-xs">${product.price.toFixed(2)}</span>
        <div className="w-8 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </div>
  </div>
);

export default MarketView;
