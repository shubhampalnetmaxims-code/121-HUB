
import React, { useState } from 'react';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Facility, Class, Trainer, Location, ClassSlot, Product, User, Booking, CartItem, Order, Pass, UserPass, Block, BlockBooking, BlockWeeklyPayment, Membership, UserMembership, Measurement, PhotoLog } from '../types';
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
import MyPaymentsView from './app/MyPaymentsView';
import MyBookingsView from './app/MyBookingsView';
import CartView from './app/CartView';
import MyOrdersView from './app/MyOrdersView';
import MyPassesView from './app/MyPassesView';
import PassListView from './app/PassListView';
import MembershipListView from './app/MembershipListView';
import MyMembershipsView from './app/MyMembershipsView';
import BlockListView from './app/BlockListView';
import BlockDetailView from './app/BlockDetailView';
import UnderDevelopmentApp from './app/UnderDevelopmentApp';
import ActivityView from './app/ActivityView';
// Fix: Import missing health tracking view components
import MeasurementsView from './app/MeasurementsView';
import PhotoLogView from './app/PhotoLogView';

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
  bookings: Booking[];
  cart: CartItem[];
  orders: Order[];
  users: User[];
  passes: Pass[];
  userPasses: UserPass[];
  memberships: Membership[];
  userMemberships: UserMembership[];
  blocks: Block[];
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  // Fix: Added missing health data props to interface
  measurements: Measurement[];
  photoLogs: PhotoLog[];
  currentUser: User | null;
  onRegisterUser: (data: Omit<User, 'id' | 'status' | 'createdAt'>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onLogout: () => void;
  onDeleteUser: (id: string) => void;
  onAddBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  // Fix: Added missing update callback props
  onUpdateBlockBooking: (id: string, updates: Partial<BlockBooking>) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onUpdateUserMembership: (id: string, updates: Partial<UserMembership>) => void;
  onAddToCart: (item: CartItem) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onAddOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  onBuyPass: (pass: Pass) => void;
  onUsePass: (userPassId: string, credits: number) => void;
  onBookBlock: (block: Block, participants: string[]) => void;
  onPayWeeklyBlock: (paymentId: string) => void;
  onBuyMembership: (m: Membership) => void;
  // Fix: Added missing health tracking callback props
  onAddMeasurement: (m: Omit<Measurement, 'id'>) => void;
  onAddPhotoLog: (p: Omit<PhotoLog, 'id'>) => void;
  onDeletePhotoLog: (id: string) => void;
}

