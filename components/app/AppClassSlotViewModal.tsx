import React, { useState } from 'react';
import { X, Clock, MapPin, User, BookOpen, UserPlus, ShieldCheck, DollarSign, Ticket, Check } from 'lucide-react';
import { ClassSlot, Class, Trainer, Location, User as UserType, Booking, UserPass, Pass, RewardSettings } from '../../types';
import { useToast } from '../ToastContext';
import { useNotifications } from '../NotificationContext';
import BookingPreviewModal from './BookingPreviewModal';

interface AppClassSlotViewModalProps {
  slot: ClassSlot;
  cls: Class | undefined;
  trainer: Trainer | undefined;
  location: Location | undefined;
  onClose: () => void;
  onAuthTrigger: () => void;
  currentUser: UserType | null;
  onAddBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  userPasses: UserPass[];
  availablePasses: Pass[];
  onBuyPass: (p: Pass) => void;
  onUsePass: (userPassId: string, credits: number) => void;
  // Added reward properties
  rewardSettings: RewardSettings;
  onRedeemPoints: (points: number, source: string, refId: string) => void;
}

const LoginPromptModal = ({ onLogin, onCancel }: { onLogin: () => void, onCancel: () => void }) => (
  <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
    <div className="bg-white rounded-[40px] p-8 text-center space-y-6 max-w-xs shadow-2xl">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Authentication Required</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">Please log in to your 121 account to complete this booking.</p>
      <div className="space-y-3">
        <button onClick={onLogin} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Log In & Proceed</button>
        <button onClick={onCancel} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Maybe Later</button>
      </div>
    </div>
  </div>
);

