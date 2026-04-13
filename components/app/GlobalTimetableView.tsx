
import React, { useState, useMemo } from 'react';
import { Facility, Class, Trainer, Location, ClassSlot, User, Booking, UserPass, Pass, RewardSettings } from '../../types';
import AppTimetableView from './AppTimetableView';
import { Layout, Search, MapPin, ChevronRight } from 'lucide-react';

interface GlobalTimetableViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  classSlots: ClassSlot[];
  onAuthTrigger: () => void;
  currentUser: User | null;
  onAddBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  userPasses: UserPass[];
  availablePasses: Pass[];
  onBuyPass: (p: Pass) => void;
  onUsePass: (userPassId: string, credits: number) => void;
  rewardSettings: RewardSettings;
  onRedeemPoints: (points: number, source: string, refId: string) => void;
}

const GlobalTimetableView: React.FC<GlobalTimetableViewProps> = (props) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacilities = useMemo(() => {
    return props.facilities.filter(f => 
      f.isActive && 
      f.features?.includes('timetable') &&
      (f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       f.location?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [props.facilities, searchQuery]);

  const selectedFacility = useMemo(() => {
    return props.facilities.find(f => f.id === selectedFacilityId);
  }, [props.facilities, selectedFacilityId]);

  if (selectedFacility) {
    return (
      <div className="h-full relative">
        <AppTimetableView 
          {...props} 
          facility={selectedFacility} 
        />
        <button 
          onClick={() => setSelectedFacilityId(null)}
          className="absolute top-14 right-6 p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm z-[60] text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          Switch Hub
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Timetable</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Select a facility to view sessions</p>
      </div>

      <div className="p-4 bg-white border-b border-slate-100 shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 scrollbar-hide">
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map(f => (
            <button 
              key={f.id}
              onClick={() => setSelectedFacilityId(f.id)}
              className="w-full bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all text-left group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-50">
                <img src={f.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={f.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1 uppercase truncate">{f.name}</h3>
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate">{f.location || '121 Wellness Network'}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 shadow-sm">
              <Layout className="w-10 h-10" />
            </div>
            <p className="text-slate-400 font-bold">No facilities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalTimetableView;
