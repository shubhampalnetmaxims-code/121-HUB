import React, { useState, useEffect } from 'react';
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

const ImageSlider = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-blue-600">
      <Dumbbell className="w-10 h-10" />
    </div>
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          alt="Facility Hub"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${idx === current ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Network Hubs</p>
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
            className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm group"
          >
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
              <ImageSlider images={f.galleryImages} />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

              <button 
                className="absolute top-4 right-4 p-2.5 rounded-lg bg-white/90 backdrop-blur shadow-md text-slate-900 transition-all active:scale-90 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowInfo(f);
                }}
              >
                <Info className="w-4 h-4" />
              </button>

              <div className="absolute bottom-6 left-6 pointer-events-none">
                <h4 className="text-white font-bold text-2xl tracking-tighter leading-none mb-1 uppercase">{f.name}</h4>
                <div className="flex items-center gap-1.5 text-white/70 text-[9px] font-black uppercase tracking-[0.2em]">
                   <MapPin className="w-2.5 h-2.5 text-blue-400" /> 121 Wellness Network
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-white">
               <div className="flex -space-x-2">
                 {/* Decorative feature icons */}
                 {f.features.slice(0, 3).map(feat => (
                   <div key={feat} className="w-7 h-7 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center shadow-sm">
                     <Dumbbell className="w-3 h-3 text-slate-300" />
                   </div>
                 ))}
               </div>
               <button 
                onClick={() => navigate(`/app/facility/${f.id}`)}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-sm"
               >
                 Explore
                 <ArrowRight className="w-3.5 h-3.5" />
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