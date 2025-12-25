import React, { useEffect, useState } from 'react';
import { Patient } from '../types';
import { fetchPatients } from '../utils/api';
import PatientList from '../components/PatientList';
import { Activity, Users, AlertCircle, Plus, SortAsc, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPatients();
        if (Array.isArray(response.data)) {
          setPatients(response.data);
          sortPatients(response.data, 'recent');
        } else {
          setPatients([]);
        }
      } catch (err) {
        setError('Database connection error.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const sortPatients = (list: Patient[], method: 'recent' | 'name') => {
    const sorted = [...list].sort((a, b) => {
      if (method === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const nameA = a.name.split(' ').pop() || '';
        const nameB = b.name.split(' ').pop() || '';
        return nameA.localeCompare(nameB);
      }
    });
    setFilteredPatients(sorted);
  };

  const handleSortChange = (method: 'recent' | 'name') => {
    setSortBy(method);
    sortPatients(patients, method);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-white border-t-[#333] rounded-full animate-spin shadow-2xl"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Innovative Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-black text-[#333] tracking-tighter leading-tight">Overview</h1>
          <p className="text-[#888] font-bold uppercase tracking-[0.3em] text-xs mt-2 ml-1">Precision Cognitive Monitoring</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BBB] group-focus-within:text-[#333] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-12 pr-6 py-4 bg-white rounded-2xl border border-transparent shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] focus:shadow-xl focus:border-white transition-all outline-none font-bold text-sm w-64 md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Modern Stats Section with 3D feel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: 'Total Registry', value: patients.length, icon: Users, color: 'text-[#333]' },
          { label: 'High Priority', value: patients.filter(p => (p.currentCDR || 0) >= 1).length, icon: AlertCircle, color: 'text-[#333]' },
          { label: 'Assessments', value: patients.reduce((acc, p) => acc + (p.mocaTests?.length || 0), 0), icon: Activity, color: 'text-[#333]' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500 opacity-50" />
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner ${stat.color}`}>
              <stat.icon size={28} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-[#AAA] uppercase tracking-widest relative z-10">{stat.label}</p>
            <p className="text-5xl font-black text-[#333] mt-2 relative z-10">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Patient List Controls */}
      <div className="space-y-8 bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-black/5 pb-8">
          <h2 className="text-2xl font-black text-[#333] tracking-tight flex items-center gap-3">
            Active Patients
            <span className="text-[10px] bg-[#333] text-white px-2 py-1 rounded-lg uppercase tracking-widest leading-none">Live</span>
          </h2>

          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-black/5">
            <button
              onClick={() => handleSortChange('recent')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${sortBy === 'recent' ? 'bg-[#333] text-white shadow-xl scale-105' : 'text-[#888] hover:text-[#333]'}`}
            >
              <Clock size={16} />
              Recent
            </button>
            <button
              onClick={() => handleSortChange('name')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${sortBy === 'name' ? 'bg-[#333] text-white shadow-xl scale-105' : 'text-[#888] hover:text-[#333]'}`}
            >
              <SortAsc size={16} />
              Alpha
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-[#333] text-white p-8 rounded-[2rem] flex items-center gap-4 font-bold shadow-2xl">
            <AlertCircle size={24} />
            {error}
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            <PatientList patients={filteredPatients} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
