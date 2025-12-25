import React from 'react';
import { Patient } from '../types';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const navigate = useNavigate();
  const latestMoca = patient.mocaTests?.length > 0
    ? patient.mocaTests[patient.mocaTests.length - 1]
    : null;

  const getStatus = () => {
    const cdr = patient.currentCDR || 0;
    if (cdr >= 1.0) return { color: 'text-rose-600', icon: AlertTriangle, label: 'Urgent' };
    if (cdr > 0) return { color: 'text-amber-500', icon: Clock, label: 'Observation' };
    return { color: 'text-emerald-500', icon: CheckCircle, label: 'Stable' };
  };

  const status = getStatus();

  return (
    <div
      onClick={() => navigate(`/patient/${patient.id}`)}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-transparent hover:border-white transition-all duration-500 cursor-pointer group flex flex-col h-full relative"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#333] group-hover:bg-[#333] group-hover:text-white transition-all duration-500 shadow-inner">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-[#333] text-lg leading-tight group-hover:translate-x-1 transition-transform">
              {patient.name}
            </h3>
            <p className="text-[10px] text-[#AAA] font-black uppercase tracking-[0.2em] mt-1">ID • {patient.id}</p>
          </div>
        </div>

        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.color} bg-slate-50 group-hover:scale-110 transition-transform`}>
          <status.icon size={18} strokeWidth={3} />
        </div>
      </div>

      <div className="bg-slate-50/50 p-5 rounded-2xl mb-8 group-hover:bg-white group-hover:shadow-inner transition-all border border-transparent group-hover:border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-[#AAA] font-black uppercase tracking-widest">Latest Screening</p>
          <p className="text-xs font-black text-[#333]">{latestMoca ? latestMoca.date : 'N/A'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <p className="text-2xl font-black text-[#333]">{latestMoca ? `${latestMoca.totalScore} pts` : '--'}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[9px] text-[#BBB] font-bold uppercase tracking-widest">Biological Info</p>
          <p className="text-xs font-black text-[#666] mt-0.5">{patient.sex} • {patient.dob}</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#333] text-white flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-xl">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
