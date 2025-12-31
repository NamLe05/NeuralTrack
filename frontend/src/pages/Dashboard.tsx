import React, { useEffect, useState, useMemo } from 'react';
import { Patient, MocaTest } from '../types';
import { fetchPatients } from '../utils/api';
import { calculateClinicalMetrics } from '../utils/clinicalCalculations';
import { Activity, Users, AlertCircle, Plus, Clock, Download, MoreHorizontal, User, Brain, ChevronRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentActivity {
  patientId: string;
  patientName: string;
  patientSex: string;
  patientDob: string;
  patientCdr: number;
  test: MocaTest;
}

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPatients();
        if (Array.isArray(response.data)) {
          setPatients(response.data);

          // Extract all MOCA tests and associate with patient info
          const activities: RecentActivity[] = [];
          response.data.forEach(p => {
            p.mocaTests.forEach((t: MocaTest) => {
              // Calculate CDR for this specific test if possible, or use patient's current
              const metrics = calculateClinicalMetrics(p);
              activities.push({
                patientId: p.id,
                patientName: p.name,
                patientSex: p.sex,
                patientDob: p.dob,
                patientCdr: metrics.currentCDR,
                test: t
              });
            });
          });

          // Sort by date descending
          activities.sort((a, b) => new Date(b.test.date).getTime() - new Date(a.test.date).getTime());
          setRecentActivities(activities.slice(0, 6));
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

  const highPriorityCount = useMemo(() => {
    return patients.filter(p => {
      const metrics = calculateClinicalMetrics(p);
      return metrics.currentCDR >= 1.0;
    }).length;
  }, [patients]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-2 border-[#EDEBE9] border-t-[#0078D4] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 text-[#323130]">
      {/* Microsoft-style Breadcrumb / Header Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#605E5C] uppercase tracking-widest">
            <Activity size={12} />
            Clinical Oversight
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm">
            <Upload size={14} />
            Export Data
          </button>
          <button
            onClick={() => navigate('/add-patient')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white rounded text-xs font-bold transition-all shadow-md active:scale-[0.98]"
          >
            <Plus size={14} />
            New Patient
          </button>
        </div>
      </div>

      {/* KPI Stats - More Grid-Aligned & Scientific */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Registry', value: patients.length, icon: Users, color: '#0078D4', description: 'Patients registered' },
          { label: 'High Priority (CDR ≥ 1)', value: highPriorityCount, icon: AlertCircle, color: '#A4262C', description: 'Requires immediate review' },
          { label: 'Screening Logs', value: patients.reduce((acc, p) => acc + (p.mocaTests?.length || 0), 0), icon: Activity, color: '#107C10', description: 'Total assessments conducted' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#EDEBE9] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Subtle Left Border Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: stat.color }} />

            <div className="px-5 py-4 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#605E5C] uppercase tracking-widest">{stat.label}</p>
                  <p className="text-[9px] text-[#A19F9D] font-bold uppercase tracking-tight">{stat.description}</p>
                </div>
                <stat.icon size={16} style={{ color: stat.color }} strokeWidth={2.5} className="shrink-0" />
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-black text-[#323130] tracking-tighter">{stat.value}</p>
                <div className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">Records</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Activity Section - Square Look */}
      <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#FAF9F8] border-b border-[#EDEBE9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-[#323130] flex items-center gap-2">
              Recent Clinical Activity
              <span className="text-[10px] bg-[#605E5C] text-white px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Live Feed</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/patients')}
            className="text-[10px] font-bold text-[#0078D4] uppercase tracking-widest hover:underline"
          >
            Full Directory
          </button>
        </div>

        <div className="p-6">
          {error ? (
            <div className="bg-[#FDE7E9] text-[#A4262C] p-4 rounded-sm border border-[#F1707B] flex items-center gap-3 font-bold text-xs">
              <AlertCircle size={16} />
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentActivities.length === 0 ? (
                <div className="col-span-full p-20 text-center text-[#A19F9D]">
                  <p className="text-xs font-bold uppercase tracking-widest">No recent assessments recorded</p>
                </div>
              ) : (
                recentActivities.map((activity, idx) => (
                  <div
                    key={`${activity.patientId}-${idx}`}
                    onClick={() => navigate(`/patient/${activity.patientId}`)}
                    className="bg-white border border-[#EDEBE9] rounded-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full relative"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FAF9F8] rounded flex items-center justify-center text-[#323130] group-hover:bg-[#F3F2F1] transition-colors border border-[#EDEBE9]">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#323130] text-sm group-hover:text-[#0078D4] transition-colors truncate max-w-[150px]">
                            {activity.patientName}
                          </h3>
                          <p className="text-[10px] text-[#605E5C] font-semibold uppercase tracking-tighter">ID: {activity.patientId}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Clock size={14} className="text-[#A19F9D]" />
                        <span className="text-[8px] font-bold text-[#605E5C] uppercase tracking-tighter">{activity.test.date}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-[#FAF9F8] p-3 rounded-sm border border-[#EDEBE9]">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold text-[#605E5C] uppercase tracking-widest">MOCA Assessment</p>
                        <Brain size={12} className="text-[#0078D4]" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <p className="text-xl font-bold text-[#323130]">{activity.test.totalScore}</p>
                        <p className="text-[10px] text-[#A19F9D] font-bold">/ 30</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#EDEBE9]">
                      <div className="flex flex-col">
                        <p className="text-[8px] text-[#A19F9D] font-bold uppercase">Patient Profile</p>
                        <p className="text-[10px] font-semibold text-[#323130] mt-0.5">{activity.patientSex} • {activity.patientDob}</p>
                      </div>

                      <div className="w-7 h-7 rounded bg-[#F3F2F1] text-[#605E5C] flex items-center justify-center group-hover:bg-[#0078D4] group-hover:text-white transition-all">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                )
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
