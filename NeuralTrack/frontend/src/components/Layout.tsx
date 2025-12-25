import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, Bell } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans text-[#333] relative overflow-x-hidden">
            {/* Top Left Logo */}
            <div className="fixed top-8 left-10 z-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#333] rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10">
                    <span className="font-bold text-xl">N</span>
                </div>
                <span className="font-black text-xl tracking-tighter text-[#333] hidden md:block">NeuralTrack</span>
            </div>

            {/* Floating Center Navigation */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-1/3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full py-2 px-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center justify-between">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[#333] text-white shadow-md scale-105' : 'text-[#666] hover:text-[#333]'
                        }`
                    }
                >
                    <LayoutDashboard size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/patients"
                    className={({ isActive }) =>
                        `flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[#333] text-white shadow-md scale-105' : 'text-[#666] hover:text-[#333]'
                        }`
                    }
                >
                    <Users size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Registry</span>
                </NavLink>
                <NavLink
                    to="/add-patient"
                    className={({ isActive }) =>
                        `flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[#333] text-white shadow-md scale-105' : 'text-[#666] hover:text-[#333]'
                        }`
                    }
                >
                    <UserPlus size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Register</span>
                </NavLink>
            </nav>

            {/* Top Right Floating Profile */}
            <div className="fixed top-8 right-10 z-50 flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-black text-[#333]">Dr. Peterson</span>
                    <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">{today}</span>
                </div>

                <div className="relative group cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#333] transition-transform active:scale-95 border border-white">
                        <Bell size={20} />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#F0F2F5] rounded-full"></div>
                    </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#333] border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm transform transition-transform hover:rotate-6">
                    DP
                </div>
            </div>

            {/* Main Content Area */}
            <main className="pt-32 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Decorative Background Elements for 3D Feel */}
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-white/40 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-white/40 rounded-full blur-[100px] pointer-events-none -z-10" />
        </div>
    );
};

export default Layout;
