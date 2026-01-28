
import React, { useState, useRef, useEffect } from 'react';
import { X, CloudUpload, DollarSign, Package, Tag, Palette, Check, Percent } from 'lucide-react';
import { Facility, Product, ProductSizeStock } from '../../types';
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
    discountPercent: product?.discountPercent || 0,
    discountedPrice: product?.discountedPrice || product?.price || 0,
    sizeStocks: product?.sizeStocks || [] as ProductSizeStock[],
    color: product?.color || '',
    category: product?.category || '',
    status: product?.status || 'active',
    images: product?.images || []
  });
  
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate discounted price
  useEffect(() => {
    const final = formData.discountPercent > 0 
      ? formData.price * (1 - (formData.discountPercent / 100))
      : formData.price;
    setFormData(prev => ({ ...prev, discountedPrice: Number(final.toFixed(2)) }));
  }, [formData.price, formData.discountPercent]);

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

  const toggleSizeSelection = (size: string) => {
    setFormData(prev => {
      const exists = prev.sizeStocks.some(ss => ss.size === size);
      if (exists) {
        return { ...prev, sizeStocks: prev.sizeStocks.filter(ss => ss.size !== size) };
      } else {
        return { ...prev, sizeStocks: [...prev.sizeStocks, { size, quantity: 0 }] };
      }
    });
  };

  const updateSizeStock = (size: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      sizeStocks: prev.sizeStocks.map(ss => ss.size === size ? { ...ss, quantity } : ss)
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    const totalQuantity = formData.sizeStocks.reduce((sum, ss) => sum + ss.quantity, 0);
    onSave({ ...formData, quantity: totalQuantity });
    setIsConfirmingSave(false);
  };

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Original Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Discount (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" max="100" value={formData.discountPercent} onChange={e => setFormData(p => ({ ...p, discountPercent: parseInt(e.target.value) || 0 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="0" />
                </div>
              </div>
            </div>

            {formData.discountPercent > 0 && (
              <div className="p-5 bg-blue-600 rounded-[24px] text-white shadow-xl shadow-blue-500/20 flex items-center justify-between animate-in zoom-in-95 duration-300">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Final Discounted Price</p>
                  <p className="text-2xl font-black">${formData.discountedPrice.toFixed(2)}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">
                  <Check className="w-6 h-6" />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Size & Individual Stock</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVAILABLE_SIZES.map(s => {
                  const isSelected = formData.sizeStocks.some(ss => ss.size === s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSizeSelection(s)}
                      className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                        isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {s}
                    </button>
                  );
                })}
              </div>

              {formData.sizeStocks.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
                  {formData.sizeStocks.map(ss => (
                    <div key={ss.size} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-[10px] shrink-0">{ss.size}</div>
                      <input 
                        type="number" 
                        min="0" 
                        value={ss.quantity} 
                        onChange={e => updateSizeStock(ss.size, parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent outline-none font-bold text-sm"
                        placeholder="Qty"
                      />
                      <Package className="w-4 h-4 text-slate-200 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Description</label>
              <textarea required value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[120px] text-sm leading-relaxed" placeholder="Tell customers about this product..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Color Variant</label>
                <div className="relative">
                  <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={formData.color} onChange={e => setFormData(p => ({ ...p, color: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Jet Black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category</label>
                <input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Apparel" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Media Gallery</label>
              <div className="grid grid-cols-4 gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative border border-slate-100">
                    <img src={img} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-md hover:bg-red-500 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-300 hover:border-blue-500 transition-all">
                  <CloudUpload className="w-6 h-6" />
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" disabled={!formData.facilityId || !formData.name} className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50">Publish Product</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Update Listing?"
          message={`Verify data and save changes for "${formData.name}".`}
          confirmText="Confirm Save"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default ProductFormModal;
