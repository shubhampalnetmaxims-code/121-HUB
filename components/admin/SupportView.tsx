import React, { useState, useMemo } from 'react';
import { Search, Filter, HelpCircle, ChevronRight, MessageSquare, CheckCircle, Clock, User, X, Send } from 'lucide-react';
import { SupportTicket } from '../../types';

interface SupportViewProps {
  tickets: SupportTicket[];
  onReplyTicket: (id: string, message: string, senderType: 'user' | 'admin') => void;
  onUpdateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  onOpenSidebar: () => void;
}

const SupportView: React.FC<SupportViewProps> = ({ tickets, onReplyTicket, onUpdateTicketStatus, onOpenSidebar }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportTicket['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | SupportTicket['userType']>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.userName.toLowerCase().includes(search.toLowerCase()) || 
                            t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                            t.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesType = typeFilter === 'all' || t.userType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [tickets, search, statusFilter, typeFilter]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicketId) return;
    onReplyTicket(selectedTicketId, replyText, 'admin');
    setReplyText('');
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-red-50 text-red-600 border-red-100';
      case 'replied': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md"><HelpCircle className="w-6 h-6" /></button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Support Ledger</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Subscriber & Staff Ticketing</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 pb-32">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="Search by Name, Email or ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div className="flex gap-2">
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                <option value="all">All Users</option>
                <option value="customer">Customers</option>
                <option value="trainer">Trainers</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                <option value="all">All Status</option>
                <option value="open">Open Only</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                <th className="px-6 py-5">Ticket ID / Date</th>
                <th className="px-6 py-5">User Account</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Subject / Preview</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors group" onClick={() => setSelectedTicketId(t.id)}>
                  <td className="px-6 py-5">
                    <p className="font-mono text-[10px] text-blue-600 font-black mb-1">{t.id}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{t.userName}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{t.userEmail}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${t.userType === 'trainer' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {t.userType}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-800 leading-none mb-1 uppercase tracking-tight truncate max-w-[200px]">{t.subject}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[250px]">{t.messages[t.messages.length - 1].message}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors inline-block bg-slate-50 rounded-lg">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-[160] flex items-center justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedTicketId(null)}></div>
          <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="text-left">
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedTicket.subject}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                 </div>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Ticket: {selectedTicket.id} • {selectedTicket.userName}</p>
              </div>
              <button onClick={() => setSelectedTicketId(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-slate-50/30">
               {selectedTicket.messages.map(msg => (
                 <div key={msg.id} className={`flex flex-col ${msg.senderType === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                      msg.senderType === 'admin' 
                        ? 'bg-slate-900 text-white rounded-tr-sm' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                    }`}>
                       {msg.message}
                       <p className={`text-[8px] font-black uppercase mt-2 opacity-40 ${msg.senderType === 'admin' ? 'text-white' : 'text-slate-400'}`}>
                          {msg.senderType === 'admin' ? 'Administrator' : selectedTicket.userName} • {new Date(msg.createdAt).toLocaleTimeString()}
                       </p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-8 border-t border-slate-100 space-y-4 bg-white">
               {selectedTicket.status !== 'resolved' ? (
                 <>
                    <div className="relative">
                       <textarea 
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Compose institutional reply..."
                          className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px]"
                       />
                    </div>
                    <div className="flex gap-3">
                       <button 
                          onClick={() => onUpdateTicketStatus(selectedTicket.id, 'resolved')}
                          className="flex-1 py-4 border-2 border-green-100 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all"
                       >
                          Mark as Resolved
                       </button>
                       <button 
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                       >
                          <Send className="w-4 h-4" /> Send Reply
                       </button>
                    </div>
                 </>
               ) : (
                 <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center justify-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">This ticket has been finalized and resolved</p>
                    <button onClick={() => onUpdateTicketStatus(selectedTicket.id, 'replied')} className="ml-4 text-[9px] font-black text-blue-600 uppercase underline">Re-open</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportView;
