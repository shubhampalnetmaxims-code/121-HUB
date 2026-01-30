
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Ticket, CreditCard, ShoppingBag, LayoutDashboard, Activity, Info, Users, ChevronRight, CalendarDays } from 'lucide-react';
import { Facility, Trainer, FEATURE_MODULES } from '../../types';
import TrainerBioModal from './TrainerBioModal';

const IconMap: Record<string, any> = {
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag, CalendarDays
};

interface FacilityHubViewProps {
  facilities: Facility[];
  trainers: Trainer[];
  onShowInfo: (f: Facility) => void;
}

const FacilityHubView: React.FC<FacilityHubViewProps> = ({ facilities, trainers, onShowInfo }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const facility = facilities.find(f => f.id === id);
  if (!facility) return <div className="p-10 text-center font-bold text-slate-400">Facility not found</div>;

  const activeModules = FEATURE_MODULES.filter(m => facility.features?.includes(m.id));
  const hasTimetable = facility.features?.includes('timetable');
  const hasMarketplace = facility.features?.includes('marketplace');
  const hasPasses = facility.features?.includes('passes');
  
  const facilityTrainers = trainers.filter(t => t.facilityIds.includes(facility.id));

  // Helper to handle navigation for dynamic modules
  const handleModuleNavigation = (moduleId: string) => {
    switch (moduleId) {
      case 'classes':
        navigate(`/app/facility/${id}/classes`);
        break;
      case 'blocks':
        navigate(`/app/facility/${id}/blocks`);
        break;
      case 'timetable':
        navigate(`/app/facility/${id}/timetable`);
        break;
      case 'marketplace':
        navigate(`/app/facility/${id}/market`);
        break;
      case 'passes':
        navigate(`/app/facility/${id}/passes`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4">
        <button onClick={() => navigate('/app/home')} className="p-2 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight">{facility.name}</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Digital Hub</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32 scroll-smooth scrollbar-hide">
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Services</h3>
          <div className="grid grid-cols-2 gap-4">
            {hasTimetable && (
              <button 
                onClick={() => navigate(`/app/facility/${id}/timetable`)}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-colors group active:scale-95"
              >
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">Timetable</span>
              </button>
            )}

            {hasMarketplace && (
              <button 
                onClick={() => navigate(`/app/facility/${id}/market`)}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-colors group active:scale-95"
              >
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">Marketplace</span>
              </button>
            )}

            {hasPasses && (
              <button 
                onClick={() => navigate(`/app/facility/${id}/passes`)}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-colors group active:scale-95"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Ticket className="w-7 h-7" />
                </div>
                <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">Passes</span>
              </button>
            )}

            {activeModules.map(module => {
              // Skip modules we already rendered manually above
              if (['timetable', 'marketplace', 'passes'].includes(module.id)) return null;
              const ModuleIcon = IconMap[module.icon] || ShoppingBag;
              return (
                <button 
                  key={module.id}
                  onClick={() => handleModuleNavigation(module.id)}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-colors group active:scale-95"
                >
                  <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ModuleIcon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">{module.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {facilityTrainers.length > 0 && (
          <section>
             <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Meet the Team</h3>
             </div>
             <div className="space-y-3">
               {facilityTrainers.map(t => (
                 <button 
                  key={t.id}
                  onClick={() => setSelectedTrainer(t)}
                  className="w-full bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all text-left"
                 >
                   <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                      {t.profilePicture ? (
                        <img src={t.profilePicture} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Users className="w-4 h-4" /></div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-extrabold text-slate-900 text-base tracking-tight leading-none mb-1">{t.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Coach</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <ChevronRight className="w-4 h-4" />
                   </div>
                 </button>
               ))}
             </div>
          </section>
        )}
      </div>

      <button 
        onClick={() => onShowInfo(facility)}
        className="absolute bottom-28 right-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-20"
      >
        <Info className="w-7 h-7" />
      </button>

      {selectedTrainer && (
        <TrainerBioModal trainer={selectedTrainer} onClose={() => setSelectedTrainer(null)} />
      )}
    </div>
  );
};

export default FacilityHubView;
