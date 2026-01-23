
import React, { useState } from 'react';
import { Plus, Menu, Users, MapPin, Edit3, Trash2, Mail, Phone, Eye, Filter, LayoutGrid } from 'lucide-react';
import { Facility, Trainer, Location } from '../../types';
import TrainerFormModal from './TrainerFormModal';
import LocationFormModal from './LocationFormModal';
import TrainerViewModal from './TrainerViewModal';
import LocationViewModal from './LocationViewModal';
import ConfirmationModal from './ConfirmationModal';

interface StaffViewProps {
  facilities: Facility[];
  trainers: Trainer[];
  onAddTrainer: (t: any) => void;
  onUpdateTrainer: (id: string, updates: any) => void;
  onDeleteTrainer: (id: string) => void;
  locations: Location[];
  onAddLocation: (l: any) => void;
  onUpdateLocation: (id: string, updates: any) => void;
  onDeleteLocation: (id: string) => void;
  onOpenSidebar: () => void;
}

const StaffView: React.FC<StaffViewProps> = ({ 
  facilities, trainers, onAddTrainer, onUpdateTrainer, onDeleteTrainer,
  locations, onAddLocation, onUpdateLocation, onDeleteLocation, onOpenSidebar 
}) => {
  const [activeTab, setActiveTab] = useState<'trainers' | 'locations'>('trainers');
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [viewingTrainer, setViewingTrainer] = useState<Trainer | null>(null);
  
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [viewingLocation, setViewingLocation] = useState<Location | null>(null);

  const [deletingTrainerId, setDeletingTrainerId] = useState<string | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  const [trainerFacilityFilter, setTrainerFacilityFilter] = useState<string>('all');
  const [locationFacilityFilter, setLocationFacilityFilter] = useState<string>('all');

  const filteredTrainers = trainers.filter(t => {
    if (trainerFacilityFilter === 'all') return true;
    return t.facilityIds.includes(trainerFacilityFilter);
  });

  const filteredLocations = locations.filter(l => {
    if (locationFacilityFilter === 'all') return true;
    return l.facilityIds.includes(locationFacilityFilter);
  });

  const handleEditTrainer = (t: Trainer) => {
    setEditingTrainer(t);
    setIsTrainerModalOpen(true);
  };

  const handleEditLocation = (l: Location) => {
    setEditingLocation(l);
    setIsLocationModalOpen(true);
  };

  const confirmDeleteTrainer = () => {
    if (deletingTrainerId) {
      onDeleteTrainer(deletingTrainerId);
      setDeletingTrainerId(null);
    }
  };

  const confirmDeleteLocation = () => {
    if (deletingLocationId) {
      onDeleteLocation(deletingLocationId);
      setDeletingLocationId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Staff & Infrastructure</h2>
              <p className="text-slate-500 text-xs md:text-sm">Manage global assets and team profiles.</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('trainers')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'trainers' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Trainers
            </button>
            <button 
              onClick={() => setActiveTab('locations')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'locations' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Locations
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        {activeTab === 'trainers' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-xs">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={trainerFacilityFilter} 
                    onChange={e => setTrainerFacilityFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Facilities</option>
                    {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => { setEditingTrainer(null); setIsTrainerModalOpen(true); }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
              >
                <Plus className="w-4 h-4" />
                Add Trainer
              </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto text-left">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Trainer Name</th>
                      <th className="px-8 py-5">Contact Details</th>
                      <th className="px-8 py-5">Assigned Facilities</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTrainers.length > 0 ? filteredTrainers.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              {t.profilePicture ? <img src={t.profilePicture} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 mx-auto mt-3.5 text-slate-300" />}
                            </div>
                            <div className="text-left overflow-hidden">
                               <p className="font-bold text-slate-900 truncate">{t.name}</p>
                               <div className="flex items-center gap-1.5">
                                 <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.colorCode }}></div>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase truncate">Professional</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-left">
                           <div className="text-sm font-medium text-slate-600 truncate max-w-[200px]">{t.email}</div>
                           <div className="text-xs text-slate-400 font-bold">{t.phone}</div>
                        </td>
                        <td className="px-8 py-6 text-left">
                           <div className="flex flex-wrap gap-1.5">
                             {t.facilityIds.map(fid => {
                               const f = facilities.find(fac => fac.id === fid);
                               return (
                                 <span key={fid} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                                   {f?.name || 'Unknown'}
                                 </span>
                               );
                             })}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => setViewingTrainer(t)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="View Profile"><Eye className="w-4 h-4" /></button>
                             <button onClick={() => handleEditTrainer(t)} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-lg transition-colors" title="Edit Profile"><Edit3 className="w-4 h-4" /></button>
                             <button onClick={() => setDeletingTrainerId(t.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">No trainers found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-xs">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={locationFacilityFilter} 
                    onChange={e => setLocationFacilityFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Facilities</option>
                    {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => { setEditingLocation(null); setIsLocationModalOpen(true); }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
              >
                <Plus className="w-4 h-4" />
                Add Location
              </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto text-left">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Location Name</th>
                      <th className="px-8 py-5">Assigned Facilities</th>
                      <th className="px-8 py-5">System ID</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLocations.length > 0 ? filteredLocations.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4 text-left">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                               <MapPin className="w-5 h-5" />
                             </div>
                             <p className="font-bold text-slate-900 truncate">{l.name}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-left">
                           <div className="flex flex-wrap gap-1.5">
                             {l.facilityIds.map(fid => {
                               const f = facilities.find(fac => fac.id === fid);
                               return (
                                 <span key={fid} className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight flex items-center gap-1">
                                   <LayoutGrid className="w-3 h-3" /> {f?.name || 'Unknown'}
                                 </span>
                               );
                             })}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-left">
                           <code className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-400 uppercase tracking-tighter">LOC-{l.id.substr(0,4)}</code>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => setViewingLocation(l)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="View Detail"><Eye className="w-4 h-4" /></button>
                             <button onClick={() => handleEditLocation(l)} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-lg transition-colors" title="Edit Area"><Edit3 className="w-4 h-4" /></button>
                             <button onClick={() => setDeletingLocationId(l.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">No locations found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {isTrainerModalOpen && (
        <TrainerFormModal 
          trainer={editingTrainer} 
          facilities={facilities} 
          onClose={() => { setIsTrainerModalOpen(false); setEditingTrainer(null); }} 
          onSave={(data) => {
            if (editingTrainer) onUpdateTrainer(editingTrainer.id, data);
            else onAddTrainer(data);
            setIsTrainerModalOpen(false);
            setEditingTrainer(null);
          }} 
        />
      )}

      {viewingTrainer && (
        <TrainerViewModal 
          trainer={viewingTrainer} 
          facilities={facilities} 
          onClose={() => setViewingTrainer(null)} 
        />
      )}

      {isLocationModalOpen && (
        <LocationFormModal 
          location={editingLocation} 
          facilities={facilities} 
          onClose={() => { setIsLocationModalOpen(false); setEditingLocation(null); }} 
          onSave={(data) => {
            if (editingLocation) onUpdateLocation(editingLocation.id, data);
            else onAddLocation(data);
            setIsLocationModalOpen(false);
            setEditingLocation(null);
          }} 
        />
      )}

      {viewingLocation && (
        <LocationViewModal 
          location={viewingLocation} 
          facilities={facilities} 
          onClose={() => setViewingLocation(null)} 
        />
      )}

      {deletingTrainerId && (
        <ConfirmationModal
          title="Delete Trainer?"
          message="Are you sure you want to remove this trainer's profile from all assigned facilities?"
          confirmText="Delete Profile"
          variant="danger"
          onConfirm={confirmDeleteTrainer}
          onCancel={() => setDeletingTrainerId(null)}
        />
      )}

      {deletingLocationId && (
        <ConfirmationModal
          title="Delete Area?"
          message="Are you sure you want to remove this facility area? This may affect existing class schedules."
          confirmText="Delete Area"
          variant="danger"
          onConfirm={confirmDeleteLocation}
          onCancel={() => setDeletingLocationId(null)}
        />
      )}
    </div>
  );
};

export default StaffView;
