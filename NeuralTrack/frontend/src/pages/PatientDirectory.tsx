import React, { useEffect, useState } from 'react';
import { Patient } from '../types';
import { fetchPatients } from '../utils/api';
import {
  Search,
  ChevronRight,
  User,
  Calendar,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientDirectory: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameSearchTerm, setNameSearchBy] = useState('');
  const [dobSearchTerm, setDobSearchBy] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient | 'recentMoca' | 'age'; direction: 'asc' | 'desc' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPatients();
        if (Array.isArray(response.data)) {
          setPatients(response.data);
          setFilteredPatients(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch registry.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    const results = patients.filter(patient => {
      const nameMatch = patient.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(nameSearchTerm.toLowerCase());
      const dobMatch = patient.dob.includes(dobSearchTerm);
      return nameMatch && dobMatch;
    });
    setFilteredPatients(results);
  }, [nameSearchTerm, dobSearchTerm, patients]);

  const getStatus = (cdr: number) => {
    if (cdr >= 1.0) return { color: '#A4262C', bg: 'bg-[#FDE7E9]', icon: AlertTriangle, label: 'Warning' };
    if (cdr > 0) return { color: '#D83B01', bg: 'bg-[#FFF4CE]', icon: Clock, label: 'Observation' };
    return { color: '#107C10', bg: 'bg-[#DFF6DD]', icon: CheckCircle, label: 'Stable' };
  };

  const handleSort = (key: keyof Patient | 'recentMoca' | 'age') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredPatients].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (key === 'age') {
        valA = calculateAge(a.dob);
        valB = calculateAge(b.dob);
      } else if (key === 'recentMoca') {
        valA = a.mocaTests.length > 0 ? a.mocaTests[a.mocaTests.length - 1].totalScore : -1;
        valB = b.mocaTests.length > 0 ? b.mocaTests[b.mocaTests.length - 1].totalScore : -1;
      } else {
        valA = a[key as keyof Patient];
        valB = b[key as keyof Patient];
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredPatients(sorted);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#EDEBE9] border-t-[#0078D4] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#323130]">Patient Directory</h1>
          <p className="text-xs font-semibold text-[#605E5C] uppercase tracking-wider">
            {filteredPatients.length} Active Clinical Records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={14} />
            <input
              type="text"
              placeholder="Search by Name or ID..."
              value={nameSearchTerm}
              onChange={(e) => setNameSearchBy(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold focus:border-[#0078D4] outline-none w-48 shadow-sm"
            />
          </div>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={14} />
            <input
              type="text"
              placeholder="Filter by DOB (YYYY-MM-DD)..."
              value={dobSearchTerm}
              onChange={(e) => setDobSearchBy(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold focus:border-[#0078D4] outline-none w-48 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#FAF9F8] border-b border-[#EDEBE9]">
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest w-16 text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">Patient Name <ArrowUpDown size={10} className="text-[#A19F9D] group-hover:text-[#323130]" /></div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest text-center cursor-pointer group" onClick={() => handleSort('age')}>
                <div className="flex items-center justify-center gap-2">Age <ArrowUpDown size={10} className="text-[#A19F9D] group-hover:text-[#323130]" /></div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest text-center cursor-pointer group" onClick={() => handleSort('dob')}>
                <div className="flex items-center justify-center gap-2">DOB <ArrowUpDown size={10} className="text-[#A19F9D] group-hover:text-[#323130]" /></div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest text-center">Gender</th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest text-center cursor-pointer group" onClick={() => handleSort('currentCDR')}>
                <div className="flex items-center justify-center gap-2">CDR <ArrowUpDown size={10} className="text-[#A19F9D] group-hover:text-[#323130]" /></div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest text-center cursor-pointer group" onClick={() => handleSort('recentMoca')}>
                <div className="flex items-center justify-center gap-2">Last MOCA <ArrowUpDown size={10} className="text-[#A19F9D] group-hover:text-[#323130]" /></div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-[#605E5C] uppercase tracking-widest text-center">Last Visit</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEBE9]">
            {filteredPatients.map((patient) => {
              const latestMoca = patient.mocaTests.length > 0 ? patient.mocaTests[patient.mocaTests.length - 1] : null;
              const status = getStatus(patient.currentCDR || 0);

              return (
                <tr
                  key={patient.id}
                  onClick={() => navigate(`/patient/${patient.id}`)}
                  className="hover:bg-[#FAF9F8] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: status.color }} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F3F2F1] rounded-sm flex items-center justify-center text-[#323130] font-bold text-xs group-hover:bg-[#323130] group-hover:text-white transition-colors">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#323130] leading-none">{patient.name}</p>
                        <p className="text-[9px] text-[#A19F9D] font-semibold mt-1 uppercase">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-[#323130]">
                    {calculateAge(patient.dob)}
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-[#323130]">
                    {patient.dob}
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-[#323130]">
                    {patient.sex}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-black ${patient.currentCDR && patient.currentCDR >= 1 ? 'text-[#A4262C]' : 'text-[#323130]'}`}>
                      {patient.currentCDR?.toFixed(1) || '0.0'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-[#323130]">{latestMoca ? latestMoca.totalScore : '--'}</span>
                      <span className="text-[8px] font-bold text-[#A19F9D] uppercase">/ 30</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-[10px] font-bold text-[#323130]">{latestMoca ? latestMoca.date : '--'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1 hover:bg-[#EDEBE9] rounded-sm transition-colors text-[#A19F9D] hover:text-[#323130]">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <div className="p-20 text-center text-[#A19F9D]">
            <p className="text-xs font-bold uppercase tracking-widest">No matching records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDirectory;
