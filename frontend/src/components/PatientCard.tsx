import React from 'react';
import { Patient } from '../types';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, Activity, AlertTriangle, CheckCircle, Clock, MoreVertical } from 'lucide-react';

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
    if (cdr >= 1.0) return { color: '#A4262C', bg: 'bg-[#FDE7E9]', icon: AlertTriangle, label: 'High Priority' };
    if (cdr > 0) return { color: '#D83B01', bg: 'bg-[#FFF4CE]', icon: Clock, label: 'Observation' };
    return { color: '#107C10', bg: 'bg-[#DFF6DD]', icon: CheckCircle, label: 'Stable' };
  };

  const status = getStatus();

  return (
    <div 
      onClick={() => navigate(`/patient/${patient.id}`)}
      className="bg-white border border-[#EDEBE9] rounded-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full relative"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAF9F8] rounded flex items-center justify-center text-[#323130] group-hover:bg-[#F3F2F1] transition-colors border border-[#EDEBE9]">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#323130] text-sm group-hover:text-[#0078D4] transition-colors truncate max-w-[150px]">
              {patient.name}
            </h3>
            <p className="text-[10px] text-[#605E5C] font-semibold uppercase tracking-tighter">ID: {patient.id}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <MoreVertical size={14} className="text-[#A19F9D]" />
          <div className={`px-2 py-0.5 rounded-sm flex items-center gap-1 ${status.bg}`} style={{ color: status.color }}>
            <status.icon size={10} strokeWidth={3} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">{status.label}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6 bg-[#FAF9F8] p-3 rounded-sm border border-[#EDEBE9]">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold text-[#605E5C] uppercase">Latest Assessment</p>
          <p className="text-[9px] font-bold text-[#A19F9D]">{latestMoca ? latestMoca.date : 'N/A'}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-xl font-bold text-[#323130]">{latestMoca ? latestMoca.totalScore : '--'}</p>
          <p className="text-[10px] text-[#A19F9D] font-bold">/ 30</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#EDEBE9]">
        <div className="flex flex-col">
          <p className="text-[8px] text-[#A19F9D] font-bold uppercase">Patient Profile</p>
          <p className="text-[10px] font-semibold text-[#323130] mt-0.5">{patient.sex} • {patient.dob}</p>
        </div>
        
        <div className="w-7 h-7 rounded bg-[#F3F2F1] text-[#605E5C] flex items-center justify-center group-hover:bg-[#0078D4] group-hover:text-white transition-all">
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
