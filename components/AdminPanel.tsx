
import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Facility, Class, Trainer, Location, ClassSlot, Product, User, Booking, Order, Pass, UserPass, Block, BlockBooking, BlockWeeklyPayment, Membership, UserMembership, Measurement, PhotoLog, RewardSettings, RewardTransaction, SupportTicket, AdminUser, AdminPermission } from '../types';
import Sidebar from './admin/Sidebar';
import FacilitiesView from './admin/FacilitiesView';
import ClassesView from './admin/ClassesView';
import StaffView from './admin/StaffView';
import TimetableView from './admin/TimetableView';
import MarketplaceView from './admin/MarketplaceView';
import PassesView from './admin/PassesView';
import MembershipsView from './admin/MembershipsView';
import BlocksView from './admin/BlocksView';
import UsersView from './admin/UsersView';
import UserDetailView from './admin/UserDetailView';
import FacilityDetailView from './admin/FacilityDetailView';
import BookingsOrdersView from './admin/BookingsOrdersView';
import RewardsView from './admin/RewardsView';
import TrainerDetailView from './admin/TrainerDetailView';
import SupportView from './admin/SupportView';
import AdminStaffView from './admin/AdminStaffView';
import { XCircle } from 'lucide-react';

interface AdminPanelProps {
  currentAdmin: AdminUser | null;
  adminUsers: AdminUser[];
  onAddAdmin: (adm: Omit<AdminUser, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateAdmin: (id: string, updates: Partial<AdminUser>) => void;
  onDeleteAdmin: (id: string) => void;
  facilities: Facility[];
  onAdd: (f: Omit<Facility, 'id' | 'createdAt' | 'features'>) => void;
  onUpdate: (id: string, updates: Partial<Facility>) => void;
  onDelete: (id: string) => void;
  classes: Class[];
  onAddClass: (c: Omit<Class, 'id' | 'createdAt'>) => void;
  onUpdateClass: (id: string, updates: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
  trainers: Trainer[];
  onAddTrainer: (t: Omit<Trainer, 'id' | 'createdAt'>) => void;
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
  onDeleteTrainer: (id: string) => void;
  locations: Location[];
  onAddLocation: (l: Omit<Location, 'id' | 'createdAt'>) => void;
  onUpdateLocation: (id: string, updates: Partial<Location>) => void;
  onDeleteLocation: (id: string) => void;
  classSlots: ClassSlot[];
  onAddClassSlot: (s: Omit<ClassSlot, 'id'>) => void;
  onUpdateClassSlot: (id: string, updates: Partial<ClassSlot>) => void;
  onDeleteClassSlot: (id: string) => void;
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  passes: Pass[];
  onAddPass: (p: Omit<Pass, 'id' | 'createdAt'>) => void;
  onUpdatePass: (id: string, updates: Partial<Pass>) => void;
  onDeletePass: (id: string) => void;
  memberships: Membership[];
  onAddMembership: (m: Omit<Membership, 'id' | 'createdAt'>) => void;
  onUpdateMembership: (id: string, updates: Partial<Membership>) => void;
  onDeleteMembership: (id: string) => void;
  blocks: Block[];
  onAddBlock: (b: Omit<Block, 'id' | 'createdAt'>) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
  users: User[];
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  userPasses: UserPass[];
  userMemberships: UserMembership[];
  onUpdateUserMembership: (id: string, updates: Partial<UserMembership>) => void;
  onUpdateBlockBooking: (id: string, updates: Partial<BlockBooking>) => void;
  onUpdateUserPass: (id: string, updates: Partial<UserPass>) => void;
  onDeleteUserPass: (id: string) => void;
  measurements: Measurement[];
  photoLogs: PhotoLog[];
  rewardSettings: RewardSettings;
  rewardTransactions: RewardTransaction[];
  onUpdateRewardSettings: (s: RewardSettings) => void;
  onResetSystem: () => void;
  tickets: SupportTicket[];
  onReplyTicket: (id: string, message: string, senderType: 'user' | 'admin') => void;
  onUpdateTicketStatus: (id: string, status: SupportTicket['status']) => void;
}

const PermissionGuard = ({ 
  currentAdmin, 
  permission, 
  children 
}: { 
  currentAdmin: AdminUser | null, 
  permission?: AdminPermission, 
  children: React.ReactNode 
}) => {
  if (!currentAdmin) return <Navigate to="/admin-login" replace />;
  if (currentAdmin.permissions.includes('super_admin')) return <>{children}</>;
  if (permission && !currentAdmin.permissions.includes(permission)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-10 text-center bg-slate-50">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
           <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">Your account does not have the permissions required to access this node. Contact your system administrator.</p>
        <button onClick={() => window.history.back()} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg">Go Back</button>
      </div>
    );
  }
  return <>{children}</>;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentAdmin, adminUsers, onAddAdmin, onUpdateAdmin, onDeleteAdmin,
  facilities, onAdd, onUpdate, onDelete,
  classes, onAddClass, onUpdateClass, onDeleteClass,
  trainers, onAddTrainer, onUpdateTrainer, onDeleteTrainer,
  locations, onAddLocation, onUpdateLocation, onDeleteLocation,
  classSlots, onAddClassSlot, onUpdateClassSlot, onDeleteClassSlot,
  products, onAddProduct, onUpdateProduct, onDeleteProduct,
  passes, onAddPass, onUpdatePass, onDeletePass,
  memberships, onAddMembership, onUpdateMembership, onDeleteMembership,
  blocks, onAddBlock, onUpdateBlock, onDeleteBlock,
  users, onUpdateUser, onDeleteUser,
  bookings, onUpdateBooking,
  orders, onUpdateOrder,
  blockBookings, blockPayments,
  userPasses, userMemberships, onUpdateUserMembership,
  onUpdateBlockBooking,
  onUpdateUserPass, onDeleteUserPass,
  measurements, photoLogs,
  rewardTransactions, rewardSettings, onUpdateRewardSettings,
  onResetSystem,
  tickets, onReplyTicket, onUpdateTicketStatus
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentAdmin) return <Navigate to="/admin-login" replace />;

