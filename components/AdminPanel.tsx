
import React, { useState, useRef } from 'react';
import { useNavigate, Link, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { 
  Plus, Search, Trash2, Edit3, Settings, LayoutDashboard,
  Sparkles, Loader2, X, Bold, Italic, List, Image as ImageIcon,
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag, CloudUpload,
  ArrowLeft, ChevronRight, CheckCircle2, Dumbbell, Flower2, Activity,
  Clock, Package, MoreVertical, Info, Menu, Signal, Calendar, MapPin, User
} from 'lucide-react';
import { Facility, Class, TimetableEntry, FEATURE_MODULES, CLASS_LEVELS, DAYS_OF_WEEK } from '../types';
import { generateFacilityDescription } from '../geminiService';
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
  timetable: TimetableEntry[];
  onAddTimetable: (t: Omit<TimetableEntry, 'id'>) => void;
  onUpdateTimetable: (id: string, updates: Partial<TimetableEntry>) => void;
  onDeleteTimetable: (id: string) => void;
}

const IconMap: Record<string, any> = {
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag, Calendar
};

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  facilities, onAdd, onUpdate, onDelete,
  classes, onAddClass, onUpdateClass, onDeleteClass,
  timetable, onAddTimetable, onUpdateTimetable, onDeleteTimetable
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [isTimetableFormOpen, setIsTimetableFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingTimetableId, setEditingTimetableId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const classFileInputRef = useRef<HTMLInputElement>(null);

  // Facility Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Activity',
    imageUrl: '',
    isActive: true
  });

  // Class Form State
  const [classFormData, setClassFormData] = useState({
    facilityId: '',
    name: '',
    shortDescription: '',
    duration: '',
    requirements: '',
    level: 'All Levels',
    imageUrl: ''
  });

  // Timetable Form State
  const [timetableFormData, setTimetableFormData] = useState({
    facilityId: '',
    classId: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    instructor: '',
    room: ''
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: 'Activity', imageUrl: '', isActive: true });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const resetClassForm = () => {
    setClassFormData({ facilityId: '', name: '', shortDescription: '', duration: '', requirements: '', level: 'All Levels', imageUrl: '' });
    setEditingClassId(null);
    setIsClassFormOpen(false);
  };

  const resetTimetableForm = () => {
    setTimetableFormData({ facilityId: '', classId: '', day: 'Monday', startTime: '09:00', endTime: '10:00', instructor: '', room: '' });
    setEditingTimetableId(null);
    setIsTimetableFormOpen(false);
  };

  const handleEditFacility = (f: Facility) => {
    setFormData({
      name: f.name,
      description: f.description,
      icon: f.icon,
      imageUrl: f.imageUrl || '',
      isActive: f.isActive
    });
    setEditingId(f.id);
    setIsFormOpen(true);
  };

  const handleEditClass = (c: Class) => {
    setClassFormData({
      facilityId: c.facilityId,
      name: c.name,
      shortDescription: c.shortDescription,
      duration: c.duration,
      requirements: c.requirements,
      level: c.level || 'All Levels',
      imageUrl: c.imageUrl || ''
    });
    setEditingClassId(c.id);
    setIsClassFormOpen(true);
  };

  const handleEditTimetable = (t: TimetableEntry) => {
    setTimetableFormData({
      facilityId: t.facilityId,
      classId: t.classId,
      day: t.day,
      startTime: t.startTime,
      endTime: t.endTime,
      instructor: t.instructor,
      room: t.room || ''
    });
    setEditingTimetableId(t.id);
    setIsTimetableFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'facility' | 'class') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'facility') setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        else setClassFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const desc = await generateFacilityDescription(formData.name);
    if (editorRef.current) {
      editorRef.current.innerHTML = desc;
    }
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, description: editorRef.current!.innerHTML }));
    }
  };

  const SidebarItem = ({ to, icon: Icon, label, disabled = false }: { to: string, icon: any, label: string, disabled?: boolean }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={disabled ? location.pathname : to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
          isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'
        } ${disabled ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
      >
        <Icon className="w-5 h-5" />
        {label}
        {disabled && <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 uppercase">WIP</span>}
      </Link>
    );
  };

  const TimetableManagement = () => {
    const grouped = facilities.reduce((acc, f) => {
      acc[f.id] = timetable.filter(t => t.facilityId === f.id);
      return acc;
    }, {} as Record<string, TimetableEntry[]>);

    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Timetable Management</h2>
                <p className="text-slate-500 text-xs md:text-sm">Schedule classes across your facilities.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsTimetableFormOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <Plus className="w-5 h-5" />
              Add Schedule
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-12 pb-24">
          {facilities.map(f => (
            <div key={f.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Calendar className="w-5 h-5" /></div>
                <div className="text-left">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{f.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{grouped[f.id]?.length || 0} scheduled sessions</p>
                </div>
              </div>
              
              <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-6 py-4">Session</th>
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Staff / Room</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {grouped[f.id]?.sort((a,b) => DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day)).map(t => {
                        const targetClass = classes.find(c => c.id === t.classId);
                        return (
                          <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="font-bold text-slate-900">{targetClass?.name || 'Unknown Class'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-tight">{t.day}</span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {t.startTime} - {t.endTime}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {t.instructor}</div>
                                {t.room && <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t.room}</div>}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEditTimetable(t)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => onDeleteTimetable(t.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {grouped[f.id]?.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-sm">No classes scheduled for this location.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ClassesManagement = () => {
    const grouped = facilities.reduce((acc, f) => {
      acc[f.id] = classes.filter(c => c.facilityId === f.id);
      return acc;
    }, {} as Record<string, Class[]>);

    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Classes Management</h2>
                <p className="text-slate-500 text-xs md:text-sm">Organize sessions for each facility.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsClassFormOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <Plus className="w-5 h-5" />
              New Class
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-12 pb-24">
          {facilities.map(f => (
            <div key={f.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><BookOpen className="w-5 h-5" /></div>
                <div className="text-left">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{f.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{grouped[f.id]?.length || 0} active classes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[f.id]?.map(c => (
                  <div key={c.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                    <div className="aspect-video relative bg-slate-50 overflow-hidden">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={c.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon className="w-10 h-10" /></div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-[10px] font-black uppercase text-blue-600 shadow-sm">{c.level}</div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => handleEditClass(c)} className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-blue-600 hover:bg-white shadow-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteClass(c.id)} className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-red-600 hover:bg-white shadow-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="p-6 text-left flex-1 flex flex-col">
                      <h4 className="font-bold text-lg mb-1">{c.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-1">{c.shortDescription}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                           <Clock className="w-3.5 h-3.5" /> {c.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 tracking-widest">
                           <Package className="w-3.5 h-3.5" /> Required Gear
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => { setClassFormData(p => ({ ...p, facilityId: f.id })); setIsClassFormOpen(true); }}
                  className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 min-h-[250px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                  <span className="font-bold text-sm">Add Session to {f.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FacilityDetail = () => {
    const { id } = useParams();
    const facility = facilities.find(f => f.id === id);
    if (!facility) return <div className="p-20 text-center font-bold text-slate-400">Facility Not Found</div>;

    const toggleFeature = (featureId: string) => {
      const currentFeatures = facility.features || [];
      const newFeatures = currentFeatures.includes(featureId)
        ? currentFeatures.filter(fid => fid !== featureId)
        : [...currentFeatures, featureId];
      onUpdate(facility.id, { features: newFeatures });
    };

    return (
      <div className="p-4 md:p-8 lg:mt-14 mt-12 pb-24">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/admin')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{facility.name}</h2>
              <button 
                onClick={() => handleEditFacility(facility)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                title="Edit Base Info"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 font-medium text-sm md:text-base">Manage enabled features and site visibility.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-left flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Service Management
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURE_MODULES.map(module => {
                const isEnabled = facility.features?.includes(module.id);
                const ModuleIcon = IconMap[module.icon] || ShoppingBag;
                return (
                  <div 
                    key={module.id} 
                    className={`flex items-center justify-between p-4 md:p-6 rounded-3xl border-2 transition-all ${isEnabled ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className={`p-3 md:p-4 rounded-[20px] ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <ModuleIcon className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg md:text-xl text-slate-900">{module.name}</p>
                        <p className="text-[10px] md:text-xs text-slate-500">Toggle {module.name.toLowerCase()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleFeature(module.id)}
                      className={`px-4 md:px-8 py-2 md:py-3 rounded-2xl font-bold text-xs md:text-sm transition-all shadow-sm ${isEnabled ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {isEnabled ? 'Remove' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100">
               <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[32px] text-white">
                  <div className="text-left">
                    <p className="font-bold text-lg">Visibility Status</p>
                    <p className="text-sm text-white/50">{facility.isActive ? 'Facility is live in the app' : 'Facility is currently hidden'}</p>
                  </div>
                  <button 
                    onClick={() => onUpdate(facility.id, { isActive: !facility.isActive })}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all ${facility.isActive ? 'bg-white/10 hover:bg-white/20' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {facility.isActive ? 'Go Offline' : 'Publish Live'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MainFacilitiesView = () => (
    <>
      <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Facility Network</h2>
              <p className="text-slate-500 text-xs md:text-sm">Manage location profiles and descriptions.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            <Plus className="w-5 h-5" />
            Add Facility
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Find a facility..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 md:px-8 py-5">Facility Details</th>
                  <th className="px-6 md:px-8 py-5 hidden md:table-cell">Modules</th>
                  <th className="px-6 md:px-8 py-5">Visibility</th>
                  <th className="px-6 md:px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 md:px-8 py-6">
                      <div className="flex items-center gap-4 md:gap-5 cursor-pointer" onClick={() => navigate(`facility/${f.id}`)}>
                        {f.imageUrl ? (
                          <img src={f.imageUrl} className="w-10 h-10 md:w-14 md:h-14 rounded-2xl object-cover ring-2 ring-slate-100" />
                        ) : (
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600"><Dumbbell className="w-6 h-6" /></div>
                        )}
                        <div className="text-left">
                          <div className="font-bold text-base md:text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{f.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-tight">Configure Features <ChevronRight className="w-3 h-3" /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-6 hidden md:table-cell">
                      <div className="flex gap-1.5 flex-wrap max-w-[240px]">
                        {f.features?.length > 0 ? f.features.map(feat => (
                          <span key={feat} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase" title={feat}>
                            {feat.charAt(0)}
                          </span>
                        )) : <span className="text-slate-300 text-xs italic">Minimal Hub</span>}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-6">
                      <span className={`px-3 md:px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${f.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {f.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 md:gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-x-2 lg:group-hover:translate-x-0">
                        <button onClick={() => handleEditFacility(f)} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Meta Data"><Edit3 className="w-4 h-4 md:w-5 md:h-5" /></button>
                        <button onClick={() => onDelete(f.id)} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Remove Facility"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[140] lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-black text-white flex flex-col p-8 fixed lg:h-full h-full lg:mt-14 mt-0 shadow-2xl z-[150] transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="text-2xl font-bold mb-12 flex items-center gap-3">
          <div className="bg-white text-black p-1.5 rounded-xl">121</div>
          <span className="tracking-tighter">Admin</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-3">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Facilities" />
          <SidebarItem to="/admin/classes" icon={BookOpen} label="Classes Hub" />
          <SidebarItem to="/admin/timetable" icon={Calendar} label="Timetable" />
          <SidebarItem to="/admin/blocks" icon={Layers} label="Blocks" disabled />
          <SidebarItem to="/admin/passes" icon={Ticket} label="Passes" disabled />
          <SidebarItem to="/admin/memberships" icon={CreditCard} label="Memberships" disabled />
          <SidebarItem to="/admin/marketplace" icon={ShoppingBag} label="Marketplace" disabled />
        </nav>
        <Link to="/" className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-white transition-all text-sm font-bold border-t border-white/10 mt-auto mb-16">
          <ArrowLeft className="w-4 h-4" />
          Sign Out
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 bg-slate-50 min-h-screen">
        <Routes>
          <Route index element={<MainFacilitiesView />} />
          <Route path="facility/:id" element={<FacilityDetail />} />
          <Route path="classes" element={<ClassesManagement />} />
          <Route path="timetable" element={<TimetableManagement />} />
          <Route path="*" element={<UnderDevelopment title="Module" />} />
        </Routes>
      </main>

      {/* Facility Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={resetForm}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{editingId ? 'Edit Profile' : 'New Location'}</h3>
              <button onClick={resetForm} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const desc = editorRef.current?.innerHTML || formData.description;
              if (editingId) onUpdate(editingId, { ...formData, description: desc });
              else onAdd({ ...formData, description: desc });
              resetForm();
            }} className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto text-left pb-24 scrollbar-hide">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Location Title</label>
                <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-lg" placeholder="e.g. 121 Wellness Hub" />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Facility Media</label>
                <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-blue-500 transition-colors">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                  ) : (
                    <div className="text-center p-6"><CloudUpload className="mx-auto mb-3 text-slate-300 w-10 h-10" /><p className="text-xs font-bold text-slate-400 uppercase">Upload Cover Photo</p></div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'facility')} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">About Facility</label>
                  <button type="button" onClick={handleAiDescription} disabled={isGenerating || !formData.name} className="text-[10px] flex items-center gap-1.5 font-black text-blue-600 disabled:opacity-50 uppercase tracking-widest border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Gemini AI Write
                  </button>
                </div>
                <div className="border border-slate-200 rounded-[28px] overflow-hidden bg-slate-50">
                  <div className="flex items-center gap-1 p-3 bg-white border-b border-slate-200">
                    <button type="button" onClick={() => execCommand('bold')} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"><Bold className="w-4 h-4" /></button>
                    <button type="button" onClick={() => execCommand('italic')} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"><Italic className="w-4 h-4" /></button>
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"><List className="w-4 h-4" /></button>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    className="w-full min-h-[180px] p-6 outline-none prose prose-blue max-w-none text-slate-700 text-sm bg-white"
                    onBlur={() => setFormData(prev => ({ ...prev, description: editorRef.current?.innerHTML || '' }))}
                    dangerouslySetInnerHTML={{ __html: formData.description }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">Facility Visibility</p>
                  <p className="text-xs text-slate-500">Show or hide this location.</p>
                </div>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-6 h-6 accent-blue-600 rounded-lg" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                <button type="button" onClick={resetForm} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Form Modal */}
      {isClassFormOpen && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={resetClassForm}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{editingClassId ? 'Update Session' : 'Create Class'}</h3>
              <button onClick={resetClassForm} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingClassId) onUpdateClass(editingClassId, classFormData);
              else onAddClass(classFormData);
              resetClassForm();
            }} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Host Facility</label>
                <select required value={classFormData.facilityId} onChange={e => setClassFormData(p => ({ ...p, facilityId: e.target.value }))} className="w-full px-6 py-4 bg-white border border-blue-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 font-bold text-slate-900">
                  <option value="">Choose location...</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Class Title</label>
                <input required value={classFormData.name} onChange={e => setClassFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Power Lifting" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Class Level</label>
                  <div className="relative">
                    <Signal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      required 
                      value={classFormData.level} 
                      onChange={e => setClassFormData(p => ({ ...p, level: e.target.value }))} 
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none"
                    >
                      {CLASS_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Thumbnail</label>
                  <div onClick={() => classFileInputRef.current?.click()} className="h-[56px] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden text-[10px] font-black uppercase text-slate-400 hover:bg-slate-100 transition-colors">
                    {classFormData.imageUrl ? "✓ Image Attached" : "Upload Thumbnail"}
                    <input type="file" ref={classFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'class')} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required value={classFormData.duration} onChange={e => setClassFormData(p => ({ ...p, duration: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. 1 hour" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quick Intro</label>
                <textarea required value={classFormData.shortDescription} onChange={e => setClassFormData(p => ({ ...p, shortDescription: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[100px] text-sm leading-relaxed" placeholder="Briefly describe the session..." />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Member Checklist</label>
                <div className="relative">
                   <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input required value={classFormData.requirements} onChange={e => setClassFormData(p => ({ ...p, requirements: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Sweat towel" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/90 backdrop-blur-md pb-4">
                <button type="button" onClick={resetClassForm} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-extrabold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Publish Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timetable Form Modal */}
      {isTimetableFormOpen && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={resetTimetableForm}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{editingTimetableId ? 'Edit Schedule' : 'Schedule Class'}</h3>
              <button onClick={resetTimetableForm} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingTimetableId) onUpdateTimetable(editingTimetableId, timetableFormData);
              else onAddTimetable(timetableFormData);
              resetTimetableForm();
            }} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Facility</label>
                <select required value={timetableFormData.facilityId} onChange={e => setTimetableFormData(p => ({ ...p, facilityId: e.target.value, classId: '' }))} className="w-full px-6 py-4 bg-white border border-blue-100 rounded-2xl outline-none font-bold text-slate-900">
                  <option value="">Choose location...</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Class Session</label>
                <select required value={timetableFormData.classId} onChange={e => setTimetableFormData(p => ({ ...p, classId: e.target.value }))} disabled={!timetableFormData.facilityId} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold disabled:opacity-50">
                  <option value="">Select class...</option>
                  {classes.filter(c => c.facilityId === timetableFormData.facilityId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Day of Week</label>
                  <select required value={timetableFormData.day} onChange={e => setTimetableFormData(p => ({ ...p, day: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold">
                    {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Instructor</label>
                   <input required value={timetableFormData.instructor} onChange={e => setTimetableFormData(p => ({ ...p, instructor: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Coach Sarah" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Start Time</label>
                  <input type="time" required value={timetableFormData.startTime} onChange={e => setTimetableFormData(p => ({ ...p, startTime: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">End Time</label>
                  <input type="time" required value={timetableFormData.endTime} onChange={e => setTimetableFormData(p => ({ ...p, endTime: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Studio / Room (Optional)</label>
                <input value={timetableFormData.room} onChange={e => setTimetableFormData(p => ({ ...p, room: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Main Hall" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/90 backdrop-blur-md pb-4">
                <button type="button" onClick={resetTimetableForm} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
