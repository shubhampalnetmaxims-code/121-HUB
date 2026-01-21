
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center mb-4">
          <div className="bg-black text-white p-4 rounded-3xl font-bold text-4xl">
            121
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
          One Platform. <br/>
          <span className="text-blue-600">Infinite Potential.</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Welcome to the 121 unified hub. Manage your health journey or oversee facility operations from one seamless interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={() => navigate('/app')}
            className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-2xl font-semibold text-xl hover:bg-slate-800 transition-all transform hover:scale-105"
          >
            <Layout className="w-6 h-6" />
            Enter App
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/admin-login')}
            className="flex items-center justify-center gap-3 border-2 border-slate-200 text-slate-900 px-8 py-5 rounded-2xl font-semibold text-xl hover:bg-slate-50 transition-all"
          >
            <ShieldCheck className="w-6 h-6" />
            Admin Login
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-slate-50">
            <h3 className="font-bold text-lg mb-2">Member Hub</h3>
            <p className="text-slate-600 text-sm">Explore facilities, view class schedules, and manage your wellness journey.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50">
            <h3 className="font-bold text-lg mb-2">Admin Dashboard</h3>
            <p className="text-slate-600 text-sm">Real-time facility management, description updates, and visibility controls.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50">
            <h3 className="font-bold text-lg mb-2">Unified Experience</h3>
            <p className="text-slate-600 text-sm">A consistent, modern design across all 121 digital touchpoints.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
