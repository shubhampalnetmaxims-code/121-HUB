import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Menu, Calendar, ShieldCheck, Clock, MapPin, CheckCircle2, Star, Trash2, Edit3, XCircle, RefreshCw, Layers } from 'lucide-react';
import { Trainer, ClassSlot, Booking, Class, Facility } from '../../types';
import { useToast } from '../ToastContext';
import TrainerFormModal from './TrainerFormModal';
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

const TrainerDetailView: React.FC<TrainerDetailViewProps> = ({ 
  trainers, classSlots, bookings, classes, facilities, onUpdateTrainer, onDeleteTrainer, onOpenSidebar 
}) => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'slots' | 'bookings' | 'feedback' | 'permissions'>('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const trainer = trainers.find(t => t.id === trainerId);
  if (!trainer) {
    return (
      <div className="p-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">
        Record Not Found
        <button onClick={() => navigate('/admin/staff')} className="block mx-auto mt-6 text-blue-600 underline uppercase">Back to Staff</button>
      </div>
    );
  }

  const assignedFacilities = facilities.filter(f => trainer.facilityIds.includes(f.id));
  const trainerSlots = classSlots.filter(s => s.trainerId === trainer.id).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  const trainerBookings = bookings.filter(b => b.trainerId === trainer.id).sort((a, b) => b.bookingDate - a.bookingDate);

  const stats = {
    totalSlots: trainerSlots.length,
    acceptedSlots: trainerSlots.filter(s => s.trainerStatus === 'accepted').length,
    pendingSlots: trainerSlots.filter(s => s.trainerStatus === 'pending').length,
    deliveredSessions: trainerSlots.filter(s => s.isDelivered).length,
    paxCount: trainerBookings.filter(b => b.status === 'delivered').reduce((acc, b) => acc + b.persons, 0)
  };

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

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md"><Menu className="w-6 h-6" /></button>
          <button onClick={() => navigate('/admin/staff')} className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-md transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Coach Portfolio Audit</h2>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-6xl w-full mx-auto">
        {/* Identity Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 p-8 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border-4 border-white shadow-md shrink-0">
            {trainer.profilePicture ? (
              <img src={trainer.profilePicture} className="w-full h-full object-cover" alt="" />
            ) : (
              <User className="w-10 h-10 text-slate-200" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">{trainer.name}</h3>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: trainer.colorCode }} />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Identifier</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Joined: {new Date(trainer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-slate-50 transition-colors shadow-xs"
            >
              Modify Profile
            </button>
            <button 
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-red-700 transition-colors shadow-md"
            >
              Purge Record
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-xs text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivered</p>
              <p className="text-2xl font-black text-slate-900">{stats.deliveredSessions} Sessions</p>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-xs text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reach</p>
              <p className="text-2xl font-black text-slate-900">{stats.paxCount} Members</p>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-xs text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accepted Rate</p>
              <p className="text-2xl font-black text-slate-900">{stats.totalSlots ? Math.round((stats.acceptedSlots/stats.totalSlots)*100) : 0}%</p>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-xs text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Action</p>
              <p className="text-2xl font-black text-amber-600">{stats.pendingSlots} Slots</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide px-1">
          <TabButton id="profile" label="Professional Details" icon={User} />
          <TabButton id="slots" label="Class Slots" icon={Calendar} />
          <TabButton id="bookings" label="Member Attendance" icon={CheckCircle2} />
          <TabButton id="feedback" label="Feedback Ledger" icon={Star} />
          <TabButton id="permissions" label="Access Control" icon={ShieldCheck} />
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-slate-200 rounded-lg min-h-[400px] shadow-sm overflow-hidden text-left">
          {activeTab === 'profile' && (
            <div className="p-8 space-y-10 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speciality</label>
                        <p className="font-bold text-slate-900 uppercase text-sm tracking-tight">{trainer.speciality || 'Not specified'}</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</label>
                        <p className="font-bold text-slate-900 uppercase text-sm tracking-tight">{trainer.experience || 'Not specified'}</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Identity</label>
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-slate-600 text-xs font-bold"><Mail className="w-3.5 h-3.5 opacity-40" /> {trainer.email}</div>
                           <div className="flex items-center gap-2 text-slate-600 text-xs font-bold"><Phone className="w-3.5 h-3.5 opacity-40" /> {trainer.phone}</div>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Bio</label>
                     <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl font-medium text-xs text-slate-600 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: trainer.description }} />
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Hub Nodes</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     {assignedFacilities.map(f => (
                        <div key={f.id} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                           <MapPin className="w-4 h-4 text-blue-600" />
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{f.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                        <th className="px-8 py-5">Schedule</th>
                        <th className="px-8 py-5">Activity</th>
                        <th className="px-8 py-5">Hub Context</th>
                        <th className="px-8 py-5">Coach Action</th>
                        <th className="px-8 py-5 text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {trainerSlots.length > 0 ? trainerSlots.map(s => {
                        const cls = classes.find(c => c.id === s.classId);
                        const fac = facilities.find(f => f.id === s.facilityId);
                        return (
                           <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <p className="font-bold text-slate-900 text-xs tracking-tight">{s.startTime}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.duration}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{cls?.name || 'Session'}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{fac?.name}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                                    s.trainerStatus === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                                    s.trainerStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-red-50 text-red-700 border-red-100'
                                 }`}>
                                    {s.trainerStatus}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 {s.isDelivered ? (
                                    <span className="flex items-center gap-1.5 justify-end text-[9px] font-black text-green-600 uppercase">
                                       <CheckCircle2 className="w-3 h-3" /> Delivered
                                    </span>
                                 ) : (
                                    <span className="text-[9px] font-black text-slate-300 uppercase italic">Upcoming</span>
                                 )}
                              </td>
                           </tr>
                        );
                     }) : (
                        <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic bg-slate-50/20">No slots assigned</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                        <th className="px-8 py-5">Timestamp</th>
                        <th className="px-8 py-5">Member</th>
                        <th className="px-8 py-5">Attendance</th>
                        <th className="px-8 py-5">Economic Status</th>
                        <th className="px-8 py-5 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {trainerBookings.length > 0 ? trainerBookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <p className="font-bold text-slate-900 text-xs tracking-tight">{new Date(b.bookingDate).toLocaleDateString()}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{b.startTime}</p>
                           </td>
                           <td className="px-8 py-6">
                              <p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{b.userName}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{b.userEmail}</p>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                                 b.attendanceStatus === 'present' ? 'bg-green-50 text-green-700 border-green-100' :
                                 b.attendanceStatus === 'absent' ? 'bg-red-50 text-red-700 border-red-100' :
                                 'bg-slate-50 text-slate-400 border-slate-100'
                              }`}>
                                 {b.attendanceStatus}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-xs font-bold text-slate-600 uppercase">{b.status}</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button onClick={() => navigate(`/admin/user/${b.userId}`)} className="text-[9px] font-black text-blue-600 uppercase hover:underline">User Record</button>
                           </td>
                        </tr>
                     )) : (
                        <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic bg-slate-50/20">No booking activity recorded</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="p-8 space-y-6 animate-in fade-in duration-300">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recent Coach Notes</h4>
               <div className="space-y-4">
                  {trainerSlots.filter(s => s.commonFeedback || trainerBookings.some(b => b.slotId === s.id && b.feedbackFromTrainer)).length > 0 ? (
                    trainerSlots.filter(s => s.commonFeedback || trainerBookings.some(b => b.slotId === s.id && b.feedbackFromTrainer)).map(s => {
                       const cls = classes.find(c => c.id === s.classId);
                       return (
                          <div key={s.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                             <div className="flex justify-between items-center">
                                <h5 className="font-black text-slate-900 uppercase text-xs">{cls?.name} • {new Date(s.startDate || Date.now()).toLocaleDateString()}</h5>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Audit ID: {s.id.substr(0,8)}</span>
                             </div>
                             {s.commonFeedback && (
                                <div className="space-y-2">
                                   <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Group Feedback</p>
                                   <p className="text-xs font-medium text-slate-600 leading-relaxed italic">"{s.commonFeedback}"</p>
                                </div>
                             )}
                          </div>
                       );
                    })
                  ) : (
                    <p className="py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No feedback documented</p>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="p-8 space-y-10 animate-in fade-in duration-300">
               <div className="text-left max-w-lg mb-8">
                  <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight mb-2">Platform Control</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Control the coach's operational autonomy. Permissions apply instantly to their mobile hub.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${trainer.permissions.canCancel ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100 bg-white'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${trainer.permissions.canCancel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}><XCircle className="w-5 h-5" /></div>
                        <div className="text-left">
                           <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">Cancel Classes</p>
                           <p className="text-[10px] text-slate-500 font-medium">Can terminate an entire session cycle.</p>
                        </div>
                     </div>
                     <input 
                        type="checkbox" 
                        checked={trainer.permissions.canCancel} 
                        onChange={e => onUpdateTrainer(trainer.id, { permissions: { ...trainer.permissions, canCancel: e.target.checked } })}
                        className="w-6 h-6 accent-blue-600 rounded cursor-pointer"
                     />
                  </div>

                  <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${trainer.permissions.canReschedule ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100 bg-white'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${trainer.permissions.canReschedule ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}><RefreshCw className="w-5 h-5" /></div>
                        <div className="text-left">
                           <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">Reschedule Classes</p>
                           <p className="text-[10px] text-slate-500 font-medium">Can move session times independently.</p>
                        </div>
                     </div>
                     <input 
                        type="checkbox" 
                        checked={trainer.permissions.canReschedule} 
                        onChange={e => onUpdateTrainer(trainer.id, { permissions: { ...trainer.permissions, canReschedule: e.target.checked } })}
                        className="w-6 h-6 accent-blue-600 rounded cursor-pointer"
                     />
                  </div>
               </div>

               <div className="p-8 bg-slate-900 rounded-[32px] text-white flex items-center gap-6 mt-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400"><ShieldCheck className="w-8 h-8" /></div>
                  <div className="text-left">
                     <p className="font-black uppercase tracking-widest text-xs mb-1">Administrative Override</p>
                     <p className="text-[10px] text-white/40 leading-relaxed font-medium">These settings restrict or allow features within the Trainer App. Admins retain full control over these slots regardless of coach permissions.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <TrainerFormModal 
          trainer={trainer} 
          facilities={facilities} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={(data) => {
            onUpdateTrainer(trainer.id, data);
            setIsEditModalOpen(false);
            showToast('Coach profile updated', 'success');
          }} 
        />
      )}

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          title="Terminate Professional Record?"
          message={`Are you sure you want to permanently delete "${trainer.name}"? This will orphan all associated session slots.`}
          variant="danger"
          confirmText="Yes, Terminate"
          onConfirm={() => {
            onDeleteTrainer(trainer.id);
            navigate('/admin/staff');
            showToast('Professional record purged', 'info');
          }}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default TrainerDetailView;