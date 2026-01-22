
import React, { useState } from 'react';
import { X, Clock, Calendar, Users, MapPin, Activity, Check, RotateCcw } from 'lucide-react';
import { Facility, Class, Trainer, Location, ClassSlot, DAYS_OF_WEEK } from '../../types';

interface ClassSlotFormModalProps {
  slot: ClassSlot | null;
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  onClose: () => void;
  onSave: (data: any | any[]) => void;
}

const ClassSlotFormModal: React.FC<ClassSlotFormModalProps> = ({ 
  slot, facilities, classes, trainers, locations, onClose, onSave 
}) => {
  const [isRepeat, setIsRepeat] = useState(!!(slot?.startDate || slot?.endDate));
  const [selectedDays, setSelectedDays] = useState<number[]>(slot ? [slot.dayOfWeek] : []);
  const [formData, setFormData] = useState({
    facilityId: slot?.facilityId || '',
    classId: slot?.classId || '',
    trainerId: slot?.trainerId || '',
    locationId: slot?.locationId || '',
    startTime: slot?.startTime || '09:00',
    duration: slot?.duration || '1 hour',
    status: slot?.status || 'available',
    currentBookings: slot?.currentBookings || 0,
    maxBookings: slot?.maxBookings || 10,
    startDate: slot?.startDate ? new Date(slot.startDate).toISOString().split('T')[0] : '',
    endDate: slot?.endDate ? new Date(slot.endDate).toISOString().split('T')[0] : ''
  });

  const toggleDay = (idx: number) => {
    // If editing, usually we only edit one, but for creation we can do multi
    if (slot) {
      setSelectedDays([idx]);
      return;
    }
    setSelectedDays(prev => 
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const commonData = {
      facilityId: formData.facilityId,
      classId: formData.classId,
      trainerId: formData.trainerId,
      locationId: formData.locationId,
      startTime: formData.startTime,
      duration: formData.duration,
      status: formData.status,
      currentBookings: formData.currentBookings,
      maxBookings: formData.maxBookings,
      startDate: isRepeat && formData.startDate ? new Date(formData.startDate).getTime() : undefined,
      endDate: isRepeat && formData.endDate ? new Date(formData.endDate).getTime() : undefined,
    };

    if (slot) {
      // Edit mode: just return one object
      onSave({ ...commonData, dayOfWeek: selectedDays[0] });
    } else {
      // Create mode: return array of objects for multi-day support
      const slotsToCreate = selectedDays.map(day => ({
        ...commonData,
        dayOfWeek: day
      }));
      onSave(slotsToCreate);
    }
  };

  const filteredClasses = classes.filter(c => c.facilityId === formData.facilityId);
  const filteredLocations = locations.filter(l => l.facilityIds.includes(formData.facilityId));
  const filteredTrainers = trainers.filter(t => t.facilityIds.includes(formData.facilityId));

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{slot ? 'Edit Class Slot' : 'Add Class Slot'}</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
          
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Target Facility</label>
              <select required value={formData.facilityId} onChange={e => setFormData(p => ({ ...p, facilityId: e.target.value }))} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-slate-900">
                <option value="">Select Facility...</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Class Type</label>
                <select required disabled={!formData.facilityId} value={formData.classId} onChange={e => setFormData(p => ({ ...p, classId: e.target.value }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold disabled:opacity-50">
                  <option value="">Choose Class...</option>
                  {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Trainer</label>
                <select required disabled={!formData.facilityId} value={formData.trainerId} onChange={e => setFormData(p => ({ ...p, trainerId: e.target.value }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold disabled:opacity-50">
                  <option value="">Choose Trainer...</option>
                  {filteredTrainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Specific Location</label>
                <select required disabled={!formData.facilityId} value={formData.locationId} onChange={e => setFormData(p => ({ ...p, locationId: e.target.value }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold disabled:opacity-50">
                  <option value="">Choose Area...</option>
                  {filteredLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Status</label>
                <select required value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold">
                  <option value="available">Available</option>
                  <option value="full">Full</option>
                  <option value="waiting">Waiting List</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Time</label>
                <input required type="time" value={formData.startTime} onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration</label>
                <input required value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="1 hour" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Select Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day, idx) => {
                  const isSelected = selectedDays.includes(idx);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`flex-1 min-w-[70px] py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {day.substr(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                   <RotateCcw className="w-4 h-4 text-blue-600" />
                   <span className="font-bold text-sm text-slate-900">Repeat within Range</span>
                 </div>
                 <input 
                  type="checkbox" 
                  checked={isRepeat} 
                  onChange={e => setIsRepeat(e.target.checked)} 
                  className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" 
                 />
               </div>
               
               {isRepeat && (
                 <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
                      <input 
                        type="date" 
                        required={isRepeat}
                        value={formData.startDate} 
                        onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">End Date</label>
                      <input 
                        type="date" 
                        required={isRepeat}
                        value={formData.endDate} 
                        onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" 
                      />
                    </div>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Persons / Bookings</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" min="0" value={formData.currentBookings} onChange={e => setFormData(p => ({ ...p, currentBookings: parseInt(e.target.value) || 0 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Max Booking</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" min="1" value={formData.maxBookings} onChange={e => setFormData(p => ({ ...p, maxBookings: parseInt(e.target.value) || 1 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="10" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
            <button type="submit" disabled={!formData.facilityId || !formData.classId || selectedDays.length === 0} className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all disabled:opacity-50">Save Slot</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassSlotFormModal;
