import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, ShieldCheck, ArrowRight, UserCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-left">
      <div className="max-w-4xl w-full text-center space-y-10">
        <div className="flex justify-center">
          <div className="bg-black text-white px-6 py-4 rounded-xl font-bold text-3xl">
            121
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          One Platform. <br/>
          <span className="text-blue-600">Health and Management.</span>
        </h1>
        
        <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          Welcome to the 121 hub. Manage your health journey or run facility operations from one simple interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/app')}
            className="group flex items-center justify-center gap-3 bg-black text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
          >
            <Layout className="w-5 h-5" />
            Enter App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/trainer')}
            className="flex items-center justify-center gap-3 border border-slate-200 text-slate-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            <UserCircle className="w-5 h-5 text-blue-600" />
            Trainer Login
          </button>

          <button
            onClick={() => navigate('/admin-login')}
            className="flex items-center justify-center gap-3 border border-slate-200 text-slate-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            <ShieldCheck className="w-5 h-5 text-slate-400" />
            Admin Login
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Layout className="w-5 h-5" /></div>
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Member Hub</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Find facilities, view schedules, and manage your bookings.</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><UserCircle className="w-5 h-5" /></div>
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Trainer Portal</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">View your upcoming sessions and track client attendance.</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Admin Panel</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Control facility profiles, staff, and rewards globally.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;