const AppHub: React.FC<AppHubProps> = ({ 
  facilities, classes, trainers, locations, classSlots, products, bookings, cart, orders, users,
  passes, userPasses, memberships, userMemberships, blocks, blockBookings, blockPayments, measurements, photoLogs, currentUser, onRegisterUser, onUpdateUser, onLogout, onDeleteUser, onAddBooking, 
  onUpdateBooking, onUpdateBlockBooking, onUpdateOrder, onUpdateUserMembership,
  onAddToCart, updateCartQuantity, removeFromCart, onAddOrder, onBuyPass, onUsePass, onBookBlock, onPayWeeklyBlock, onBuyMembership,
  onAddMeasurement, onAddPhotoLog, onDeletePhotoLog
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedInfoFacility, setSelectedInfoFacility] = useState<Facility | null>(null);

  const showBottomNav = !['/app', '/app/', '/app/onboarding', '/app/cart'].includes(location.pathname);

  const handleAuthTrigger = () => {
    // Capture current path to return after login
    navigate('/app/onboarding', { state: { returnTo: location.pathname } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20 pb-10">
      <div className="relative w-full max-w-[400px] h-[860px] bg-black rounded-[48px] shadow-2xl overflow-hidden border-[8px] border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-[100]"></div>
        <div className="h-full bg-white relative">
          <Routes>
            <Route index element={<EntryView />} />
            <Route path="onboarding" element={<OnboardingFlow users={users} onComplete={onRegisterUser} onCancel={() => navigate('/app/home')} />} />
            <Route path="home" element={<HomeView facilities={facilities} onShowInfo={setSelectedInfoFacility} currentUser={currentUser} />} />
            <Route path="market" element={<MarketView facilities={facilities} products={products} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} onAddToCart={onAddToCart} cart={cart} />} />
            <Route path="cart" element={<CartView cart={cart} updateQuantity={updateCartQuantity} remove={removeFromCart} currentUser={currentUser} onAddOrder={onAddOrder} onAuthTrigger={handleAuthTrigger} onUpdateUser={onUpdateUser} />} />
            <Route path="activity" element={<ActivityView />} />
            {/* Fix: Use actual tracking views instead of under development placeholders */}
            <Route path="measurements" element={<MeasurementsView currentUser={currentUser} measurements={measurements} onAddMeasurement={onAddMeasurement} onAuthTrigger={handleAuthTrigger} />} />
            <Route path="photo-logs" element={<PhotoLogView currentUser={currentUser} photoLogs={photoLogs} onAddPhotoLog={onAddPhotoLog} onDeletePhotoLog={onDeletePhotoLog} onAuthTrigger={handleAuthTrigger} />} />
            <Route path="rewards" element={<UnderDevelopmentApp title="Rewards" subtitle="Earn points for your activities and unlock exclusive benefits." />} />
            {/* Fix: Pass missing userMemberships to ProfileView */}
            <Route path="profile" element={<ProfileView currentUser={currentUser} bookings={bookings} facilities={facilities} classes={classes} orders={orders} onLogout={onLogout} onDeleteAccount={onDeleteUser} onAuthTrigger={handleAuthTrigger} userPasses={userPasses} userMemberships={userMemberships} />} />
            <Route path="profile/payments" element={<MyPaymentsView currentUser={currentUser} onUpdateUser={onUpdateUser} />} />
            <Route path="profile/orders" element={<MyOrdersView currentUser={currentUser} orders={orders} facilities={facilities} />} />
            <Route path="profile/passes" element={<MyPassesView currentUser={currentUser} userPasses={userPasses} facilities={facilities} classes={classes} />} />
            <Route path="profile/memberships" element={<MyMembershipsView currentUser={currentUser} userMemberships={userMemberships} facilities={facilities} />} />
            {/* Fix: Pass missing required props to MyBookingsView */}
            <Route path="bookings" element={<MyBookingsView currentUser={currentUser} bookings={bookings} blockBookings={blockBookings} blockPayments={blockPayments} facilities={facilities} classes={classes} trainers={trainers} blocks={blocks} userMemberships={userMemberships} orders={orders} onUpdateBooking={onUpdateBooking} onUpdateBlockBooking={onUpdateBlockBooking} onUpdateOrder={onUpdateOrder} onUpdateUserMembership={onUpdateUserMembership} onAuthTrigger={handleAuthTrigger} onPayWeeklyBlock={onPayWeeklyBlock} onUpdateUser={onUpdateUser} />} />
            <Route path="facility/:id" element={<FacilityHubView facilities={facilities} trainers={trainers} onShowInfo={setSelectedInfoFacility} />} />
            <Route path="facility/:id/market" element={<MarketView facilities={facilities} products={products} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} onAddToCart={onAddToCart} cart={cart} />} />
            <Route path="facility/:id/classes" element={<ClassListView facilities={facilities} classes={classes} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} />} />
            <Route path="facility/:id/passes" element={<PassListView facilities={facilities} passes={passes} onBuyPass={onBuyPass} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} onUpdateUser={onUpdateUser} />} />
            <Route path="facility/:id/memberships" element={<MembershipListView facilities={facilities} memberships={memberships} onBuyMembership={onBuyMembership} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} onUpdateUser={onUpdateUser} />} />
            <Route path="facility/:id/blocks" element={<BlockListView facilities={facilities} blocks={blocks} trainers={trainers} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} />} />
            <Route path="facility/:id/block/:blockId" element={<BlockDetailView facilities={facilities} blocks={blocks} trainers={trainers} onAuthTrigger={handleAuthTrigger} currentUser={currentUser} onBookBlock={onBookBlock} onUpdateUser={onUpdateUser} />} />
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
                      onAddBooking={onAddBooking}
                      onUpdateUser={onUpdateUser}
                      userPasses={userPasses}
                      availablePasses={passes}
                      onBuyPass={onBuyPass}
                      onUsePass={onUsePass}
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
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-md">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-xl mb-3 tracking-tight text-slate-900">Active Platform</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Manage your health journey or explore facility services through this unified interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppHub;
