
import React, { useState, useRef } from 'react';
import { useNavigate, Link, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { 
  Plus, Search, Trash2, Edit3, Settings, LayoutDashboard,
  Sparkles, Loader2, X, Bold, Italic, List, Image as ImageIcon,
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag, CloudUpload,
  ArrowLeft, ChevronRight, CheckCircle2, Dumbbell, Flower2, Activity,
  Clock, Package, MoreVertical, Info
} from 'lucide-react';
import { Facility, Class, FEATURE_MODULES } from '../types';
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
}

const IconMap: Record<string, any> = {
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag
};

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  facilities, onAdd, onUpdate, onDelete,
  classes, onAddClass, onUpdateClass, onDeleteClass
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
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
    imageUrl: ''
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: 'Activity', imageUrl: '', isActive: true });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const resetClassForm = () => {
    setClassFormData({ facilityId: '', name: '', shortDescription: '', duration: '', requirements: '', imageUrl: '' });
    setEditingClassId(null);
    setIsClassFormOpen(false);
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
      imageUrl: c.imageUrl || ''
    });
    setEditingClassId(c.id);
    setIsClassFormOpen(true);
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

  const ClassesManagement = () => {
    const grouped = facilities.reduce((acc, f) => {
      acc[f.id] = classes.filter(c => c.facilityId === f.id);
      return acc;
    }, {} as Record<string, Class[]>);

    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 mt-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-slate-900">Classes Management</h2>
              <p className="text-slate-500 text-sm">Organize sessions for each facility.</p>
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

        <div className="p-8 space-y-12 pb-24">
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
      <div className="p-8 mt-14 pb-24">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/admin')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{facility.name}</h2>
              <button 
                onClick={() => handleEditFacility(facility)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                title="Edit Base Info"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 font-medium">Manage enabled features and site visibility.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-left flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Enabled Modules
                </h3>
              </div>
              <div className="grid gap-4">
                {FEATURE_MODULES.map(module => {
                  const isEnabled = facility.features?.includes(module.id);
                  const ModuleIcon = IconMap[module.icon] || ShoppingBag;
                  return (
                    <div 
                      key={module.id} 
                      className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${isEnabled ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-[20px] ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <ModuleIcon className="w-7 h-7" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-xl text-slate-900">{module.name}</p>
                          <p className="text-sm text-slate-500">Toggle {module.name.toLowerCase()} in the hub grid.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleFeature(module.id)}
                        className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${isEnabled ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {isEnabled ? 'Remove Feature' : 'Add Feature'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white text-left relative overflow-hidden group">
              <Activity className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="font-bold text-2xl mb-6">Real-time Preview</h3>
                <div className="space-y-5 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-white/50">Active Services</span>
                    <span className="font-bold text-blue-400">{facility.features?.length || 0} Enabled</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-white/50">Hub Mode</span>
                    <span className={`font-bold ${facility.isActive ? 'text-green-400' : 'text-red-400'}`}>{facility.isActive ? 'Live' : 'Maintenance'}</span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-3">Live Hub Grid View</p>
                   <div className="grid grid-cols-4 gap-2">
                     {facility.features?.map(feat => (
                        <div key={feat} className="aspect-square bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-bold">
                           {feat.charAt(0).toUpperCase()}
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MainFacilitiesView = () => (
    <>
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 mt-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-slate-900">Facility Network</h2>
            <p className="text-slate-500 text-sm">Manage location profiles and descriptions.</p>
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

      <div className="p-8 pb-24">
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
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
                  <th className="px-8 py-5">Facility Details</th>
                  <th className="px-8 py-5">Modules</th>
                  <th className="px-8 py-5">Visibility</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5 cursor-pointer" onClick={() => navigate(`facility/${f.id}`)}>
                        {f.imageUrl ? (
                          <img src={f.imageUrl} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100" />
                        ) : (
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600"><Dumbbell className="w-6 h-6" /></div>
                        )}
                        <div className="text-left">
                          <div className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{f.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-tight">Configure Features <ChevronRight className="w-3 h-3" /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-1.5 flex-wrap max-w-[240px]">
                        {f.features?.length > 0 ? f.features.map(feat => (
                          <span key={feat} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase" title={feat}>
                            {feat.charAt(0)}
                          </span>
                        )) : <span className="text-slate-300 text-xs italic">Minimal Hub</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${f.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {f.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => handleEditFacility(f)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Meta Data"><Edit3 className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(f.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Remove Facility"><Trash2 className="w-5 h-5" /></button>
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
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-black text-white hidden lg:flex flex-col p-8 fixed h-full mt-14 shadow-2xl z-20">
        <div className="text-2xl font-bold mb-12 flex items-center gap-3">
          <div className="bg-white text-black p-1.5 rounded-xl">121</div>
          <span className="tracking-tighter">Admin</span>
        </div>
        <nav className="flex-1 space-y-3">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Facilities" />
          <SidebarItem to="/admin/classes" icon={BookOpen} label="Classes Hub" />
          <SidebarItem to="/admin/blocks" icon={Layers} label="Blocks" disabled />
          <SidebarItem to="/admin/passes" icon={Ticket} label="Passes" disabled />
          <SidebarItem to="/admin/memberships" icon={CreditCard} label="Memberships" disabled />
          <SidebarItem to="/admin/marketplace" icon={ShoppingBag} label="Marketplace" disabled />
        </nav>
        <Link to="/" className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-white transition-all text-sm font-bold border-t border-white/10 mt-auto mb-16">
          <ArrowLeft className="w-4 h-4" />
          Log Out
        </Link>
      </aside>

      <main className="flex-1 lg:ml-64 bg-slate-50 min-h-screen">
        <Routes>
          <Route index element={<MainFacilitiesView />} />
          <Route path="facility/:id" element={<FacilityDetail />} />
          <Route path="classes" element={<ClassesManagement />} />
          <Route path="*" element={<UnderDevelopment title="Module" />} />
        </Routes>
      </main>

      {/* Facility Form Modal (Restore Rich Text & Gemini) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={resetForm}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingId ? 'Edit Profile' : 'New Location'}</h3>
              <button onClick={resetForm} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const desc = editorRef.current?.innerHTML || formData.description;
              if (editingId) onUpdate(editingId, { ...formData, description: desc });
              else onAdd({ ...formData, description: desc });
              resetForm();
            }} className="flex-1 p-8 space-y-8 overflow-y-auto text-left pb-24 scrollbar-hide">
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
                  <p className="text-xs text-slate-500">Show or hide this location from members.</p>
                </div>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-6 h-6 accent-blue-600 rounded-lg" />
              </div>

              <div className="flex gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                <button type="button" onClick={resetForm} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Form Modal */}
      {isClassFormOpen && (
        <div className="fixed inset-0 z-[130] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={resetClassForm}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingClassId ? 'Update Session' : 'Create Class'}</h3>
              <button onClick={resetClassForm} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingClassId) onUpdateClass(editingClassId, classFormData);
              else onAddClass(classFormData);
              resetClassForm();
            }} className="flex-1 p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={classFormData.duration} onChange={e => setClassFormData(p => ({ ...p, duration: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. 1 hour" />
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
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quick Intro</label>
                <textarea required value={classFormData.shortDescription} onChange={e => setClassFormData(p => ({ ...p, shortDescription: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[100px] text-sm leading-relaxed" placeholder="Briefly describe the class intensity and goals..." />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Member Checklist</label>
                <div className="relative">
                   <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input required value={classFormData.requirements} onChange={e => setClassFormData(p => ({ ...p, requirements: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Sweat towel, Clean sneakers" />
                </div>
              </div>
              <div className="flex gap-4 pt-10 sticky bottom-0 bg-white/90 backdrop-blur-md pb-4">
                <button type="button" onClick={resetClassForm} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-extrabold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Publish Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
