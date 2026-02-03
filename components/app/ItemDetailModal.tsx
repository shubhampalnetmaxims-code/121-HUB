import React from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, ShieldCheck, Tag, Info, CheckCircle2, Ticket, CreditCard, Layers, Package, User } from 'lucide-react';
import { Booking, Order, UserPass, UserMembership, Facility, Class, Trainer } from '../../types';

interface ItemDetailModalProps {
  type: 'booking' | 'order' | 'pass' | 'membership';
  item: any;
  facility: Facility | undefined;
  cls?: Class | undefined;
  trainer?: Trainer | undefined;
  onClose: () => void;
  actions?: React.ReactNode;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ type, item, facility, cls, trainer, onClose, actions }) => {
  const isBooking = type === 'booking';
  const isOrder = type === 'order';
  const isPass = type === 'pass';
  const isMembership = type === 'membership';

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': case 'placed': case 'active': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': case 'picked-up': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': case 'expired': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const amount = item.amount || item.price || item.total || 0;

  return (
    <div className="absolute inset-0 z-[160] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden text-left">
      <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="text-left">
          <h3 className="text-xl font-bold tracking-tight uppercase leading-none mb-1">Entry Detail</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isOrder ? item.orderNumber : `Ref: ${item.id.substr(0,12)}`}</p>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40 scrollbar-hide">
        {/* Status Section */}
        <div className={`p-6 rounded-[32px] border flex items-center justify-between ${statusColor(item.status || (isPass ? 'active' : ''))}`}>
           <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                 {isBooking && <Calendar className="w-5 h-5" />}
                 {isOrder && <Package className="w-5 h-5" />}
                 {isPass && <Ticket className="w-5 h-5" />}
                 {isMembership && <CreditCard className="w-5 h-5" />}
              </div>
              <div className="text-left">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Status</p>
                 <p className="font-extrabold text-base capitalize">{item.status || (isPass ? 'Active' : 'Unspecified')}</p>
              </div>
           </div>
           {isBooking && <span className="text-[9px] font-black uppercase tracking-widest">{item.type} session</span>}
        </div>

        {/* Logistic Section */}
        <section className="space-y-4">
           <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Logistic Data</label>
           <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 shrink-0"><MapPin className="w-5 h-5" /></div>
                 <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Facility Location</p>
                    <p className="font-bold text-slate-900 text-sm uppercase">{facility?.name}</p>
                 </div>
              </div>
              
              {isBooking && (
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 shrink-0"><Clock className="w-5 h-5" /></div>
                   <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Scheduled Slot</p>
                      <p className="font-bold text-slate-900 text-sm">{item.startTime} • {new Date(item.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                   </div>
                </div>
              )}

              {(isPass || isMembership) && (
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 shrink-0"><Calendar className="w-5 h-5" /></div>
                    <div className="text-left">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Validity Range</p>
                       <p className="font-bold text-slate-900 text-sm">{new Date(item.startDate || item.purchasedAt).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p>
                    </div>
                 </div>
              )}
           </div>
        </section>

        {/* Economic Section */}
        <section className="space-y-4">
           <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Economic Breakdown</label>
           <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-4">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest opacity-40">
                    <span>Valuation Matrix</span>
                    <span>USD</span>
                 </div>
                 <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-white/50">Base Price</span>
                       <span className="font-mono font-bold">${amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-white/50">Taxes & Fees (Included)</span>
                       <span className="font-mono font-bold">$0.00</span>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Economic Total</p>
                    <p className="text-2xl font-black">${amount.toFixed(2)}</p>
                 </div>
              </div>
              <DollarSign className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 rotate-12" />
           </div>
        </section>

        {/* Content Section */}
        {isOrder && (
           <section className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Purchased Units</label>
              <div className="space-y-2">
                 {item.items.map((it: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-[24px] flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-slate-100 shrink-0">
                          <img src={it.image} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="flex-1 text-left">
                          <p className="font-bold text-slate-900 text-xs uppercase leading-tight">{it.name}</p>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Qty: {it.quantity} • {it.size}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        )}

        {isBooking && (
           <section className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Assigned Professional</label>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 shrink-0 border border-slate-100">
                    {trainer?.profilePicture ? <img src={trainer.profilePicture} className="w-full h-full object-cover rounded-xl" /> : <User className="w-6 h-6" />}
                 </div>
                 <div className="text-left">
                    <p className="font-extrabold text-slate-900 text-sm uppercase leading-none mb-1">{trainer?.name || 'TBA'}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Coach Portfolio</p>
                 </div>
              </div>
           </section>
        )}

        {/* Action Bar from props */}
        {actions && (
          <div className="pt-4 space-y-3">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Available Actions</label>
             {actions}
          </div>
        )}
      </div>

      {/* Done Button Footer */}
      <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
         <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-tight">Return to Portfolio</button>
      </div>
    </div>
  );
};

export default ItemDetailModal;