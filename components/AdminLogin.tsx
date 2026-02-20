
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Mail } from 'lucide-react';
import { useToast } from './ToastContext';
import { AdminUser } from '../types';

interface AdminLoginProps {
  adminUsers: AdminUser[];
  onLogin: (admin: AdminUser) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ adminUsers, onLogin }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = adminUsers.find(u => 
      (u.username === identifier || u.email === identifier) && 
      u.password === password
    );
    
    if (admin) {
      if (admin.status === 'suspended') {
        showToast('Account suspended. Contact system administrator.', 'error');
        return;
      }
      onLogin(admin);
      showToast('Admin session authorized', 'success');
      navigate('/admin');
    } else {
      showToast('Invalid administrator credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg p-10 shadow-sm border border-slate-200 text-left">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Sign in to the management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Institutional Email or Handle</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="admin@121fit.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-md flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-left">
             <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Prototype Access Codes</p>
             <div className="space-y-1 text-[9px] font-bold text-slate-500 uppercase">
                <p>Master: <span className="text-blue-900">admin@121fit.com / admin</span></p>
                <p>Gym Mgr: <span className="text-blue-900">gym.manager@121fit.com / password</span></p>
                <p>Fitness Mgr: <span className="text-blue-900">fitness.mgr@121fit.com / password</span></p>
             </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
