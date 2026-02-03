import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Facility, Class, Trainer, Location as StaffLocation, ClassSlot, Product, User, Booking, CartItem, Order, Pass, UserPass, Block, BlockBooking, BlockWeeklyPayment, Membership, UserMembership, Measurement, PhotoLog, DEFAULT_FACILITIES, DEFAULT_CLASSES, DEFAULT_TRAINERS, DEFAULT_LOCATIONS, DEFAULT_CLASS_SLOTS, DEFAULT_USERS, DEFAULT_PRODUCTS, DEFAULT_BOOKINGS, DEFAULT_ORDERS, DEFAULT_PASSES, DEFAULT_BLOCKS, DEFAULT_BLOCK_BOOKINGS, DEFAULT_BLOCK_PAYMENTS, DEFAULT_MEMBERSHIPS } from './types';
import LandingPage from './components/LandingPage';
import AppHub from './components/AppHub';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { ToastProvider, useToast } from './components/ToastContext';
import { NotificationProvider, useNotifications } from './components/NotificationContext';
import { Layout, ShieldCheck } from 'lucide-react';

const GlobalHeader: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-[100] flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg hover:text-blue-600 transition-colors">
          <div className="bg-black text-white px-1.5 py-0.5 rounded text-xs">121</div>
          <span className="hidden sm:inline">Platform</span>
        </Link>
        <nav className="flex gap-2">
          <Link 
            to="/app" 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${location.pathname.startsWith('/app') ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Layout className="w-4 h-4" />
            User App
          </Link>
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${location.pathname.startsWith('/admin') ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        </nav>
      </div>
      <div className="hidden md:flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Dashboard
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [locations, setLocations] = useState<StaffLocation[]>([]);
  const [classSlots, setClassSlots] = useState<ClassSlot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [userPasses, setUserPasses] = useState<UserPass[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockBookings, setBlockBookings] = useState<BlockBooking[]>([]);
  const [blockPayments, setBlockPayments] = useState<BlockWeeklyPayment[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [photoLogs, setPhotoLogs] = useState<PhotoLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const safeHydrate = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored || stored === 'undefined' || stored === 'null') return fallback;
      const parsed = JSON.parse(stored);
      return parsed || fallback;
    } catch (e) {
      console.error(`Failed to hydrate ${key}:`, e);
      return fallback;
    }
  };

  useEffect(() => {
    setFacilities(safeHydrate('121_facilities', DEFAULT_FACILITIES));
    setClasses(safeHydrate('121_classes', DEFAULT_CLASSES));
    setTrainers(safeHydrate('121_trainers', DEFAULT_TRAINERS));
    setLocations(safeHydrate('121_locations', DEFAULT_LOCATIONS));
    setClassSlots(safeHydrate('121_slots', DEFAULT_CLASS_SLOTS));
    setProducts(safeHydrate('121_products', DEFAULT_PRODUCTS));
    setUsers(safeHydrate('121_users', DEFAULT_USERS));
    setBookings(safeHydrate('121_bookings', DEFAULT_BOOKINGS));
    setCart(safeHydrate('121_cart', []));
    setOrders(safeHydrate('121_orders', DEFAULT_ORDERS));
    setPasses(safeHydrate('121_passes', DEFAULT_PASSES));
    setUserPasses(safeHydrate('121_user_passes', []));
    setMemberships(safeHydrate('121_memberships', DEFAULT_MEMBERSHIPS));
    setUserMemberships(safeHydrate('121_user_memberships', []));
    setBlocks(safeHydrate('121_blocks', DEFAULT_BLOCKS));
    setBlockBookings(safeHydrate('121_block_bookings', DEFAULT_BLOCK_BOOKINGS));
    setBlockPayments(safeHydrate('121_block_payments', DEFAULT_BLOCK_PAYMENTS));
    setMeasurements(safeHydrate('121_measurements', []));
    setPhotoLogs(safeHydrate('121_photo_logs', []));
    setCurrentUser(safeHydrate('121_current_user', null));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('121_facilities', JSON.stringify(facilities));
      localStorage.setItem('121_classes', JSON.stringify(classes));
      localStorage.setItem('121_trainers', JSON.stringify(trainers));
      localStorage.setItem('121_locations', JSON.stringify(locations));
      localStorage.setItem('121_slots', JSON.stringify(classSlots));
      localStorage.setItem('121_products', JSON.stringify(products));
      localStorage.setItem('121_users', JSON.stringify(users));
      localStorage.setItem('121_bookings', JSON.stringify(bookings));
      localStorage.setItem('121_cart', JSON.stringify(cart));
      localStorage.setItem('121_orders', JSON.stringify(orders));
      localStorage.setItem('121_passes', JSON.stringify(passes));
      localStorage.setItem('121_user_passes', JSON.stringify(userPasses));
      localStorage.setItem('121_memberships', JSON.stringify(memberships));
      localStorage.setItem('121_user_memberships', JSON.stringify(userMemberships));
      localStorage.setItem('121_blocks', JSON.stringify(blocks));
      localStorage.setItem('121_block_bookings', JSON.stringify(blockBookings));
      localStorage.setItem('121_block_payments', JSON.stringify(blockPayments));
      localStorage.setItem('121_measurements', JSON.stringify(measurements));
      localStorage.setItem('121_photo_logs', JSON.stringify(photoLogs));
      if (currentUser) {
        localStorage.setItem('121_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('121_current_user');
      }
    }
  }, [facilities, classes, trainers, locations, classSlots, products, users, bookings, cart, orders, passes, userPasses, memberships, userMemberships, blocks, blockBookings, blockPayments, measurements, photoLogs, currentUser, isLoading]);

  const addFacility = (facility: Omit<Facility, 'id' | 'createdAt' | 'features'>) => {
    setFacilities(prev => [...prev, { ...facility, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now(), features: [] }]);
    showToast('Facility added', 'success');
  };
  const updateFacility = (id: string, updates: Partial<Facility>) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    showToast('Facility updated', 'success');
  };
  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
    showToast('Facility removed', 'info');
  };

  const addClass = (data: Omit<Class, 'id' | 'createdAt'>) => {
    setClasses(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Class created', 'success');
  };
  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Class updated', 'success');
  };
  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    showToast('Class deleted', 'info');
  };

  const addMembership = (data: Omit<Membership, 'id' | 'createdAt'>) => {
    setMemberships(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Membership created', 'success');
  };
  const updateMembership = (id: string, updates: Partial<Membership>) => {
    setMemberships(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    showToast('Membership updated', 'success');
  };
  const deleteMembership = (id: string) => {
    setMemberships(prev => prev.filter(m => m.id !== id));
    showToast('Membership removed', 'info');
  };

  const buyMembership = (m: Membership) => {
    if (!currentUser) return;
    const newUserMembership: UserMembership = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      membershipId: m.id,
      facilityId: m.facilityId,
      title: m.title,
      startDate: Date.now(),
      endDate: Date.now() + (m.durationDays * 86400000),
      price: m.price,
      allow24Hour: m.allow24Hour,
      startTime: m.startTime,
      endTime: m.endTime,
      daysAccess: m.daysAccess,
      status: 'active',
      purchasedAt: Date.now()
    };
    setUserMemberships(prev => [...prev, newUserMembership]);
    showToast('Membership activated!', 'success');
    addNotification('Membership Active', `Your ${m.title} is now active.`, 'success', currentUser.id);
  };

  // Fix: Added updateUserMembership for status handling
  const updateUserMembership = (id: string, updates: Partial<UserMembership>) => {
    setUserMemberships(prev => prev.map(um => um.id === id ? { ...um, ...updates } : um));
  };

  const addBlock = (data: Omit<Block, 'id' | 'createdAt'>) => {
    setBlocks(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Block created', 'success');
  };
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast('Block updated', 'success');
  };
  const deleteBlock = (id: string) => {
    const hasBookings = blockBookings.some(bb => bb.blockId === id);
    if (hasBookings) {
      showToast('Cannot delete block with active bookings', 'error');
      return;
    }
    setBlocks(prev => prev.filter(b => b.id !== id));
    showToast('Block deleted', 'info');
  };

  const bookBlock = (block: Block, participantNames: string[]) => {
    if (!currentUser) return;
    const newBB: BlockBooking = {
      id: Math.random().toString(36).substr(2, 9),
      blockId: block.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      facilityId: block.facilityId,
      trainerId: block.trainerId,
      startDate: block.startDate,
      participantNames,
      bookingAmountPaid: true,
      status: 'upcoming',
      createdAt: Date.now()
    };
    
    // Generate weekly payments
    const newPayments: BlockWeeklyPayment[] = [];
    for (let i = 1; i <= block.numWeeks; i++) {
      newPayments.push({
        id: Math.random().toString(36).substr(2, 9),
        blockBookingId: newBB.id,
        userId: currentUser.id,
        weekNumber: i,
        amount: block.weeklyAmount,
        dueDate: block.startDate + (i - 1) * 7 * 86400000,
        status: 'pending'
      });
    }

    setBlockBookings(prev => [...prev, newBB]);
    setBlockPayments(prev => [...prev, ...newPayments]);
    showToast('Block joined successfully!', 'success');
    addNotification('Block Joined', `You joined ${block.name}. Booking amount paid.`, 'success', currentUser.id);
  };

  const payWeeklyBlock = (paymentId: string) => {
    setBlockPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'paid', paidAt: Date.now() } : p));
    showToast('Weekly installment paid', 'success');
  };

  const updateBlockBooking = (id: string, updates: Partial<BlockBooking>) => {
    setBlockBookings(prev => prev.map(bb => bb.id === id ? { ...bb, ...updates } : bb));
  };

  const addTrainer = (data: Omit<Trainer, 'id' | 'createdAt'>) => {
    setTrainers(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Trainer added', 'success');
  };
  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Trainer updated', 'success');
  };
  const deleteTrainer = (id: string) => {
    setTrainers(prev => prev.filter(t => t.id !== id));
    showToast('Trainer removed', 'info');
  };

  const addLocation = (data: Omit<StaffLocation, 'id' | 'createdAt'>) => {
    setLocations(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Location saved', 'success');
  };
  const updateLocation = (id: string, updates: Partial<StaffLocation>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    showToast('Location updated', 'success');
  };
  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    showToast('Location removed', 'info');
  };

  const addClassSlot = (data: Omit<ClassSlot, 'id'>) => {
    setClassSlots(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) }]);
    showToast('Slot added', 'success');
  };
  const updateClassSlot = (id: string, updates: Partial<ClassSlot>) => {
    setClassSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Slot updated', 'success');
  };
  const deleteClassSlot = (id: string) => {
    setClassSlots(prev => prev.filter(s => s.id !== id));
    showToast('Slot removed', 'info');
  };

  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>) => {
    setProducts(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Product added', 'success');
  };
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Product updated', 'success');
  };
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed', 'info');
  };

  const addPass = (data: Omit<Pass, 'id' | 'createdAt'>) => {
    setPasses(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Pass created', 'success');
  };
  const updatePass = (id: string, updates: Partial<Pass>) => {
    setPasses(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Pass updated', 'success');
  };
  const deletePass = (id: string) => {
    setPasses(prev => prev.filter(p => p.id !== id));
    showToast('Pass removed', 'info');
  };

  const buyPass = (pass: Pass) => {
    if (!currentUser) return;
    const newUserPass: UserPass = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      passId: pass.id,
      facilityId: pass.facilityId,
      name: pass.name,
      totalCredits: pass.credits,
      remainingCredits: pass.credits,
      personsPerBooking: pass.personsPerBooking,
      isAllClasses: pass.isAllClasses,
      allowedClassIds: pass.allowedClassIds,
      purchasedAt: Date.now(),
      status: 'active'
    };
    setUserPasses(prev => [...prev, newUserPass]);
    showToast('Pass purchased!', 'success');
    addNotification('Pass Purchased', `You bought ${pass.name}. Ready to use!`, 'success', currentUser.id);
  };

  const usePass = (userPassId: string, credits: number) => {
    setUserPasses(prev => prev.map(p => {
      if (p.id === userPassId) {
        const remaining = p.remainingCredits - credits;
        return { 
          ...p, 
          remainingCredits: remaining,
          status: remaining <= 0 ? 'exhausted' : p.status
        };
      }
      return p;
    }));
  };

  const onAddToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const product = products.find(p => p.id === i.productId);
        const stock = product?.sizeStocks.find(ss => ss.size === i.size)?.quantity || 0;
        const newQty = Math.max(1, Math.min(i.quantity + delta, stock));
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    const order = orders.find(o => o.id === id);
    if (updates.status === 'picked-up' && order) {
      addNotification('Order Picked Up', `Your order ${order.orderNumber} is ready.`, 'success', order.userId);
      showToast('Order marked as picked up', 'success');
    }
  };

  const registerUser = (userData: Omit<User, 'id' | 'status' | 'createdAt'>) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.fullName}`, 'success');
      return;
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      createdAt: Date.now(),
      paymentCards: userData.paymentCards || []
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome, ${userData.fullName}`, 'success');
    addNotification('New Member', `${userData.fullName} joined the platform.`, 'success', 'admin');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Profile updated', 'success');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
      showToast('Account deleted', 'info');
    } else {
      showToast('Member removed', 'info');
    }
  };

  const onAddBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast('Booking updated', 'success');
  };

  const onAddMeasurement = (m: Omit<Measurement, 'id'>) => {
    setMeasurements(prev => [...prev, { ...m, id: Math.random().toString(36).substr(2, 9) }]);
    showToast('Measurement logged', 'success');
  };

  const onAddPhotoLog = (p: Omit<PhotoLog, 'id'>) => {
    setPhotoLogs(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
    showToast('Photo added to log', 'success');
  };

  const onDeletePhotoLog = (id: string) => {
    setPhotoLogs(prev => prev.filter(p => p.id !== id));
    showToast('Photo removed', 'info');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    showToast('Logged out', 'info');
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-semibold text-slate-400">Loading...</div>;

  return (
    <HashRouter>
      <GlobalHeader />
      <div className="pt-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/app/*" 
            element={
              <AppHub 
                facilities={facilities} 
                classes={classes} 
                trainers={trainers} 
                locations={locations} 
                classSlots={classSlots}
                products={products}
                bookings={bookings}
                cart={cart}
                orders={orders}
                users={users}
                passes={passes}
                userPasses={userPasses}
                memberships={memberships}
                userMemberships={userMemberships}
                blocks={blocks}
                blockBookings={blockBookings}
                blockPayments={blockPayments}
                measurements={measurements}
                photoLogs={photoLogs}
                currentUser={currentUser}
                onRegisterUser={registerUser}
                onUpdateUser={updateUser}
                onLogout={handleLogout}
                onDeleteUser={deleteUser}
                onAddBooking={onAddBooking}
                onUpdateBooking={updateBooking}
                // Fix: Added missing props to AppHub instantiation
                onUpdateBlockBooking={updateBlockBooking}
                onUpdateOrder={updateOrder}
                onUpdateUserMembership={updateUserMembership}
                onAddToCart={onAddToCart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                onAddOrder={addOrder}
                onBuyPass={buyPass}
                onUsePass={usePass}
                onBookBlock={bookBlock}
                onPayWeeklyBlock={payWeeklyBlock}
                onBuyMembership={buyMembership}
                onAddMeasurement={onAddMeasurement}
                onAddPhotoLog={onAddPhotoLog}
                onDeletePhotoLog={onDeletePhotoLog}
              />
            } 
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <AdminPanel 
                facilities={facilities} 
                onAdd={addFacility} 
                onUpdate={updateFacility} 
                onDelete={deleteFacility}
                classes={classes}
                onAddClass={addClass}
                onUpdateClass={updateClass}
                onDeleteClass={deleteClass}
                trainers={trainers}
                onAddTrainer={addTrainer}
                onUpdateTrainer={updateTrainer}
                onDeleteTrainer={deleteTrainer}
                locations={locations}
                onAddLocation={addLocation}
                onUpdateLocation={updateLocation}
                onDeleteLocation={deleteLocation}
                classSlots={classSlots}
                onAddClassSlot={addClassSlot}
                onUpdateClassSlot={updateClassSlot}
                onDeleteClassSlot={deleteClassSlot}
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                passes={passes}
                onAddPass={addPass}
                onUpdatePass={updatePass}
                onDeletePass={deletePass}
                memberships={memberships}
                onAddMembership={addMembership}
                onUpdateMembership={updateMembership}
                onDeleteMembership={deleteMembership}
                blocks={blocks}
                onAddBlock={addBlock}
                onUpdateBlock={updateBlock}
                onDeleteBlock={deleteBlock}
                users={users}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
                bookings={bookings}
                onUpdateBooking={updateBooking}
                orders={orders}
                onUpdateOrder={updateOrder}
                blockBookings={blockBookings}
                blockPayments={blockPayments}
                userPasses={userPasses}
                userMemberships={userMemberships}
                measurements={measurements}
                photoLogs={photoLogs}
              />
            } 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  </ToastProvider>
);

export default App;