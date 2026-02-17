import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Menu, Calendar, ShieldCheck, Clock, MapPin, CheckCircle2, Star, Trash2, Edit3, XCircle, RefreshCw, Share2, ShieldAlert, Users, Building, ChevronRight, X, Award, Shield, Save, BookOpen, Quote, MessageSquare, AlertTriangle } from 'lucide-react';
import { Trainer, ClassSlot, Booking, Class, Facility, DAYS_OF_WEEK } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface TrainerDetailViewProps {
  trainers: Trainer[];
  classSlots: ClassSlot[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
  onDeleteTrainer: (id: string) => void;
  onOpenSidebar: () => void;
}

const RosterModal = ({ slot, cls, facility, bookings, onClose }: { slot: ClassSlot, cls?: Class, facility?: Facility, bookings: Booking[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Participant Roster</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
              {cls?.name} • {slot.startTime} • {facility?.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
          {bookings.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">User Email</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map(b => (
                  <tr key={b.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 uppercase tracking-tight">{b.userName}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{b.userEmail}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase border ${
                        b.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        b.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">
              No registered bookings found for this session.
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Dismiss</button>
        </div>
      </div>
    </div>
  );
};

const TrainerDetailView: React.FC<TrainerDetailViewProps> = ({ 
  trainers = [], 
  classSlots = [], 
  bookings = [], 
  classes = [], 
  facilities = [], 
  onUpdateTrainer, 
  onDeleteTrainer, 
  onOpenSidebar 
}) => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'feedback' | 'permissions'>('profile');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [viewingRosterSlot, setViewingRosterSlot] = useState<ClassSlot | null>(null);

  const trainer = trainers.find(t => t.id === trainerId);

  // Profile Edit State
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: trainer?.name || '',
    email: trainer?.email || '',
    phone: trainer?.phone || '',
    speciality: trainer?.speciality || '',
    experience: trainer?.experience || '',
    description: trainer?.description || '',
    colorCode: trainer?.colorCode || '#000000'
  });

  if (!trainer) {
    return (
      <div className="p-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">
        Record Not Found
        <button onClick={() => navigate('/admin/staff')} className="block mx-auto mt-6 text-blue-600 underline">Back to Staff</button>
      </div>
    );
  }

  const trainerSlots = classSlots.filter(s => s.trainerId === trainer.id).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  const trainerReviews = bookings.filter(b => b.trainerId === trainer.id && (b.userRating || b.userFeedback));

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${
        activeTab === id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600)); 
    onUpdateTrainer(trainer.id, editForm);
    setIsSaving(false);
    showToast('Professional profile synchronized', 'success');
  };

  const updatePermissions = (key: keyof Trainer['permissions'], value: boolean) => {
    onUpdateTrainer(trainer.id, {
      permissions: {
        ...trainer.permissions,
        [key]: value
      }
    });
    showToast('Governance permissions updated', 'success');
  };

  const getSlotStatusLabel = (s: ClassSlot) => {
    if (s.isDelivered) return 'delivered';
    if (s.trainerStatus === 'accepted') return 'upcoming';
    return s.trainerStatus;
  };

  return (
    <div className="flex flex-col min-h-screen text-left bg-slate-50/30">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md"><Menu className="w-6 h-6" /></button>
            <button onClick={() => navigate('/admin/staff')} className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-md transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{trainer.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel Detail Node</p>
            </div>
          </div>
          <button 
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md border border-red-100 hover:bg-red-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" /> Purge Account
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6 pb-40">
        {/* Identity Bar */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
           <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner shrink-0">
              {trainer.profilePicture ? <img src={trainer.profilePicture} className="w-full h-full object-cover" alt="" /> : <User className="w-10 h-10 text-slate-200" />}
           </div>
           <div className="flex-1 text-center md:text-left overflow-hidden">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">{trainer.name}</h3>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: trainer.colorCode }} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{trainer.colorCode}</span>
                 </div>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-l border-slate-200 pl-4">Network Member since {new Date(trainer.createdAt).toLocaleDateString()}</span>
              </div>
           </div>
           <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${trainer.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                Visibility: {trainer.status}
              </span>
              <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${trainer.appAccess === 'allowed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                App Access: {trainer.appAccess}
              </span>
           </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide px-1 bg-white rounded-t-xl">
          <TabButton id="profile" label="Profile" icon={User} />
          <TabButton id="schedule" label="Schedule" icon={Calendar} />
          <TabButton id="feedback" label="Feedback" icon={Star} />
          <TabButton id="permissions" label="Permissions" icon={Shield} />
        </div>

        <div className="bg-white border border-slate-200 rounded-b-xl min-h-[500px] shadow-sm overflow-hidden text-left">
          
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div className="p-8 md:p-12 animate-in fade-in duration-300">
               <form onSubmit={handleSaveProfile} className="space-y-10 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                        <input value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all text-sm" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Email</label>
                        <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({...f, email: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all text-sm" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                        <input value={editForm.phone} onChange={e => setEditForm(f => ({...f, phone: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all text-sm" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Color</label>
                        <div className="flex gap-2">
                           <input type="color" value={editForm.colorCode} onChange={e => setEditForm(f => ({...f, colorCode: e.target.value}))} className="h-12 w-14 rounded-lg cursor-pointer bg-slate-50 border border-slate-100 p-1" />
                           <input value={editForm.colorCode} onChange={e => setEditForm(f => ({...f, colorCode: e.target.value}))} className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-mono font-bold outline-none uppercase text-xs focus:bg-white" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Speciality Domain</label>
                        <input value={editForm.speciality} onChange={e => setEditForm(f => ({...f, speciality: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all text-sm" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Tenure</label>
                        <input value={editForm.experience} onChange={e => setEditForm(f => ({...f, experience: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all text-sm" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Portfolio Biography</label>
                     <textarea value={editForm.description} onChange={e => setEditForm(f => ({...f, description: e.target.value}))} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm leading-relaxed outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all min-h-[160px] italic shadow-inner" />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50">
                     <button type="submit" disabled={isSaving} className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50">
                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Profile Changes
                     </button>
                  </div>
               </form>
            </div>
          )}

          {/* SCHEDULE SECTION */}
          {activeTab === 'schedule' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                        <th className="px-8 py-5">Date and Time</th>
                        <th className="px-8 py-5">Class Name</th>
                        <th className="px-8 py-5">Facility Name</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Bookings</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {trainerSlots.length > 0 ? trainerSlots.map(s => {
                        const cls = classes.find(c => c.id === s.classId);
                        const fac = facilities.find(f => f.id === s.facilityId);
                        const dayName = DAYS_OF_WEEK[s.dayOfWeek];
                        const slotBookings = bookings.filter(b => b.slotId === s.id);
                        const status = getSlotStatusLabel(s);

                        return (
                           <tr 
                              key={s.id} 
                              className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                              onClick={() => setViewingRosterSlot(s)}
                           >
                              <td className="px-8 py-6">
                                 <p className="font-bold text-slate-900 text-xs tracking-tight uppercase leading-none mb-1.5">{dayName}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> {s.startTime}
                                 </p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="font-black text-slate-900 uppercase text-xs tracking-tight truncate max-w-[160px] leading-none">{cls?.name || 'Class'}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none flex items-center gap-1.5">
                                    <Building className="w-3 h-3" /> {fac?.name}
                                 </p>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-all ${
                                    status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                    status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    // Fix: status can only be delivered, upcoming, pending, or not-available based on getSlotStatusLabel. removed status === 'rescheduled' check.
                                    status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-red-50 text-red-700 border-red-100'
                                 }`}>
                                    {status}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex items-center justify-end gap-3 text-slate-300 group-hover:text-blue-600 transition-colors">
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 shadow-xs">
                                       <Users className="w-3.5 h-3.5" />
                                       <span className="text-[10px] font-black">{slotBookings.length}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                 </div>
                              </td>
                           </tr>
                        );
                     }) : (
                        <tr><td colSpan={5} className="py-32 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/20">Zero Assigned Shifts</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}

          {/* FEEDBACK SECTION */}
          {activeTab === 'feedback' && (
            <div className="p-10 space-y-8 animate-in fade-in duration-300">
               <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <div className="text-left">
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Qualitative Roster History</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reviews submitted by members for this coach</p>
                  </div>
                  <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                     <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Avg Rank: </span>
                     <span className="text-lg font-black text-amber-700 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        {trainerReviews.length > 0 ? (trainerReviews.reduce((a,b) => a + (b.userRating || 0), 0) / trainerReviews.length).toFixed(1) : '--'}
                     </span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trainerReviews.length > 0 ? trainerReviews.map(rev => (
                     <div key={rev.id} className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6 group transition-all hover:border-blue-200 hover:bg-white hover:shadow-sm">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0"><User className="w-5 h-5 text-slate-300" /></div>
                              <div className="text-left overflow-hidden">
                                 <p className="font-bold text-slate-900 uppercase text-xs truncate leading-none mb-1">{rev.userName}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(rev.bookingDate).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} className={`w-3 h-3 ${i < (rev.userRating || 0) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                              ))}
                           </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 relative shadow-inner">
                           <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{rev.userFeedback || 'No written feedback provided.'}"</p>
                           <Quote className="absolute -top-3 -left-2 w-7 h-7 text-blue-500/10" />
                        </div>
                        <div className="flex items-center gap-1.5 px-1">
                           <BookOpen className="w-3 h-3 text-blue-600 opacity-60" />
                           <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{classes.find(c => c.id === rev.classId)?.name}</span>
                        </div>
                     </div>
                  )) : (
                     <div className="col-span-2 py-32 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-200"><MessageSquare className="w-8 h-8" /></div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Zero Qualitative Records</p>
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* PERMISSIONS SECTION */}
          {activeTab === 'permissions' && (
            <div className="p-10 space-y-12 animate-in fade-in duration-300">
               <div className="space-y-8">
                  <div className="flex items-center gap-4 text-left border-b border-slate-100 pb-6">
                     <div className="p-3 bg-slate-900 rounded-xl text-white shadow-lg"><Shield className="w-6 h-6" /></div>
                     <div>
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none mb-1">Hub Governance</h4>
                        <p className="text-xs text-slate-500 font-medium">Control institutional authority and visibility status.</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Permissions</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:bg-slate-50/50">
                           <div className="flex items-center gap-4">
                              <XCircle className="w-5 h-5 text-slate-300" />
                              <span className="font-bold text-slate-900 text-xs uppercase tracking-tight">Cancel Cycle</span>
                           </div>
                           <input 
                              type="checkbox" 
                              checked={trainer.permissions.canCancel}
                              onChange={e => updatePermissions('canCancel', e.target.checked)}
                              className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" 
                           />
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:bg-slate-50/50">
                           <div className="flex items-center gap-4">
                              <RefreshCw className="w-5 h-5 text-slate-300" />
                              <span className="font-bold text-slate-900 text-xs uppercase tracking-tight">Reschedule Window</span>
                           </div>
                           <input 
                              type="checkbox" 
                              checked={trainer.permissions.canReschedule}
                              onChange={e => updatePermissions('canReschedule', e.target.checked)}
                              className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" 
                           />
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:bg-slate-50/50 md:col-span-2">
                           <div className="flex items-center gap-4">
                              <Share2 className="w-5 h-5 text-slate-300" />
                              <span className="font-bold text-slate-900 text-xs uppercase tracking-tight">Shift Transfer Proxy</span>
                           </div>
                           <input 
                              type="checkbox" 
                              checked={trainer.permissions.canTransfer}
                              onChange={e => updatePermissions('canTransfer', e.target.checked)}
                              className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" 
                           />
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                     <div className={`p-8 rounded-3xl border transition-all flex flex-col gap-6 ${trainer.status === 'active' ? 'border-green-600 bg-green-50/10' : 'border-red-600 bg-red-50/10'}`}>
                        <div className="flex justify-between items-start">
                           <div className="text-left space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Visibility</p>
                              <h5 className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-none">Public Status</h5>
                           </div>
                           <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${trainer.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{trainer.status}</span>
                        </div>
                        <button 
                           onClick={() => onUpdateTrainer(trainer.id, { status: trainer.status === 'active' ? 'inactive' : 'active' })}
                           className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 ${
                              trainer.status === 'active' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
                           }`}
                        >
                           Set as {trainer.status === 'active' ? 'Hidden' : 'Visible'}
                        </button>
                     </div>

                     <div className={`p-8 rounded-3xl border transition-all flex flex-col gap-6 ${trainer.appAccess === 'allowed' ? 'border-blue-600 bg-blue-50/10' : 'border-amber-600 bg-amber-50/10'}`}>
                        <div className="flex justify-between items-start">
                           <div className="text-left space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Auth</p>
                              <h5 className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-none">App Entry</h5>
                           </div>
                           <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${trainer.appAccess === 'allowed' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{trainer.appAccess}</span>
                        </div>
                        <button 
                           onClick={() => onUpdateTrainer(trainer.id, { appAccess: trainer.appAccess === 'allowed' ? 'restricted' : 'allowed' })}
                           className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 ${
                              trainer.appAccess === 'allowed' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-blue-600 text-white hover:bg-blue-700'
                           }`}
                        >
                           {trainer.appAccess === 'allowed' ? 'Suspend Access' : 'Restore Auth'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {viewingRosterSlot && (
        <RosterModal 
          slot={viewingRosterSlot}
          cls={classes.find(c => c.id === viewingRosterSlot.classId)}
          facility={facilities.find(f => f.id === viewingRosterSlot.facilityId)}
          bookings={bookings.filter(b => b.slotId === viewingRosterSlot.id)}
          onClose={() => setViewingRosterSlot(null)}
        />
      )}

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          title="Archive Profile Record?"
          message={`Delete "${trainer.name}" permanently? All qualitative records and shift history will be lost.`}
          variant="danger"
          confirmText="Confirm Purge"
          onConfirm={() => {
            onDeleteTrainer(trainer.id);
            navigate('/admin/staff');
            showToast('Personnel node terminated', 'info');
          }}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default TrainerDetailView;