
import React from 'react';
import { X, Clock, BookOpen, Layers, Info, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import { Class, Facility } from '../../types';

interface ClassViewModalProps {
  cls: Class;
  facility: Facility | undefined;
  onClose: () => void;
  onEdit: () => void;
}

const ClassViewModal: React.FC<ClassViewModalProps> = ({ cls, facility, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Class Specification</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curriculum Details</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto pb-32 scrollbar-hide text-left">
          {/* Hero Image */}
          <div className="aspect-video relative bg-slate-100 rounded-[32px] overflow-hidden border border-slate-200 shadow-inner">
            {cls.imageUrl ? (
              <img src={cls.imageUrl} className="w-full h-full object-cover" alt={cls.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon className="w-16 h-16" />
              </div>
            )}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="bg-white/95 backdrop-blur rounded-md px-3 py-1 text-[10px] font-black uppercase text-blue-600 shadow-sm border border-slate-100">{cls.level}</div>
              <div className={`backdrop-blur rounded-md px-3 py-1 text-[10px] font-black uppercase shadow-sm border ${cls.status === 'active' ? 'bg-green-500/90 text-white border-green-600' : 'bg-red-500/90 text-white border-red-600'}`}>
                {cls.status}
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <section className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">{cls.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xs font-black uppercase tracking-widest">{facility?.name || 'Global Curriculum'}</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-4">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overview</p>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {cls.shortDescription}
              </p>
            </div>
          </section>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Duration</p>
              </div>
              <p className="font-extrabold text-slate-900 text-2xl leading-none mb-1">{cls.duration}</p>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Per Session</p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty Level</p>
              </div>
              <p className="font-extrabold text-slate-900 text-2xl leading-none mb-1 uppercase">{cls.level}</p>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Audience</p>
            </div>
          </div>

          {/* Full Description */}
          {cls.fullDescription && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Layers className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Curriculum</p>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {cls.fullDescription}
                </p>
              </div>
            </section>
          )}

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-[32px] border flex items-center gap-4 ${cls.status === 'active' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              {cls.status === 'active' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                <p className={`font-extrabold uppercase ${cls.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>{cls.status}</p>
              </div>
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors uppercase text-xs tracking-widest"
            >
              Back to List
            </button>
            <button 
              onClick={onEdit}
              className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
            >
              Edit Specification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassViewModal;
