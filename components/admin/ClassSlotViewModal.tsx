
import React from 'react';
import { X, Clock, Users, MapPin, Activity, User, BookOpen } from 'lucide-react';
import { ClassSlot, Class, Trainer, Location } from '../../types';

interface ClassSlotViewModalProps {
  slot: ClassSlot;
  cls: Class | undefined;
  trainer: Trainer | undefined;
  location: Location | undefined;
  onClose: () => void;
  onEdit: () => void;
}

const ClassSlotViewModal: React.FC<ClassSlotViewModalProps> = ({ slot, cls, trainer, location, onClose, onEdit }) => {
  const bookingPercentage = Math.min((slot.currentBookings / slot.maxBookings) * 100, 100);
  
  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Session Details</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management View</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto pb-32 scrollbar-hide text-left">
          {/* Class Overview */}
          <section className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">{cls?.name || 'Unknown Class'}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${slot.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {slot.status}
                  </span>
                  <span className="text-slate-300 text-xs font-bold">•</span>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-tight">{cls?.level}</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {cls?.shortDescription || 'No description available for this session.'}
            </p>
          </section>

          {/* Booking Status Card */}
          <section className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Current Attendance</p>
                  <h5 className="text-4xl font-black tracking-tighter">{slot.currentBookings} <span className="text-xl text-white/30 font-bold">/ {slot.maxBookings}</span></h5>
                </div>
                <Users className="w-8 h-8 text-white/20" />
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${bookingPercentage >= 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${bookingPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold text-white/40 mt-3 uppercase tracking-widest">
                {slot.maxBookings - slot.currentBookings} SPOTS REMAINING
              </p>
            </div>
            <Activity className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
          </section>

          {/* Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time & Duration</p>
              </div>
              <p className="font-extrabold text-slate-900 text-lg leading-none mb-1">{slot.startTime}</p>
              <p className="text-xs font-bold text-slate-500">{slot.duration}</p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
              </div>
              <p className="font-extrabold text-slate-900 text-lg leading-none mb-1">{location?.name || 'TBA'}</p>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Physical Asset</p>
            </div>
          </div>

          {/* Trainer Info */}
          <section className="bg-slate-50 border border-slate-100 rounded-[32px] p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Professional</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0">
                {trainer?.profilePicture ? (
                  <img src={trainer.profilePicture} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <h6 className="font-extrabold text-slate-900 text-xl tracking-tight leading-none mb-1">{trainer?.name || 'TBA'}</h6>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{trainer?.email || 'No email provided'}</p>
              </div>
            </div>
          </section>

          {/* Sticky Actions */}
          <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
            >
              Back to Timetable
            </button>
            <button 
              onClick={onEdit}
              className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all"
            >
              Edit Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSlotViewModal;
