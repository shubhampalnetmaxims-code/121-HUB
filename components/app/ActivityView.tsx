
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Image, ChevronRight } from 'lucide-react';

const ActivityView: React.FC = () => {
  const navigate = useNavigate();

  const ActivityItem = ({ icon: Icon, title, subtitle, onClick }: { icon: any, title: string, subtitle: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 text-lg tracking-tight leading-none mb-1 uppercase">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300" />
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">My Activity</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32 scrollbar-hide">
        <div className="space-y-3">
          <ActivityItem 
            icon={Activity} 
            title="Measurements" 
            subtitle="Track your body metrics and progress"
            onClick={() => navigate('/app/measurements')} 
          />
          <ActivityItem 
            icon={Image} 
            title="Photo Log" 
            subtitle="Visual timeline of your transformation"
            onClick={() => navigate('/app/photo-logs')} 
          />
        </div>

        <section className="p-6 bg-blue-600 rounded-[32px] text-white space-y-2 mt-4">
           <h4 className="font-bold tracking-tight uppercase text-sm">Stay Consistent</h4>
           <p className="text-[10px] text-white/70 leading-relaxed font-medium uppercase tracking-tight">
             Regular logging helps you stay on track with your long-term health and wellness goals.
           </p>
        </section>
      </div>
    </div>
  );
};

export default ActivityView;