  const isRestricted = !!currentAdmin.assignedFacilityId;
  const restrictedId = currentAdmin.assignedFacilityId || '';

  // Filter global data if restricted
  const filteredFacilities = isRestricted ? facilities.filter(f => f.id === restrictedId) : facilities;
  const filteredClasses = isRestricted ? classes.filter(c => c.facilityId === restrictedId) : classes;
  const filteredTrainers = isRestricted ? trainers.filter(t => t.facilityIds.includes(restrictedId)) : trainers;
  const filteredLocations = isRestricted ? locations.filter(l => l.facilityIds.includes(restrictedId)) : locations;
  const filteredSlots = isRestricted ? classSlots.filter(s => s.facilityId === restrictedId) : classSlots;
  const filteredProducts = isRestricted ? products.filter(p => p.facilityId === restrictedId) : products;
  const filteredPasses = isRestricted ? passes.filter(p => p.facilityId === restrictedId) : passes;
  const filteredMemberships = isRestricted ? memberships.filter(m => m.facilityId === restrictedId) : memberships;
  const filteredBlocks = isRestricted ? blocks.filter(b => b.facilityId === restrictedId) : blocks;
  const filteredBookings = isRestricted ? bookings.filter(b => b.facilityId === restrictedId) : bookings;
  const filteredOrders = isRestricted ? orders.filter(o => o.facilityId === restrictedId) : orders;
  const filteredUserPasses = isRestricted ? userPasses.filter(up => up.facilityId === restrictedId) : userPasses;
  const filteredUserMemberships = isRestricted ? userMemberships.filter(um => um.facilityId === restrictedId) : userMemberships;
  const filteredBlockBookings = isRestricted ? blockBookings.filter(bb => bb.facilityId === restrictedId) : blockBookings;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-left">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentAdmin={currentAdmin} />

