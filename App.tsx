import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Facility, Class, Trainer, Location as StaffLocation, ClassSlot, Product, User, Booking, CartItem, Order, Pass, UserPass, Block, BlockBooking, BlockWeeklyPayment, Membership, UserMembership, Measurement, PhotoLog, RewardTransaction, RewardSettings, SupportTicket, DEFAULT_FACILITIES, DEFAULT_CLASSES, DEFAULT_TRAINERS, DEFAULT_LOCATIONS, DEFAULT_CLASS_SLOTS, DEFAULT_USERS, DEFAULT_PRODUCTS, DEFAULT_BOOKINGS, DEFAULT_ORDERS, DEFAULT_PASSES, DEFAULT_BLOCKS, DEFAULT_MEMBERSHIPS, DEFAULT_REWARD_SETTINGS, DEFAULT_REWARD_TRANSACTIONS, DEFAULT_USER_PASSES, DEFAULT_USER_MEMBERSHIPS, DEFAULT_MEASUREMENTS, DEFAULT_PHOTO_LOGS, DEFAULT_BLOCK_BOOKINGS, DEFAULT_TICKETS } from './types';
import LandingPage from './components/LandingPage';
import AppHub from './components/AppHub';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import TrainerApp from './components/trainer/TrainerApp';
import { ToastProvider, useToast } from './components/ToastContext';
import { NotificationProvider, useNotifications } from './components/NotificationContext';
import { Layout, ShieldCheck, UserCircle } from 'lucide-react';

const STORAGE_PREFIX = '121fit_v2_';

