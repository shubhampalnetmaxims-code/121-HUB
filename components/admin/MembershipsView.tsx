import React, { useState } from 'react';
import { Plus, Menu, CreditCard, Edit3, Trash2, Search, ChevronRight, Eye, Clock, Calendar } from 'lucide-react';
import { Facility, Membership } from '../../types';
import MembershipFormModal from './MembershipFormModal';
import ConfirmationModal from './ConfirmationModal';

interface MembershipsViewProps {
  facilities: Facility[];
  memberships: Membership[];
  onAddMembership: (m: any) => void;
  onUpdateMembership: (id: string, updates: any) => void;
  onDeleteMembership: (id: string) => void;
  onOpenSidebar: () => void;
}

const MembershipsView: React.FC<MembershipsViewProps> = ({ 
  facilities, memberships, onAddMembership, onUpdateMembership, onDeleteMembership, onOpenSidebar 
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('memberships');

  const filteredMemberships = memberships.filter(m => {
    if (m.facilityId !== selectedFacilityId) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (m: Membership) => {
    setEditingMembership(m);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingMembership) onUpdateMembership(editingMembership.id, data);
    else onAddMembership(data);
    setIsFormOpen(false);
    setEditingMembership(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteMembership(deletingId);
      setDeletingId(null);
    }
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
                className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-8 appearance-none text-slate-900 uppercase tracking-tight"
              >
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search plans..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none w-full md:w-64"
              />
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingMembership(null); setIsFormOpen(true); }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg disabled:opacity-50 uppercase tracking-widest"
            >
              Add Plan
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-100 p-10 rounded-lg text-center shadow-inner">
            <CreditCard className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2 uppercase tracking-tight">Memberships Disabled</h3>
            <p className="text-amber-700 text-sm max-w-md mx-auto font-medium">This module is not active for the current facility. Enable it in Hub settings to manage plans.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemberships.map(m => (
              <div key={m.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEdit(m)} className="p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:text-slate-900 transition-all"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => setDeletingId(m.id)} className="p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <h4 className="font-black text-xl text-slate-900 mb-2 uppercase tracking-tight">{m.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed font-bold uppercase tracking-tight opacity-70">{m.description}</p>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-md border border-slate-100">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>Duration: {m.durationDays} Days</span>
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{m.allow24Hour ? '24-Hour Access' : `${m.startTime} - ${m.endTime}`}</span>
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                        <span>Days: {m.daysAccess === 'all' ? 'All Days' : 'Weekdays Only'}</span>
                     </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">${m.price.toFixed(2)}</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${m.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setEditingMembership(null); setIsFormOpen(true); }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 group shadow-inner min-h-[250px]"
            >
              <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs"><Plus className="w-5 h-5" /></div>
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">New Membership Plan</span>
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <MembershipFormModal 
          membership={editingMembership} 
          facilities={facilities} 
          initialFacilityId={selectedFacilityId}
          onClose={() => { setIsFormOpen(false); setEditingMembership(null); }} 
          onSave={handleSave} 
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Remove Membership Plan?"
          message="Are you sure you want to delete this membership plan? Active user subscriptions will not be affected."
          confirmText="Delete Plan"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default MembershipsView;