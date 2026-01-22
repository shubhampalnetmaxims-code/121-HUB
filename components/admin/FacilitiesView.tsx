
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Dumbbell, ChevronRight, Edit3, Trash2, Menu, Bell } from 'lucide-react';
import { Facility } from '../../types';
import { useNotifications } from '../NotificationContext';
import FacilityFormModal from './FacilityFormModal';
import AdminNotifications from './AdminNotifications';

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
      <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Facility Network</h2>
              <p className="text-slate-500 text-xs md:text-sm">Manage location profiles and descriptions.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all relative border border-slate-100"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </div>
              )}
            </button>
            <button 
              onClick={() => { setEditingFacility(null); setIsFormOpen(true); }}
              className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <Plus className="w-5 h-5" />
              Add Facility
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Find a facility..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 md:px-8 py-5">Facility Details</th>
                  <th className="px-6 md:px-8 py-5 hidden md:table-cell">Modules</th>
                  <th className="px-6 md:px-8 py-5">Visibility</th>
                  <th className="px-6 md:px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 md:px-8 py-6">
                      <div className="flex items-center gap-4 md:gap-5 cursor-pointer" onClick={() => navigate(`facility/${f.id}`)}>
                        {f.imageUrl ? (
                          <img src={f.imageUrl} className="w-10 h-10 md:w-14 md:h-14 rounded-2xl object-cover ring-2 ring-slate-100" />
                        ) : (
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600"><Dumbbell className="w-6 h-6" /></div>
                        )}
                        <div className="text-left">
                          <div className="font-bold text-base md:text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{f.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-tight">Configure Features <ChevronRight className="w-3 h-3" /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-6 hidden md:table-cell">
                      <div className="flex gap-1.5 flex-wrap max-w-[240px]">
                        {f.features?.length > 0 ? f.features.map(feat => (
                          <span key={feat} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase" title={feat}>
                            {feat.charAt(0)}
                          </span>
                        )) : <span className="text-slate-300 text-xs italic">Minimal Hub</span>}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-6">
                      <span className={`px-3 md:px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${f.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {f.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 md:gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-x-2 lg:group-hover:translate-x-0">
                        <button onClick={() => handleEdit(f)} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 className="w-4 h-4 md:w-5 md:h-5" /></button>
                        <button onClick={() => onDelete(f.id)} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
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
