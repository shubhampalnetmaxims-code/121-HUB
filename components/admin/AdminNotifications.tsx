
import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Clock, Trash2 } from 'lucide-react';
import { useNotifications } from '../NotificationContext';

interface AdminNotificationsProps {
  onClose: () => void;
}

const AdminNotifications: React.FC<AdminNotificationsProps> = ({ onClose }) => {
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  
  const adminNotifs = notifications.filter(n => n.target === 'admin');
  const unreadCount = adminNotifs.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">System Alerts</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{unreadCount} UNREAD NOTIFICATIONS</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => clearNotifications('admin')} 
              className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-colors shadow-sm"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-3 bg-white text-slate-900 rounded-2xl transition-colors shadow-sm"><X className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide text-left">
          {adminNotifs.length > 0 ? adminNotifs.map(n => (
            <div 
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-6 rounded-[32px] border transition-all relative group cursor-pointer ${
                n.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-slate-50 border-blue-200'
              }`}
            >
              {!n.isRead && <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />}
              
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  n.type === 'success' ? 'bg-green-100 text-green-600' :
                  n.type === 'alert' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                   {n.type === 'success' && <CheckCircle className="w-6 h-6" />}
                   {n.type === 'alert' && <AlertCircle className="w-6 h-6" />}
                   {n.type === 'info' && <Info className="w-6 h-6" />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-black text-slate-900 leading-tight">{n.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{n.message}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 text-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-10 h-10" />
              </div>
              <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Inbox Zero. Great work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