      <main className="flex-1 lg:ml-64 bg-slate-50 min-h-screen">
        <Routes>
          <Route index element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_facilities">
              {isRestricted ? (
                <FacilityDetailView facilities={filteredFacilities} onUpdate={onUpdate} onOpenSidebar={() => setIsSidebarOpen(true)} isRestricted />
              ) : (
                <FacilitiesView facilities={filteredFacilities} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} onOpenSidebar={() => setIsSidebarOpen(true)} onResetSystem={onResetSystem} />
              )}
            </PermissionGuard>
          } />
          
          <Route path="facility/:id" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_facilities">
              <FacilityDetailView facilities={facilities} onUpdate={onUpdate} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="classes" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_curriculum">
              <ClassesView 
                facilities={filteredFacilities} 
                classes={filteredClasses} 
                trainers={filteredTrainers} 
                locations={filteredLocations} 
                classSlots={filteredSlots}
                bookings={filteredBookings}
                onAddClass={onAddClass} 
                onUpdateClass={onUpdateClass} 
                onDeleteClass={onDeleteClass} 
                onOpenSidebar={() => setIsSidebarOpen(true)} 
              />
            </PermissionGuard>
          } />

          <Route path="staff" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_staff">
              <StaffView facilities={filteredFacilities} trainers={filteredTrainers} onAddTrainer={onAddTrainer} onUpdateTrainer={onUpdateTrainer} onDeleteTrainer={onDeleteTrainer} locations={filteredLocations} onAddLocation={onAddLocation} onUpdateLocation={onUpdateLocation} onDeleteLocation={onDeleteLocation} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="trainer/:trainerId" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_staff">
              <TrainerDetailView trainers={trainers} classSlots={classSlots} bookings={bookings} classes={classes} facilities={facilities} onUpdateTrainer={onUpdateTrainer} onDeleteTrainer={onDeleteTrainer} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="users" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_users">
              <UsersView users={users} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="user/:userId" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_users">
              <UserDetailView users={users} bookings={bookings} classes={classes} facilities={facilities} orders={orders} userPasses={userPasses} userMemberships={userMemberships} blockBookings={blockBookings} blockPayments={blockPayments} blocks={blocks} measurements={measurements} photoLogs={photoLogs} rewardTransactions={rewardTransactions} trainers={trainers} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="timetable" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_timetable">
              <TimetableView facilities={filteredFacilities} classes={filteredClasses} trainers={filteredTrainers} locations={filteredLocations} classSlots={filteredSlots} onAddSlot={onAddClassSlot} onUpdateSlot={onUpdateClassSlot} onDeleteSlot={onDeleteClassSlot} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="marketplace" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_marketplace">
              <MarketplaceView facilities={filteredFacilities} products={filteredProducts} onAddProduct={onAddProduct} onUpdateProduct={onUpdateProduct} onDeleteProduct={onDeleteProduct} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="passes" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_finance">
              <PassesView facilities={filteredFacilities} classes={filteredClasses} passes={filteredPasses} userPasses={filteredUserPasses} users={users} bookings={filteredBookings} trainers={filteredTrainers} onAddPass={onAddPass} onUpdatePass={onUpdatePass} onDeletePass={onDeletePass} onUpdateUserPass={onUpdateUserPass} onDeleteUserPass={onDeleteUserPass} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="memberships" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_finance">
              <MembershipsView 
                facilities={filteredFacilities} 
                memberships={filteredMemberships} 
                userMemberships={filteredUserMemberships} 
                users={users} 
                onAddMembership={onAddMembership} 
                onUpdateMembership={onUpdateMembership} 
                onDeleteMembership={onDeleteMembership} 
                onUpdateUserMembership={onUpdateUserMembership}
                onOpenSidebar={() => setIsSidebarOpen(true)} 
              />
            </PermissionGuard>
          } />

          <Route path="blocks" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_finance">
              <BlocksView 
                facilities={filteredFacilities} 
                trainers={filteredTrainers} 
                blocks={filteredBlocks} 
                blockBookings={filteredBlockBookings}
                onAddBlock={onAddBlock} 
                onUpdateBlock={onUpdateBlock} 
                onDeleteBlock={onDeleteBlock} 
                onUpdateBlockBooking={onUpdateBlockBooking}
                onOpenSidebar={() => setIsSidebarOpen(true)} 
              />
            </PermissionGuard>
          } />

          <Route path="bookings-orders" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_operations">
              <BookingsOrdersView facilities={filteredFacilities} classes={filteredClasses} trainers={filteredTrainers} locations={filteredLocations} classSlots={filteredSlots} bookings={filteredBookings} orders={filteredOrders} blockBookings={filteredBlockBookings} blockPayments={blockPayments} blocks={filteredBlocks} userMemberships={filteredUserMemberships} onUpdateBooking={onUpdateBooking} onUpdateOrder={onUpdateOrder} onUpdateUserMembership={onUpdateUserMembership} onUpdateBlockBooking={onUpdateBlockBooking} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="rewards" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_rewards">
              <RewardsView settings={rewardSettings} facilities={filteredFacilities} onUpdateSettings={onUpdateRewardSettings} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="support" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_support">
              <SupportView tickets={tickets} onReplyTicket={onReplyTicket} onUpdateTicketStatus={onUpdateTicketStatus} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />

          <Route path="admin-staff" element={
            <PermissionGuard currentAdmin={currentAdmin} permission="manage_admin_staff">
              <AdminStaffView adminUsers={adminUsers} facilities={facilities} onAddAdmin={onAddAdmin} onUpdateAdmin={onUpdateAdmin} onDeleteAdmin={onDeleteAdmin} onOpenSidebar={() => setIsSidebarOpen(true)} />
            </PermissionGuard>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
