import React, { useState, useMemo } from 'react';
import { Plus, Menu, BookOpen, Edit3, Trash2, Clock, Package, Image as ImageIcon, Search, Filter, User, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { Facility, Class, Trainer, Location, ClassSlot } from '../../types';
import ClassFormModal from './ClassFormModal';
import ConfirmationModal from './ConfirmationModal';

interface ClassesViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  classSlots: ClassSlot[];
  onAddClass: (c: any) => void;
  onUpdateClass: (id: string, updates: any) => void;
  onDeleteClass: (id: string) => void;
  onOpenSidebar: () => void;
}

const ClassesView: React.FC<ClassesViewProps> = ({ 
  facilities, classes, trainers, locations, classSlots, onAddClass, onUpdateClass, onDeleteClass, onOpenSidebar 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      // Search by name
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Filter by status
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      
      // Filter by Facility
      if (facilityFilter !== 'all' && c.facilityId !== facilityFilter) return false;

      // Filter by Trainer (via ClassSlots)
      if (trainerFilter !== 'all') {
        const hasTrainer = classSlots.some(slot => slot.classId === c.id && slot.trainerId === trainerFilter);
        if (!hasTrainer) return false;
      }

      return true;
    });
  }, [classes, classSlots, searchQuery, statusFilter, trainerFilter, facilityFilter]);

  const grouped = useMemo(() => {
    return facilities.reduce((acc, f) => {
      const facilityClasses = filteredClasses.filter(c => c.facilityId === f.id);
      if (facilityClasses.length > 0 || (facilityFilter === f.id || facilityFilter === 'all')) {
        acc[f.id] = facilityClasses;
      }
      return acc;
    }, {} as Record<string, Class[]>);
  }, [facilities, filteredClasses, facilityFilter]);

  const handleEdit = (c: Class) => {
    setEditingClass(c);
    setIsFormOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingClass) onUpdateClass(editingClass.id, data);
    else onAddClass(data);
    setIsFormOpen(false);
    setEditingClass(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteClass(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left flex items-center gap-3">
              <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Curriculum Engine</h2>
                <p className="text-slate-500 text-xs md:text-sm font-medium">Manage class definitions across the network.</p>
              </div>
            </div>
            <button 
              onClick={() => { setEditingClass(null); setSelectedFacilityId(''); setIsFormOpen(true); }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm uppercase tracking-tight"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search class title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={facilityFilter} 
                onChange={(e) => setFacilityFilter(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer max-w-[120px]"
              >
                <option value="all">All Hubs</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={trainerFilter} 
                onChange={(e) => setTrainerFilter(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer max-w-[120px]"
              >
                <option value="all">All Coaches</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-12 pb-24">
        {(Object.entries(grouped) as [string, Class[]][]).map(([facId, facClasses]) => {
          const f = facilities.find(fac => fac.id === facId);
          if (!f) return null;
          
          if (facilityFilter !== 'all' && facilityFilter !== facId) return null;

          return (
            <div key={facId} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-md text-blue-600"><BookOpen className="w-5 h-5" /></div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{f.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{facClasses.length} matches found</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facClasses.length > 0 ? facClasses.map(c => (
                  <div key={c.id} className={`bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col ${c.status === 'inactive' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    <div className="aspect-video relative bg-slate-50 overflow-hidden border-b border-slate-100">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={c.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon className="w-10 h-10" /></div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <div className="bg-white/95 backdrop-blur rounded-sm px-2 py-0.5 text-[9px] font-black uppercase text-blue-600 shadow-sm border border-slate-100">{c.level}</div>
                        <div className={`backdrop-blur rounded-sm px-2 py-0.5 text-[9px] font-black uppercase shadow-sm border ${c.status === 'active' ? 'bg-green-500/90 text-white border-green-600' : 'bg-red-500/90 text-white border-red-600'}`}>
                          {c.status}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(c)} className="p-2 bg-white/95 backdrop-blur rounded-md text-blue-600 hover:bg-blue-600 hover:text-white shadow-md transition-all border border-slate-200"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeletingId(c.id)} className="p-2 bg-white/95 backdrop-blur rounded-md text-red-600 hover:bg-red-600 hover:text-white shadow-md transition-all border border-slate-200"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="p-6 text-left flex-1 flex flex-col">
                      <h4 className="font-bold text-lg mb-1 uppercase tracking-tight text-slate-900 leading-tight">{c.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed flex-1">{c.shortDescription}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5" /> {c.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-2 py-1 rounded-sm">
                           <Package className="w-3 h-3" /> Requirements
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Zero matching class records at this hub</p>
                  </div>
                )}
                
                {!searchQuery && (
                  <button 
                    onClick={() => { setSelectedFacilityId(facId); setEditingClass(null); setIsFormOpen(true); }}
                    className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 min-h-[250px] group shadow-inner"
                  >
                    <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-5 h-5" /></div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">New Specification</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <div className="py-32 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 uppercase">No Matches Found</h3>
            <p className="text-slate-400 text-sm font-medium mt-2">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTrainerFilter('all');
                setFacilityFilter('all');
              }}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ClassFormModal 
          editingClass={editingClass} 
          facilities={facilities} 
          initialFacilityId={selectedFacilityId}
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
        />
      )}

      {deletingId && (
        <ConfirmationModal
          title="Delete Class?"
          message="Are you sure you want to remove this class from the curriculum? This action cannot be undone."
          confirmText="Delete Class"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default ClassesView;