
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
      <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">System Alerts</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{unreadCount} UNREAD RECORDS</p>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => clearNotifications('admin')} 
              className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-md transition-colors shadow-xs border border-slate-200"
              title="Purge Inbox"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 bg-white text-slate-900 rounded-md transition-colors shadow-xs border border-slate-200"><X className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide text-left">
          {adminNotifs.length > 0 ? adminNotifs.map(n => (
            <div 
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 rounded-md border transition-all relative group cursor-pointer shadow-xs ${
                n.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-slate-50 border-blue-200'
              }`}
            >
              {!n.isRead && <div className="absolute top-5 right-5 w-2 h-2 bg-blue-600 rounded-full shadow-sm" />}
              
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 shadow-xs ${
                  n.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' :
                  n.type === 'alert' ? 'bg-red-50 text-red-600 border-red-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                   {n.type === 'success' && <CheckCircle className="w-5 h-5" />}
                   {n.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                   {n.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight uppercase tracking-tight">{n.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-50 text-slate-100 rounded-lg flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                <Bell className="w-8 h-8" />
              </div>
              <p className="font-black text-slate-300 uppercase text-[10px] tracking-[0.4em] italic">Ledger Status: Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;