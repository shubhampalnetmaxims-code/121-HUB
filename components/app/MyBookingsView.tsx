
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, XCircle, MoreVertical, ShieldCheck, AlertCircle, User as UserIcon } from 'lucide-react';
import { Booking, User, Facility, Class, Trainer } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from '../admin/ConfirmationModal';

interface MyBookingsViewProps {
  currentUser: User | null;
  bookings: Booking[];
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onAuthTrigger: () => void;
}

const MyBookingsView: React.FC<MyBookingsViewProps> = ({ 
  currentUser, bookings, facilities, classes, trainers, onUpdateBooking, onAuthTrigger 
}) => {
  const { showToast } = useToast();
  const locationState = useLocation();
  const deepLinkStatus = (locationState.state as { status?: Booking['status'] })?.status;

  // Initialize tab based on deep link or default to upcoming
  const initialTab = deepLinkStatus && (deepLinkStatus === 'delivered' || deepLinkStatus === 'cancelled') ? 'past' : 'upcoming';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>(initialTab);
  
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">My Bookings</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Sign in to view your scheduled sessions and booking history.</p>
        <button 
          onClick={onAuthTrigger}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === currentUser.id);
  const upcomingBookings = userBookings.filter(b => b.status === 'upcoming' || b.status === 'rescheduled');
  const pastBookings = userBookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancel = () => {
    if (cancellingId) {
      onUpdateBooking(cancellingId, { status: 'cancelled' });
      showToast("Booking cancelled successfully", "info");
      setCancellingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">My Bookings</h2>
        <div className="flex gap-8 mt-6">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
              activeTab === 'upcoming' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            Upcoming
            {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
              activeTab === 'past' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            Past & Records
            {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {displayedBookings.length > 0 ? displayedBookings.map(booking => {
          const fac = facilities.find(f => f.id === booking.facilityId);
          const cls = classes.find(c => c.id === booking.classId);
          const trn = trainers.find(t => t.id === booking.trainerId);
          
          const settings = fac?.settings || { canCancelBooking: true, canRescheduleBooking: true };

          return (
            <div 
              key={booking.id}
              className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">{cls?.name}</h4>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{fac?.name}</p>
                   </div>
                 </div>
                 <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                   booking.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                   booking.status === 'delivered' ? 'bg-green-50 text-green-600' :
                   'bg-red-50 text-red-600'
                 }`}>
                   {booking.status}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                 <div className="flex items-center gap-2.5">
                   <Calendar className="w-4 h-4 text-slate-300" />
                   <div className="text-left">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Scheduled</p>
                     <p className="text-xs font-bold text-slate-700">{new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <Clock className="w-4 h-4 text-slate-300" />
                   <div className="text-left">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Time</p>
                     <p className="text-xs font-bold text-slate-700">{booking.startTime}</p>
                   </div>
                 </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trn?.colorCode }} />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coach: {trn?.name}</span>
                 </div>
                 <div className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                    {booking.persons} {booking.persons > 1 ? 'PERSONS' : 'PERSON'}
                 </div>
              </div>

              {activeTab === 'upcoming' && booking.status !== 'cancelled' && (settings.canCancelBooking || settings.canRescheduleBooking) && (
                <div className={`grid ${settings.canCancelBooking && settings.canRescheduleBooking ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-2`}>
                   {settings.canCancelBooking && (
                     <button 
                      onClick={() => setCancellingId(booking.id)}
                      className="py-3 bg-red-50 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors"
                     >
                       Cancel
                     </button>
                   )}
                   {settings.canRescheduleBooking && (
                     <button 
                      className="py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-colors"
                     >
                       Reschedule
                     </button>
                   )}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
               <Calendar className="w-8 h-8 text-slate-200" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-400">No {activeTab} bookings</p>
              <p className="text-xs text-slate-300 font-medium">Schedule your next session from a facility hub.</p>
            </div>
          </div>
        )}
      </div>

      {cancellingId && (
        <ConfirmationModal
          title="Cancel Booking?"
          message="Are you sure you want to cancel this booking? Cancellations are subject to our 24-hour notice policy."
          variant="danger"
          confirmText="Yes, Cancel Booking"
          onConfirm={handleCancel}
          onCancel={() => setCancellingId(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsView;
