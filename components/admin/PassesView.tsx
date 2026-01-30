import React, { useState } from 'react';
import { Plus, Menu, Ticket, Edit3, Trash2, Search, ChevronRight, Eye } from 'lucide-react';
import { Facility, Pass, Class } from '../../types';
import PassFormModal from './PassFormModal';
import PassViewModal from './PassViewModal';
import ConfirmationModal from './ConfirmationModal';

interface PassesViewProps {
  facilities: Facility[];
  classes: Class[];
  passes: Pass[];
  onAddPass: (p: any) => void;
  onUpdatePass: (id: string, updates: any) => void;
  onDeletePass: (id: string) => void;
  onOpenSidebar: () => void;
}

const PassesView: React.FC<PassesViewProps> = ({ 
  facilities, classes, passes, onAddPass, onUpdatePass, onDeletePass, onOpenSidebar 
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPass, setEditingPass] = useState<Pass | null>(null);
  const [viewingPass, setViewingPass] = useState<Pass | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('passes');

  const filteredPasses = passes.filter(p => {
    if (p.facilityId !== selectedFacilityId) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (p: Pass) => {
    setEditingPass(p);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingPass) onUpdatePass(editingPass.id, data);
    else onAddPass(data);
    setIsFormOpen(false);
    setEditingPass(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeletePass(deletingId);
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
                className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-8 appearance-none text-slate-900"
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
                placeholder="Search passes..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none w-full md:w-64"
              />
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingPass(null); setIsFormOpen(true); }}
              className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
            >
              Add Pass
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] text-center">
            <Ticket className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">Passes Module Disabled</h3>
            <p className="text-amber-700 text-sm max-w-md mx-auto">This module is not active for the current facility. You can enable it in the Facility Detail settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPasses.map(p => (
              <div key={p.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setViewingPass(p)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                       <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => setDeletingId(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <h4 className="font-black text-xl text-slate-900 mb-2">{p.name}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">{p.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                     <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Credits</p>
                        <p className="font-bold text-slate-900">{p.credits} Sessions</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Persons</p>
                        <p className="font-bold text-slate-900">{p.personsPerBooking} / Booking</p>
                     </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <span className="text-2xl font-black text-blue-600">${p.price}</span>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setEditingPass(null); setIsFormOpen(true); }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 group aspect-video lg:aspect-auto min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Create New Pass</span>
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <PassFormModal 
          pass={editingPass} 
          facilities={facilities} 
          classes={classes}
          initialFacilityId={selectedFacilityId}
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
        />
      )}

      {viewingPass && (
        <PassViewModal 
          pass={viewingPass}
          facilityName={facilities.find(f => f.id === viewingPass.facilityId)?.name || ''}
          classes={classes}
          onClose={() => setViewingPass(null)}
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Delete Pass?"
          message="Are you sure you want to remove this pass? Existing user passes will remain functional."
          confirmText="Delete Pass"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default PassesView;
