
import React from 'react';
import { X, MapPin, Calendar, LayoutGrid } from 'lucide-react';
import { Location, Facility } from '../../types';

interface LocationViewModalProps {
  location: Location;
  facilities: Facility[];
  onClose: () => void;
}

const LocationViewModal: React.FC<LocationViewModalProps> = ({ location, facilities, onClose }) => {
  const assignedFacilities = facilities.filter(f => location.facilityIds.includes(f.id));

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Location Details</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto pb-24 scrollbar-hide text-left">
          <div className="flex items-center gap-6 border-b border-slate-50 pb-10">
            <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
               <MapPin className="w-10 h-10" />
            </div>
            <div>
               <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{location.name}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Infrastructure Asset</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Creation Details</label>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                 <Calendar className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-bold text-slate-900 text-sm">{new Date(location.createdAt).toLocaleDateString()}</p>
                 <p className="text-[10px] text-slate-400 uppercase font-black">Record Entry Date</p>
               </div>
             </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Associated Facilities</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {assignedFacilities.map(f => (
                 <div key={f.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <LayoutGrid className="w-4 h-4" />
                     </div>
                     <span className="font-bold text-slate-800">{f.name}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100/50 text-blue-600">
            <p className="text-xs font-bold leading-relaxed">
              This location is a digital representation of a physical area within your facilities. It can be linked to bookings, staff schedules, and class sessions.
            </p>
          </div>

          <button onClick={onClose} className="w-full bg-black text-white py-5 rounded-[28px] font-black text-lg shadow-2xl hover:bg-slate-800 transition-all active:scale-95">Close Asset</button>
        </div>
      </div>
    </div>
  );
};

export default LocationViewModal;
