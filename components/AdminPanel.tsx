
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
// Fix: Added Order to imports from ../types
import { Facility, Class, Trainer, Location, ClassSlot, Product, User, Booking, Order } from '../types';
import Sidebar from './admin/Sidebar';
import FacilitiesView from './admin/FacilitiesView';
import ClassesView from './admin/ClassesView';
import StaffView from './admin/StaffView';
import TimetableView from './admin/TimetableView';
import MarketplaceView from './admin/MarketplaceView';
import UsersView from './admin/UsersView';
import UserDetailView from './admin/UserDetailView';
import FacilityDetailView from './admin/FacilityDetailView';
import BookingsOrdersView from './admin/BookingsOrdersView';
import UnderDevelopment from './UnderDevelopment';

interface AdminPanelProps {
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
  users: User[];
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  // Fix: Added orders and onUpdateOrder to AdminPanelProps
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  facilities, onAdd, onUpdate, onDelete,
  classes, onAddClass, onUpdateClass, onDeleteClass,
  trainers, onAddTrainer, onUpdateTrainer, onDeleteTrainer,
  locations, onAddLocation, onUpdateLocation, onDeleteLocation,
  classSlots, onAddClassSlot, onUpdateClassSlot, onDeleteClassSlot,
  products, onAddProduct, onUpdateProduct, onDeleteProduct,
  users, onUpdateUser, onDeleteUser,
  bookings, onUpdateBooking,
  // Fix: Destructured orders and onUpdateOrder from props
  orders, onUpdateOrder
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 bg-slate-50 min-h-screen">
        <Routes>
          <Route index element={<FacilitiesView facilities={facilities} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="facility/:id" element={<FacilityDetailView facilities={facilities} onUpdate={onUpdate} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="classes" element={<ClassesView facilities={facilities} classes={classes} onAddClass={onAddClass} onUpdateClass={onUpdateClass} onDeleteClass={onDeleteClass} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="staff" element={<StaffView facilities={facilities} trainers={trainers} onAddTrainer={onAddTrainer} onUpdateTrainer={onUpdateTrainer} onDeleteTrainer={onDeleteTrainer} locations={locations} onAddLocation={onAddLocation} onUpdateLocation={onUpdateLocation} onDeleteLocation={onDeleteLocation} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="users" element={<UsersView users={users} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="user/:userId" element={<UserDetailView users={users} bookings={bookings} classes={classes} facilities={facilities} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="timetable" element={<TimetableView facilities={facilities} classes={classes} trainers={trainers} locations={locations} classSlots={classSlots} onAddSlot={onAddClassSlot} onUpdateSlot={onUpdateClassSlot} onDeleteSlot={onDeleteClassSlot} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="marketplace" element={<MarketplaceView facilities={facilities} products={products} onAddProduct={onAddProduct} onUpdateProduct={onUpdateProduct} onDeleteProduct={onDeleteProduct} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          {/* Fix: Passed orders and onUpdateOrder props to BookingsOrdersView */}
          <Route path="bookings-orders" element={<BookingsOrdersView facilities={facilities} classes={classes} trainers={trainers} locations={locations} bookings={bookings} orders={orders} onUpdateBooking={onUpdateBooking} onUpdateOrder={onUpdateOrder} onOpenSidebar={() => setIsSidebarOpen(true)} />} />
          <Route path="blocks" element={<UnderDevelopment title="Blocks Module" />} />
          <Route path="passes" element={<UnderDevelopment title="Passes Module" />} />
          <Route path="memberships" element={<UnderDevelopment title="Memberships Module" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