// Robust hydration helper defined outside to be used in lazy initializers
const safeHydrate = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (!stored || stored === 'undefined' || stored === 'null') return fallback;
    
    const parsed = JSON.parse(stored);
    
    // If we expect an array and it has data, but the stored one is empty, 
    // it's likely a fresh install/deploy, so we prefer the fallback dummy data.
    if (Array.isArray(fallback) && fallback.length > 0) {
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return fallback;
      }
    }
    
    return (parsed !== null && parsed !== undefined) ? parsed : fallback;
  } catch (e) {
    console.error(`Failed to hydrate ${key}:`, e);
    return fallback;
  }
};

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
            to="/trainer" 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${location.pathname.startsWith('/trainer') ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <UserCircle className="w-4 h-4" />
            Trainer
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
        Network Dashboard
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  // Lazy state initialization: Run safeHydrate immediately during state creation
  const [facilities, setFacilities] = useState<Facility[]>(() => safeHydrate('facilities', DEFAULT_FACILITIES));
  const [classes, setClasses] = useState<Class[]>(() => safeHydrate('classes', DEFAULT_CLASSES));
  const [trainers, setTrainers] = useState<Trainer[]>(() => safeHydrate('trainers', DEFAULT_TRAINERS));
  const [locations, setLocations] = useState<StaffLocation[]>(() => safeHydrate('locations', DEFAULT_LOCATIONS));
  const [classSlots, setClassSlots] = useState<ClassSlot[]>(() => safeHydrate('slots', DEFAULT_CLASS_SLOTS));
  const [products, setProducts] = useState<Product[]>(() => safeHydrate('products', DEFAULT_PRODUCTS));
  const [users, setUsers] = useState<User[]>(() => safeHydrate('users', DEFAULT_USERS));
  const [bookings, setBookings] = useState<Booking[]>(() => safeHydrate('bookings', DEFAULT_BOOKINGS));
  const [cart, setCart] = useState<CartItem[]>(() => safeHydrate('cart', []));
  const [orders, setOrders] = useState<Order[]>(() => safeHydrate('orders', DEFAULT_ORDERS));
  const [passes, setPasses] = useState<Pass[]>(() => safeHydrate('passes', DEFAULT_PASSES));
  const [userPasses, setUserPasses] = useState<UserPass[]>(() => safeHydrate('user_passes', DEFAULT_USER_PASSES));
  const [memberships, setMemberships] = useState<Membership[]>(() => safeHydrate('memberships', DEFAULT_MEMBERSHIPS));
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>(() => safeHydrate('user_memberships', DEFAULT_USER_MEMBERSHIPS));
  const [blocks, setBlocks] = useState<Block[]>(() => safeHydrate('blocks', DEFAULT_BLOCKS));
  const [blockBookings, setBlockBookings] = useState<BlockBooking[]>(() => safeHydrate('block_bookings', DEFAULT_BLOCK_BOOKINGS));
  const [blockPayments, setBlockPayments] = useState<BlockWeeklyPayment[]>(() => safeHydrate('block_payments', []));
  const [measurements, setMeasurements] = useState<Measurement[]>(() => safeHydrate('measurements', DEFAULT_MEASUREMENTS));
  const [photoLogs, setPhotoLogs] = useState<PhotoLog[]>(() => safeHydrate('photo_logs', DEFAULT_PHOTO_LOGS));
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>(() => safeHydrate('reward_transactions', DEFAULT_REWARD_TRANSACTIONS));
  const [rewardSettings, setRewardSettings] = useState<RewardSettings>(() => safeHydrate('reward_settings', DEFAULT_REWARD_SETTINGS));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => safeHydrate('tickets', DEFAULT_TICKETS));
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = safeHydrate('current_user', null);
    return saved || DEFAULT_USERS[0];
  });
  
  const [currentTrainer, setCurrentTrainer] = useState<Trainer | null>(() => safeHydrate('current_trainer', null));
  const [isReady, setIsReady] = useState(false);

  // Mark system as ready once initial render is handled
  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleResetSystem = () => {
    if (window.confirm("Are you sure? This will wipe all current changes and restore the original dummy data.")) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      });
      window.location.reload();
    }
  };

  // Effect to persist data to localStorage whenever any state changes
  useEffect(() => {
    if (!isReady) return;

    const dataToStore: Record<string, any> = {
      facilities, classes, trainers, locations, slots: classSlots, products,
      users, bookings, cart, orders, passes, user_passes: userPasses,
      memberships, user_memberships: userMemberships, blocks, block_bookings: blockBookings,
      block_payments: blockPayments, measurements, photo_logs: photoLogs,
      reward_transactions: rewardTransactions, reward_settings: rewardSettings, tickets,
      current_user: currentUser, current_trainer: currentTrainer
    };

    Object.entries(dataToStore).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      } else {
        localStorage.removeItem(STORAGE_PREFIX + key);
      }
    });
  }, [facilities, classes, trainers, locations, classSlots, products, users, bookings, cart, orders, passes, userPasses, memberships, userMemberships, blocks, blockBookings, blockPayments, measurements, photoLogs, rewardTransactions, rewardSettings, tickets, currentUser, currentTrainer, isReady]);

  const onAddTicket = (t: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => {
    const newTicket: SupportTicket = {
      ...t,
      id: `tk-${Math.random().toString(36).substr(2, 6)}`,
      status: 'open',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [{
        id: Math.random().toString(36).substr(2, 9),
        senderId: t.userId,
        senderType: 'user',
        message: initialMessage,
        createdAt: Date.now()
      }]
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast('Support ticket raised successfully', 'success');
  };

  const onReplyTicket = (ticketId: string, message: string, senderType: 'user' | 'admin') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMessage = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: senderType === 'admin' ? 'admin' : t.userId,
          senderType,
          message,
          createdAt: Date.now()
        };
        return {
          ...t,
          status: senderType === 'admin' ? 'replied' : t.status,
          updatedAt: Date.now(),
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));
  };

  const onUpdateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: Date.now() } : t));
  };

  const addRewardTransaction = (userId: string, type: 'earned' | 'used', source: RewardTransaction['source'], referenceId: string, points: number, facilityId?: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const currentBalance = user.rewardPoints;
    const newBalance = type === 'earned' ? currentBalance + points : currentBalance - points;
    const newTX: RewardTransaction = { id: Math.random().toString(36).substr(2, 9), userId, date: Date.now(), type, source, referenceId, points, remainingBalance: newBalance, facilityId };
    setRewardTransactions(prev => [newTX, ...prev]);
    updateUserPoints(userId, newBalance);
  };

  const updateUserPoints = (userId: string, newPoints: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, rewardPoints: newPoints } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, rewardPoints: newPoints } : null);
  };

  const addFacility = (facility: Omit<Facility, 'id' | 'createdAt' | 'features'>) => setFacilities(prev => [...prev, { ...facility, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now(), features: [] }]);
  const updateFacility = (id: string, updates: Partial<Facility>) => setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteFacility = (id: string) => setFacilities(prev => prev.filter(f => f.id !== id));

  const addClass = (data: Omit<Class, 'id' | 'createdAt'>) => setClasses(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
  const updateClass = (id: string, updates: Partial<Class>) => setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteClass = (id: string) => setClasses(prev => prev.filter(c => c.id !== id));

  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (currentTrainer?.id === id) setCurrentTrainer(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateSlot = (id: string, updates: Partial<ClassSlot>) => {
    setClassSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const onAddBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = { ...booking, id: Math.random().toString(36).substr(2, 9), paymentStatus: 'paid', createdAt: Date.now(), attendanceStatus: 'pending' };
    setClassSlots(prev => prev.map(slot => {
      if (slot.id === newBooking.slotId) {
        const newCount = slot.currentBookings + newBooking.persons;
        return { ...slot, currentBookings: newCount, status: newCount >= slot.maxBookings ? 'full' : slot.status };
      }
      return slot;
    }));
    const cConfig = rewardSettings.classes;
    if (currentUser && cConfig.enabled && newBooking.type === 'class' && (cConfig.facilityIds.length === 0 || cConfig.facilityIds.includes(newBooking.facilityId))) {
       addRewardTransaction(currentUser.id, 'earned', 'booking', newBooking.id, cConfig.points, newBooking.facilityId);
       showToast(`Earned ${cConfig.points} points!`, 'success');
    }
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const buyMembership = (m: Membership) => {
    if (!currentUser) return;
    let finalPrice = m.price;
    if (m.directDiscountEnabled && m.directDiscountValue) {
      if (m.directDiscountType === 'flat') finalPrice = Math.max(0, m.price - m.directDiscountValue);
      else finalPrice = Math.max(0, m.price * (1 - (m.directDiscountValue / 100)));
    }
    const newUserMembership: UserMembership = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, membershipId: m.id, facilityId: m.facilityId, title: m.title, startDate: Date.now(), endDate: Date.now() + (m.durationDays * 86400000), price: finalPrice, allow24Hour: m.allow24Hour, startTime: m.startTime, endTime: m.endTime, daysOfWeek: m.daysOfWeek, status: 'active', purchasedAt: Date.now() };
    setUserMemberships(prev => [...prev, newUserMembership]);
    const mConfig = rewardSettings.memberships;
    if (mConfig.enabled && (mConfig.facilityIds.length === 0 || mConfig.facilityIds.includes(m.facilityId))) {
       const pts = m.rewardPointsEnabled ? m.rewardPointsValue || mConfig.points : mConfig.points;
       addRewardTransaction(currentUser.id, 'earned', 'membership', newUserMembership.id, pts, m.facilityId);
       showToast(`Earned ${pts} points!`, 'success');
    }
    showToast('Membership activated!', 'success');
  };

  const bookBlock = (block: Block, participantNames: string[]) => {
    if (!currentUser) return;
    const newBB: BlockBooking = { id: Math.random().toString(36).substr(2, 9), blockId: block.id, userId: currentUser.id, userName: currentUser.fullName, userEmail: currentUser.email, facilityId: block.facilityId, trainerId: block.trainerId, startDate: block.startDate, participantNames, bookingAmountPaid: true, status: 'upcoming', amount: block.reservedAmount || block.totalAmount, createdAt: Date.now() };
    const bConfig = rewardSettings.blocks;
    if (bConfig.enabled && (bConfig.facilityIds.length === 0 || bConfig.facilityIds.includes(block.facilityId))) {
      addRewardTransaction(currentUser.id, 'earned', 'block', newBB.id, bConfig.points, block.facilityId);
      showToast(`Earned ${bConfig.points} points!`, 'success');
    }
    const newPayments: BlockWeeklyPayment[] = [];
    const calculatedWeeklyAmount = (block.totalAmount - (block.reservedAmount || 0)) / block.numWeeks;
    for (let i = 1; i <= block.numWeeks; i++) {
      newPayments.push({ id: Math.random().toString(36).substr(2, 9), blockBookingId: newBB.id, userId: currentUser.id, weekNumber: i, amount: calculatedWeeklyAmount, dueDate: block.startDate + (i - 1) * 7 * 86400000, status: 'pending' });
    }
    setBlockBookings(prev => [...prev, newBB]);
    setBlockPayments(prev => [...prev, ...newPayments]);
    showToast('Block joined successfully!', 'success');
  };

  const buyPass = (pass: Pass) => {
    if (!currentUser) return;
    const newUserPass: UserPass = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, passId: pass.id, facilityId: pass.facilityId, name: pass.name, totalCredits: pass.credits, remainingCredits: pass.credits, personsPerBooking: pass.personsPerBooking, isAllClasses: pass.isAllClasses, allowedClassIds: pass.allowedClassIds, purchasedAt: Date.now(), status: 'active', pricePaid: pass.price, paymentStatus: 'paid' };
    const pConfig = rewardSettings.passes;
    if (pConfig.enabled && (pConfig.facilityIds.length === 0 || pConfig.facilityIds.includes(pass.facilityId))) {
      addRewardTransaction(currentUser.id, 'earned', 'pass', newUserPass.id, pConfig.points, pass.facilityId);
      showToast(`Earned ${pConfig.points} points!`, 'success');
    }
    setUserPasses(prev => [...prev, newUserPass]);
    showToast('Pass purchased!', 'success');
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = { ...order, id: Math.random().toString(36).substr(2, 9), paymentStatus: 'paid', createdAt: Date.now() };
    const oConfig = rewardSettings.orders;
    if (currentUser && oConfig.enabled && (oConfig.facilityIds.length === 0 || oConfig.facilityIds.includes(newOrder.facilityId))) {
      addRewardTransaction(currentUser.id, 'earned', 'order', newOrder.id, oConfig.points, newOrder.facilityId);
      showToast(`Earned ${oConfig.points} points!`, 'success');
    }
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const registerUser = (userData: Omit<User, 'id' | 'status' | 'createdAt'>) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) { setCurrentUser(existing); return; }
    const newUser: User = { ...userData, id: Math.random().toString(36).substr(2, 9), status: 'active', createdAt: Date.now(), paymentCards: userData.paymentCards || [], rewardPoints: 0 };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  return (
    <HashRouter>
      <GlobalHeader />
      <div className="pt-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/*" element={
            <AppHub 
              facilities={facilities} classes={classes} trainers={trainers} locations={locations} classSlots={classSlots}
              products={products} bookings={bookings} cart={cart} orders={orders} users={users}
              passes={passes} userPasses={userPasses} memberships={memberships} userMemberships={userMemberships}
              blocks={blocks} blockBookings={blockBookings} blockPayments={blockPayments} measurements={measurements} photoLogs={photoLogs}
              rewardTransactions={rewardTransactions} rewardSettings={rewardSettings} onRedeemPoints={(pts, src, ref) => currentUser && addRewardTransaction(currentUser.id, 'used', src as any, ref, pts)}
              currentUser={currentUser} onRegisterUser={registerUser} onUpdateUser={(id, up) => setUsers(p => p.map(u => u.id === id ? {...u, ...up} : u))} onLogout={() => setCurrentUser(null)} onDeleteUser={(id) => setUsers(p => p.filter(u => u.id !== id))}
              onAddBooking={onAddBooking} onUpdateBooking={updateBooking}
              onUpdateBlockBooking={(id, up) => setBlockBookings(p => p.map(b => b.id === id ? {...b, ...up} : b))}
              onUpdateOrder={(id, up) => setOrders(p => p.map(o => o.id === id ? {...o, ...up} : o))}
              onUpdateUserMembership={(id, up) => setUserMemberships(p => p.map(m => m.id === id ? {...m, ...up} : m))}
              onAddToCart={(it) => setCart(p => {
                const existing = p.find(i => i.productId === it.productId && i.size === it.size);
                if (existing) {
                  return p.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + it.quantity } : i);
                }
                return [...p, it];
              })} 
              updateCartQuantity={(id, d) => setCart(p => p.map(i => i.id === id ? {...i, quantity: i.quantity + d} : i))} removeFromCart={(id) => setCart(p => p.filter(i => i.id !== id))}
              onAddOrder={addOrder} onBuyPass={buyPass} onUsePass={(id, c) => setUserPasses(p => p.map(up => up.id === id ? {...up, remainingCredits: up.remainingCredits - c} : up))}
              onBookBlock={bookBlock} onPayWeeklyBlock={(id) => setBlockPayments(p => p.map(py => py.id === id ? {...py, status: 'paid'} : py))} onBuyMembership={buyMembership}
              onAddMeasurement={(m) => setMeasurements(p => [...p, {...m, id: Math.random().toString(36).substr(2, 9)}])} onAddPhotoLog={(ph) => setPhotoLogs(p => [...p, {...ph, id: Math.random().toString(36).substr(2, 9)}])}
              onDeletePhotoLog={(id) => setPhotoLogs(p => p.filter(ph => ph.id !== id))}
              tickets={tickets} onAddTicket={onAddTicket} onReplyTicket={onReplyTicket}
            />
          } />
          <Route path="/trainer/*" element={
            <TrainerApp trainers={trainers} classSlots={classSlots} bookings={bookings} classes={classes} facilities={facilities} locations={locations} currentTrainer={currentTrainer} onTrainerLogin={(t) => setCurrentTrainer(t)} onTrainerLogout={() => setCurrentTrainer(null)} onUpdateTrainer={updateTrainer} onUpdateSlot={updateSlot} onUpdateBooking={updateBooking} 
              tickets={tickets} onAddTicket={onAddTicket} onReplyTicket={onReplyTicket}
            />
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminPanel 
              facilities={facilities} onAdd={addFacility} onUpdate={updateFacility} onDelete={deleteFacility}
              classes={classes} onAddClass={addClass} onUpdateClass={updateClass} onDeleteClass={deleteClass}
              trainers={trainers} onAddTrainer={(t) => setTrainers(p => [...p, { ...t, id: Math.random().toString(36).substr(2,9), createdAt: Date.now(), isFirstLogin: true, password: '', speciality: '', experience: '' }])}
              onUpdateTrainer={updateTrainer}
              onDeleteTrainer={(id) => setTrainers(p => p.filter(t => t.id !== id))}
              locations={locations} onAddLocation={(l) => setLocations(prev => [...prev, {...l, id: Math.random().toString(36).substr(2,9), createdAt: Date.now()}])}
              onUpdateLocation={(id, up) => setLocations(prev => prev.map(loc => loc.id === id ? {...loc, ...up} : loc))}
              onDeleteLocation={(id) => setLocations(prev => prev.filter(loc => loc.id !== id))}
              classSlots={classSlots} onAddClassSlot={(s) => setClassSlots(p => [...p, { ...s, id: Math.random().toString(36).substr(2,9), trainerStatus: 'accepted', isDelivered: false }])}
              onUpdateClassSlot={updateSlot}
              onDeleteClassSlot={(id) => setClassSlots(p => p.filter(s => s.id !== id))}
              products={products} onAddProduct={(p) => setProducts(pr => [...pr, {...p, id: Math.random().toString(36).substr(2,9), createdAt: Date.now()}])}
              onUpdateProduct={(id, up) => setProducts(p => p.map(pr => pr.id === id ? {...pr, ...up} : pr))}
              onDeleteProduct={(id) => setProducts(p => p.filter(pr => pr.id !== id))}
              passes={passes} onAddPass={(p) => setPasses(ps => [...ps, {...p, id: Math.random().toString(36).substr(2,9), createdAt: Date.now()}])}
              onUpdatePass={(id, up) => setPasses(p => p.map(ps => ps.id === id ? {...ps, ...up} : ps))}
              onDeletePass={(id) => setPasses(p => p.filter(ps => ps.id !== id))}
              memberships={memberships} onAddMembership={(m) => setMemberships(mb => [...mb, {...m, id: Math.random().toString(36).substr(2,9), createdAt: Date.now()}])}
              onUpdateMembership={(id, up) => setMemberships(p => p.map(mb => mb.id === id ? {...mb, ...up} : mb))}
              onDeleteMembership={(id) => setMemberships(p => p.filter(mb => mb.id !== id))}
              blocks={blocks} onAddBlock={(b) => setBlocks(bk => [...bk, {...b, id: Math.random().toString(36).substr(2,9), createdAt: Date.now()}])}
              onUpdateBlock={(id, up) => setBlocks(p => p.map(bk => bk.id === id ? {...bk, ...up} : bk))}
              onDeleteBlock={(id) => setBlocks(p => p.filter(bk => bk.id !== id))}
              users={users} onUpdateUser={(id, up) => setUsers(p => p.map(u => u.id === id ? {...u, ...up} : u))}
              onDeleteUser={(id) => setUsers(p => p.filter(u => u.id !== id))}
              bookings={bookings} onUpdateBooking={updateBooking}
              orders={orders} onUpdateOrder={(id, up) => setOrders(p => p.map(o => o.id === id ? {...o, ...up} : o))}
              blockBookings={blockBookings} blockPayments={blockPayments} userPasses={userPasses} userMemberships={userMemberships}
              onUpdateUserMembership={(id, up) => setUserMemberships(p => p.map(m => m.id === id ? {...m, ...up} : m))}
              onUpdateBlockBooking={(id, up) => setBlockBookings(p => p.map(b => b.id === id ? {...b, ...up} : b))}
              onUpdateUserPass={(id, up) => setUserPasses(p => p.map(up => up.id === id ? {...up, ...up} : up))}
              onDeleteUserPass={(id) => setUserPasses(p => p.filter(up => up.id !== id))}
              measurements={measurements} photoLogs={photoLogs} rewardSettings={rewardSettings} rewardTransactions={rewardTransactions}
              onUpdateRewardSettings={(s) => setRewardSettings(s)}
              onResetSystem={handleResetSystem}
              tickets={tickets} onReplyTicket={onReplyTicket} onUpdateTicketStatus={onUpdateTicketStatus}
            />
          } />
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