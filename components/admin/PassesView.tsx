
import React, { useState, useMemo } from 'react';
import { Plus, Menu, Ticket, Edit3, Trash2, Search, ChevronRight, Eye, Users, Mail, User as UserIcon, Calendar, Layers, Ban, CheckCircle, Filter, DollarSign, Clock, Building2 } from 'lucide-react';
import { Facility, Pass, Class, UserPass, User, Booking, Trainer } from '../../types';
import PassFormModal from './PassFormModal';
import PassViewModal from './PassViewModal';
import SoldPassDetailModal from './SoldPassDetailModal';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../ToastContext';

interface PassesViewProps {
  facilities: Facility[];
  classes: Class[];
  passes: Pass[];
  userPasses: UserPass[];
  users: User[];
  bookings: Booking[];
  trainers: Trainer[];
  onAddPass: (p: any) => void;
  onUpdatePass: (id: string, updates: any) => void;
  onDeletePass: (id: string) => void;
  onUpdateUserPass: (id: string, updates: Partial<UserPass>) => void;
  onDeleteUserPass: (id: string) => void;
  onOpenSidebar: () => void;
}

const PassesView: React.FC<PassesViewProps> = ({ 
  facilities, classes, trainers, passes, userPasses, users, bookings,
  onAddPass, onUpdatePass, onDeletePass, onUpdateUserPass, onDeleteUserPass, onOpenSidebar 
}) => {
  const { showToast } = useToast();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPass, setEditingPass] = useState<Pass | null>(null);
  const [viewingPass, setViewingPass] = useState<Pass | null>(null);
  const [viewingSoldPass, setViewingSoldPass] = useState<UserPass | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'designs' | 'sold'>('sold');

  const filteredPasses = useMemo(() => {
    return passes.filter(p => {
      if (selectedFacilityId !== 'all' && p.facilityId !== selectedFacilityId) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [passes, selectedFacilityId, search]);

  const filteredSoldPasses = useMemo(() => {
    return userPasses.filter(up => {
      if (selectedFacilityId !== 'all' && up.facilityId !== selectedFacilityId) return false;
      const user = users.find(u => u.id === up.userId);
      if (search) {
        const query = search.toLowerCase();
        const matches = user?.fullName.toLowerCase().includes(query) || user?.email.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => b.purchasedAt - a.purchasedAt);
  }, [userPasses, selectedFacilityId, search, users]);

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

  const handleToggleBlock = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    onUpdateUserPass(id, { status: newStatus as any });
    showToast(`Pass ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`, 'info');
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
                onClick={() => setActiveTab('sold')}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sold' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sold Passes
              </button>
              <button 
                onClick={() => setActiveTab('designs')}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'designs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Pass Designs
              </button>
            </div>
            {activeTab === 'designs' && (
              <button 
                onClick={() => { setEditingPass(null); setIsFormOpen(true); }}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg uppercase tracking-tight"
              >
                <Plus className="w-4 h-4 mr-2 inline" /> Add Pass
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
              placeholder={activeTab === 'designs' ? "Search designs..." : "Search by Customer Name or Email..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {activeTab === 'designs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredPasses.map(p => (
              <div key={p.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all text-left">
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-[20px] shadow-inner"><Ticket className="w-6 h-6" /></div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setViewingPass(p)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                       <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => setDeletingId(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-1">{p.name}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                       <Building2 className="w-3 h-3" />
                       {facilities.find(f => f.id === p.facilityId)?.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Credits</p>
                      <p className="font-black text-slate-900 text-sm">{p.credits} SESSIONS</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Scope</p>
                      <p className="font-black text-slate-900 text-[10px] uppercase truncate">{p.isAllClasses ? 'Unlimited' : `${p.allowedClassIds.length} Classes`}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium flex-1 italic">"{p.description}"</p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                      <span className="text-2xl font-black text-blue-600 tracking-tighter leading-none">${p.price.toFixed(2)}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-xs ${p.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                   <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                         <th className="px-6 py-5">Customer Record</th>
                         <th className="px-6 py-5">Facility</th>
                         <th className="px-6 py-5">Purchased Date</th>
                         <th className="px-6 py-5">Credit Balance</th>
                         <th className="px-6 py-5">Economic Ledger</th>
                         <th className="px-6 py-5">System Status</th>
                         <th className="px-6 py-5 text-right">Ops</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredSoldPasses.length > 0 ? filteredSoldPasses.map(up => {
                         const user = users.find(u => u.id === up.userId);
                         const fac = facilities.find(f => f.id === up.facilityId);
                         return (
                            <tr key={up.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setViewingSoldPass(up)}>
                               <td className="px-6 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                        <UserIcon className="w-5 h-5 text-slate-300" />
                                     </div>
                                     <div className="flex flex-col">
                                        <p className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-none mb-1.5">{user?.fullName || 'Unknown'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{user?.email}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="flex items-center gap-2">
                                     <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                     <p className="text-xs font-bold text-slate-700 uppercase">{fac?.name || 'Hub'}</p>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                     <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                     <span className="uppercase">{new Date(up.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="space-y-1.5">
                                     <div className="flex items-center gap-2">
                                        <p className="font-black text-slate-900 text-sm leading-none">{up.remainingCredits}</p>
                                        <span className="text-slate-300 font-bold text-[10px]">/ {up.totalCredits}</span>
                                     </div>
                                     <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600" style={{ width: `${(up.remainingCredits / up.totalCredits) * 100}%` }} />
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="flex flex-col gap-1">
                                     <p className="font-black text-slate-900 text-sm tracking-tighter leading-none">${up.pricePaid?.toFixed(2) || '0.00'}</p>
                                     <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border w-fit ${
                                        up.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 
                                        up.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                        'bg-red-50 text-red-700 border-red-100'
                                     }`}>{up.paymentStatus || 'unknown'}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                     up.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                     up.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                                     up.status === 'exhausted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                     'bg-slate-50 text-slate-500 border-slate-200'
                                  }`}>{up.status}</span>
                               </td>
                               <td className="px-6 py-6 text-right">
                                  <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                     <button 
                                        onClick={() => handleToggleBlock(up.id, up.status)}
                                        className={`w-9 h-9 rounded-xl transition-all border flex items-center justify-center ${
                                           up.status === 'blocked' ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'
                                        }`}
                                        title={up.status === 'blocked' ? 'Unblock Pass' : 'Block Pass'}
                                     >
                                        {up.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                     </button>
                                     <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 border border-transparent transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                     </div>
                                  </div>
                               </td>
                            </tr>
                         );
                      }) : (
                         <tr><td colSpan={7} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/10">Zero Sales Records Found</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <PassFormModal pass={editingPass} facilities={facilities} classes={classes} initialFacilityId={selectedFacilityId === 'all' ? facilities[0]?.id : selectedFacilityId} onClose={() => setIsFormOpen(false)} onSave={handleSave} />
      )}

      {viewingPass && (
        <PassViewModal pass={viewingPass} facilityName={facilities.find(f => f.id === viewingPass.facilityId)?.name || ''} classes={classes} onClose={() => setViewingPass(null)} />
      )}

      {viewingSoldPass && (
        <SoldPassDetailModal
          userPass={viewingSoldPass}
          user={users.find(u => u.id === viewingSoldPass.userId)}
          facility={facilities.find(f => f.id === viewingSoldPass.facilityId)}
          classes={classes}
          bookings={bookings}
          trainers={trainers}
          onClose={() => setViewingSoldPass(null)}
          onToggleBlock={handleToggleBlock}
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Archive Pass Design?"
          message="Are you sure you want to remove this pass design? This will not affect already sold passes but will hide the design from the mobile app."
          confirmText="Yes, Archive"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default PassesView;
