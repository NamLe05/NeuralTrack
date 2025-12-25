import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient } from '../types';
import { fetchPatientById, deleteMocaTest } from '../utils/api';
import {
  ArrowLeft,
  Calendar,
  User,
  Brain,
  Clock,
  ArrowUpRight,
  Plus,
  Phone,
  Mail,
  MapPin,
  Dna,
  History,
  Trash2,
  Edit3,
  ChevronRight
} from 'lucide-react';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadPatient = async () => {
        try {
          const response = await fetchPatientById(id);
          setPatient(response.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadPatient();
    }
  }, [id]);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleDeleteTest = async (index: number) => {
    if (id && window.confirm('Permanently delete this assessment session?')) {
      try {
        const response = await deleteMocaTest(id, index);
        setPatient(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-white border-t-[#333] rounded-full animate-spin shadow-2xl"></div>
    </div>
  );

  if (!patient) return <div className="p-12 text-center font-bold text-[#888]">Patient record not found.</div>;

  return (
    <div className="animate-in fade-in duration-700 pb-20 pt-6 max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#888] hover:text-[#333] font-black uppercase tracking-widest text-xs transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Exit Profile
        </button>
        <button
          onClick={() => navigate(`/assessment/${id}`)}
          className="bg-[#333] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Assessment
        </button>
      </div>

      {/* Unified Profile Container */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 overflow-hidden">
        {/* Top Header Section */}
        <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white relative overflow-hidden">
          <div className="flex items-center gap-10 relative z-10">
            <div className="w-24 h-24 bg-[#333] rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-xl transform rotate-2">
              {patient.name.charAt(0)}
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-[#333] tracking-tighter">{patient.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#AAA] font-black text-xs uppercase tracking-widest">
                <span className="flex items-center gap-2 text-[#333] bg-slate-50 px-3 py-1 rounded-lg"><Dna size={14} /> {patient.sex}</span>
                <span className="flex items-center gap-2 border border-slate-100 px-3 py-1 rounded-lg"><Calendar size={14} /> Born {patient.dob} ({calculateAge(patient.dob)} yrs)</span>
                <span className="text-[#888]">ID: {patient.id}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 relative z-10">
            <div className="bg-slate-50 p-6 rounded-2xl min-w-[140px] border border-white">
              <p className="text-[10px] font-black text-[#AAA] uppercase tracking-widest mb-1">Baseline CDR</p>
              <p className="text-3xl font-black text-[#333]">{patient.currentCDR || '0.0'}</p>
            </div>
            <div className="bg-[#333] p-6 rounded-2xl min-w-[140px] text-white shadow-md">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">CDR Sum</p>
              <p className="text-3xl font-black">{patient.cdrSum || '0.0'}</p>
            </div>
          </div>
        </div>

        {/* Communication Row (Top) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-12 bg-slate-50/20 border-b border-slate-50">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#AAA] uppercase tracking-widest mb-1">Primary Phone</p>
              <p className="text-sm font-black text-[#333]">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#AAA] uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-sm font-black text-[#333] truncate">{patient.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#AAA] uppercase tracking-widest mb-1">Residence</p>
              <p className="text-sm font-black text-[#333] leading-relaxed">{patient.address}</p>
            </div>
          </div>
        </div>

        {/* History Section (Bottom) */}
        <div className="p-12 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-[#333] tracking-tight flex items-center gap-4">
              <Brain className="text-[#333]" size={32} />
              Session History
            </h2>
            <div className="text-[10px] font-black text-[#888] bg-slate-50 px-4 py-2 rounded-xl border border-white uppercase tracking-widest">
              {patient.mocaTests.length} Records
            </div>
          </div>

          {patient.mocaTests.length === 0 ? (
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 p-20 rounded-[3rem] text-center">
              <Brain size={64} className="text-slate-200 mx-auto mb-6" />
              <p className="text-[#BBB] font-black uppercase tracking-[0.2em] text-xs">No screening records found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {patient.mocaTests.slice().reverse().map((test, index) => {
                const originalIndex = patient.mocaTests.length - 1 - index;
                return (
                  <div
                    key={index}
                    className="group bg-slate-50/30 hover:bg-white border border-transparent hover:border-slate-100 p-8 rounded-[2.5rem] transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-10">
                      <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-slate-100 flex flex-col items-center justify-center group-hover:bg-[#333] transition-colors duration-300 border border-white shadow-sm">
                        <span className="text-2xl font-black text-[#333] group-hover:text-white">{test.totalScore}</span>
                        <span className="text-[10px] font-black text-[#AAA] uppercase tracking-widest group-hover:text-white/40 leading-none">PTS</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-[#CCC]" />
                          <p className="text-lg font-black text-[#333]">{test.date}</p>
                        </div>
                        <div className="flex gap-3">
                          {['Abstraction', 'Recall', 'Orientation'].map(label => (
                            <div key={label} className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-[#888] tracking-widest border border-white group-hover:bg-white group-hover:border-slate-100">
                              {label.substring(0, 3)}: <span className="text-[#333]">{test.subscores[label.toLowerCase() as keyof typeof test.subscores]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-4 bg-white hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-[#333] border border-slate-100 transition-all">
                        <Edit3 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteTest(originalIndex)}
                        className="p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl text-rose-300 hover:text-rose-600 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="w-12 h-12 rounded-2xl bg-[#333] text-white flex items-center justify-center ml-2 shadow-2xl">
                        <ChevronRight size={22} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
