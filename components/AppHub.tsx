
import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { Facility, Class, FEATURE_MODULES } from '../types';
import { 
  Info, Dumbbell, Flower2, Activity, X, ChevronLeft, Bell, User, Search,
  Home as HomeIcon, Calendar, Compass, ArrowRight, LayoutDashboard,
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag, ArrowLeft,
  Clock, Package, MapPin
} from 'lucide-react';

interface AppHubProps {
  facilities: Facility[];
  classes: Class[];
}

const IconMap: Record<string, any> = {
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag
};

const AppHub: React.FC<AppHubProps> = ({ facilities, classes }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedInfoFacility, setSelectedInfoFacility] = useState<Facility | null>(null);

  const filteredFacilities = facilities.filter(f => f.isActive);

  const ClassListView = () => {
    const { id } = useParams();
    const facility = facilities.find(f => f.id === id);
    if (!facility) return null;
    
    const facilityClasses = classes.filter(c => c.facilityId === id);

    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        <div className="p-6 pt-12 flex items-center gap-4 border-b border-slate-50">
          <button onClick={() => navigate(`/app/facility/${id}`)} className="p-2 hover:bg-slate-100 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold tracking-tight">Available Classes</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          {facilityClasses.length > 0 ? facilityClasses.map(c => (
            <div key={c.id} className="bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100">
               <div className="aspect-[16/9] relative">
                 {c.imageUrl ? (
                   <img src={c.imageUrl} className="w-full h-full object-cover" alt={c.name} />
                 ) : (
                   <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600"><BookOpen className="w-10 h-10" /></div>
                 )}
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full font-bold text-[10px] text-blue-600 shadow-sm uppercase tracking-widest">{c.duration}</div>
               </div>
               <div className="p-6 text-left">
                 <h4 className="text-xl font-bold mb-2">{c.name}</h4>
                 <p className="text-slate-500 text-sm mb-4 leading-relaxed">{c.shortDescription}</p>
                 <div className="flex items-start gap-2 p-4 bg-white rounded-2xl border border-slate-100">
                    <Package className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs font-semibold text-slate-600 leading-tight">Bring: {c.requirements}</div>
                 </div>
                 <button className="w-full mt-5 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Book Spot</button>
               </div>
            </div>
          )) : (
            <div className="py-20 text-center text-slate-400 font-bold">No classes scheduled yet.</div>
          )}
        </div>
      </div>
    );
  };

  const FacilityHub = () => {
    const { id } = useParams();
    const facility = facilities.find(f => f.id === id);
    if (!facility) return <div className="p-10 text-center">Facility not found</div>;

    const activeModules = FEATURE_MODULES.filter(m => facility.features?.includes(m.id));

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Hub Header */}
        <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4">
          <button onClick={() => navigate('/app/home')} className="p-2 hover:bg-slate-100 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight">{facility.name}</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Digital Hub</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-left">Services</h3>
            {activeModules.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {activeModules.map(module => {
                  const ModuleIcon = IconMap[module.icon] || ShoppingBag;
                  return (
                    <button 
                      key={module.id}
                      onClick={() => module.id === 'classes' ? navigate(`/app/facility/${id}/classes`) : null}
                      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-colors group active:scale-95"
                    >
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ModuleIcon className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm tracking-tight">{module.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-12 text-center border border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-400">Hub is quiet...</p>
                <p className="text-xs text-slate-400 mt-1">Visit later for new digital services at this location.</p>
              </div>
            )}
          </section>

          <section>
             <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative text-left min-h-[140px] flex flex-col justify-center">
               <div className="relative z-10">
                 <h4 className="font-bold text-lg mb-1">Coming Soon</h4>
                 <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">Unlock new possibilities as we roll out updates to this hub.</p>
               </div>
               <Activity className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
             </div>
          </section>
        </div>

        <button 
          onClick={() => setSelectedInfoFacility(facility)}
          className="absolute bottom-28 right-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-20"
        >
          <Info className="w-7 h-7" />
        </button>
      </div>
    );
  };

  const EntryScreen = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-black text-white">
      <div className="mb-12 text-7xl font-bold tracking-tighter">121</div>
      <p className="text-center text-slate-500 mb-8 max-w-xs font-medium leading-relaxed">Your portal to health, wellness, and peak performance.</p>
      <button 
        onClick={() => navigate('home')}
        className="w-full bg-blue-600 text-white font-bold py-5 rounded-[24px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/30 active:scale-95 transform text-lg"
      >
        Enter Hub
      </button>
      <Link to="/" className="mt-8 text-slate-600 text-sm hover:text-white transition-colors">Return to Site</Link>
    </div>
  );

  const HomePage = () => (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="p-6 pt-12 flex justify-between items-center border-b border-slate-50">
        <div className="text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Experience</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">121 Active Network</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><Search className="w-5 h-5 text-slate-400" /></button>
          <button className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><Bell className="w-5 h-5 text-slate-400" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-28 space-y-8">
        <section>
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="font-bold text-xl text-slate-900">Our Facilities</h3>
          </div>
          
          <div className="flex flex-col gap-8">
            {filteredFacilities.map(f => (
              <div 
                key={f.id} 
                className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 group transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  {f.imageUrl ? (
                    <img 
                      src={f.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={f.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
                      <Dumbbell className="w-12 h-12" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <button 
                    className="absolute top-5 right-5 p-4 rounded-full bg-white shadow-2xl text-blue-600 hover:bg-slate-50 transition-all z-10 active:scale-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInfoFacility(f);
                    }}
                    title="View Information"
                  >
                    <Info className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-6 left-8 text-left">
                    <h4 className="text-white font-extrabold text-3xl drop-shadow-lg tracking-tight">{f.name}</h4>
                    <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">
                       <MapPin className="w-3 h-3" /> Digital Member Hub
                    </div>
                  </div>
                </div>

                <div className="p-6 flex justify-between items-center bg-white">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Touch ⓘ for profile</span>
                   <button 
                    onClick={() => navigate(`/app/facility/${f.id}`)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-[20px] font-extrabold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                   >
                     Go Inside
                     <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 pb-6 pt-2 z-40">
        <button onClick={() => navigate('/app/home')} className={`flex flex-col items-center gap-1.5 transition-colors ${location.pathname.includes('/home') ? 'text-blue-600' : 'text-slate-400'}`}>
          <HomeIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-400">
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-400">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Bookings</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
        </button>
      </div>

      {selectedInfoFacility && (
        <div className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-t-[48px] overflow-hidden max-h-[95%] flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              {selectedInfoFacility.imageUrl ? (
                <img src={selectedInfoFacility.imageUrl} className="w-full h-full object-cover" alt={selectedInfoFacility.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
                   <Activity className="w-16 h-16" />
                </div>
              )}
              <button 
                onClick={() => setSelectedInfoFacility(null)} 
                className="absolute top-6 right-6 p-3 rounded-full bg-black/30 backdrop-blur hover:bg-black/50 text-white transition-all shadow-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 pb-16 overflow-y-auto text-left">
              <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Facility Details</span>
              </div>
              <h3 className="text-4xl font-black mb-8 tracking-tighter text-slate-900 leading-tight">{selectedInfoFacility.name}</h3>
              
              <div className="space-y-8">
                <div 
                  className="text-slate-600 leading-relaxed text-lg font-medium prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedInfoFacility.description }}
                />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operation</p>
                    <p className="font-extrabold text-slate-900">Open 24/7</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tier</p>
                    <p className="font-extrabold text-slate-900">All Members</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedInfoFacility(null)} 
                  className="w-full mt-6 bg-black text-white font-black py-5 rounded-[28px] text-xl shadow-2xl shadow-black/30 hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-tighter"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="relative w-full max-w-[400px] h-[880px] bg-black rounded-[64px] shadow-2xl overflow-hidden border-[12px] border-slate-900 ring-4 ring-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-900 rounded-b-[24px] z-[100]"></div>
        <div className="h-full">
          <Routes>
            <Route index element={<EntryScreen />} />
            <Route path="home" element={<HomePage />} />
            <Route path="facility/:id" element={<FacilityHub />} />
            <Route path="facility/:id/classes" element={<ClassListView />} />
          </Routes>
        </div>
      </div>
      
      <div className="hidden xl:block absolute left-12 bottom-12 max-w-xs space-y-4">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-200">
          <div className="w-14 h-14 bg-blue-600 rounded-[20px] flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/30">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h4 className="font-black text-2xl mb-4 tracking-tight">Active Platform</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
            "Every facility is a unique ecosystem. Admins curate the services, members live the experience."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppHub;
