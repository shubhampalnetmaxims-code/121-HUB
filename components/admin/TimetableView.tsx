
import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Menu, Edit3, Trash2, CalendarDays, Calendar as CalendarIcon, Layout, Users } from 'lucide-react';
import { Facility, Class, Trainer, Location, ClassSlot, DAYS_OF_WEEK } from '../../types';
import ClassSlotFormModal from './ClassSlotFormModal';
import ClassSlotViewModal from './ClassSlotViewModal';

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
  
  // Date and View State
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('timetable');

  // Calculate the week range (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const start = new Date(anchorDate);
    // Sunday is 0. Reset to start of Sunday.
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
    if (viewType === 'week') {
      next.setDate(anchorDate.getDate() + (direction * 7));
    } else {
      next.setDate(anchorDate.getDate() + direction);
    }
    setAnchorDate(next);
  };

  const getFormatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const currentRangeLabel = viewType === 'week' 
    ? `${getFormatDate(weekDays[0])} - ${getFormatDate(weekDays[6])}`
    : anchorDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const handleDatePicker = () => {
    if (dateInputRef.current) {
      try {
        if ('showPicker' in HTMLInputElement.prototype) {
          (dateInputRef.current as any).showPicker();
        } else {
          dateInputRef.current.click();
        }
      } catch (e) {
        dateInputRef.current.click();
      }
    }
  };

  const handleSave = (data: any | any[]) => {
    if (editingSlot) {
      onUpdateSlot(editingSlot.id, data);
    } else {
      // If data is array (multi-day selection), create multiple
      if (Array.isArray(data)) {
        data.forEach(slotData => onAddSlot(slotData));
      } else {
        onAddSlot(data);
      }
    }
    setIsModalOpen(false);
    setEditingSlot(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <select 
                value={selectedFacilityId} 
                onChange={e => setSelectedFacilityId(e.target.value)}
                className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-8 appearance-none text-slate-900"
              >
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
                <option value="all">All Classes</option>
                {classes.filter(c => c.facilityId === selectedFacilityId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={trainerFilter} onChange={e => setTrainerFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
                <option value="all">All Trainers</option>
                {trainers.filter(t => t.facilityIds.includes(selectedFacilityId)).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
                <option value="all">All Locations</option>
                {locations.filter(l => l.facilityIds.includes(selectedFacilityId)).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingSlot(null); setIsModalOpen(true); }}
              className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
            >
              Add Slot
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] text-center">
            <CalendarDays className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">Timetable Disabled</h3>
            <p className="text-amber-700 text-sm max-w-md mx-auto">This module is not active for the current facility. You can enable it in the Facility Detail settings.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center mb-10 px-4">
              <div className="flex items-center gap-6 mb-4">
                <button 
                  onClick={() => navigateDate(-1)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-900"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                
                <div className="relative">
                  <input 
                    type="date" 
                    ref={dateInputRef} 
                    className="absolute opacity-0 pointer-events-none" 
                    onChange={(e) => setAnchorDate(new Date(e.target.value))}
                  />
                  <button 
                    onClick={handleDatePicker}
                    className="flex items-center gap-3 text-2xl md:text-3xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-colors"
                  >
                    <CalendarIcon className="w-6 h-6 text-slate-300" />
                    {currentRangeLabel}
                  </button>
                </div>

                <button 
                  onClick={() => navigateDate(1)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-900"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>

              <div className="flex gap-10 items-center justify-center">
                <button 
                  onClick={() => setViewType('week')}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] pb-1 transition-all ${
                    viewType === 'week' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                  }`}
                >
                  Week View
                </button>
                <button 
                  onClick={() => setViewType('day')}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] pb-1 transition-all ${
                    viewType === 'day' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                  }`}
                >
                  Day View
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {displayedDates.map(date => {
                const dayIdx = date.getDay();
                const dayName = DAYS_OF_WEEK[dayIdx];
                const dayNum = date.getDate();
                const daySlots = getSlotsForDate(date);
                
                return (
                  <div key={date.toISOString()} className="flex animate-in fade-in slide-in-from-left duration-300">
                    <div className="w-10 bg-red-600 rounded-l-lg flex items-center justify-center p-2 relative overflow-hidden group">
                       <span className="text-white font-black uppercase text-xs tracking-widest whitespace-nowrap origin-center -rotate-90 select-none">
                         {dayName} {dayNum}{dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th'}
                       </span>
                    </div>
                    <div className="flex-1 bg-white border border-l-0 border-slate-100 rounded-r-2xl p-6 overflow-x-auto scrollbar-hide">
                      <div className="flex gap-4 min-h-[140px]">
                        {daySlots.length > 0 ? daySlots.map(s => {
                          const cls = classes.find(c => c.id === s.classId);
                          const trn = trainers.find(t => t.id === s.trainerId);
                          const loc = locations.find(l => l.id === s.locationId);
                          return (
                            <div 
                              key={s.id} 
                              onClick={() => setViewingSlot(s)}
                              className="min-w-[220px] bg-slate-50/50 border border-slate-100 rounded-2xl p-4 relative group hover:border-blue-200 hover:bg-blue-50/10 transition-all cursor-pointer flex flex-col justify-between h-40"
                            >
                              <div className="flex items-start justify-between">
                                <div className="text-left">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${s.status === 'available' ? 'bg-green-500' : s.status === 'full' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    <h4 className="font-bold text-slate-900 line-clamp-1">{cls?.name || 'Unknown'}</h4>
                                  </div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.startTime} • {s.duration}</p>
                                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                                    <Layout className="w-2.5 h-2.5" /> {loc?.name || 'TBA'}
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingSlot(s); setIsModalOpen(true); }} 
                                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                                   >
                                    <Edit3 className="w-3.5 h-3.5" />
                                   </button>
                                   <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteSlot(s.id); }} 
                                    className="p-1.5 hover:bg-white text-red-600 rounded-lg transition-colors"
                                   >
                                    <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                                </div>
                              </div>
                              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-500">{trn?.name || 'TBA'}</p>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                                  <Users className="w-3 h-3" /> {s.currentBookings}/{s.maxBookings}
                                </div>
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-50 rounded-2xl text-slate-200 font-black uppercase text-[10px] tracking-widest italic select-none">
                            No sessions scheduled
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
          onClose={() => {
            setIsModalOpen(false);
            setEditingSlot(null);
          }}
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
          onEdit={() => {
            setEditingSlot(viewingSlot);
            setViewingSlot(null);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default TimetableView;
