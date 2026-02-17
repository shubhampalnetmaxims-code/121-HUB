import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added missing 'Info' import from lucide-react
import { Plus, Menu, Layers, Edit3, Trash2, Search, ChevronRight, Eye, Calendar, Clock, User, Users, Building2, Ban, CheckCircle, RefreshCcw, ShieldAlert, X, Info } from 'lucide-react';
import { Facility, Block, Trainer, BlockBooking, DAYS_OF_WEEK } from '../../types';
import BlockFormModal from './BlockFormModal';
import BlockViewModal from './BlockViewModal';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../ToastContext';

interface BlocksViewProps {
  facilities: Facility[];
  trainers: Trainer[];
  blocks: Block[];
  blockBookings: BlockBooking[];
  onAddBlock: (b: any) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlockBooking: (id: string, updates: Partial<BlockBooking>) => void;
  onOpenSidebar: () => void;
}

type OperationalStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const BlocksView: React.FC<BlocksViewProps> = ({ 
  facilities, trainers, blocks, blockBookings, onAddBlock, onUpdateBlock, onDeleteBlock, onUpdateBlockBooking, onOpenSidebar 
}) => {
  const { showToast } = useToast();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'cycles' | 'designs'>('cycles');
  const [cycleStatus, setCycleStatus] = useState<OperationalStatus>('upcoming');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [viewingBlockDesign, setViewingBlockDesign] = useState<Block | null>(null);
  const [viewingCycleRoster, setViewingCycleRoster] = useState<{ blockId: string, startDate: number } | null>(null);
  const [deletingDesignId, setDeletingDesignId] = useState<string | null>(null);

  // Grouped Cycles Logic
  const groupedCycles = useMemo(() => {
    const now = Date.now();
    
    // Group all bookings by (blockId + startDate)
    const groups: Record<string, { blockId: string, startDate: number, bookings: BlockBooking[] }> = {};
    
    blockBookings.forEach(bb => {
      const key = `${bb.blockId}-${bb.startDate}`;
      if (!groups[key]) groups[key] = { blockId: bb.blockId, startDate: bb.startDate, bookings: [] };
      groups[key].bookings.push(bb);
    });

    return Object.values(groups).filter(group => {
      const blockDef = blocks.find(b => b.id === group.blockId);
      if (!blockDef) return false;
      if (selectedFacilityId !== 'all' && blockDef.facilityId !== selectedFacilityId) return false;
      if (search && !blockDef.name.toLowerCase().includes(search.toLowerCase())) return false;

      const endDate = group.startDate + (blockDef.numWeeks * 7 * 86400000);
      
      // Categorization
      // If cycleStatus is 'cancelled', we show cycles that have at least one cancelled booking
      if (cycleStatus === 'cancelled') {
        return group.bookings.some(b => b.status === 'cancelled');
      }

      // Otherwise filter by cycle timeframe
      // Note: Only show active bookings for timeframe categories
      const activeInGroup = group.bookings.filter(b => b.status !== 'cancelled');
      if (activeInGroup.length === 0) return false;

      if (cycleStatus === 'upcoming') return group.startDate > now;
      if (cycleStatus === 'ongoing') return group.startDate <= now && endDate >= now;
      if (cycleStatus === 'completed') return endDate < now;

      return false;
    }).sort((a, b) => a.startDate - b.startDate);
  }, [blockBookings, blocks, selectedFacilityId, search, cycleStatus]);

  const filteredDesigns = blocks.filter(b => {
    if (selectedFacilityId !== 'all' && b.facilityId !== selectedFacilityId) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEditDesign = (b: Block) => {
    setEditingBlock(b);
    setIsFormOpen(true);
  };

  const handleSaveDesign = (data: any) => {
    if (editingBlock) onUpdateBlock(editingBlock.id, data);
    else onAddBlock(data);
    setIsFormOpen(false);
    setEditingBlock(null);
  };

  const confirmDeleteDesign = () => {
    if (deletingDesignId) {
      // Check if any bookings exist for this design
      const hasBookings = blockBookings.some(bb => bb.blockId === deletingDesignId);
      if (hasBookings) {
        showToast("Cannot delete: Block design has active enrollments.", "error");
      } else {
        onDeleteBlock(deletingDesignId);
        showToast("Block design archived", "info");
      }
      setDeletingDesignId(null);
    }
  };

  const handleCancelBooking = (booking: BlockBooking) => {
    const parentBlock = blocks.find(b => b.id === booking.blockId);
    if (!parentBlock) return;

    const isEligible = (parentBlock.startDate - Date.now()) >= (48 * 60 * 60 * 1000);
    const updates: Partial<BlockBooking> = { status: 'cancelled', cancelledAt: Date.now() };
    
    if (isEligible && booking.paymentStatus === 'paid') {
      updates.paymentStatus = 'refunded';
    }

    onUpdateBlockBooking(booking.id, updates);
    showToast(`Enrollment cancelled. ${isEligible ? 'Refund eligible.' : 'Policy: Non-refundable.'}`, "info");
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
                className="text-xl md:text-2xl font-black bg-transparent outline-none cursor-pointer pr-10 appearance-none text-slate-900 uppercase tracking-tight"
              >
                <option value="all">All Facilities</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <ChevronRight className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
              <button 
                onClick={() => setActiveTab('cycles')}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cycles' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Purchased Cycles
              </button>
              <button 
                onClick={() => setActiveTab('designs')}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'designs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Block Designs
              </button>
            </div>
            {activeTab === 'designs' && (
              <button 
                onClick={() => { setEditingBlock(null); setIsFormOpen(true); }}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg uppercase tracking-tight"
              >
                <Plus className="w-4 h-4 mr-2 inline" /> New Design
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search block name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {activeTab === 'cycles' ? (
          <div className="space-y-6">
             <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {(['upcoming', 'ongoing', 'completed', 'cancelled'] as OperationalStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => setCycleStatus(status)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                      cycleStatus === status 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {status} Cycles
                  </button>
                ))}
             </div>

             <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[1100px]">
                      <thead>
                         <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                            <th className="px-6 py-5">Block Identity</th>
                            <th className="px-6 py-5">Cycle Weeks</th>
                            <th className="px-6 py-5">Schedule Specs</th>
                            <th className="px-6 py-5">Assigned Coach</th>
                            <th className="px-6 py-5">Hub Node</th>
                            <th className="px-6 py-5">Subscribers</th>
                            <th className="px-6 py-5 text-right">Ops</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                         {groupedCycles.length > 0 ? groupedCycles.map(group => {
                            const block = blocks.find(b => b.id === group.blockId);
                            const trainer = trainers.find(t => t.id === block?.trainerId);
                            const facility = facilities.find(f => f.id === block?.facilityId);
                            
                            // Filter bookings based on cycle status context
                            const displayBookings = cycleStatus === 'cancelled' 
                               ? group.bookings.filter(b => b.status === 'cancelled')
                               : group.bookings.filter(b => b.status !== 'cancelled');

                            return (
                               <tr 
                                 key={`${group.blockId}-${group.startDate}`} 
                                 className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                 onClick={() => setViewingCycleRoster({ blockId: group.blockId, startDate: group.startDate })}
                               >
                                  <td className="px-6 py-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                           <Layers className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="flex flex-col">
                                           <p className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-none mb-1.5">{block?.name}</p>
                                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">ID: {group.blockId.substr(0,8)}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-6">
                                     <p className="text-xs font-bold text-slate-700 uppercase">{block?.numWeeks} WEEK PROGRAM</p>
                                  </td>
                                  <td className="px-6 py-6">
                                     <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                                           <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                           <span>{new Date(group.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                           <Clock className="w-3.5 h-3.5 text-slate-300" />
                                           <span>{block?.startTime} • {block?.duration}</span>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-6">
                                     <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-slate-300" />
                                        <p className="text-xs font-bold text-slate-700 uppercase">{trainer?.name}</p>
                                     </div>
                                  </td>
                                  <td className="px-6 py-6">
                                     <div className="flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                        <p className="text-xs font-bold text-slate-700 uppercase">{facility?.name}</p>
                                     </div>
                                  </td>
                                  <td className="px-6 py-6">
                                     <div className="flex items-center gap-2 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100 shadow-inner">
                                        <Users className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="font-black text-slate-900 text-xs">{displayBookings.length}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-6 text-right">
                                     <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:text-blue-600 group-hover:bg-blue-50 transition-all border border-transparent group-hover:border-blue-100 shadow-xs">
                                        <ChevronRight className="w-4 h-4" />
                                     </div>
                                  </td>
                               </tr>
                            );
                         }) : (
                            <tr><td colSpan={7} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/10">Zero Cycles Found in this category</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredDesigns.map(b => {
              const trainer = trainers.find(t => t.id === b.trainerId);
              const fac = facilities.find(f => f.id === b.facilityId);
              return (
                <div key={b.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group text-left">
                  <div className="p-6 flex-1 flex flex-col space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-[20px] shadow-inner">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingBlockDesign(b)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-xs"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEditDesign(b)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-xs"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeletingDesignId(b.id)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition-all shadow-xs"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-1">{b.name}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        <Building2 className="w-3 h-3" />
                        {fac?.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2">
                       <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Coach</p>
                          <p className="font-black text-slate-900 text-[10px] uppercase truncate">{trainer?.name || 'TBA'}</p>
                       </div>
                       <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Term</p>
                          <p className="font-black text-slate-900 text-[10px] uppercase">{b.numWeeks} WEEKS</p>
                       </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{b.about}"</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Cost</p>
                        <span className="text-2xl font-black text-blue-600 tracking-tighter leading-none">${b.totalAmount.toFixed(2)}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-xs ${b.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{b.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Roster Detailed View Modal */}
      {viewingCycleRoster && (
        <div className="fixed inset-0 z-[200] overflow-hidden flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingCycleRoster(null)}></div>
           <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Cohort Specification</p>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
                       {blocks.find(b => b.id === viewingCycleRoster.blockId)?.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Cycle Start: {new Date(viewingCycleRoster.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
                 <button onClick={() => setViewingCycleRoster(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Financial Value</th>
                          <th className="px-6 py-4">Ledger Status</th>
                          <th className="px-6 py-4">Refund Policy</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {blockBookings.filter(bb => bb.blockId === viewingCycleRoster.blockId && bb.startDate === viewingCycleRoster.startDate).map(bb => {
                          const isCancelled = bb.status === 'cancelled';
                          const isRefunded = bb.paymentStatus === 'refunded';
                          const blockStartTime = viewingCycleRoster.startDate;
                          const cancelTime = bb.cancelledAt || Date.now();
                          const isEligible = (blockStartTime - cancelTime) >= (48 * 60 * 60 * 1000);

                          return (
                             <tr key={bb.id} className={`text-sm ${isCancelled ? 'opacity-60 bg-slate-50/30' : ''}`}>
                                <td className="px-6 py-5">
                                   <div className="text-left overflow-hidden">
                                      <p className="font-bold text-slate-900 uppercase text-xs truncate leading-none mb-1">{bb.userName}</p>
                                      <p className="text-[9px] font-bold text-slate-400 truncate">{bb.userEmail}</p>
                                   </div>
                                </td>
                                <td className="px-6 py-5">
                                   <p className="font-black text-slate-900 text-xs tracking-tighter">${bb.amount.toFixed(2)}</p>
                                </td>
                                <td className="px-6 py-5">
                                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                      bb.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' :
                                      bb.paymentStatus === 'refunded' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                      'bg-red-50 text-red-700 border-red-100'
                                   }`}>{bb.paymentStatus || 'unknown'}</span>
                                </td>
                                <td className="px-6 py-5">
                                   {isCancelled ? (
                                      isRefunded ? (
                                         <span className="text-[9px] font-black text-green-600 uppercase">Refunded Complete</span>
                                      ) : isEligible ? (
                                         <button 
                                           onClick={() => { onUpdateBlockBooking(bb.id, { paymentStatus: 'refunded' }); showToast("Refund synchronized", "success"); }}
                                           className="px-2 py-1 bg-blue-600 text-white rounded text-[8px] font-black uppercase shadow-sm active:scale-95 transition-all"
                                         >
                                            Initiate Refund
                                         </button>
                                      ) : (
                                         <span className="text-[9px] font-black text-red-400 uppercase">Not Eligible</span>
                                      )
                                   ) : (
                                      <span className="text-[8px] font-bold text-slate-300 uppercase italic">Active Node</span>
                                   )}
                                </td>
                                <td className="px-6 py-5 text-right">
                                   {!isCancelled && (
                                      <button 
                                        onClick={() => handleCancelBooking(bb)}
                                        className="p-2 text-slate-300 hover:text-red-600 border border-slate-100 hover:border-red-100 rounded-lg transition-all"
                                        title="Cancel Enrollment"
                                      >
                                         <Ban className="w-4 h-4" />
                                      </button>
                                   )}
                                   {isCancelled && (
                                      <div className="p-2 text-slate-200">
                                         <ShieldAlert className="w-4 h-4" />
                                      </div>
                                   )}
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
              
              <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-blue-600" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enrollment Audit Policy: Cancellations are final once synchronized.</p>
                 </div>
                 <button onClick={() => setViewingCycleRoster(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">Close Audit</button>
              </div>
           </div>
        </div>
      )}

      {isFormOpen && (
        <BlockFormModal 
          block={editingBlock} 
          facilities={facilities} 
          trainers={trainers}
          initialFacilityId={selectedFacilityId === 'all' ? facilities[0]?.id : selectedFacilityId}
          onClose={() => { setIsFormOpen(false); setEditingBlock(null); }} 
          onSave={handleSaveDesign} 
        />
      )}

      {viewingBlockDesign && (
        <BlockViewModal 
          block={viewingBlockDesign}
          facilityName={facilities.find(f => f.id === viewingBlockDesign.facilityId)?.name || ''}
          trainerName={trainers.find(t => t.id === viewingBlockDesign.trainerId)?.name || ''}
          onClose={() => setViewingBlockDesign(null)}
        />
      )}

      {deletingDesignId && (
        <ConfirmationModal
          title="Archive Block Design?"
          message="This action removes the template from the network. It will not delete existing purchased cycles."
          confirmText="Yes, Archive"
          variant="danger"
          onConfirm={confirmDeleteDesign}
          onCancel={() => setDeletingDesignId(null)}
        />
      )}
    </div>
  );
};

export default BlocksView;