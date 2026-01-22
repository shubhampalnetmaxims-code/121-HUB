
import React, { useState } from 'react';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Facility, Class, Trainer, Location, ClassSlot, Product, User } from '../types';
import { LayoutDashboard } from 'lucide-react';
import EntryView from './app/EntryView';
import HomeView from './app/HomeView';
import FacilityHubView from './app/FacilityHubView';
import ClassListView from './app/ClassListView';
import AppTimetableView from './app/AppTimetableView';
import MarketView from './app/MarketView';
import FacilityInfoModal from './app/FacilityInfoModal';
import BottomNav from './app/BottomNav';
import OnboardingFlow from './app/OnboardingFlow';
import ProfileView from './app/ProfileView';

// Helper component to find facility from URL params within the Hub
const FacilityLoader = ({ facilities, render }: { facilities: Facility[], render: (f: Facility) => React.ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const f = facilities.find(fac => fac.id === id);
  if (!f) return <div className="p-10 text-center font-bold text-slate-400">Loading Hub...</div>;
  return <>{render(f)}</>;
};

interface AppHubProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  classSlots: ClassSlot[];
  products: Product[];
  currentUser: User | null;
  onRegisterUser: (data: Omit<User, 'id' | 'status' | 'createdAt'>) => void;
  onLogout: () => void;
  onDeleteUser: (id: string) => void;
}

const AppHub: React.FC<AppHubProps> = ({ 
  facilities, classes, trainers, locations, classSlots, products, 
  currentUser, onRegisterUser, onLogout, onDeleteUser
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedInfoFacility, setSelectedInfoFacility] = useState<Facility | null>(null);

  const showBottomNav = !['/app', '/app/', '/app/onboarding'].includes(location.pathname);

  const handleAuthTrigger = () => {
    // Capture current path to return after login
    navigate('/app/onboarding', { state: { returnTo: location.pathname } });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="relative w-full max-w-[400px] h-[880px] bg-black rounded-[64px] shadow-2xl overflow-hidden border-[12px] border-slate-900 ring-4 ring-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-900 rounded-b-[24px] z-[100]"></div>
        <div className="h-full">
          <Routes>
            <Route index element={<EntryView />} />
            <Route path="onboarding" element={<OnboardingFlow onComplete={onRegisterUser} onCancel={() => navigate('/app/home')} />} />
            <Route path="home" element={<HomeView facilities={facilities} onShowInfo={setSelectedInfoFacility} />} />
            <Route path="market" element={<MarketView facilities={facilities} products={products} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} />} />
            <Route path="profile" element={<ProfileView currentUser={currentUser} onLogout={onLogout} onDeleteAccount={onDeleteUser} onAuthTrigger={handleAuthTrigger} />} />
            <Route path="facility/:id" element={<FacilityHubView facilities={facilities} trainers={trainers} onShowInfo={setSelectedInfoFacility} />} />
            <Route path="facility/:id/market" element={<MarketView facilities={facilities} products={products} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} />} />
            <Route path="facility/:id/classes" element={<ClassListView facilities={facilities} classes={classes} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} />} />
            <Route 
              path="facility/:id/timetable" 
              element={
                <FacilityLoader 
                  facilities={facilities} 
                  render={(f) => (
                    <AppTimetableView 
                      facility={f} 
                      classes={classes} 
                      trainers={trainers} 
                      locations={locations} 
                      classSlots={classSlots}
                      onAuthTrigger={handleAuthTrigger}
                      currentUser={currentUser}
                    />
                  )} 
                />
              } 
            />
          </Routes>
        </div>

        {showBottomNav && <BottomNav />}

        {selectedInfoFacility && (
          <FacilityInfoModal 
            facility={selectedInfoFacility} 
            onClose={() => setSelectedInfoFacility(null)} 
          />
        )}
      </div>
      
      <div className="hidden xl:block absolute left-12 bottom-12 max-w-xs space-y-4">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-200">
          <div className="w-14 h-14 bg-blue-600 rounded-[20px] flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/30">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h4 className="font-black text-2xl mb-4 tracking-tight">Active Platform</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
            "Every facility is a unique ecosystem. Admins curate the services, members live the experience."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppHub;
