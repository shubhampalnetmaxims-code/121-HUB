import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Signal, Clock, Package, Info } from 'lucide-react';
import { Class } from '../../types';

interface TrainerClassDetailViewProps {
  classes: Class[];
}

const TrainerClassDetailView: React.FC<TrainerClassDetailViewProps> = ({ classes }) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const cls = classes.find(c => c.id === classId);

  if (!cls) return null;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="p-6 pt-12 flex items-center gap-4 border-b border-slate-50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
           <h2 className="text-xl font-bold tracking-tight uppercase">Session Specs</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Curriculum</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <div className="aspect-[16/9] relative bg-slate-100 shrink-0">
          {cls.imageUrl ? (
            <img src={cls.imageUrl} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-600"><BookOpen className="w-10 h-10" /></div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl font-bold text-[10px] text-blue-600 shadow-sm uppercase tracking-widest flex items-center gap-1.5">
            <Signal className="w-3 h-3" /> {cls.level}
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl font-bold text-[10px] text-slate-600 shadow-sm uppercase tracking-widest">{cls.duration}</div>
        </div>

        <div className="p-6 space-y-8">
           <section>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">{cls.name}</h3>
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info className="w-4 h-4" /></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Overview & Objectives</p>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium text-lg italic border-l-4 border-slate-100 pl-4">
                "{cls.shortDescription}"
              </p>
           </section>

           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Session Logistics</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Duration</p>
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-blue-600" />
                       <span className="font-bold text-slate-900">{cls.duration}</span>
                    </div>
                 </div>
                 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Proficiency</p>
                    <div className="flex items-center gap-2">
                       <Signal className="w-4 h-4 text-blue-600" />
                       <span className="font-bold text-slate-900">{cls.level}</span>
                    </div>
                 </div>
              </div>
           </section>

           <section className="p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-blue-400" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60">Required Gear</h5>
                 </div>
                 <p className="text-lg font-bold leading-tight uppercase">{cls.requirements}</p>
                 <p className="text-[10px] text-white/40 mt-4 font-medium uppercase tracking-tight">Ensure all equipment is sanitized and available before slot start.</p>
              </div>
           </section>
        </div>
      </div>

      <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all"
        >
          Return to Hub
        </button>
      </div>
    </div>
  );
};

export default TrainerClassDetailView;