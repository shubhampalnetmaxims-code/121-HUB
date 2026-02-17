import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar as CalendarIcon, ChevronRight, ChevronLeft, MapPin, Layout, Filter } from 'lucide-react';
import { Facility, Class, ClassSlot, Trainer, DAYS_OF_WEEK, Location } from '../../types';

interface TrainerTimetableViewProps {
  facilities: Facility[];
  classes: Class[];
  trainer: Trainer;
  trainers: Trainer[];
  locations: Location[];
  classSlots: ClassSlot[];
  onUpdateSlot: (id: string, updates: Partial<ClassSlot>) => void;
}

const TrainerTimetableView: React.FC<TrainerTimetableViewProps> = ({ 
  facilities, classes, trainer, trainers, locations, classSlots, onUpdateSlot 
}) => {
  const { id, classId } = useParams();
  const navigate = useNavigate();
  
  const [classFilter, setClassFilter] = useState<string>(classId === 'all' ? 'all' : classId || 'all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

  const facility = facilities.find(f => f.id === id);

  const filteredSlots = classSlots.filter(s => {
    if (s.facilityId !== id) return false;
    
    const parentClass = classes.find(c => c.id === s.classId);
    // TRAINER LOGIC: If class is inactive, only show it IF it has bookings (already handled by slot existing, 
    // but we check parent class status explicitly here to enforce the 'hidden if inactive unless booked' logic)
    if (parentClass?.status === 'inactive' && s.currentBookings === 0) return false;

    if (classFilter !== 'all' && s.classId !== classFilter) return false;
    if (staffFilter !== 'all' && s.trainerId !== staffFilter) return false;
    return true;
  });

  const weekDays = useMemo(() => {
    const start = new Date(anchorDate);
    start.setDate(anchorDate.getDate() - anchorDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [anchorDate]);

  const displayedDates = viewType === 'week' ? weekDays : [anchorDate];

  const navigateDate = (direction: number) => {
    const next = new Date(anchorDate);
    if (viewType === 'week') next.setDate(anchorDate.getDate() + (direction * 7));
    else next.setDate(anchorDate.getDate() + direction);
    setAnchorDate(next);
  };

  const getFormatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const currentRangeLabel = viewType === 'week' 
    ? `${getFormatDate(weekDays[0])} - ${getFormatDate(weekDays[6])}`
    : anchorDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      {/* Filters Header */}
      <div className="bg-white p-4 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3 mb-4">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl">
             <ArrowLeft className="w-5 h-5 text-slate-900" />
           </button>
           <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Facility Timetable</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
           <div className="relative shrink-0">
              <select 
                value={classFilter} 
                onChange={e => setClassFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none"
              >
                <option value="all">All Classes</option>
                {/* Note: Trainers can see even inactive classes if they are filtering, but generally active only in dropdown */}
                {classes.filter(c => c.facilityId === id).map(c => <option key={c.id} value={c.id}>{c.name} {c.status === 'inactive' ? '(Inactive)' : ''}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 rotate-90" />
           </div>
           <div className="relative shrink-0">
              <select 
                value={staffFilter} 
                onChange={e => setStaffFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none"
              >
                <option value="all">All Trainers</option>
                {trainers.filter(t => t.facilityIds.includes(id!)).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 rotate-90" />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                 <button onClick={() => navigateDate(-1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-900 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                 </button>
                 <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-slate-300" />
                    <span className="text-lg font-black text-slate-900 tracking-tight uppercase">{currentRangeLabel}</span>
                 </div>
                 <button onClick={() => navigateDate(1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-900 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex border-t border-slate-50 pt-4">
                 <button onClick={() => setViewType('week')} className={`flex-1 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${viewType === 'week' ? 'text-blue-600 border-blue-600' : 'text-slate-300 border-transparent'}`}>Week</button>
                 <button onClick={() => setViewType('day')} className={`flex-1 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${viewType === 'day' ? 'text-blue-600 border-blue-600' : 'text-slate-300 border-transparent'}`}>Day</button>
              </div>
           </div>
        </div>

        <div className="px-4 space-y-4">
          {displayedDates.map(date => {
            const dayIdx = date.getDay();
            const daySlots = filteredSlots.filter(s => s.dayOfWeek === dayIdx);
            
            return (
              <div key={date.toISOString()} className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden flex min-h-[160px]">
                <div className="w-14 bg-red-600 flex items-center justify-center relative overflow-hidden shrink-0">
                  <span className="text-white font-black text-xs uppercase tracking-[0.3em] whitespace-nowrap -rotate-90">
                    {DAYS_OF_WEEK[dayIdx].substr(0, 3)} {date.getDate()}
                  </span>
                </div>

                <div className="flex-1 p-5 flex flex-col justify-center">
                  {daySlots.length > 0 ? (
                    <div className="space-y-4">
                      {daySlots.map(slot => {
                        const slotCls = classes.find(c => c.id === slot.classId);
                        const slotTrainer = trainers.find(t => t.id === slot.trainerId);
                        const slotLoc = locations.find(l => l.id === slot.locationId);
                        const isMyShift = slot.trainerId === trainer.id;

                        return (
                          <div 
                            key={slot.id} 
                            onClick={() => navigate(`/trainer/slot/${slot.id}`)}
                            className={`p-4 rounded-2xl border border-slate-100 space-y-3 active:scale-[0.98] transition-all ${slotCls?.status === 'inactive' ? 'bg-amber-50/50 grayscale-[0.3]' : 'bg-slate-50/50'}`}
                          >
                             <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full shadow-sm ${slotCls?.status === 'inactive' ? 'bg-slate-400' : 'bg-orange-500'}`} />
                                   <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight truncate max-w-[120px]">{slotCls?.name}</h4>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {isMyShift && (
                                    <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[7px] font-black uppercase tracking-widest">My Shift</span>
                                  )}
                                  {slotCls?.status === 'inactive' && (
                                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[7px] font-black uppercase tracking-widest">Inactive Class</span>
                                  )}
                                </div>
                             </div>

                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{slot.startTime} • {slot.duration}</p>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase">
                                   <MapPin className="w-2.5 h-2.5" /> {slotLoc?.name || 'Main Hall'}
                                </div>
                             </div>

                             <div className="pt-3 border-t border-slate-100/50">
                                <p className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight">{slotTrainer?.name}</p>
                             </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                       <p className="text-slate-200 font-black text-xs uppercase tracking-[0.4em] italic select-none">No Classes</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainerTimetableView;