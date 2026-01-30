import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
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
        
        <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          Welcome to the 121 hub. Manage your health journey or run facility operations from one simple interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/app')}
            className="group flex items-center justify-center gap-3 bg-black text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all"
          >
            <Layout className="w-5 h-5" />
            Enter App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/admin-login')}
            className="flex items-center justify-center gap-3 border border-slate-200 text-slate-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Login
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-xl border border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 mb-2">Member Hub</h3>
            <p className="text-slate-500 text-sm">Find facilities, view class schedules, and manage your bookings.</p>
          </div>
          <div className="p-6 rounded-xl border border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 mb-2">Admin Panel</h3>
            <p className="text-slate-500 text-sm">Control facility profiles, descriptions, and class visibility easily.</p>
          </div>
          <div className="p-6 rounded-xl border border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 mb-2">Clean Design</h3>
            <p className="text-slate-500 text-sm">Enjoy a simple and consistent experience across all devices.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;