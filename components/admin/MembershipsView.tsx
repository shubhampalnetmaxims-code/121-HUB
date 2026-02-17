import React, { useState, useMemo } from 'react';
import { Plus, Menu, CreditCard, Edit3, Trash2, Search, ChevronRight, Eye, Clock, Calendar, Users, Mail, User as UserIcon, Ban, CheckCircle, Percent, Gift, Building2 } from 'lucide-react';
import { Facility, Membership, UserMembership, User, DAYS_OF_WEEK } from '../../types';
import MembershipFormModal from './MembershipFormModal';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../ToastContext';

interface MembershipsViewProps {
  facilities: Facility[];
  memberships: Membership[];
  userMemberships: UserMembership[];
  users: User[];
  onAddMembership: (m: any) => void;
  onUpdateMembership: (id: string, updates: any) => void;
  onDeleteMembership: (id: string) => void;
  onUpdateUserMembership: (id: string, updates: Partial<UserMembership>) => void;
  onOpenSidebar: () => void;
}

const MembershipsView: React.FC<MembershipsViewProps> = ({ 
  facilities, memberships, userMemberships, users, onAddMembership, onUpdateMembership, onDeleteMembership, onUpdateUserMembership, onOpenSidebar 
}) => {
  const { showToast } = useToast();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'plans' | 'subscribers'>('subscribers');

  const filteredMemberships = useMemo(() => {
    return memberships.filter(m => {
      if (selectedFacilityId !== 'all' && m.facilityId !== selectedFacilityId) return false;
      if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [memberships, selectedFacilityId, search]);

  const filteredSubscribers = useMemo(() => {
    return userMemberships.filter(um => {
      if (selectedFacilityId !== 'all' && um.facilityId !== selectedFacilityId) return false;
      const user = users.find(u => u.id === um.userId);
      if (search) {
        const query = search.toLowerCase();
        const matches = user?.fullName.toLowerCase().includes(query) || 
                        user?.email.toLowerCase().includes(query) || 
                        um.title.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => b.purchasedAt - a.purchasedAt);
  }, [userMemberships, selectedFacilityId, search, users]);

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

  const handleToggleBlock = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    onUpdateUserMembership(id, { status: newStatus as any });
    showToast(`Membership ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`, 'info');
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
                onClick={() => setActiveTab('subscribers')}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'subscribers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Subscribers
              </button>
              <button 
                onClick={() => setActiveTab('plans')}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'plans' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Plan Designs
              </button>
            </div>
            {activeTab === 'plans' && (
              <button 
                onClick={() => { setEditingMembership(null); setIsFormOpen(true); }}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg uppercase tracking-tight"
              >
                <Plus className="w-4 h-4 mr-2 inline" /> Add Plan
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
              placeholder={activeTab === 'plans' ? "Search plans..." : "Search by name, email or plan..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {activeTab === 'plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredMemberships.map(m => {
              const fac = facilities.find(f => f.id === m.facilityId);
              return (
                <div key={m.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group text-left">
                  <div className="p-6 flex-1 flex flex-col space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-[20px] shadow-inner">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(m)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-xs"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeletingId(m.id)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition-all shadow-xs"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-1">{m.title}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        <Building2 className="w-3 h-3" />
                        {fac?.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Term</p>
                        <p className="font-black text-slate-900 text-xs">{m.durationDays} DAYS</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hours</p>
                        <p className="font-black text-slate-900 text-[10px] uppercase truncate">
                          {m.allow24Hour ? '24/7 Access' : `${m.startTime} - ${m.endTime}`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Access Schedule</p>
                      <div className="flex flex-wrap gap-1">
                        {DAYS_OF_WEEK.map((day, idx) => (
                          <span key={day} className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${m.daysOfWeek.includes(idx) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                            {day.substr(0, 1)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2" dangerouslySetInnerHTML={{ __html: m.description }} />
                      
                      <div className="flex flex-wrap gap-2">
                        {m.directDiscountEnabled && (
                          <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                            <Percent className="w-3 h-3 text-green-600" />
                            <span className="text-[9px] font-black text-green-600 uppercase">Save {m.directDiscountType === 'flat' ? `$${m.directDiscountValue}` : `${m.directDiscountValue}%`}</span>
                          </div>
                        )}
                        {m.rewardPointsEnabled && (
                          <div className="flex items-center gap-1.5 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
                            <Gift className="w-3 h-3 text-purple-600" />
                            <span className="text-[9px] font-black text-purple-600 uppercase">+{m.rewardPointsValue} Pts</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Fee</p>
                        <span className="text-2xl font-black text-blue-600 tracking-tighter leading-none">${m.price.toFixed(2)}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-xs ${m.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{m.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                   <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                         <th className="px-6 py-5">Customer Record</th>
                         <th className="px-6 py-5">Facility</th>
                         <th className="px-6 py-5">Plan Chosen</th>
                         <th className="px-6 py-5">Active Term</th>
                         <th className="px-6 py-5">Amount</th>
                         <th className="px-6 py-5">Status</th>
                         <th className="px-6 py-5 text-right">Ops</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredSubscribers.length > 0 ? filteredSubscribers.map(um => {
                         const user = users.find(u => u.id === um.userId);
                         const fac = facilities.find(f => f.id === um.facilityId);
                         const daysRemaining = Math.ceil((um.endDate - Date.now()) / (1000 * 60 * 60 * 24));
                         return (
                            <tr key={um.id} className="hover:bg-slate-50/50 transition-colors group">
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
                                  <div className="flex flex-col gap-1">
                                     <p className="font-bold text-slate-900 text-xs uppercase tracking-tight">{um.title}</p>
                                     <code className="text-[8px] font-mono text-slate-400">ID: {um.id.substr(0,8)}</code>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="flex flex-col gap-1">
                                     <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                                        <Calendar className="w-3 h-3 text-slate-300" />
                                        <span>{new Date(um.startDate).toLocaleDateString('en-GB')} - {new Date(um.endDate).toLocaleDateString('en-GB')}</span>
                                     </div>
                                     <p className={`text-[9px] font-black uppercase tracking-widest ${daysRemaining > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                                        {daysRemaining > 0 ? `${daysRemaining} Days Remaining` : 'Term Expired'}
                                     </p>
                                  </div>
                               </td>
                               <td className="px-6 py-6 text-left">
                                  <div className="flex flex-col gap-1">
                                     <p className="font-black text-slate-900 text-sm tracking-tighter leading-none">${um.price.toFixed(2)}</p>
                                     <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border w-fit ${
                                        um.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 
                                        um.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                        'bg-red-50 text-red-700 border-red-100'
                                     }`}>{um.paymentStatus || 'unknown'}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                     um.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                     um.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                                     um.status === 'cancelled' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                     'bg-slate-50 text-slate-500 border-slate-200'
                                  }`}>{um.status}</span>
                               </td>
                               <td className="px-6 py-6 text-right">
                                  <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                     <button 
                                        onClick={() => handleToggleBlock(um.id, um.status)}
                                        className={`w-9 h-9 rounded-xl transition-all border flex items-center justify-center ${
                                           um.status === 'blocked' ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'
                                        }`}
                                        title={um.status === 'blocked' ? 'Unblock Member' : 'Block Member'}
                                     >
                                        {um.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
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
        <MembershipFormModal 
          membership={editingMembership} 
          facilities={facilities} 
          initialFacilityId={selectedFacilityId === 'all' ? facilities[0]?.id : selectedFacilityId} 
          onClose={() => { setIsFormOpen(false); setEditingMembership(null); }} 
          onSave={handleSave} 
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Archive Plan Design?"
          message="Are you sure you want to remove this membership plan? Existing subscribers will keep their terms, but no new enrollments will be allowed."
          confirmText="Yes, Archive"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default MembershipsView;