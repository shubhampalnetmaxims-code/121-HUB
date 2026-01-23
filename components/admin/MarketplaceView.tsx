
import React, { useState } from 'react';
import { Plus, Menu, ShoppingBag, Edit3, Trash2, Tag, Layers, Search, ChevronRight } from 'lucide-react';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('marketplace');

  const filteredProducts = products.filter(p => {
    if (p.facilityId !== selectedFacilityId) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <select 
                value={selectedFacilityId} 
                onChange={e => setSelectedFacilityId(e.target.value)}
                className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-8 appearance-none text-slate-900"
              >
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none w-full md:w-64"
              />
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
            >
              Add Product
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] text-center">
            <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">Marketplace Disabled</h3>
            <p className="text-amber-700 text-sm max-w-md mx-auto">This module is not active for the current facility. You can enable it in the Facility Detail settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col">
                <div className="aspect-square relative bg-slate-50 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingBag className="w-10 h-10" /></div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${p.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {p.status}
                    </span>
                    {p.category && <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">{p.category}</span>}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-blue-600 hover:bg-white shadow-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeletingId(p.id)} className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-red-600 hover:bg-white shadow-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                    <span className="font-black text-blue-600 text-sm">${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 flex-1 mb-4">{p.description}</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <div className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Stock: {p.quantity}</div>
                    {(p.size || p.color) && <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Variants</div>}
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 aspect-square group"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Add New Product</span>
            </button>
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
