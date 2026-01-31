
import React, { useState } from 'react';
import { Plus, Menu, Layers, Edit3, Trash2, Search, ChevronRight, Eye, Calendar, Clock, User } from 'lucide-react';
import { Facility, Block, Trainer } from '../../types';
import BlockFormModal from './BlockFormModal';
import BlockViewModal from './BlockViewModal';
import ConfirmationModal from './ConfirmationModal';

interface BlocksViewProps {
  facilities: Facility[];
  trainers: Trainer[];
  blocks: Block[];
  onAddBlock: (b: any) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  onOpenSidebar: () => void;
}

const BlocksView: React.FC<BlocksViewProps> = ({ 
  facilities, trainers, blocks, onAddBlock, onUpdateBlock, onDeleteBlock, onOpenSidebar 
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [viewingBlock, setViewingBlock] = useState<Block | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const facility = facilities.find(f => f.id === selectedFacilityId);
  const isEnabled = facility?.features?.includes('blocks');

  const filteredBlocks = blocks.filter(b => {
    if (b.facilityId !== selectedFacilityId) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (b: Block) => {
    setEditingBlock(b);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingBlock) onUpdateBlock(editingBlock.id, data);
    else onAddBlock(data);
    setIsFormOpen(false);
    setEditingBlock(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteBlock(deletingId);
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
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find program..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none w-full md:w-64 focus:bg-white transition-all font-medium"
              />
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingBlock(null); setIsFormOpen(true); }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-sm disabled:opacity-50"
            >
              Design Block
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-200 p-10 rounded-lg text-center shadow-inner">
            <Layers className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-amber-900 mb-2 uppercase tracking-tight">Blocks Module Offline</h3>
            <p className="text-amber-700 text-xs font-bold uppercase tracking-tight max-w-md mx-auto opacity-70">This module is not active for the current facility. Enable it in Hub settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlocks.map(b => (
              <div key={b.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-md border border-blue-100 shadow-xs">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setViewingBlock(b)} className="p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:text-blue-600 transition-all shadow-xs" title="Review Specification"><Eye className="w-4 h-4" /></button>
                       <button onClick={() => handleEdit(b)} className="p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:text-slate-900 transition-all shadow-xs" title="Modify Program"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => setDeletingId(b.id)} className="p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:text-red-600 transition-all shadow-xs" title="Terminate Block"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <h4 className="font-black text-xl text-slate-900 mb-2 uppercase tracking-tight">{b.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed font-bold uppercase tracking-tight opacity-70">{b.about}</p>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-md border border-slate-100">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>START: {new Date(b.startDate).toLocaleDateString()} • {b.numWeeks} WEEKS</span>
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{b.startTime} • {b.duration}</span>
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span>COACH: {trainers.find(t => t.id === b.trainerId)?.name}</span>
                     </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Matrix</p>
                      <span className="text-xl font-black text-slate-900">${b.bookingAmount} <span className="text-[10px] text-slate-300 font-bold">+ ${b.weeklyAmount}/WK</span></span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${b.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setEditingBlock(null); setIsFormOpen(true); }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 group shadow-inner min-h-[250px]"
            >
              <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs"><Plus className="w-5 h-5" /></div>
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Deploy Transformation Cycle</span>
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <BlockFormModal 
          block={editingBlock} 
          facilities={facilities} 
          trainers={trainers}
          initialFacilityId={selectedFacilityId}
          onClose={() => { setIsFormOpen(false); setEditingBlock(null); }} 
          onSave={handleSave} 
        />
      )}

      {viewingBlock && (
        <BlockViewModal 
          block={viewingBlock}
          facilityName={facilities.find(f => f.id === viewingBlock.facilityId)?.name || ''}
          trainerName={trainers.find(t => t.id === viewingBlock.trainerId)?.name || ''}
          onClose={() => setViewingBlock(null)}
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Delete Block?"
          message="Are you sure you want to remove this block? This action is permanent and only allowed if no bookings exist."
          confirmText="Delete Block"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default BlocksView;