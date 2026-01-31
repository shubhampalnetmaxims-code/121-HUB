
import React, { useState } from 'react';
import { Plus, Menu, BookOpen, Edit3, Trash2, Clock, Package, Image as ImageIcon } from 'lucide-react';
import { Facility, Class } from '../../types';
import ClassFormModal from './ClassFormModal';
import ConfirmationModal from './ConfirmationModal';

interface ClassesViewProps {
  facilities: Facility[];
  classes: Class[];
  onAddClass: (c: any) => void;
  onUpdateClass: (id: string, updates: any) => void;
  onDeleteClass: (id: string) => void;
  onOpenSidebar: () => void;
}

const ClassesView: React.FC<ClassesViewProps> = ({ facilities, classes, onAddClass, onUpdateClass, onDeleteClass, onOpenSidebar }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const grouped = facilities.reduce((acc, f) => {
    acc[f.id] = classes.filter(c => c.facilityId === f.id);
    return acc;
  }, {} as Record<string, Class[]>);

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
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Classes Management</h2>
              <p className="text-slate-500 text-xs md:text-sm font-medium">Organize curriculum and session types.</p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingClass(null); setSelectedFacilityId(''); setIsFormOpen(true); }}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm uppercase tracking-tight"
          >
            <Plus className="w-4 h-4" />
            New Class
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-12 pb-24">
        {facilities.map(f => (
          <div key={f.id} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-blue-50 rounded-md text-blue-600"><BookOpen className="w-5 h-5" /></div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{f.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{grouped[f.id]?.length || 0} registered classes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[f.id]?.map(c => (
                <div key={c.id} className={`bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col ${c.status === 'inactive' ? 'opacity-60' : ''}`}>
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
                    <h4 className="font-bold text-lg mb-1 uppercase tracking-tight text-slate-900">{c.name}</h4>
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
              ))}
              <button 
                onClick={() => { setSelectedFacilityId(f.id); setEditingClass(null); setIsFormOpen(true); }}
                className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 gap-4 hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 min-h-[250px] group shadow-inner"
              >
                <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-5 h-5" /></div>
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Add New Specification</span>
              </button>
            </div>
          </div>
        ))}
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
          message="Are you sure you want to remove this class from the schedule? This action cannot be undone."
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