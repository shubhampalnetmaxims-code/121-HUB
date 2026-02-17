import React from 'react';
import { X, User, Mail, Calendar, Clock, MapPin, DollarSign, ShieldCheck, Ticket, Layers, Ban, CheckCircle, ChevronRight, UserCircle, BookOpen, Info } from 'lucide-react';
import { UserPass, User as UserType, Facility, Class, Booking, Trainer } from '../../types';

interface SoldPassDetailModalProps {
  userPass: UserPass;
  user: UserType | undefined;
  facility: Facility | undefined;
  classes: Class[];
  bookings: Booking[];
  trainers: Trainer[];
  onClose: () => void;
  onToggleBlock: (id: string, currentStatus: string) => void;
}

const SoldPassDetailModal: React.FC<SoldPassDetailModalProps> = ({ 
  userPass, user, facility, classes, bookings, trainers, onClose, onToggleBlock 
}) => {
  // Extract bookings linked specifically to this user pass
  const passBookings = bookings.filter(b => b.usedPassId === userPass.id).sort((a, b) => b.bookingDate - a.bookingDate);
  
  const validClasses = userPass.isAllClasses 
    ? 'All Standard Sessions' 
    : classes.filter(c => userPass.allowedClassIds.includes(c.id)).map(c => c.name).join(', ');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'blocked': return 'bg-red-50 text-red-700 border-red-200';
      case 'exhausted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired': return 'bg-slate-50 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      case 'rescheduled': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden max-h-[95vh] text-left">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="text-left">
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pass Audit Portfolio</h3>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Institutional Node Reference: <span className="text-slate-400 font-mono">UP-{userPass.id.substr(0,12)}</span></p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide">
          
          {/* Section A: Pass Specification & Customer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 mb-5 flex items-center gap-2">
                      <UserCircle className="w-3.5 h-3.5" /> Customer Identity
                   </h4>
                   <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-5 shadow-inner">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shrink-0 shadow-sm">
                         {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-slate-200" />}
                      </div>
                      <div className="overflow-hidden">
                         <p className="font-black text-slate-900 text-lg uppercase tracking-tight truncate leading-none mb-1.5">{user?.fullName || 'Unknown Customer'}</p>
                         <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-blue-500" />
                            <p className="text-xs font-bold text-slate-500 truncate">{user?.email}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                      <Ticket className="w-3.5 h-3.5" /> Pass Parameters
                   </h4>
                   <div className="p-7 bg-white border border-slate-100 rounded-[32px] space-y-6 shadow-sm">
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-slate-400 uppercase tracking-widest">Base Hub</span>
                         <span className="text-blue-600 uppercase font-black">{facility?.name}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs font-bold pt-4 border-t border-slate-50">
                         <span className="text-slate-400 uppercase tracking-widest shrink-0">Coverage Reach</span>
                         <span className="text-slate-900 uppercase text-right leading-relaxed max-w-[200px]">{validClasses}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-slate-50">
                         <span className="text-slate-400 uppercase tracking-widest">Purchased Timestamp</span>
                         <span className="text-slate-900">{new Date(userPass.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-slate-50">
                         <span className="text-slate-400 uppercase tracking-widest">Expiry Window</span>
                         <span className="text-slate-900">{userPass.validityUntil ? new Date(userPass.validityUntil).toLocaleDateString() : 'LIFETIME CONTRACT'}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 mb-5 flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5" /> Economic Audit
                   </h4>
                   <div className="p-8 bg-slate-900 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
                      <div className="relative z-10 space-y-8">
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Institutional Amount Paid</p>
                               <p className="text-4xl font-black tracking-tighter">${userPass.pricePaid?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Ledger State</p>
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-white/10 bg-white/5`}>{userPass.paymentStatus || 'unresolved'}</span>
                            </div>
                         </div>
                         <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Credits Consumed / Remaining</p>
                               <p className="text-3xl font-black text-blue-400">{userPass.remainingCredits} <span className="text-base text-white/30 font-bold uppercase tracking-widest">/ {userPass.totalCredits} units</span></p>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Current Profile</p>
                               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xl ${getStatusBadge(userPass.status)}`}>{userPass.status}</span>
                            </div>
                         </div>
                      </div>
                      <ShieldCheck className="absolute -right-12 -bottom-12 w-48 h-48 text-white/5 rotate-12" />
                   </div>
                </div>

                <div className="pt-2">
                   <button 
                      onClick={() => onToggleBlock(userPass.id, userPass.status)}
                      className={`w-full py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                         userPass.status === 'blocked' ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20'
                      }`}
                   >
                      {userPass.status === 'blocked' ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      {userPass.status === 'blocked' ? 'Reactivate Pass Entry' : 'Restrict Credit Consumption'}
                   </button>
                   <div className="flex items-start gap-3 mt-5 px-6 opacity-60">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                        {userPass.status === 'blocked' ? 'Restoring access will allow the member to resume booking sessions immediately.' : 'Restricting this pass will prevent the member from using remaining credits for new bookings.'}
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Section B: Historical Usage Ledger */}
          <div className="space-y-6 pt-8 border-t border-slate-100">
             <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Historical Usage Ledger</h4>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">{passBookings.length} Transaction Records</span>
             </div>

             <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-inner min-h-[200px]">
                {passBookings.length > 0 ? (
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="py-5 px-8">Class Specification</th>
                            <th className="py-5 px-8">Assigned Lead</th>
                            <th className="py-5 px-8">Audit Timestamp</th>
                            <th className="py-5 px-8 text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {passBookings.map(b => {
                            const bCls = classes.find(c => c.id === b.classId);
                            const bTrn = trainers.find(t => t.id === b.trainerId);
                            return (
                               <tr key={b.id} className="text-xs hover:bg-slate-50 transition-colors group">
                                  <td className="py-6 px-8">
                                     <p className="font-black text-slate-900 uppercase tracking-tight mb-1 text-sm group-hover:text-blue-600 transition-colors">{bCls?.name || 'Class Session'}</p>
                                     <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        <MapPin className="w-2.5 h-2.5" /> Site Location Node
                                     </div>
                                  </td>
                                  <td className="py-6 px-8">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                           <User className="w-4 h-4 text-slate-300" />
                                        </div>
                                        <span className="font-bold text-slate-700 uppercase text-[10px]">{bTrn?.name || 'TBA'}</span>
                                     </div>
                                  </td>
                                  <td className="py-6 px-8">
                                     <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                                        <div>
                                           <p className="font-bold text-slate-600 uppercase tracking-tighter">{new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{b.startTime}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="py-6 px-8 text-right">
                                     <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getBookingStatusBadge(b.status)}`}>{b.status}</span>
                                  </td>
                               </tr>
                            );
                         })}
                      </tbody>
                   </table>
                ) : (
                   <div className="py-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-5 text-slate-200 border border-slate-100 shadow-sm"><Layers className="w-8 h-8" /></div>
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic">No usage history found in system archive.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
           <button onClick={onClose} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 shadow-slate-900/10">Terminate Audit</button>
        </div>
      </div>
    </div>
  );
};

export default SoldPassDetailModal;