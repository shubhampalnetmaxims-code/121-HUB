
import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { Facility, Location } from '../../types';

interface LocationFormModalProps {
  location: Location | null;
  facilities: Facility[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({ location, facilities, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityIds: location?.facilityIds || [],
    name: location?.name || ''
  });

  const toggleFacility = (id: string) => {
    setFormData(prev => {
      const exists = prev.facilityIds.includes(id);
      if (exists) {
        return { ...prev, facilityIds: prev.facilityIds.filter(fid => fid !== id) };
      } else {
        return { ...prev, facilityIds: [...prev.facilityIds, id] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{location ? 'Edit Area' : 'New Location'}</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }} className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto text-left">
          
          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Associated Facilities</label>
            <div className="grid grid-cols-2 gap-3">
              {facilities.map(f => {
                const isSelected = formData.facilityIds.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFacility(f.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <span className="font-bold text-sm">{f.name}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
            {formData.facilityIds.length === 0 && <p className="text-[10px] text-red-500 font-bold uppercase">Please assign to at least one facility.</p>}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Zone/Area Name</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Studio 1" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
            <button type="submit" disabled={formData.facilityIds.length === 0} className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all disabled:opacity-50">Save Infrastructure</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormModal;
