import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, Bell, Search, Settings, HelpCircle } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#F3F2F1] font-sans text-[#323130] flex flex-col">
      {/* Microsoft-style Top Global Bar */}
      <header className="h-12 bg-[#333] text-white flex items-center justify-between px-4 z-50 shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer transition-colors">
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">NeuralTrack</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">Clinical</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white" size={14} />
            <input
              type="text"
              placeholder="Search patients, assessments..."
              className="w-full pl-9 pr-4 py-1.5 bg-white/10 border border-transparent rounded focus:bg-white focus:text-[#323130] transition-all outline-none text-xs placeholder:text-white/60"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer transition-colors">
            <Settings size={16} />
          </div>
          <div className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer transition-colors">
            <HelpCircle size={16} />
          </div>
          <div className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer transition-colors relative">
            <Bell size={16} />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </div>
          <div className="h-8 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold leading-none">Dr. Peterson</p>
              <p className="text-[8px] text-white/60 leading-none mt-1 uppercase tracking-tighter">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#605E5C] border border-white/20 flex items-center justify-center text-[10px] font-bold shadow-inner">
              DP
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Microsoft-style Side Nav */}
        <aside className="w-56 bg-white border-r border-[#EDEBE9] flex flex-col shrink-0">
          <nav className="flex-1 py-4 px-2 space-y-0.5">
            <p className="px-3 py-2 text-[10px] font-bold text-[#605E5C] uppercase tracking-widest">Main Registry</p>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 group ${
                  isActive ? 'bg-[#F3F2F1] text-[#0078D4] border-l-4 border-[#0078D4] pl-2 font-semibold shadow-sm' : 'text-[#323130] hover:bg-[#F3F2F1]'
                }`
              }
            >
              <LayoutDashboard size={18} className="shrink-0" />
              <span className="text-xs">Clinical Dashboard</span>
            </NavLink>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 group ${
                  isActive ? 'bg-[#F3F2F1] text-[#0078D4] border-l-4 border-[#0078D4] pl-2 font-semibold shadow-sm' : 'text-[#323130] hover:bg-[#F3F2F1]'
                }`
              }
            >
              <Users size={18} className="shrink-0" />
              <span className="text-xs">Patient Directory</span>
            </NavLink>
            <NavLink
              to="/add-patient"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 group ${
                  isActive ? 'bg-[#F3F2F1] text-[#0078D4] border-l-4 border-[#0078D4] pl-2 font-semibold shadow-sm' : 'text-[#323130] hover:bg-[#F3F2F1]'
                }`
              }
            >
              <UserPlus size={18} className="shrink-0" />
              <span className="text-xs">New Registration</span>
            </NavLink>
          </nav>

          <div className="p-4 border-t border-[#EDEBE9] bg-[#FAF9F8]">
            <p className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-tighter mb-2">System Status</p>
            <div className="flex items-center gap-2 text-[10px] text-[#605E5C] font-medium">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Database Synchronized
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F3F2F1]">
          <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
