import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Calendar as CalendarIcon, MapPin, Building, Activity, LayoutGrid } from 'lucide-react';
import { Trainer, ClassSlot, Class, Facility } from '../../types';

interface TrainerSchedulesTabProps {
  trainer: Trainer;
  classSlots: ClassSlot[];
  classes: Class[];
  facilities: Facility[];
}

const TrainerSchedulesTab: React.FC<TrainerSchedulesTabProps> = ({ trainer, classSlots, classes, facilities }) => {
  const navigate = useNavigate();
  const assignedFacilities = facilities.filter(f => trainer.facilityIds.includes(f.id));

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase leading-none">Facility Schedules</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Global Timetable Access</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-4 scrollbar-hide">
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Hub Ledger</h3>
           </div>

           <div className="grid grid-cols-1 gap-3">
              {assignedFacilities.map(f => (
                <button 
                  key={f.id}
                  onClick={() => navigate(`/trainer/facility/${f.id}/timetable/all`)}
                  className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:bg-blue-600 transition-colors">
                         <Building className="w-7 h-7" />
                      </div>
                      <div className="text-left overflow-hidden">
                         <h4 className="font-black text-lg text-slate-900 uppercase tracking-tight truncate leading-none mb-1">{f.name}</h4>
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">View Full Timetable</p>
                      </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
           </div>
        </section>

        {assignedFacilities.length === 0 ? (
          <div className="py-24 text-center space-y-4">
             <div className="w-16 h-16 bg-white rounded-[32px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
                <MapPin className="w-8 h-8" />
             </div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Assigned Facilities</p>
          </div>
        ) : (
          <section className="p-7 bg-slate-900 rounded-[40px] text-white relative overflow-hidden mt-6">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <Activity className="w-5 h-5 text-blue-400" />
                   <h4 className="font-bold text-sm uppercase tracking-tight">Schedule Transparency</h4>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-medium uppercase tracking-tight">
                  You can now view all sessions across the facility, including those assigned to other staff members. Click on any slot to review the registered subscriber list.
                </p>
             </div>
             <LayoutGrid className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
          </section>
        )}
      </div>
    </div>
  );
};

export default TrainerSchedulesTab;