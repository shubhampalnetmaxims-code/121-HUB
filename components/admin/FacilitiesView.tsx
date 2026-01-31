
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Dumbbell, ChevronRight, Edit3, Menu, Bell, XCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { Facility } from '../../types';
import { useNotifications } from '../NotificationContext';
import FacilityFormModal from './FacilityFormModal';
import AdminNotifications from './AdminNotifications';
import ConfirmationModal from './ConfirmationModal';

interface FacilitiesViewProps {
  facilities: Facility[];
  onAdd: (f: any) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onOpenSidebar: () => void;
}

const FacilitiesView: React.FC<FacilitiesViewProps> = ({ facilities, onAdd, onUpdate, onDelete, onOpenSidebar }) => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const unreadCount = notifications.filter(n => n.target === 'admin' && !n.isRead).length;

  const handleEdit = (f: Facility) => {
    setEditingFacility(f);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingFacility) onUpdate(editingFacility.id, data);
    else onAdd(data);
    setIsFormOpen(false);
    setEditingFacility(null);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Facility Network</h2>
              <p className="text-slate-500 text-xs font-medium">Manage location profiles and hub settings.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-md transition-all relative border border-slate-200 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white px-1">
                  {unreadCount}
                </div>
              )}
            </button>
            <button 
              onClick={() => { setEditingFacility(null); setIsFormOpen(true); }}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm uppercase tracking-tight"
            >
              <Plus className="w-4 h-4" />
              Add Facility
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-20">
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search facility name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4">Facility Details</th>
                  <th className="px-6 py-4 hidden md:table-cell">Policies</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`facility/${f.id}`)}>
                        {f.imageUrl ? (
                          <img src={f.imageUrl} className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-100 shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-blue-600"><Dumbbell className="w-5 h-5" /></div>
                        )}
                        <div className="text-left">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{f.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">Config & Modules <ChevronRight className="w-3 h-3" /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex gap-1.5">
                        <div title="Booking Cancellation" className={`p-1.5 rounded-md border ${f.settings?.canCancelBooking ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                           <XCircle className="w-3.5 h-3.5" />
                        </div>
                        <div title="Booking Rescheduling" className={`p-1.5 rounded-md border ${f.settings?.canRescheduleBooking ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                           <RefreshCw className="w-3.5 h-3.5" />
                        </div>
                        <div title="Order Cancellation" className={`p-1.5 rounded-md border ${f.settings?.canCancelOrder ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                           <ShoppingCart className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest ${f.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {f.isActive ? 'Active' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => handleEdit(f)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white rounded-md transition-all border border-slate-200 shadow-sm" title="Edit Profile"><Edit3 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <FacilityFormModal 
          facility={editingFacility} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
        />
      )}

      {isNotifOpen && (
        <AdminNotifications onClose={() => setIsNotifOpen(false)} />
      )}
    </>
  );
};

export default FacilitiesView;