const AppClassSlotViewModal: React.FC<AppClassSlotViewModalProps> = ({ 
  slot, cls, trainer, location, onClose, onAuthTrigger, currentUser, onAddBooking, onUpdateUser,
  userPasses, availablePasses, onBuyPass, onUsePass,
  rewardSettings, onRedeemPoints // Destructured new props
}) => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const isPersonalTraining = cls?.name === 'Personal Training';
  const [personCount, setPersonCount] = useState(1);
  const [names, setNames] = useState<string[]>(['']);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  // Pass Selection States
  const [selectedUserPassId, setSelectedUserPassId] = useState<string>('');
  const [selectedNewPassId, setSelectedNewPassId] = useState<string>('');
  
  const MAX_PER_PERSON = isPersonalTraining ? 1 : 4;

  const validUserPasses = userPasses.filter(up => {
    if (up.userId !== currentUser?.id) return false;
    if (up.facilityId !== slot.facilityId) return false;
    if (up.status !== 'active' || up.remainingCredits < personCount) return false;
    if (!up.isAllClasses && !up.allowedClassIds.includes(slot.classId)) return false;
    if (up.personsPerBooking < personCount) return false;
    return true;
  });

  const validAvailablePasses = availablePasses.filter(p => {
    if (p.facilityId !== slot.facilityId || p.status !== 'active') return false;
    if (!p.isAllClasses && !p.allowedClassIds.includes(slot.classId)) return false;
    if (p.personsPerBooking < personCount) return false;
    return true;
  });

  const handlePersonCountChange = (count: number) => {
    if (isPersonalTraining) return;
    const newCount = Math.max(1, Math.min(count, MAX_PER_PERSON));
    setPersonCount(newCount);
    const newNames = [...names];
    if (newCount > names.length) {
      for (let i = names.length; i < newCount; i++) newNames.push('');
    } else {
      newNames.length = newCount;
    }
    setNames(newNames);
    
    // Reset pass selections as they might now be invalid due to person count
    setSelectedUserPassId('');
    setSelectedNewPassId('');
  };

  const handlePreview = () => {
    if (names.some(n => !n.trim())) {
      showToast("Please enter names for all participants", "error");
      return;
    }
    
    if (!currentUser) {
      setIsLoginPromptOpen(true);
    } else {
      setIsPreviewOpen(true);
    }
  };

  const handleBookingComplete = () => {
    setIsBooked(true);
    setIsPreviewOpen(false);
  };

  if (isBooked) {
    return (
      <div className="absolute inset-0 z-[80] bg-white flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[32px] flex items-center justify-center mb-8 animate-bounce">
          <BookOpen className="w-10 h-10" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Booking Confirmed!</h3>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">You're all set for <b>{cls?.name}</b> at {slot.startTime}. See you there!</p>
        <button onClick={onClose} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-[0.98] transition-all">Done</button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[80] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
      <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="text-left">
          <h3 className="text-xl font-bold tracking-tight">Session Information</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserve Your Spot</p>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide text-left">
        <section className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">{cls?.name || 'Unknown'}</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                  slot.status === 'available' ? 'bg-green-100 text-green-600' : 
                  slot.status === 'full' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {slot.status === 'available' ? 'Open for Booking' : slot.status === 'full' ? 'Fully Booked' : slot.status}
                </span>
                <span className="text-slate-300 text-xs font-bold">•</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tight">{cls?.level}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            {cls?.shortDescription || 'No description available for this session.'}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-[28px]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Schedule</p>
            </div>
            <p className="font-extrabold text-slate-900 leading-none mb-1">{slot.startTime}</p>
            <p className="text-[10px] font-bold text-slate-500">{slot.duration}</p>
          </div>
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-[28px]">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Area</p>
            </div>
            <p className="font-extrabold text-slate-900 leading-none mb-1">{location?.name || 'TBA'}</p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">On-site</p>
          </div>
          {cls?.pricePerSession !== undefined && !selectedUserPassId && !selectedNewPassId && (
            <div className="p-5 bg-blue-50 border border-blue-100 rounded-[28px] col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">Pricing</p>
              </div>
              <p className="font-extrabold text-slate-900 leading-none">${cls.pricePerSession}</p>
              <p className="text-[10px] font-bold text-slate-500">Per Session / Participant</p>
            </div>
          )}
        </div>

        {/* Pass Suggestions Selection */}
        {currentUser && (validUserPasses.length > 0 || validAvailablePasses.length > 0) && (
          <section className="space-y-4">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Method Selection</h5>
             
             {/* Use Existing Pass */}
             {validUserPasses.length > 0 && (
               <div className="space-y-2">
                 <p className="text-[8px] font-black text-slate-300 uppercase px-1">Use Existing Credits</p>
                 {validUserPasses.map(up => (
                   <button 
                    key={up.id} 
                    onClick={() => { setSelectedUserPassId(up.id); setSelectedNewPassId(''); }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedUserPassId === up.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}
                   >
                     <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-blue-600" />
                        <div className="text-left">
                          <p className="font-bold text-sm text-slate-900 leading-none mb-1">{up.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Credits: {up.remainingCredits} / {up.totalCredits}</p>
                        </div>
                     </div>
                     {selectedUserPassId === up.id && <Check className="w-4 h-4 text-blue-600" />}
                   </button>
                 ))}
               </div>
             )}

             {/* Buy New Pass */}
             {validAvailablePasses.length > 0 && (
               <div className="space-y-2">
                 <p className="text-[8px] font-black text-slate-300 uppercase px-1">Buy New Pass & Book</p>
                 {validAvailablePasses.map(p => (
                   <button 
                    key={p.id} 
                    onClick={() => { setSelectedNewPassId(p.id); setSelectedUserPassId(''); }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedNewPassId === p.id ? 'border-green-600 bg-green-50' : 'border-slate-100 bg-white'}`}
                   >
                     <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-green-600" />
                        <div className="text-left">
                          <p className="font-bold text-sm text-slate-900 leading-none mb-1">{p.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{p.credits} Credits • ${p.price}</p>
                        </div>
                     </div>
                     {selectedNewPassId === p.id && <Check className="w-4 h-4 text-green-600" />}
                   </button>
                 ))}
               </div>
             )}

             {/* Standard Pay Button */}
             {(selectedUserPassId || selectedNewPassId) && (
                <button 
                  onClick={() => { setSelectedUserPassId(''); setSelectedNewPassId(''); }}
                  className="w-full py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center"
                >
                  Switch back to standard session price
                </button>
             )}
          </section>
        )}

        <section className="bg-slate-50 border border-slate-100 rounded-[32px] p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Your Coach</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0">
              {trainer?.profilePicture ? (
                <img src={trainer.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400"><User className="w-6 h-6" /></div>
              )}
            </div>
            <div className="text-left">
              <h6 className="font-extrabold text-slate-900 tracking-tight leading-none mb-1">{trainer?.name || 'TBA'}</h6>
              <p className="text-[9px] font-bold text-slate-50 uppercase tracking-widest">Professional</p>
            </div>
          </div>
        </section>

        {/* Booking Form - Only visible if not full */}
        {slot.status !== 'full' ? (
          <section className="space-y-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-black text-slate-900 tracking-tight uppercase">Reservation</h5>
                {!isPersonalTraining && (
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button onClick={() => handlePersonCountChange(personCount - 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600">-</button>
                    <span className="px-4 font-black text-slate-900 text-sm">{personCount}</span>
                    <button onClick={() => handlePersonCountChange(personCount + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600">+</button>
                  </div>
                )}
                {isPersonalTraining && (
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">1-on-1 Session</span>
                )}
            </div>

            <div className="space-y-3">
                {names.map((name, idx) => (
                  <div key={idx} className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder={`Participant ${idx + 1} Name`} 
                      value={name}
                      onChange={(e) => {
                        const newNames = [...names];
                        newNames[idx] = e.target.value;
                        setNames(newNames);
                      }}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                ))}
            </div>
          </section>
        ) : (
          <section className="pt-4 border-t border-slate-100">
            <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 text-center">
              <p className="text-xs font-black text-red-600 uppercase tracking-widest">Fully Booked</p>
              <p className="text-xs text-red-500/70 mt-1 font-medium">This session has reached its attendance limit. Please check other available times.</p>
            </div>
          </section>
        )}
      </div>

      <div className="p-6 pt-2 pb-10 border-t border-slate-50 bg-white/80 backdrop-blur-md sticky bottom-0 z-10 shrink-0">
        <button 
          onClick={handlePreview}
          disabled={slot.status === 'full'}
          className="w-full py-5 bg-blue-600 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {slot.status === 'full' ? 'Fully Booked' : 'Preview Booking'}
        </button>
      </div>

      {isLoginPromptOpen && (
        <LoginPromptModal 
          onLogin={onAuthTrigger}
          onCancel={() => setIsLoginPromptOpen(false)}
        />
      )}

      {isPreviewOpen && currentUser && (
        <BookingPreviewModal
          slot={slot}
          cls={cls}
          trainer={trainer}
          location={location}
          currentUser={currentUser}
          participantNames={names}
          onClose={() => setIsPreviewOpen(false)}
          onComplete={handleBookingComplete}
          onAddBooking={onAddBooking}
          onUpdateUser={onUpdateUser}
          selectedUserPass={userPasses.find(up => up.id === selectedUserPassId)}
          selectedNewPass={availablePasses.find(p => p.id === selectedNewPassId)}
          onBuyPass={onBuyPass}
          onUsePass={onUsePass}
          // Propagating reward props
          rewardSettings={rewardSettings}
          onRedeemPoints={onRedeemPoints}
        />
      )}
    </div>
  );
};

export default AppClassSlotViewModal;