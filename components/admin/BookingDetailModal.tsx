
import React from 'react';
import { X, User, Mail, Calendar, Clock, BookOpen, Users, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Booking, Class, Trainer } from '../../types';

interface BookingDetailModalProps {
  booking: Booking;
  cls: Class | undefined;
  trainer: Trainer | undefined;
  onClose: () => void;
  onUpdateStatus: (status: Booking['status']) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ 
  booking, cls, trainer, onClose, onUpdateStatus 
}) => {
  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Booking Details</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Transaction ID: {booking.id}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto pb-32 scrollbar-hide text-left">
          {/* Status Banner */}
          <div className={`p-6 rounded-[32px] border flex items-center justify-between ${
            booking.status === 'upcoming' ? 'bg-blue-50 border-blue-100 text-blue-600' :
            booking.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-600' :
            booking.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
            'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-white shadow-sm`}>
                {booking.status === 'upcoming' && <Calendar className="w-5 h-5" />}
                {booking.status === 'delivered' && <CheckCircle className="w-5 h-5" />}
                {booking.status === 'cancelled' && <XCircle className="w-5 h-5" />}
                {booking.status === 'rescheduled' && <MoreHorizontal className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">CURRENT STATUS</p>
                <p className="font-extrabold text-lg capitalize">{booking.status}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">Type: {booking.type}</p>
          </div>

          {/* Primary Participant */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Account Holder</label>
             <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div className="text-left overflow-hidden">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tighter truncate">{booking.userName}</h4>
                   <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                     <Mail className="w-4 h-4 opacity-40" /> {booking.userEmail}
                   </div>
                </div>
             </div>
          </section>

          {/* Class & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Session Type</label>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                     <BookOpen className="w-5 h-5" />
                   </div>
                   <p className="font-extrabold text-slate-900 leading-tight">{cls?.name || 'Unknown Class'}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Coach</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trainer?.colorCode }} />
                   <span className="text-xs font-bold text-slate-600">{trainer?.name}</span>
                </div>
             </div>
             
             <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Time Frame</label>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                     <Clock className="w-5 h-5" />
                   </div>
                   <p className="font-extrabold text-slate-900 leading-tight">{booking.startTime}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Date</p>
                <p className="text-xs font-bold text-slate-600 mt-2">{new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
          </div>

          {/* Multi-person Attendance */}
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance List</label>
                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {booking.persons} {booking.persons > 1 ? 'Attendees' : 'Attendee'}
                </span>
             </div>
             <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                {booking.participantNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-200/50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-300 shadow-sm font-bold text-xs">
                       {idx + 1}
                    </div>
                    <p className="font-bold text-slate-700">{name}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Timestamps */}
          <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50">
             <div className="flex justify-between items-center text-[10px] font-black uppercase text-blue-600/60 tracking-widest">
                <span>Created At: {new Date(booking.createdAt).toLocaleString()}</span>
                <span>System ID: {booking.id.substr(0, 12)}</span>
             </div>
          </div>

          {/* Quick Actions */}
          {booking.status !== 'cancelled' && booking.status !== 'delivered' && (
            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
               <button 
                 onClick={() => onUpdateStatus('cancelled')}
                 className="flex-1 py-4 border-2 border-red-100 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
               >
                 Cancel Booking
               </button>
               <button 
                 onClick={() => onUpdateStatus('delivered')}
                 className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-extrabold shadow-2xl shadow-green-600/20 hover:bg-green-700 transition-all"
               >
                 Mark Delivered
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
