
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
    facilityIds: product?.facilityIds || (product?.facilityId ? [product.facilityId] : [initialFacilityId]),
    name: product?.name || '',
    description: product?.description || '',
    discountType: product?.discountType || 'percent' as 'flat' | 'percent',
    discountValue: product?.discountValue || 0,
    sizeStocks: product?.sizeStocks || [] as ProductSizeStock[],
    color: product?.color || '',
    category: product?.category || '',
    status: product?.status || 'active',
    images: product?.images || []
  });
  
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateDiscountedPrice = (price: number) => {
    if (formData.discountValue <= 0) return price;
    if (formData.discountType === 'percent') {
      return price * (1 - (formData.discountValue / 100));
    } else {
      return Math.max(0, price - formData.discountValue);
    }
  };

  const toggleFacility = (id: string) => {
    setFormData(prev => ({
      ...prev,
      facilityIds: prev.facilityIds.includes(id)
        ? prev.facilityIds.filter(fid => fid !== id)
        : [...prev.facilityIds, id]
    }));
  };

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
        return { ...prev, sizeStocks: [...prev.sizeStocks, { size, quantity: 0, price: 0 }] };
      }
    });
  };

  const updateSizeField = (size: string, field: 'quantity' | 'price', value: number) => {
    setFormData(prev => ({
      ...prev,
      sizeStocks: prev.sizeStocks.map(ss => ss.size === size ? { ...ss, [field]: value } : ss)
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    const totalQuantity = formData.sizeStocks.reduce((sum, ss) => sum + ss.quantity, 0);
    const minPrice = formData.sizeStocks.length > 0 
      ? Math.min(...formData.sizeStocks.map(ss => ss.price))
      : 0;

    // Update discounted prices for each size before saving
    const updatedSizeStocks = formData.sizeStocks.map(ss => ({
      ...ss,
      discountedPrice: Number(calculateDiscountedPrice(ss.price).toFixed(2))
    }));

    onSave({ 
      ...formData, 
      facilityId: formData.facilityIds[0] || '', // Keep for backward compatibility
      price: minPrice,
      discountedPrice: Number(calculateDiscountedPrice(minPrice).toFixed(2)),
      sizeStocks: updatedSizeStocks,
      quantity: totalQuantity 
    });
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
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Choose Facilities</label>
              <div className="flex flex-wrap gap-2">
                {facilities.map(f => {
                  const isSelected = formData.facilityIds.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFacility(f.id)}
                      className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Name</label>
              <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Premium Protein Powder" />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Select Which Size</label>
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
                <div className="mt-4 space-y-3 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
                  <div className="grid grid-cols-12 gap-2 px-4 mb-1">
                    <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">Size</div>
                    <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Price ($)</div>
                    <div className="col-span-5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock</div>
                  </div>
                  {formData.sizeStocks.map(ss => (
                    <div key={ss.size} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-[10px] shrink-0">{ss.size}</div>
                      </div>
                      <div className="col-span-4 relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                        <input 
                          type="number" 
                          step="0.01"
                          min="0" 
                          value={ss.price} 
                          onChange={e => updateSizeField(ss.size, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="col-span-5 relative">
                        <Package className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                        <input 
                          type="number" 
                          min="0" 
                          value={ss.quantity} 
                          onChange={e => updateSizeField(ss.size, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs"
                          placeholder="Qty"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Discount Settings</label>
                <div className="flex bg-white rounded-lg p-1 border border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, discountType: 'percent' }))}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${formData.discountType === 'percent' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
                  >
                    Percent
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, discountType: 'flat' }))}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${formData.discountType === 'flat' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
                  >
                    Flat
                  </button>
                </div>
              </div>
              
              <div className="relative">
                {formData.discountType === 'percent' ? (
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                ) : (
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                )}
                <input 
                  type="number" 
                  min="0" 
                  value={formData.discountValue} 
                  onChange={e => setFormData(p => ({ ...p, discountValue: parseFloat(e.target.value) || 0 }))} 
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold" 
                  placeholder={formData.discountType === 'percent' ? "Enter percentage (0-100)" : "Enter flat amount"} 
                />
              </div>

              {formData.discountValue > 0 && formData.sizeStocks.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Discounted Prices Preview</p>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.sizeStocks.map(ss => (
                      <div key={ss.size} className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase">{ss.size}</span>
                        <div className="text-right">
                          <span className="text-[8px] opacity-60 line-through block">${ss.price.toFixed(2)}</span>
                          <span className="text-xs font-black">${calculateDiscountedPrice(ss.price).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <button type="submit" disabled={formData.facilityIds.length === 0 || !formData.name} className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50">Publish Product</button>
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
