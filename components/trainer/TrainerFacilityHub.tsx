import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, CalendarDays, Clock, Eye } from 'lucide-react';
import { Facility, Class, Trainer } from '../../types';

interface TrainerFacilityHubProps {
  facilities: Facility[];
  classes: Class[];
  trainer: Trainer;
}

const TrainerFacilityHub: React.FC<TrainerFacilityHubProps> = ({ facilities, classes, trainer }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find(f => f.id === id);
  
  if (!facility) return null;
  
  const facilityClasses = classes.filter(c => c.facilityId === id && c.status === 'active');

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      {/* Header */}
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate('/trainer/home')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">{facility.name}</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Management Hub</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-8 scrollbar-hide">
        {/* BIG TIMETABLE ACTION */}
        <section>
          <button 
            onClick={() => navigate(`/trainer/facility/${id}/timetable/all`)}
            className="w-full bg-slate-900 p-8 rounded-2xl text-white flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20"
          >
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                   <CalendarDays className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-left">
                   <h4 className="font-black text-xl leading-tight uppercase tracking-tight">Shift Timetable</h4>
                   <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Manage All Session Slots</p>
                </div>
             </div>
             <ChevronRight className="w-6 h-6 text-white/30 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        {/* ASSIGNED CLASSES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Classes</h3>
            <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">{facilityClasses.length} Units</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {facilityClasses.map(c => (
              <div 
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                      <BookOpen className="w-6 h-6" />
                   </div>
                   <div className="flex-1 overflow-hidden text-left">
                      <h4 className="font-bold text-slate-900 text-sm uppercase truncate leading-none mb-1">{c.name}</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                         <Clock className="w-3 h-3" /> {c.duration}
                      </div>
                   </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/trainer/facility/${id}/timetable/${c.id}`)}
                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-black"
                  >
                    View Schedule
                  </button>
                  <button 
                    onClick={() => navigate(`/trainer/facility/${id}/class/${c.id}`)}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainerFacilityHub;