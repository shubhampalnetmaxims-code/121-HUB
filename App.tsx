
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Facility, Class, TimetableEntry, DEFAULT_FACILITIES, DEFAULT_CLASSES, DEFAULT_TIMETABLE } from './types';
import LandingPage from './components/LandingPage';
import AppHub from './components/AppHub';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { Layout, ShieldCheck } from 'lucide-react';

const GlobalHeader: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[100] flex items-center justify-between px-6 shadow-sm">
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

const App: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedF = localStorage.getItem('121_facilities');
    const storedC = localStorage.getItem('121_classes');
    const storedT = localStorage.getItem('121_timetable');
    
    if (storedF) setFacilities(JSON.parse(storedF));
    else setFacilities(DEFAULT_FACILITIES);

    if (storedC) setClasses(JSON.parse(storedC));
    else setClasses(DEFAULT_CLASSES);

    if (storedT) setTimetable(JSON.parse(storedT));
    else setTimetable(DEFAULT_TIMETABLE);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('121_facilities', JSON.stringify(facilities));
      localStorage.setItem('121_classes', JSON.stringify(classes));
      localStorage.setItem('121_timetable', JSON.stringify(timetable));
    }
  }, [facilities, classes, timetable, isLoading]);

  // Facility Actions
  const addFacility = (facility: Omit<Facility, 'id' | 'createdAt' | 'features'>) => {
    const newFacility: Facility = {
      ...facility,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      features: []
    };
    setFacilities(prev => [...prev, newFacility]);
  };

  const updateFacility = (id: string, updates: Partial<Facility>) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
  };

  // Class Actions
  const addClass = (classData: Omit<Class, 'id' | 'createdAt'>) => {
    const newClass: Class = {
      ...classData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    setTimetable(prev => prev.filter(t => t.classId !== id)); // Cleanup timetable
  };

  // Timetable Actions
  const addTimetable = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTimetable(prev => [...prev, newEntry]);
  };

  const updateTimetable = (id: string, updates: Partial<TimetableEntry>) => {
    setTimetable(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTimetable = (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <HashRouter>
      <GlobalHeader />
      <div className="pt-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/*" element={<AppHub facilities={facilities} classes={classes} timetable={timetable} />} />
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
                timetable={timetable}
                onAddTimetable={addTimetable}
                onUpdateTimetable={updateTimetable}
                onDeleteTimetable={deleteTimetable}
              />
            } 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
