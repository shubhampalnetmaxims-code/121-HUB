import React from 'react';
import { X, User, Mail, Phone, Calendar, Clock, BookOpen, Users, CheckCircle, XCircle, MoreHorizontal, DollarSign, ShieldCheck, MapPin } from 'lucide-react';
import { Booking, Class, Trainer, Facility } from '../../types';

interface BookingDetailModalProps {
  booking: Booking;
  cls: Class | undefined;
  trainer: Trainer | undefined;
  facility: Facility | undefined;
  onClose: () => void;
  onUpdateStatus: (status: Booking['status']) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ 
  booking, cls, trainer, facility, onClose, onUpdateStatus 
}) => {
  // Mock breakdown for session-based bookings if not explicitly stored
  const subtotal = booking.amount;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Reservation Audit</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ref: {booking.id}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 pb-32 scrollbar-hide text-left">
          {/* Status & Type Banner */}
          <div className={`p-6 rounded-[32px] border flex items-center justify-between ${
            booking.status === 'upcoming' ? 'bg-blue-50 border-blue-100 text-blue-600' :
            booking.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-600' :
            booking.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
            'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white shadow-sm">
                {booking.status === 'upcoming' && <Calendar className="w-5 h-5" />}
                {booking.status === 'delivered' && <CheckCircle className="w-5 h-5" />}
                {booking.status === 'cancelled' && <XCircle className="w-5 h-5" />}
                {booking.status === 'rescheduled' && <MoreHorizontal className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Status</p>
                <p className="font-extrabold text-lg capitalize">{booking.status}</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Method</p>
               <p className="text-xs font-bold uppercase">{booking.type} Entry</p>
            </div>
          </div>

          {/* Section: User Identification */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Subscriber Identification</label>
             <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div className="text-left overflow-hidden">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tighter truncate uppercase leading-none mb-1">{booking.userName}</h4>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <Mail className="w-3.5 h-3.5 opacity-40" /> {booking.userEmail}
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Section: Context & Logistics */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Logistics & Context</label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                         <p className="text-[9px] font-black text-slate-400 uppercase">Item</p>
                         <p className="font-extrabold text-slate-900 leading-tight uppercase text-sm">{cls?.name || 'Session'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trainer?.colorCode }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{trainer?.name}</span>
                   </div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                         <p className="text-[9px] font-black text-slate-400 uppercase">Schedule</p>
                         <p className="font-extrabold text-slate-900 leading-tight text-sm">{booking.startTime}</p>
                      </div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight px-1">{new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100"><MapPin className="w-5 h-5" /></div>
                <div className="text-left">
                   <p className="text-[9px] font-black text-slate-400 uppercase">Facility Hub</p>
                   <p className="font-extrabold text-slate-900 text-sm uppercase">{facility?.name}</p>
                </div>
             </div>
          </section>

          {/* Section: Payment Breakdown */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Financial Ledger</label>
             <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                      <span>Valuation breakdown</span>
                      <span>USD</span>
                   </div>
                   <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-white/60">Base Amount ({booking.persons} Pers)</span>
                         <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-white/60">Tax / Surcharge (Estimated)</span>
                         <span className="font-mono font-bold">${tax.toFixed(2)}</span>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <div>
                         <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Economic Total</p>
                         <p className="text-3xl font-black tracking-tighter leading-none">${total.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Method</p>
                         <div className="flex items-center gap-1.5 justify-end">
                            <ShieldCheck className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-bold">Secure Hub Pay</span>
                         </div>
                      </div>
                   </div>
                </div>
                <DollarSign className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5 rotate-12" />
             </div>
          </section>

          {/* Attendance List */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant Register</label>
                <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase">{booking.persons} PAX</span>
             </div>
             <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 divide-y divide-slate-200/50">
                {booking.participantNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm text-[10px] font-black">{idx + 1}</div>
                    <p className="font-bold text-slate-700 text-sm uppercase">{name}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Quick Controls */}
          {booking.status !== 'cancelled' && booking.status !== 'delivered' && (
            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
               <button 
                 onClick={() => onUpdateStatus('cancelled')}
                 className="flex-1 py-4 border-2 border-red-100 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-colors shadow-sm"
               >
                 Cancel Ledger Item
               </button>
               <button 
                 onClick={() => onUpdateStatus('delivered')}
                 className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
               >
                 Complete Reservation
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;