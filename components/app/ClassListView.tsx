
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Signal, Package } from 'lucide-react';
import { Facility, Class, User } from '../../types';

// Updated interface to include required props for authentication and user state
interface ClassListViewProps {
  facilities: Facility[];
  classes: Class[];
  onAuthTrigger: () => void;
  currentUser: User | null;
}

const ClassListView: React.FC<ClassListViewProps> = ({ facilities, classes, onAuthTrigger, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find(f => f.id === id);
  if (!facility) return null;
  
  // Filter for both facility ID and active status
  const facilityClasses = classes.filter(c => c.facilityId === id && c.status === 'active');

  const handleViewTimetable = (classId: string) => {
    // Navigate to timetable and pass the specific class ID to pre-filter results
    navigate(`/app/facility/${id}/timetable`, { state: { preSelectedClassId: classId } });
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="p-6 pt-12 flex items-center gap-4 border-b border-slate-50">
        <button onClick={() => navigate(`/app/facility/${id}`)} className="p-2 hover:bg-slate-100 rounded-xl">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold tracking-tight">Available Classes</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {facilityClasses.length > 0 ? facilityClasses.map(c => (
          <div key={c.id} className="bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100">
             <div className="aspect-[16/9] relative">
               {c.imageUrl ? (
                 <img src={c.imageUrl} className="w-full h-full object-cover" alt={c.name} />
               ) : (
                 <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600"><BookOpen className="w-10 h-10" /></div>
               )}
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full font-bold text-[10px] text-blue-600 shadow-sm uppercase tracking-widest flex items-center gap-1.5">
                 <Signal className="w-3 h-3" /> {c.level}
               </div>
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full font-bold text-[10px] text-slate-600 shadow-sm uppercase tracking-widest">{c.duration}</div>
             </div>
             <div className="p-6 text-left">
               <h4 className="text-xl font-bold mb-2">{c.name}</h4>
               <p className="text-slate-500 text-sm mb-4 leading-relaxed">{c.shortDescription}</p>
               <div className="flex items-start gap-2 p-4 bg-white rounded-2xl border border-slate-100">
                  <Package className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold text-slate-600 leading-tight">Bring: {c.requirements}</div>
               </div>
               <button 
                onClick={() => handleViewTimetable(c.id)}
                className="w-full mt-5 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
               >
                View Timetable
               </button>
             </div>
          </div>
        )) : (
          <div className="py-20 text-center text-slate-400 font-bold">No classes scheduled yet.</div>
        )}
      </div>
    </div>
  );
};

export default ClassListView;
