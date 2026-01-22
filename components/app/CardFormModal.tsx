
import React, { useState } from 'react';
import { X, CreditCard, User, Calendar, ShieldCheck } from 'lucide-react';
import { PaymentCard } from '../../types';
import { useToast } from '../ToastContext';

interface CardFormModalProps {
  initialCard?: PaymentCard | null;
  onClose: () => void;
  onSave: (card: Omit<PaymentCard, 'id' | 'createdAt'>) => void;
}

const CardFormModal: React.FC<CardFormModalProps> = ({ initialCard, onClose, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    holderName: initialCard?.holderName || '',
    cardNumber: initialCard?.cardNumber || '',
    expiryDate: initialCard?.expiryDate || '',
    cvv: '',
    isPrimary: initialCard?.isPrimary ?? false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber.length < 16) {
      showToast('Please enter a valid card number', 'error');
      return;
    }
    if (!formData.expiryDate.includes('/')) {
      showToast('Please enter expiry in MM/YY format', 'error');
      return;
    }

    // Determine brand based on first digit
    let brand: PaymentCard['brand'] = 'Other';
    if (formData.cardNumber.startsWith('4')) brand = 'Visa';
    else if (formData.cardNumber.startsWith('5')) brand = 'Mastercard';
    else if (formData.cardNumber.startsWith('3')) brand = 'Amex';

    onSave({
      holderName: formData.holderName,
      cardNumber: `•••• •••• •••• ${formData.cardNumber.slice(-4)}`,
      brand,
      expiryDate: formData.expiryDate,
      isPrimary: formData.isPrimary
    });
  };

  return (
    <div className="absolute inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in duration-300">
      <div className="w-full bg-white rounded-t-[40px] flex flex-col max-h-[90%] animate-in slide-in-from-bottom duration-500 overflow-hidden shadow-2xl">
        <div className="p-6 pt-10 border-b border-slate-50 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {initialCard ? 'Edit Card' : 'Add New Card'}
            </h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Secure Entry</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-900 rounded-2xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-20">
          <div className="p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden shadow-xl mb-4">
             <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-start">
                  <CreditCard className="w-8 h-8 opacity-40" />
                  <div className="text-right">
                     <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Digital Wallet</p>
                  </div>
               </div>
               <div className="text-xl font-mono tracking-widest leading-none">
                 {formData.cardNumber ? formData.cardNumber.replace(/\d(?=\d{4})/g, "•").match(/.{1,4}/g)?.join(' ') : '•••• •••• •••• ••••'}
               </div>
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Card Holder</p>
                    <p className="font-bold uppercase text-xs tracking-widest">{formData.holderName || 'Name on Card'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Expires</p>
                    <p className="font-bold text-xs tracking-widest">{formData.expiryDate || 'MM/YY'}</p>
                  </div>
               </div>
             </div>
             <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="text" 
                placeholder="Name on Card"
                value={formData.holderName}
                onChange={e => setFormData(p => ({ ...p, holderName: e.target.value }))}
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="text" 
                maxLength={16}
                placeholder="Card Number"
                value={formData.cardNumber.replace(/\D/g, '')}
                onChange={e => setFormData(p => ({ ...p, cardNumber: e.target.value }))}
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="text" 
                  placeholder="MM/YY"
                  maxLength={5}
                  value={formData.expiryDate}
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                    setFormData(p => ({ ...p, expiryDate: val }));
                  }}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="password" 
                  placeholder="CVV"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={e => setFormData(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                   <ShieldCheck className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-blue-900">Set as Primary</p>
                   <p className="text-[10px] font-medium text-blue-600/60 leading-tight">Default for all hub transactions.</p>
                 </div>
               </div>
               <input 
                 type="checkbox" 
                 checked={formData.isPrimary} 
                 onChange={e => setFormData(p => ({ ...p, isPrimary: e.target.checked }))}
                 className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer"
               />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all mt-4"
          >
            {initialCard ? 'Update Card' : 'Save Securely'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardFormModal;
