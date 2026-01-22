
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Dumbbell, Info, MapPin, ArrowRight } from 'lucide-react';
import { Facility } from '../../types';

interface HomeViewProps {
  facilities: Facility[];
  onShowInfo: (f: Facility) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ facilities, onShowInfo }) => {
  const navigate = useNavigate();
  const filteredFacilities = facilities.filter(f => f.isActive);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="p-6 pt-12 flex justify-between items-center border-b border-slate-50">
        <div className="text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Experience</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">121 Active Network</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><Search className="w-5 h-5 text-slate-400" /></button>
          <button className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><Bell className="w-5 h-5 text-slate-400" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-28 space-y-8">
        <section>
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="font-bold text-xl text-slate-900">Our Facilities</h3>
          </div>
          
          <div className="flex flex-col gap-8">
            {filteredFacilities.map(f => (
              <div 
                key={f.id} 
                className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 group transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  {f.imageUrl ? (
                    <img 
                      src={f.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={f.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
                      <Dumbbell className="w-12 h-12" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <button 
                    className="absolute top-5 right-5 p-4 rounded-full bg-white shadow-2xl text-blue-600 hover:bg-slate-50 transition-all z-10 active:scale-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowInfo(f);
                    }}
                  >
                    <Info className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-6 left-8 text-left">
                    <h4 className="text-white font-extrabold text-3xl drop-shadow-lg tracking-tight">{f.name}</h4>
                    <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">
                       <MapPin className="w-3 h-3" /> Digital Member Hub
                    </div>
                  </div>
                </div>

                <div className="p-6 flex justify-between items-center bg-white">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Touch ⓘ for profile</span>
                   <button 
                    onClick={() => navigate(`/app/facility/${f.id}`)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-[20px] font-extrabold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                   >
                     Go Inside
                     <ArrowRight className="w-4 h-4" />
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

export default HomeView;
