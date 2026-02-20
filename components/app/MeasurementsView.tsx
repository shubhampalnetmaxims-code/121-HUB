
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, History, Activity, Scale, Ruler, User as UserIcon, Calendar, Check, TrendingUp, Info } from 'lucide-react';
import { User, Measurement } from '../../types';
import { useToast } from '../ToastContext';

interface MeasurementsViewProps {
  currentUser: User | null;
  measurements: Measurement[];
  onAddMeasurement: (m: Omit<Measurement, 'id'>) => void;
  onAuthTrigger: () => void;
}

const SimpleLineChart = ({ data, color, height = 100 }: { data: number[], color: string, height?: number }) => {
  if (data.length < 2) return <div className="h-full flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Insufficient data for trend</div>;

  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const range = max - min;
  const width = 300;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={areaPoints} fill={`url(#grad-${color})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="drop-shadow-sm"
      />
      {data.map((val, i) => (
        <circle 
          key={i} 
          cx={(i / (data.length - 1)) * width} 
          cy={height - ((val - min) / range) * height} 
          r="4" 
          fill="white" 
          stroke={color} 
          strokeWidth="2" 
        />
      ))}
    </svg>
  );
};

const MeasurementsView: React.FC<MeasurementsViewProps> = ({ currentUser, measurements, onAddMeasurement, onAuthTrigger }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLogging, setIsLogging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [formData, setFormData] = useState({
    weight: 70,
    height: 175,
    age: 25,
    chest: 0,
    waist: 0,
    hips: 0,
    biceps: 0,
    triceps: 0,
    thighs: 0
  });

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
          <Scale className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Log Progress</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Sign in to track your body metrics and see how far you've come.</p>
        <button onClick={onAuthTrigger} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase">Sign In</button>
      </div>
    );
  }

  const userMeasurements = useMemo(() => 
    measurements.filter(m => m.userId === currentUser.id).sort((a, b) => a.date - b.date),
    [measurements, currentUser.id]
  );
  
  const historyList = [...userMeasurements].reverse();
  const latest = historyList[0];

  const weightTrend = useMemo(() => userMeasurements.map(m => m.weight), [userMeasurements]);
  const bmiTrend = useMemo(() => userMeasurements.map(m => m.bmi), [userMeasurements]);

  const calculateBMI = (w: number, h: number) => {
    const heightInMeters = h / 100;
    return parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const calculateBodyFat = (waist: number, weight: number, gender: string) => {
    if (!waist) return undefined;
    const factor = gender.toLowerCase() === 'male' ? 0.45 : 0.55;
    return parseFloat(((waist / weight) * 100 * factor).toFixed(1));
  };

  const handleSave = () => {
    const bmi = calculateBMI(formData.weight, formData.height);
    const bodyFat = calculateBodyFat(formData.waist, formData.weight, currentUser.gender);
    
    onAddMeasurement({
      userId: currentUser.id,
      date: Date.now(),
      ...formData,
      bmi,
      bodyFatPercentage: bodyFat,
      leanBodyMass: bodyFat ? formData.weight * (1 - bodyFat/100) : undefined
    });
    setIsLogging(false);
    showToast('Measurement logged', 'success');
  };

  if (isLogging) {
    return (
      <div className="h-full bg-white flex flex-col animate-in slide-in-from-right duration-300 text-left">
        <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
          <button onClick={() => setIsLogging(false)} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">New Entry</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Weight (kg)</label>
                <div className="relative"><Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="number" value={formData.weight} onChange={e => setFormData(p => ({...p, weight: parseFloat(e.target.value)}))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" /></div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Height (cm)</label>
                <div className="relative"><Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="number" value={formData.height} onChange={e => setFormData(p => ({...p, height: parseFloat(e.target.value)}))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" /></div>
             </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
             {(['chest', 'waist', 'hips', 'biceps', 'triceps', 'thighs'] as const).map(field => (
                <div key={field} className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-tight px-1">{field}</label>
                   <input type="number" placeholder="0" value={formData[field] || ''} onChange={e => setFormData(p => ({...p, [field]: parseFloat(e.target.value)}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" />
                </div>
             ))}
          </div>
        </div>
        <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0">
          <button onClick={handleSave} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase flex items-center justify-center gap-3">
             <Check className="w-6 h-6" /> Save Entry
          </button>
        </div>
      </div>
    );
  }

  if (showHistory) {
     return (
        <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300 text-left">
           <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Log History</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide pb-32">
              {historyList.map(m => (
                 <div key={m.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-slate-900">{new Date(m.date).toLocaleDateString()}</span>
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry ID: {m.id.substr(0,6)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Body Stats</p><p className="font-bold text-slate-900">{m.weight}kg • {m.height}cm</p></div>
                       <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">BMI</p><p className="font-black text-blue-600">{m.bmi}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {m.waist && <span className="px-2 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 uppercase">Waist: {m.waist}cm</span>}
                       {m.chest && <span className="px-2 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 uppercase">Chest: {m.chest}cm</span>}
                       {m.bodyFatPercentage && <span className="px-2 py-1 bg-blue-50 rounded-lg text-[9px] font-black text-blue-600 uppercase">Body Fat: {m.bodyFatPercentage}%</span>}
                    </div>
                 </div>
              ))}
           </div>
        </div>
     );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate('/app/activity')} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Measurements</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Progress Tracking</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 scrollbar-hide">
        {latest ? (
          <>
            {/* Interactive Progress Chart */}
            <section className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Progress Analytics</h3>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Weight Trend</p>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                    <TrendingUp className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 uppercase">Last {weightTrend.length} Logs</span>
                  </div>
               </div>
               
               <div className="h-32 w-full relative group">
                  <SimpleLineChart data={weightTrend} color="#2563eb" />
                  <div className="absolute inset-x-0 bottom-[-20px] flex justify-between px-1">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Start</span>
                    <span className="text-[8px] font-black text-blue-600 uppercase">Current</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Weight Change</p>
                    <p className={`font-black text-lg ${weightTrend[weightTrend.length - 1] < weightTrend[0] ? 'text-green-600' : 'text-slate-900'}`}>
                      {weightTrend[weightTrend.length - 1] - weightTrend[0] > 0 ? '+' : ''}
                      {(weightTrend[weightTrend.length - 1] - weightTrend[0]).toFixed(1)}kg
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">BMI Trend</p>
                    <p className="font-black text-lg text-blue-600">{bmiTrend[bmiTrend.length - 1]}</p>
                  </div>
               </div>
            </section>

            <section className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Current Weight</p>
                        <h4 className="text-5xl font-black tracking-tighter leading-none">{latest.weight}<span className="text-lg opacity-30 ml-1">kg</span></h4>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Activity className="w-6 h-6 text-blue-400" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                     <div><p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">BMI Score</p><p className="text-2xl font-black">{latest.bmi}</p></div>
                     <div><p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Body Fat</p><p className="text-2xl font-black">{latest.bodyFatPercentage || '--'}%</p></div>
                  </div>
               </div>
               <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            </section>

            <section className="grid grid-cols-2 gap-4">
               <button onClick={() => setIsLogging(true)} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Plus className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">New Entry</span>
               </button>
               <button onClick={() => setShowHistory(true)} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center"><History className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">See History</span>
               </button>
            </section>

            <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Latest Circumference</h4>
               <div className="grid grid-cols-2 gap-y-6 gap-x-10">
                  {latest.waist && <div className="space-y-1"><p className="text-[9px] font-bold text-slate-400 uppercase">Waist</p><p className="font-black text-slate-900">{latest.waist}cm</p></div>}
                  {latest.chest && <div className="space-y-1"><p className="text-[9px] font-bold text-slate-400 uppercase">Chest</p><p className="font-black text-slate-900">{latest.chest}cm</p></div>}
                  {latest.hips && <div className="space-y-1"><p className="text-[9px] font-bold text-slate-400 uppercase">Hips</p><p className="font-black text-slate-900">{latest.hips}cm</p></div>}
                  {latest.thighs && <div className="space-y-1"><p className="text-[9px] font-bold text-slate-400 uppercase">Thighs</p><p className="font-black text-slate-900">{latest.thighs}cm</p></div>}
               </div>
            </section>
          </>
        ) : (
          <div className="py-24 text-center space-y-6">
             <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200 shadow-sm">
                <Scale className="w-8 h-8" />
             </div>
             <div>
               <p className="text-lg font-bold text-slate-400">Zero log data</p>
               <p className="text-xs text-slate-300 font-medium">Start your tracking journey by adding your first measurement entry.</p>
             </div>
             <button onClick={() => setIsLogging(true)} className="px-10 py-4 bg-black text-white rounded-[24px] font-black text-sm uppercase shadow-xl active:scale-95 transition-all">Log First Entry</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementsView;
