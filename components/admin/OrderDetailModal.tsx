import React from 'react';
import { X, User, Mail, Package, ShoppingBag, MapPin, CheckCircle, Tag, DollarSign, ShieldCheck } from 'lucide-react';
import { Order, Facility } from '../../types';

interface OrderDetailModalProps {
  order: Order;
  facility: Facility | undefined;
  onClose: () => void;
  onUpdateStatus: (status: Order['status']) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, facility, onClose, onUpdateStatus 
}) => {
  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Order Inventory Audit</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ID: {order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 pb-32 scrollbar-hide text-left">
          {/* Status Banner */}
          <div className={`p-6 rounded-[32px] border flex items-center justify-between ${
            order.status === 'picked-up' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white shadow-sm">
                {order.status === 'picked-up' ? <CheckCircle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Fulfillment</p>
                <p className="font-extrabold text-lg capitalize">{order.status === 'picked-up' ? 'Fulfilled' : 'Active Order'}</p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          {/* User Details */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Customer Record</label>
             <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center text-slate-200 border border-slate-200 shrink-0 shadow-xs">
                  <User className="w-7 h-7" />
                </div>
                <div className="text-left overflow-hidden">
                   <h4 className="text-xl font-black text-slate-900 tracking-tight truncate uppercase leading-none mb-1">{order.userName}</h4>
                   <p className="text-slate-500 text-xs font-bold opacity-70">{order.userEmail}</p>
                </div>
             </div>
          </section>

          {/* Items Breakdown */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Units</label>
                <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase">{order.items.length} SKUs</span>
             </div>
             <div className="space-y-3">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-colors">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                       <img src={it.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-center text-left">
                       <h5 className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-none mb-1">{it.name}</h5>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Size: {it.size} • Qty: {it.quantity}</p>
                    </div>
                    <div className="text-right py-1 flex flex-col justify-center">
                       <p className="font-black text-slate-900 text-sm tracking-tighter">${(it.price * it.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Financials */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Financial Summary</label>
             <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-white/40">
                         <span>Subtotal Value</span>
                         <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-white/40">
                         <span>Tax / Handling Surcharges</span>
                         <span>${(order.vat + order.serviceCharge).toFixed(2)}</span>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <div>
                         <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Economic Total</p>
                         <p className="text-3xl font-black tracking-tighter leading-none">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-1.5 justify-end">
                            <ShieldCheck className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Paid Complete</span>
                         </div>
                      </div>
                   </div>
                </div>
                <DollarSign className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5 rotate-12" />
             </div>
          </section>

          {/* Fulfillment Rules */}
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100"><MapPin className="w-5 h-5" /></div>
             <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase">Collection Point</p>
                <p className="font-extrabold text-slate-900 text-sm uppercase">{facility?.name}</p>
             </div>
          </div>

          {/* Actions */}
          {order.status === 'placed' && (
            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
               <button 
                 onClick={() => onUpdateStatus('picked-up')}
                 className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
               >
                 Mark as Collected
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;