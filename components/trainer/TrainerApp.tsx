import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Trainer, ClassSlot, Booking, Class, Facility, Location as FacilityLocation } from '../../types';
import TrainerLogin from './TrainerLogin';
import TrainerHomeView from './TrainerHomeView';
import TrainerFacilityHub from './TrainerFacilityHub';
import TrainerTimetableView from './TrainerTimetableView';
import TrainerSlotDetailView from './TrainerSlotDetailView';
import TrainerBookingsTab from './TrainerBookingsTab';
import TrainerProfileSetup from './TrainerProfileSetup';
import TrainerProfileTab from './TrainerProfileTab';
import { Home, Calendar, User } from 'lucide-react';

interface TrainerAppProps {
  trainers: Trainer[];
  classSlots: ClassSlot[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  locations: FacilityLocation[];
  currentTrainer: Trainer | null;
  onTrainerLogin: (t: Trainer) => void;
  onTrainerLogout: () => void;
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
  onUpdateSlot: (id: string, updates: Partial<ClassSlot>) => void;
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
}

const TrainerBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40">
      <button onClick={() => navigate('/trainer/home')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/trainer/home') ? 'text-blue-600' : 'text-slate-400'}`}>
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium uppercase tracking-tight">Home</span>
      </button>
      <button onClick={() => navigate('/trainer/bookings')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/trainer/bookings') ? 'text-blue-600' : 'text-slate-400'}`}>
        <Calendar className="w-5 h-5" />
        <span className="text-[10px] font-medium uppercase tracking-tight">Bookings</span>
      </button>
      <button onClick={() => navigate('/trainer/profile')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/trainer/profile') ? 'text-blue-600' : 'text-slate-400'}`}>
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium uppercase tracking-tight">Profile</span>
      </button>
    </div>
  );
};

const TrainerApp: React.FC<TrainerAppProps> = ({ 
  trainers, classSlots, bookings, classes, facilities, locations, currentTrainer, onTrainerLogin, onTrainerLogout, onUpdateTrainer, onUpdateSlot, onUpdateBooking
}) => {
  const navigate = useNavigate();
  const showNav = currentTrainer && !currentTrainer.isFirstLogin;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20 pb-10">
      <div className="relative w-full max-w-[375px] h-[750px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-[100]"></div>
        <div className="h-full bg-white relative overflow-hidden">
          <Routes>
            <Route index element={
              !currentTrainer ? (
                <TrainerLogin trainers={trainers} onLogin={(t) => { onTrainerLogin(t); if(t.isFirstLogin) navigate('/trainer/setup'); else navigate('/trainer/home'); }} />
              ) : (
                currentTrainer.isFirstLogin ? <TrainerProfileSetup trainer={currentTrainer} onComplete={(up) => { onUpdateTrainer(currentTrainer.id, {...up, isFirstLogin: false}); navigate('/trainer/home'); }} /> : <TrainerHomeView facilities={facilities} trainer={currentTrainer} />
              )
            } />
            <Route path="setup" element={currentTrainer ? <TrainerProfileSetup trainer={currentTrainer} onComplete={(up) => { onUpdateTrainer(currentTrainer.id, {...up, isFirstLogin: false}); navigate('/trainer/home'); }} /> : <TrainerLogin trainers={trainers} onLogin={(t) => { onTrainerLogin(t); navigate('/trainer/setup'); }} />} />
            <Route path="home" element={currentTrainer ? <TrainerHomeView facilities={facilities} trainer={currentTrainer} /> : <TrainerLogin trainers={trainers} onLogin={(t) => { onTrainerLogin(t); navigate('/trainer/home'); }} />} />
            <Route path="facility/:id" element={<TrainerFacilityHub facilities={facilities} classes={classes} trainer={currentTrainer!} />} />
            <Route path="facility/:id/timetable/:classId" element={<TrainerTimetableView facilities={facilities} classes={classes} trainer={currentTrainer!} classSlots={classSlots} onUpdateSlot={onUpdateSlot} />} />
            <Route path="slot/:slotId" element={<TrainerSlotDetailView classSlots={classSlots} classes={classes} facilities={facilities} bookings={bookings} trainer={currentTrainer!} onUpdateSlot={onUpdateSlot} onUpdateBooking={onUpdateBooking} />} />
            <Route path="bookings" element={currentTrainer ? <TrainerBookingsTab trainer={currentTrainer} bookings={bookings} classSlots={classSlots} classes={classes} /> : <TrainerLogin trainers={trainers} onLogin={(t) => { onTrainerLogin(t); navigate('/trainer/bookings'); }} />} />
            <Route path="profile" element={currentTrainer ? <TrainerProfileTab trainer={currentTrainer} onLogout={onTrainerLogout} onUpdateTrainer={onUpdateTrainer} facilities={facilities} /> : <TrainerLogin trainers={trainers} onLogin={(t) => { onTrainerLogin(t); navigate('/trainer/profile'); }} />} />
          </Routes>
        </div>
        {showNav && <TrainerBottomNav />}
      </div>
    </div>
  );
};

export default TrainerApp;