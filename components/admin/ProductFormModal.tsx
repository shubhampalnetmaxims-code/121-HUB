
import React, { useState, useRef } from 'react';
import { X, CloudUpload, DollarSign, Package, Tag, Palette, Check } from 'lucide-react';
import { Facility, Product } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface ProductFormModalProps {
  product: Product | null;
  facilities: Facility[];
  initialFacilityId: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, facilities, initialFacilityId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityId: product?.facilityId || initialFacilityId,
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    size: product?.size || '',
    color: product?.color || '',
    category: product?.category || '',
    status: product?.status || 'active',
    images: product?.images || []
  });
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
    if (e.target) e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const toggleSize = (size: string) => {
    const currentSizes = formData.size ? formData.size.split(', ').filter(s => s) : [];
    let newSizes: string[];
    
    if (currentSizes.includes(size)) {
      newSizes = currentSizes.filter(s => s !== size);
    } else {
      newSizes = [...currentSizes, size];
    }
    
    setFormData(prev => ({ ...prev, size: newSizes.join(', ') }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    onSave(formData);
    setIsConfirmingSave(false);
  };

  const currentSelectedSizes = formData.size ? formData.size.split(', ').filter(s => s) : [];

  return (
    <>
      <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
        <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{product ? 'Update Inventory' : 'Add Product'}</h3>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleFormSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
            
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Host Facility</label>
              <select required value={formData.facilityId} onChange={e => setFormData(p => ({ ...p, facilityId: e.target.value }))} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-slate-900">
                <option value="">Select Facility...</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Name</label>
              <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Premium Protein Powder" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quantity</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="0" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Available Sizes</label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_SIZES.map(s => {
                  const isSelected = currentSelectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                        isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Colors</label>
              <div className="relative">
                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={formData.color} onChange={e => setFormData(p => ({ ...p, color: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Black, Slate, Neon" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category</label>
              <input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Supplements, Apparel" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Description</label>
              <textarea required value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[120px] text-sm leading-relaxed" placeholder="Detailed product information..." />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Gallery</label>
              <div className="grid grid-cols-4 gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-100 shadow-sm">
                    <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)} 
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()} 
                  className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-300 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
                >
                  <CloudUpload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black uppercase mt-1">Add Photos</span>
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <p className="text-[9px] font-bold text-slate-400 mt-2 italic">Tip: You can select multiple images at once.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
              <p className="font-bold text-slate-900">Active Listing</p>
              <input type="checkbox" checked={formData.status === 'active'} onChange={e => setFormData(p => ({ ...p, status: e.target.checked ? 'active' : 'inactive' }))} className="w-6 h-6 accent-blue-600 rounded-lg" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" disabled={!formData.facilityId || !formData.name} className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all disabled:opacity-50">Confirm Listing</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Update Product Listing?"
          message={`Are you sure you want to save the changes for "${formData.name}"?`}
          confirmText="Confirm Update"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default ProductFormModal;
