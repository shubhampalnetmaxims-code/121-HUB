
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { useToast } from './ToastContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      showToast('Admin session authorized', 'success');
      navigate('/admin');
    } else {
      showToast('Invalid administrator credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg p-10 shadow-sm border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Sign in to the management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
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