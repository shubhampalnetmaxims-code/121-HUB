import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, CalendarDays, Clock, Eye, Info, LayoutGrid, MapPin, Signal } from 'lucide-react';
import { Facility, Class, Trainer } from '../../types';

interface TrainerFacilityHubProps {
  facilities: Facility[];
  classes: Class[];
  trainer: Trainer;
}

const TrainerFacilityHub: React.FC<TrainerFacilityHubProps> = ({ facilities, classes, trainer }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);
  
  const facility = facilities.find(f => f.id === id);
  
  if (!facility) return <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Facility Not Found</div>;
  
  const facilityClasses = classes.filter(c => c.facilityId === id && c.status === 'active');

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      {/* Header */}
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate('/trainer/home')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase leading-none mb-1">{facility.name}</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Facility Operations</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-8 scrollbar-hide">
        {/* Facility Info Banner */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                 <Info className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Hub Specification</h3>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Property Details</p>
              </div>
           </div>
           
           <div className="relative">
              <p className={`text-xs font-medium text-slate-600 leading-relaxed ${!showFullDesc ? 'line-clamp-3' : ''}`} dangerouslySetInnerHTML={{ __html: facility.description }} />
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                {showFullDesc ? 'Show Less' : 'Read Full Description'}
              </button>
           </div>
        </section>

        {/* Classes Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Facility Curriculum</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase border border-blue-100">
               {facilityClasses.length} Types
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {facilityClasses.map(c => (
              <div 
                key={c.id}
                className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm flex flex-col"
              >
                <div className="aspect-[21/9] relative bg-slate-100 shrink-0">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl font-bold text-[9px] text-blue-600 shadow-sm uppercase tracking-widest flex items-center gap-1.5">
                    <Signal className="w-3 h-3" /> {c.level}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col text-left">
                   <div>
                      <h4 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2 uppercase">{c.name}</h4>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> {c.duration}
                         </div>
                      </div>
                   </div>

                   <p className="text-xs font-medium text-slate-500 leading-relaxed italic flex-1">
                     "{c.shortDescription}"
                   </p>

                   <div className="flex gap-2 pt-2">
                     <button 
                        onClick={() => navigate(`/trainer/facility/${id}/timetable/${c.id}`)}
                        className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                      >
                        <CalendarDays className="w-3.5 h-3.5" /> Timetable
                      </button>
                      <button 
                        onClick={() => navigate(`/trainer/facility/${id}/class/${c.id}`)}
                        className="p-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl active:scale-[0.98] transition-all"
                        title="View Full Specs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {facilityClasses.length === 0 && (
          <div className="py-24 text-center space-y-4">
             <div className="w-16 h-16 bg-white rounded-[32px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200 shadow-sm">
                <LayoutGrid className="w-8 h-8" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zero Class Specifications Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerFacilityHub;