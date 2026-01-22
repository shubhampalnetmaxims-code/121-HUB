
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Facility, Class, Trainer, Location as StaffLocation, ClassSlot, Product, User, DEFAULT_FACILITIES, DEFAULT_CLASSES, DEFAULT_TRAINERS, DEFAULT_LOCATIONS, DEFAULT_CLASS_SLOTS, DEFAULT_USERS } from './types';
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
    <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[100] flex items-center justify-between px-6 shadow-sm text-left">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-blue-600 transition-colors">
          <div className="bg-black text-white px-2 py-0.5 rounded text-sm">121</div>
          <span className="hidden sm:inline">Platform</span>
        </Link>
        <nav className="flex gap-1">
          <Link 
            to="/app" 
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${location.pathname.startsWith('/app') ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Layout className="w-4 h-4" />
            User App
          </Link>
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${location.pathname.startsWith('/admin') ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        </nav>
      </div>
      <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        Development Environment
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedF = localStorage.getItem('121_facilities');
    const storedC = localStorage.getItem('121_classes');
    const storedT = localStorage.getItem('121_trainers');
    const storedL = localStorage.getItem('121_locations');
    const storedS = localStorage.getItem('121_slots');
    const storedP = localStorage.getItem('121_products');
    const storedU = localStorage.getItem('121_users');
    const storedCurU = localStorage.getItem('121_current_user');
    
    if (storedF) setFacilities(JSON.parse(storedF));
    else setFacilities(DEFAULT_FACILITIES);

    if (storedC) setClasses(JSON.parse(storedC));
    else setClasses(DEFAULT_CLASSES);

    if (storedT) setTrainers(JSON.parse(storedT));
    else setTrainers(DEFAULT_TRAINERS);

    if (storedL) setLocations(JSON.parse(storedL));
    else setLocations(DEFAULT_LOCATIONS);

    if (storedS) setClassSlots(JSON.parse(storedS));
    else setClassSlots(DEFAULT_CLASS_SLOTS);

    if (storedP) setProducts(JSON.parse(storedP));
    // DEFAULT_PRODUCTS removed from logic to rely on storage, assuming storage setup elsewhere
    
    if (storedU) setUsers(JSON.parse(storedU));
    else setUsers(DEFAULT_USERS);

    if (storedCurU) setCurrentUser(JSON.parse(storedCurU));

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
      if (currentUser) {
        localStorage.setItem('121_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('121_current_user');
      }
    }
  }, [facilities, classes, trainers, locations, classSlots, products, users, currentUser, isLoading]);

  // Actions
  const addFacility = (facility: Omit<Facility, 'id' | 'createdAt' | 'features'>) => {
    setFacilities(prev => [...prev, { ...facility, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now(), features: [] }]);
    showToast('Facility added successfully', 'success');
  };
  const updateFacility = (id: string, updates: Partial<Facility>) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    showToast('Facility profile updated', 'success');
  };
  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
    showToast('Facility removed', 'info');
  };

  const addClass = (data: Omit<Class, 'id' | 'createdAt'>) => {
    setClasses(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Class created successfully', 'success');
  };
  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Class updated', 'success');
  };
  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    showToast('Class deleted', 'info');
  };

  const addTrainer = (data: Omit<Trainer, 'id' | 'createdAt'>) => {
    setTrainers(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Trainer profile added', 'success');
  };
  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Trainer profile updated', 'success');
  };
  const deleteTrainer = (id: string) => {
    setTrainers(prev => prev.filter(t => t.id !== id));
    showToast('Trainer removed', 'info');
  };

  const addLocation = (data: Omit<StaffLocation, 'id' | 'createdAt'>) => {
    setLocations(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }]);
    showToast('Area infrastructure saved', 'success');
  };
  const updateLocation = (id: string, updates: Partial<StaffLocation>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    showToast('Area updated', 'success');
  };
  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    showToast('Area removed', 'info');
  };

  const addClassSlot = (data: Omit<ClassSlot, 'id'>) => {
    setClassSlots(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) }]);
    showToast('Timetable slot added', 'success');
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
    showToast('Product listed in market', 'success');
  };
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Product details updated', 'success');
  };
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product unlisted', 'info');
  };

  const registerUser = (userData: Omit<User, 'id' | 'status' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      createdAt: Date.now()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to 121, ${userData.fullName}!`, 'success');
    
    // Notification for Admin
    addNotification('New User Registered', `${userData.fullName} has joined the platform via app onboarding.`, 'success', 'admin');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    if (updates.status === 'blocked') showToast('User access restricted', 'warning');
    else if (updates.status === 'active') showToast('User access restored', 'success');
    else showToast('User details updated', 'success');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
      showToast('Account permanently deleted', 'info');
    } else {
      showToast('Member account removed', 'info');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out of Hub', 'info');
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
                currentUser={currentUser}
                onRegisterUser={registerUser}
                onLogout={handleLogout}
                onDeleteUser={deleteUser}
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
                users={users}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
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
