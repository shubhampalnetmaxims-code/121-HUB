
import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Layout, ArrowLeft } from 'lucide-react';
import { Facility, Class, Trainer, Location, ClassSlot, DAYS_OF_WEEK, User } from '../../types';
import AppClassSlotViewModal from './AppClassSlotViewModal';
import { useNavigate } from 'react-router-dom';

interface AppTimetableViewProps {
  facility: Facility;
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  classSlots: ClassSlot[];
  onAuthTrigger: () => void;
  currentUser: User | null;
}

const AppTimetableView: React.FC<AppTimetableViewProps> = ({
  facility, classes, trainers, locations, classSlots, onAuthTrigger, currentUser
}) => {
  const navigate = useNavigate();
  const [classFilter, setClassFilter] = useState<string>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [viewingSlot, setViewingSlot] = useState<ClassSlot | null>(null);
  
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const filteredSlots = classSlots.filter(s => {
    if (s.facilityId !== facility.id) return false;
    if (classFilter !== 'all' && s.classId !== classFilter) return false;
    if (trainerFilter !== 'all' && s.trainerId !== trainerFilter) return false;
    if (locationFilter !== 'all' && s.locationId !== locationFilter) return false;
    return true;
  });

  const getSlotsForDate = (date: Date) => {
    const dayIdx = date.getDay();
    const dateTime = date.getTime();
    
    return filteredSlots.filter(s => {
      if (s.dayOfWeek !== dayIdx) return false;
      // Range check
      if (s.startDate && dateTime < s.startDate) return false;
      if (s.endDate && dateTime > s.endDate) return false;
      return true;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

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
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight">{facility.name} Timetable</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sessions & Classes</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-4">
          {/* Filters */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none">
              <option value="all">All Classes</option>
              {classes.filter(c => c.facilityId === facility.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={trainerFilter} onChange={e => setTrainerFilter(e.target.value)} className="shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none">
              <option value="all">All Trainers</option>
              {trainers.filter(t => t.facilityIds.includes(facility.id)).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none">
              <option value="all">All Areas</option>
              {locations.filter(l => l.facilityIds.includes(facility.id)).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          {/* Date Nav */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-[32px] border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => navigateDate(-1)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></button>
              <div className="relative">
                <input type="date" ref={dateInputRef} className="absolute opacity-0 pointer-events-none" onChange={(e) => setAnchorDate(new Date(e.target.value))} />
                <button onClick={() => dateInputRef.current?.showPicker()} className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tighter">
                  <CalendarIcon className="w-5 h-5 text-slate-300" />
                  {currentRangeLabel}
                </button>
              </div>
              <button onClick={() => navigateDate(1)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><ChevronRight className="w-6 h-6" /></button>
            </div>
            <div className="flex gap-8">
              <button onClick={() => setViewType('week')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${viewType === 'week' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}>Week</button>
              <button onClick={() => setViewType('day')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${viewType === 'day' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}>Day</button>
            </div>
          </div>

          {/* Slots List */}
          <div className="space-y-3">
            {displayedDates.map(date => {
              const daySlots = getSlotsForDate(date);
              const dayNum = date.getDate();
              const dayName = DAYS_OF_WEEK[date.getDay()];
              
              return (
                <div key={date.toISOString()} className="flex">
                  <div className="w-8 bg-red-600 rounded-l-2xl flex items-center justify-center relative overflow-hidden shrink-0">
                    <span className="text-white font-black uppercase text-[10px] tracking-widest whitespace-nowrap -rotate-90">
                      {dayName.substr(0, 3)} {dayNum}
                    </span>
                  </div>
                  <div className="flex-1 bg-white border border-l-0 border-slate-100 rounded-r-2xl p-4 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3">
                      {daySlots.length > 0 ? daySlots.map(s => {
                        const cls = classes.find(c => c.id === s.classId);
                        const loc = locations.find(l => l.id === s.locationId);
                        return (
                          <div 
                            key={s.id} 
                            onClick={() => setViewingSlot(s)}
                            className="min-w-[180px] bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between h-36 active:scale-95 transition-transform cursor-pointer"
                          >
                            <div className="text-left">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className={`w-2 h-2 rounded-full ${s.status === 'available' ? 'bg-green-500' : s.status === 'full' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{cls?.name}</h4>
                              </div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.startTime} • {s.duration}</p>
                              <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase">
                                <Layout className="w-2 h-2" /> {loc?.name}
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                              <p className="text-[10px] font-bold text-slate-500">{trainers.find(t => t.id === s.trainerId)?.name || 'TBA'}</p>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="flex-1 py-10 text-center text-[10px] font-black uppercase text-slate-200 italic">No classes</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {viewingSlot && (
        <AppClassSlotViewModal
          slot={viewingSlot}
          cls={classes.find(c => c.id === viewingSlot.classId)}
          trainer={trainers.find(t => t.id === viewingSlot.trainerId)}
          location={locations.find(l => l.id === viewingSlot.locationId)}
          onClose={() => setViewingSlot(null)}
          onAuthTrigger={onAuthTrigger}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default AppTimetableView;
