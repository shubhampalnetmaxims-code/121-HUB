import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Dumbbell, Info, MapPin, ArrowRight } from 'lucide-react';
import { Facility, User } from '../../types';
import { useNotifications } from '../NotificationContext';
import NotificationListModal from './NotificationListModal';

interface HomeViewProps {
  facilities: Facility[];
  onShowInfo: (f: Facility) => void;
  currentUser?: User | null;
}

const HomeView: React.FC<HomeViewProps> = ({ facilities, onShowInfo, currentUser }) => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const filteredFacilities = facilities.filter(f => f.isActive);
  const userNotifs = notifications.filter(n => n.target === currentUser?.id);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="p-6 pt-10 flex justify-between items-center border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Facilities</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Locations</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-lg bg-slate-50 border border-slate-200"><Search className="w-4 h-4 text-slate-400" /></button>
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 relative"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6 scrollbar-hide">
        {filteredFacilities.map(f => (
          <div 
            key={f.id} 
            className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm"
          >
            <div className="relative aspect-video w-full bg-slate-100">
              {f.imageUrl ? (
                <img 
                  src={f.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt={f.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50/50">
                  <Dumbbell className="w-10 h-10" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              <button 
                className="absolute top-4 right-4 p-2.5 rounded-lg bg-white/90 backdrop-blur shadow-md text-slate-900 transition-all active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowInfo(f);
                }}
              >
                <Info className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6">
                <h4 className="text-white font-bold text-xl tracking-tight leading-none mb-1">{f.name}</h4>
                <div className="flex items-center gap-1.5 text-white/80 text-[9px] font-bold uppercase tracking-wider">
                   <MapPin className="w-2.5 h-2.5" /> 121 Wellness Network
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-white">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Hub</span>
               <button 
                onClick={() => navigate(`/app/facility/${f.id}`)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-black transition-all"
               >
                 Open Hub
                 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {isNotifOpen && (
        <NotificationListModal currentUser={currentUser || null} onClose={() => setIsNotifOpen(false)} />
      )}
    </div>
  );
};

export default HomeView;