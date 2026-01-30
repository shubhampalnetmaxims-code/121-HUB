
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
                placeholder="Search blocks..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none w-full md:w-64"
              />
            </div>
            <button 
              disabled={!isEnabled}
              onClick={() => { setEditingBlock(null); setIsFormOpen(true); }}
              className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
            >
              Create Block
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        {!isEnabled ? (
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] text-center">
            <Layers className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2">Blocks Module Disabled</h3>
            <p className="text-amber-700 text-sm max-w-md mx-auto">This module is not active for the current facility. Enable it in Hub settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlocks.map(b => (
              <div key={b.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setViewingBlock(b)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                       <button onClick={() => handleEdit(b)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => setDeletingId(b.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <h4 className="font-black text-xl text-slate-900 mb-2 uppercase">{b.name}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed font-medium">{b.about}</p>
                  
                  <div className="space-y-3 mb-6">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Starts: {new Date(b.startDate).toLocaleDateString()} • {b.numWeeks} Weeks</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{b.startTime} • {b.duration}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                        <User className="w-3.5 h-3.5" />
                        <span>Trainer: {trainers.find(t => t.id === b.trainerId)?.name}</span>
                     </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Join Fee + Weekly</p>
                      <span className="text-2xl font-black text-blue-600">${b.bookingAmount} + ${b.weeklyAmount}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${b.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setEditingBlock(null); setIsFormOpen(true); }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 group aspect-video lg:aspect-auto min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Design New Block</span>
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
