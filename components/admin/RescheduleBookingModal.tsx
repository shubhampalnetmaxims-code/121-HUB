import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, MapPin, User, ChevronRight, Search, Layout } from 'lucide-react';
import { Booking, ClassSlot, Class, Trainer, Location, DAYS_OF_WEEK } from '../../types';

interface RescheduleBookingModalProps {
  booking: Booking;
  slots: ClassSlot[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  onClose: () => void;
  onConfirm: (slot: ClassSlot, date: number) => void;
}

const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({ 
  booking, slots, classes, trainers, locations, onClose, onConfirm 
}) => {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const cls = classes.find(c => c.id === booking.classId);
  
  const availableSlots = useMemo(() => {
    return slots.filter(s => {
      if (s.classId !== booking.classId) return false;
      if (s.facilityId !== booking.facilityId) return false;
      if (search && !trainers.find(t => t.id === s.trainerId)?.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [slots, booking, search, trainers]);

  const handleSelect = (slot: ClassSlot) => {
    const date = new Date(selectedDate);
    // Adjust date to match the slot's day of week
    const currentDay = date.getDay();
    const targetDay = slot.dayOfWeek;
    const diff = targetDay - currentDay;
    date.setDate(date.getDate() + (diff < 0 ? diff + 7 : diff));
    
    onConfirm(slot, date.getTime());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden max-h-[85vh] text-left">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Select New Slot</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Rescheduling: {cls?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4 border-b border-slate-100">
           <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Target Week Starting From</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500" 
              />
           </div>
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Filter by trainer name..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {availableSlots.length > 0 ? availableSlots.map(slot => {
            const trn = trainers.find(t => t.id === slot.trainerId);
            const loc = locations.find(l => l.id === slot.locationId);
            return (
              <button 
                key={slot.id}
                onClick={() => handleSelect(slot)}
                className="w-full bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group hover:border-blue-500 hover:bg-blue-50/10 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 text-left overflow-hidden">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <Clock className="w-5 h-5" />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{DAYS_OF_WEEK[slot.dayOfWeek]} @ {slot.startTime}</p>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                         <User className="w-2.5 h-2.5" /> {trn?.name} • <Layout className="w-2.5 h-2.5" /> {loc?.name}
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                   <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-sm">
                      {slot.currentBookings}/{slot.maxBookings} Full
                   </span>
                   <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
            );
          }) : (
            <div className="py-12 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest italic">No slots found for this class</div>
          )}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
           <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar className="w-4 h-4" />
           </div>
           <p className="text-[10px] font-medium text-slate-500 leading-tight">Selecting a slot will immediately move the booking and notify the member.</p>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBookingModal;