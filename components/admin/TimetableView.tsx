import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Menu, Edit3, Trash2, CalendarDays, Calendar as CalendarIcon, Layout, Users, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { Facility, Class, Trainer, Location, ClassSlot, DAYS_OF_WEEK } from '../../types';
import ClassSlotFormModal from './ClassSlotFormModal';
import ClassSlotViewModal from './ClassSlotViewModal';
import ConfirmationModal from './ConfirmationModal';

interface TimetableViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  classSlots: ClassSlot[];
  onAddSlot: (s: any) => void;
  onUpdateSlot: (id: string, updates: any) => void;
  onDeleteSlot: (id: string) => void;
  onOpenSidebar: () => void;
}

const TimetableView: React.FC<TimetableViewProps> = ({
  facilities, classes, trainers, locations, classSlots, onAddSlot, onUpdateSlot, onDeleteSlot, onOpenSidebar
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingSlot, setViewingSlot] = useState<ClassSlot | null>(null);
  const [editingSlot, setEditingSlot] = useState<ClassSlot | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('timetable');

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
    if (s.facilityId !== selectedFacilityId) return false;
    const parentClass = classes.find(c => c.id === s.classId);
    if (!parentClass || parentClass.status === 'inactive') return false;
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const selectedDate = new Date(val);
      if (!isNaN(selectedDate.getTime())) {
        setAnchorDate(selectedDate);
        setViewType('day');
      }
    }
  };

  const getFormatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const currentRangeLabel = viewType === 'week' 
    ? `${getFormatDate(weekDays[0])} - ${getFormatDate(weekDays[6])}`
    : anchorDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const handleSave = (data: any | any[]) => {
    if (editingSlot) onUpdateSlot(editingSlot.id, data);
    else {
      if (Array.isArray(data)) data.forEach(slotData => onAddSlot(slotData));
      else onAddSlot(data);
    }
    setIsModalOpen(false);
    setEditingSlot(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteSlot(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <select 
                value={selectedFacilityId} 
                onChange={e => setSelectedFacilityId(e.target.value)}
                className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-8 appearance-none text-slate-900 uppercase tracking-tight"
              >
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-4 py-2">
              <Filter className="w-3 h-3 text-slate-400" />
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                <option value="all">All Classes</option>
                {classes.filter(c => c.facilityId === selectedFacilityId && c.status === 'active').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-4 py-2">
              <Filter className="w-3 h-3 text-slate-400" />
              <select value={trainerFilter} onChange={e => setTrainerFilter(e.target.value)} className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                <option value="all">All Trainers</option>
                {trainers.filter(t => t.facilityIds.includes(selectedFacilityId)).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingSlot(null); setIsModalOpen(true); }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-sm disabled:opacity-50"
            >
              Add Slot
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-200 p-10 rounded-lg text-center shadow-inner">
            <CalendarDays className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-amber-900 mb-2 uppercase tracking-tight">Timetable Reach Disabled</h3>
            <p className="text-amber-700 text-xs font-bold uppercase tracking-tight max-w-md mx-auto opacity-70">This module is not active for the current facility. Enable it in Hub settings.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center mb-10 px-4">
              <div className="flex items-center gap-6 mb-6">
                <button onClick={() => navigateDate(-1)} className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-900 shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                <div className="relative">
                  <input type="date" ref={dateInputRef} className="absolute opacity-0 pointer-events-none" onChange={handleDateChange} />
                  <button onClick={() => dateInputRef.current?.showPicker()} className="flex items-center gap-3 text-2xl md:text-3xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-colors uppercase">
                    <CalendarIcon className="w-6 h-6 text-slate-300" />
                    {currentRangeLabel}
                  </button>
                </div>
                <button onClick={() => navigateDate(1)} className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-900 shadow-sm"><ChevronRight className="w-5 h-5" /></button>
              </div>

              <div className="flex gap-8 items-center justify-center border-b border-slate-100 w-full max-w-xs">
                <button onClick={() => setViewType('week')} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-3 transition-all relative ${viewType === 'week' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Week View{viewType === 'week' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
                <button onClick={() => setViewType('day')} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-3 transition-all relative ${viewType === 'day' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Day View{viewType === 'day' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
              </div>
            </div>

            <div className="space-y-3">
              {displayedDates.map(date => {
                const daySlots = getSlotsForDate(date);
                const dayNum = date.getDate();
                const dayName = DAYS_OF_WEEK[date.getDay()];
                return (
                  <div key={date.toISOString()} className="flex group/row">
                    <div className="w-12 bg-slate-900 border border-slate-800 rounded-l-md flex items-center justify-center p-2 relative overflow-hidden shrink-0">
                       <span className="text-white font-black uppercase text-[10px] tracking-widest whitespace-nowrap -rotate-90 select-none">
                         {dayName.substr(0, 3)} {dayNum}
                       </span>
                    </div>
                    <div className="flex-1 bg-white border border-l-0 border-slate-200 rounded-r-md p-6 overflow-x-auto scrollbar-hide shadow-sm group-hover/row:border-slate-300 transition-colors">
                      <div className="flex gap-3 min-h-[140px]">
                        {daySlots.length > 0 ? daySlots.map(s => {
                          const cls = classes.find(c => c.id === s.classId);
                          const trn = trainers.find(t => t.id === s.trainerId);
                          const loc = locations.find(l => l.id === s.locationId);
                          return (
                            <div 
                              key={s.id} 
                              onClick={() => setViewingSlot(s)}
                              style={{ borderTop: `3px solid ${trn?.colorCode || '#cbd5e1'}` }}
                              className="min-w-[200px] bg-slate-50/50 border border-slate-100 rounded-md p-4 relative group hover:bg-blue-50/10 hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between h-40 shadow-xs"
                            >
                              <div className="flex items-start justify-between">
                                <div className="text-left">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className={`w-2 h-2 rounded-full ${s.status === 'available' ? 'bg-green-500' : s.status === 'full' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    <h4 className="font-bold text-slate-900 line-clamp-1 uppercase text-xs tracking-tight">{cls?.name || 'Session'}</h4>
                                  </div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.startTime} • {s.duration}</p>
                                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                                    <Layout className="w-2.5 h-2.5" /> {loc?.name || 'TBA'}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={(e) => { e.stopPropagation(); setEditingSlot(s); setIsModalOpen(true); }} className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:text-blue-600 transition-colors"><Edit3 className="w-3 h-3" /></button>
                                   <button onClick={(e) => { e.stopPropagation(); setDeletingId(s.id); }} className="p-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:text-red-600 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-slate-100 flex flex-col gap-1 mt-auto">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trn?.colorCode || '#cbd5e1' }} />
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[80px]">{trn?.name || 'TBA'}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                                    <Users className="w-3 h-3" /> {s.currentBookings}/{s.maxBookings}
                                  </div>
                                </div>
                                <div className="flex justify-start">
                                   {s.trainerStatus === 'pending' && <span className="flex items-center gap-1 text-[7px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-1 py-0.5 rounded border border-amber-100"><Clock className="w-2 h-2" /> Pending Coach</span>}
                                   {s.trainerStatus === 'accepted' && <span className="flex items-center gap-1 text-[7px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-1 py-0.5 rounded border border-green-100"><ShieldCheck className="w-2 h-2" /> Accepted</span>}
                                   {s.trainerStatus === 'not-available' && <span className="flex items-center gap-1 text-[7px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-1 py-0.5 rounded border border-red-100"><XCircle className="w-2 h-2" /> Declined</span>}
                                </div>
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="flex-1 flex items-center justify-center border border-dashed border-slate-100 rounded-md text-slate-200 font-black uppercase text-[10px] tracking-[0.3em] italic select-none bg-slate-50/20">
                            Closed Loop
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <ClassSlotFormModal 
          slot={editingSlot}
          facilities={facilities}
          classes={classes}
          trainers={trainers}
          locations={locations}
          onClose={() => { setIsModalOpen(false); setEditingSlot(null); }}
          onSave={handleSave}
        />
      )}

      {viewingSlot && (
        <ClassSlotViewModal
          slot={viewingSlot}
          cls={classes.find(c => c.id === viewingSlot.classId)}
          trainer={trainers.find(t => t.id === viewingSlot.trainerId)}
          location={locations.find(l => l.id === viewingSlot.locationId)}
          onClose={() => setViewingSlot(null)}
          onEdit={() => { setEditingSlot(viewingSlot); setViewingSlot(null); setIsModalOpen(true); }}
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Delete Slot?"
          message="Are you sure you want to remove this specific class session from the timetable?"
          confirmText="Delete Slot"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default TimetableView;