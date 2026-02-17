import React, { useState, useMemo } from 'react';
import { Plus, Menu, ShoppingBag, Edit3, Trash2, Tag, Layers, Search, ChevronRight, Percent, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { Facility, Product } from '../../types';
import ProductFormModal from './ProductFormModal';
import ConfirmationModal from './ConfirmationModal';

interface MarketplaceViewProps {
  facilities: Facility[];
  products: Product[];
  onAddProduct: (p: any) => void;
  onUpdateProduct: (id: string, updates: any) => void;
  onDeleteProduct: (id: string) => void;
  onOpenSidebar: () => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ facilities, products, onAddProduct, onUpdateProduct, onDeleteProduct, onOpenSidebar }) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('marketplace');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Facility Check
      if (p.facilityId !== selectedFacilityId) return false;
      
      // Search Check
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      
      // Status Filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      
      // Stock Filter
      if (stockFilter === 'in-stock' && p.quantity <= 0) return false;
      if (stockFilter === 'out-of-stock' && p.quantity > 0) return false;
      
      return true;
    });
  }, [products, selectedFacilityId, search, statusFilter, stockFilter]);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingProduct) onUpdateProduct(editingProduct.id, data);
    else onAddProduct(data);
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteProduct(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative">
                <select 
                  value={selectedFacilityId} 
                  onChange={e => setSelectedFacilityId(e.target.value)}
                  className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-8 appearance-none text-slate-900 uppercase tracking-tight"
                >
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm uppercase tracking-tight"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search inventory name..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={stockFilter} 
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="all">All Inventory</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-200 p-10 rounded-lg text-center shadow-inner">
            <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-amber-900 mb-2 uppercase tracking-tight">Marketplace Offline</h3>
            <p className="text-amber-700 text-xs font-bold uppercase tracking-tight max-w-md mx-auto opacity-70">This module is not active for the current facility. You can enable it in Hub settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className={`bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col ${p.status === 'inactive' ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                <div className="aspect-square relative bg-slate-50 overflow-hidden border-b border-slate-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingBag className="w-10 h-10" /></div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-sm border ${p.status === 'active' ? 'bg-green-500/90 text-white border-green-600' : 'bg-red-500/90 text-white border-red-600'}`}>
                      {p.status}
                    </span>
                    {p.discountPercent && p.discountPercent > 0 && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md border border-blue-700">
                        <Percent className="w-2.5 h-2.5" /> {p.discountPercent}% OFF
                      </span>
                    )}
                    {p.quantity === 0 && (
                      <span className="px-2 py-0.5 bg-red-600 text-white rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md border border-red-700">
                        <AlertCircle className="w-2.5 h-2.5" /> Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(p)} className="p-2 bg-white/95 border border-slate-200 shadow-md rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeletingId(p.id)} className="p-2 bg-white/95 border border-slate-200 shadow-md rounded-md text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 line-clamp-1 uppercase text-sm tracking-tight">{p.name}</h4>
                    <div className="text-right">
                      {p.discountedPrice && p.discountedPrice < p.price ? (
                        <>
                          <div className="text-[10px] text-slate-400 line-through font-bold">${p.price.toFixed(2)}</div>
                          <div className="font-black text-blue-600 text-sm">${p.discountedPrice.toFixed(2)}</div>
                        </>
                      ) : (
                        <span className="font-black text-blue-600 text-sm">${p.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 flex-1 mb-4 font-medium">{p.description}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.sizeStocks?.map(ss => (
                      <div key={ss.size} className={`px-1.5 py-0.5 border rounded-sm text-[8px] font-black uppercase tracking-widest ${ss.quantity === 0 ? 'bg-red-50 border-red-100 text-red-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        {ss.size}: <span className={ss.quantity === 0 ? 'text-red-500' : 'text-slate-900'}>{ss.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    <div className={`flex items-center gap-1.5 ${p.quantity === 0 ? 'text-red-500' : ''}`}><Layers className="w-3 h-3" /> STOCK: {p.quantity}</div>
                    {p.category && <div className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {p.category}</div>}
                  </div>
                </div>
              </div>
            ))}
            
            {!search && filteredProducts.length === 0 && (
              <button 
                onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 aspect-square group shadow-inner"
              >
                <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs"><Plus className="w-5 h-5" /></div>
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">New Listing Entry</span>
              </button>
            )}

            {search && filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 uppercase">No Matches</h4>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isFormOpen && (
        <ProductFormModal 
          product={editingProduct} 
          facilities={facilities} 
          initialFacilityId={selectedFacilityId}
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Delete Product?"
          message="Are you sure you want to remove this product from the marketplace? It will no longer be visible to members."
          confirmText="Delete Product"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default MarketplaceView;