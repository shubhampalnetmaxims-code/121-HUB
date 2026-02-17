import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Menu, Users, MapPin, Edit3, Trash2, Mail, Phone, Eye, Filter, LayoutGrid, ChevronRight, Search, ShieldCheck, ShieldAlert, Star, Award, CheckCircle2, XCircle, Building2, User } from 'lucide-react';
import { Facility, Trainer, Location } from '../../types';
import TrainerFormModal from './TrainerFormModal';
import LocationFormModal from './LocationFormModal';
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
  facilities = [], trainers = [], onAddTrainer, onUpdateTrainer, onDeleteTrainer,
  locations = [], onAddLocation, onUpdateLocation, onDeleteLocation, onOpenSidebar 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'trainers' | 'locations'>('trainers');
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [viewingLocation, setViewingLocation] = useState<Location | null>(null);

  const [deletingTrainerId, setDeletingTrainerId] = useState<string | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  // Advanced Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'allowed' | 'restricted'>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');

  const filteredTrainers = useMemo(() => {
    return trainers.filter(t => {
      if (search) {
        const query = search.toLowerCase();
        const matches = t.name.toLowerCase().includes(query) || 
                        t.email.toLowerCase().includes(query) || 
                        t.phone.includes(query) || 
                        (t.speciality && t.speciality.toLowerCase().includes(query));
        if (!matches) return false;
      }
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (accessFilter !== 'all' && t.appAccess !== accessFilter) return false;
      if (facilityFilter !== 'all' && !t.facilityIds.includes(facilityFilter)) return false;
      if (experienceFilter !== 'all' && t.experience !== experienceFilter) return false;
      return true;
    });
  }, [trainers, search, statusFilter, accessFilter, facilityFilter, experienceFilter]);

  const filteredLocations = locations.filter(l => {
    if (facilityFilter === 'all') return true;
    return l.facilityIds.includes(facilityFilter);
  });

  const handleEditTrainer = (t: Trainer) => {
    setEditingTrainer(t);
    setIsTrainerModalOpen(true);
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
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Control Center</h2>
              <p className="text-slate-500 text-xs font-medium">Manage human capital and physical assets.</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-md">
            <button 
              onClick={() => setActiveTab('trainers')}
              className={`px-6 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'trainers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Trainers
            </button>
            <button 
              onClick={() => setActiveTab('locations')}
              className={`px-6 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'locations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Locations
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24 space-y-6">
        <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text"
                    placeholder="Search by Name, Email, Phone or Specs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                 />
              </div>
              <button 
                onClick={() => activeTab === 'trainers' ? setIsTrainerModalOpen(true) : setIsLocationModalOpen(true)}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {activeTab === 'trainers' ? 'New Coach' : 'New Area'}
              </button>
           </div>

           <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                 <Filter className="w-3.5 h-3.5 text-slate-400" />
                 <select 
                   value={facilityFilter} 
                   onChange={e => setFacilityFilter(e.target.value)}
                   className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer max-w-[120px]"
                 >
                   <option value="all">All Hubs</option>
                   {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                 </select>
              </div>

              {activeTab === 'trainers' && (
                <>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={statusFilter} 
                      onChange={e => setStatusFilter(e.target.value as any)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                    >
                      <option value="all">Visibility: All</option>
                      <option value="active">Active Hubs</option>
                      <option value="inactive">Hidden Hubs</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={accessFilter} 
                      onChange={e => setAccessFilter(e.target.value as any)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                    >
                      <option value="all">Access: All</option>
                      <option value="allowed">Allowed Entry</option>
                      <option value="restricted">Restricted</option>
                    </select>
                  </div>
                </>
              )}
           </div>
        </section>

        {activeTab === 'trainers' ? (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Coach Profile</th>
                    <th className="px-8 py-5">Assigned Hubs</th>
                    <th className="px-8 py-5">Network Status</th>
                    <th className="px-8 py-5">App Access</th>
                    <th className="px-8 py-5 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTrainers.length > 0 ? filteredTrainers.map(t => (
                    <tr 
                      key={t.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/admin/trainer/${t.id}`)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs relative">
                            {t.profilePicture ? <img src={t.profilePicture} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 mx-auto mt-3.5 text-slate-300" />}
                            {t.status === 'inactive' && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                 <XCircle className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                          </div>
                          <div className="text-left overflow-hidden">
                             <p className="font-bold text-slate-900 truncate uppercase text-sm tracking-tight">{t.name}</p>
                             <div className="flex items-center gap-1.5 mt-0.5">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{t.speciality || 'Authorized Coach'}</span>
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {t.facilityIds.map(fid => {
                            const fac = facilities.find(f => f.id === fid);
                            return (
                              <span key={fid} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[8px] font-black uppercase whitespace-nowrap">
                                {fac?.name || 'Hub'}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-colors ${
                            t.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                         }`}>
                           {t.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                           {t.appAccess === 'allowed' ? (
                             <ShieldCheck className="w-4 h-4 text-green-600" />
                           ) : (
                             <ShieldAlert className="w-4 h-4 text-red-600" />
                           )}
                           <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">{t.appAccess}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                           <button onClick={() => navigate(`/admin/trainer/${t.id}`)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-colors shadow-xs" title="View Portfolio"><Eye className="w-4 h-4" /></button>
                           <button onClick={() => handleEditTrainer(t)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-colors shadow-xs" title="Edit Profile"><Edit3 className="w-4 h-4" /></button>
                           <button onClick={() => setDeletingTrainerId(t.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-md transition-colors shadow-xs" title="Delete Account"><Trash2 className="w-4 h-4" /></button>
                           <div className="p-2 text-slate-300 group-hover:text-slate-900 transition-colors">
                             <ChevronRight className="w-4 h-4" />
                           </div>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Physical Infrastructure</th>
                    <th className="px-8 py-5">Network Deployment</th>
                    <th className="px-8 py-5">System Identity</th>
                    <th className="px-8 py-5 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLocations.length > 0 ? filteredLocations.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4 text-left">
                           <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                             <MapPin className="w-4 h-4" />
                           </div>
                           <p className="font-bold text-slate-900 truncate uppercase text-sm tracking-tight">{l.name}</p>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-left">
                         <div className="flex flex-wrap gap-1">
                           {l.facilityIds.map(fid => {
                             const f = facilities.find(fac => fac.id === fid);
                             return (
                               <span key={fid} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-sm text-[8px] font-black uppercase tracking-tight flex items-center gap-1 border border-slate-200">
                                 <LayoutGrid className="w-2.5 h-2.5" /> {f?.name || 'Network'}
                               </span>
                             );
                           })}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-left">
                         <code className="text-[10px] font-mono bg-slate-50 px-2 py-0.5 border border-slate-200 rounded-sm text-slate-400 uppercase tracking-tighter">LOC-{l.id.substr(0,4)}</code>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                           <button onClick={() => setViewingLocation(l)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-colors shadow-xs" title="Infrastructure Review"><Eye className="w-4 h-4" /></button>
                           <button onClick={() => { setEditingLocation(l); setIsLocationModalOpen(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-colors shadow-xs" title="Modify Asset"><Edit3 className="w-4 h-4" /></button>
                           <button onClick={() => setDeletingLocationId(l.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-md transition-colors shadow-xs" title="Remove Infrastructure"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">No physical assets found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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