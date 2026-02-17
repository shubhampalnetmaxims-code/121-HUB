import React, { useState } from 'react';
import { ArrowLeft, Plus, MessageSquare, Send, X, CheckCircle, HelpCircle, Clock } from 'lucide-react';
import { SupportTicket, User, Trainer } from '../../types';
import { useNavigate } from 'react-router-dom';

interface SupportViewProps {
  currentUser: User | Trainer | null;
  userType: 'customer' | 'trainer';
  tickets: SupportTicket[];
  onAddTicket: (t: any, msg: string) => void;
  onReplyTicket: (id: string, msg: string, type: 'user' | 'admin') => void;
}

const SupportView: React.FC<SupportViewProps> = ({ currentUser, userType, tickets, onAddTicket, onReplyTicket }) => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  if (!currentUser) return null;

  const userTickets = tickets.filter(t => t.userId === currentUser.id).sort((a, b) => b.updatedAt - a.updatedAt);
  const selectedTicket = userTickets.find(t => t.id === selectedTicketId);

  const handleSubmitTicket = () => {
    if (!subject.trim() || !message.trim()) return;
    onAddTicket({
      userId: currentUser.id,
      userName: 'name' in currentUser ? currentUser.name : currentUser.fullName,
      userEmail: currentUser.email,
      userType,
      subject
    }, message);
    setIsCreating(false);
    setSubject('');
    setMessage('');
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicketId) return;
    onReplyTicket(selectedTicketId, replyText, 'user');
    setReplyText('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">Support</h2>
        </div>
        {!isCreating && !selectedTicketId && (
          <button onClick={() => setIsCreating(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus className="w-5 h-5" /></button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {userTickets.length > 0 ? userTickets.map(t => (
          <button 
            key={t.id} 
            onClick={() => setSelectedTicketId(t.id)}
            className="w-full bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group active:scale-[0.98] transition-all"
          >
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
               t.status === 'resolved' ? 'bg-green-50 text-green-600' : 
               t.status === 'replied' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
             }`}>
                {t.status === 'resolved' ? <CheckCircle className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
             </div>
             <div className="flex-1 text-left overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">ID: {t.id}</p>
                <h4 className="font-bold text-slate-900 leading-none uppercase text-sm tracking-tight truncate">{t.subject}</h4>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                     t.status === 'open' ? 'bg-red-50 text-red-600 border-red-100' : 
                     t.status === 'replied' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                   }`}>{t.status}</span>
                   <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
             </div>
          </button>
        )) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
               <HelpCircle className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-slate-400 uppercase text-xs tracking-widest">No support tickets found.</p>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="absolute inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
           <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
             <h3 className="text-xl font-bold tracking-tight uppercase">New Request</h3>
             <button onClick={() => setIsCreating(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={subject} 
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Summary of your issue..."
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[28px] font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all shadow-inner" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message Detail</label>
                    <textarea 
                      value={message} 
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Please describe your issue in detail so we can help better..."
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] font-medium text-sm outline-none h-48 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all shadow-inner" 
                    />
                 </div>
              </div>
           </div>
           <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0">
             <button 
               onClick={handleSubmitTicket} 
               disabled={!subject.trim() || !message.trim()}
               className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase disabled:opacity-50"
             >
               Submit Ticket
             </button>
           </div>
        </div>
      )}

      {selectedTicket && (
        <div className="absolute inset-0 z-[120] bg-white flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-left">
           <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-left">
                 <h3 className="text-xl font-bold tracking-tight uppercase truncate max-w-[200px]">{selectedTicket.subject}</h3>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedTicket.status}</p>
              </div>
              <button onClick={() => setSelectedTicketId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/30">
              {selectedTicket.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.senderType === 'admin' ? 'items-start' : 'items-end'}`}>
                   <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                     msg.senderType === 'admin' 
                      ? 'bg-blue-600 text-white rounded-tl-sm' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tr-sm'
                   }`}>
                      {msg.message}
                      <p className={`text-[8px] font-black uppercase mt-2 opacity-50 ${msg.senderType === 'admin' ? 'text-white' : 'text-slate-400'}`}>
                         {msg.senderType === 'admin' ? 'Support Admin' : 'Me'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                   </div>
                </div>
              ))}
           </div>

           {selectedTicket.status !== 'resolved' && (
             <div className="p-6 pt-4 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md shrink-0">
                <div className="flex gap-3">
                   <input 
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                   />
                   <button 
                     onClick={handleSendReply}
                     disabled={!replyText.trim()}
                     className="p-4 bg-black text-white rounded-2xl shadow-lg active:scale-90 transition-all disabled:opacity-50"
                   >
                      <Send className="w-5 h-5" />
                   </button>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SupportView;
