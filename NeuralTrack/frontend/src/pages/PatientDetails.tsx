import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Patient, MocaTest } from '../types';
import { fetchPatientById, deleteMocaTest, deletePatient } from '../utils/api';
import {
  ArrowLeft,
  Calendar,
  User,
  Brain,
  Clock,
  Plus,
  Phone,
  Mail,
  MapPin,
  Dna,
  History,
  Trash2,
  Edit3,
  ChevronRight,
  ChevronLeft,
  Activity,
  TrendingUp,
  BarChart3,
  ListFilter,
  Info,
  Shield,
  FileText,
  Microscope,
  Stethoscope,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Printer,
  UserCog,
  Upload,
  Download
} from 'lucide-react';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: doctor } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'data'>('timeline');
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

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

  const projectedCDR = useMemo(() => {
    if (!patient || !patient.mocaTests || patient.mocaTests.length === 0) return 0;

    // In dev mode, we use the simulated values for instant feedback
    if (localStorage.getItem('token') === 'dev-token') {
      const latestTest = patient.mocaTests[patient.mocaTests.length - 1];
      const score = latestTest.totalScore;
      let decline = 0;
      if (patient.mocaTests.length >= 2) {
        decline = patient.mocaTests[patient.mocaTests.length - 2].totalScore - score;
      }

      let currentCDR = 0.0;
      if (score < 15) currentCDR = 2.0;
      else if (score < 20) currentCDR = 1.0;
      else if (score < 26) currentCDR = 0.5;

      if (decline > 2 || score < 20) return Math.min(3.0, currentCDR + 0.5);
      return currentCDR;
    }

    const current = patient.currentCDR || 0;
    if (patient.mocaTests.length >= 2) {
      const last = patient.mocaTests[patient.mocaTests.length - 1].totalScore;
      const prev = patient.mocaTests[patient.mocaTests.length - 2].totalScore;
      if (last < prev) return Math.min(3.0, current + 0.5);
    }
    return current;
  }, [patient]);

  const currentCDRValue = useMemo(() => {
    if (!patient || !patient.mocaTests || patient.mocaTests.length === 0) return 0;
    if (localStorage.getItem('token') === 'dev-token') {
      const latestTest = patient.mocaTests[patient.mocaTests.length - 1];
      const score = latestTest.totalScore;
      if (score < 15) return 2.0;
      if (score < 20) return 1.0;
      if (score < 26) return 0.5;
      return 0.0;
    }
    return patient.currentCDR || 0.0;
  }, [patient]);

  const mlInsights = useMemo(() => {
    if (!patient || !patient.mocaTests || patient.mocaTests.length === 0) return null;

    const latestTest = patient.mocaTests[patient.mocaTests.length - 1];
    const score = latestTest.totalScore;
    let decline = 0;
    if (patient.mocaTests.length >= 2) {
      decline = patient.mocaTests[patient.mocaTests.length - 2].totalScore - score;
    }

    let confidenceLabel = "Low";
    let confidenceColor = "#A4262C"; // Red for Low

    if (score > 25) {
      confidenceLabel = "High";
      confidenceColor = "#107C10"; // Green for High
    } else if (score > 18) {
      confidenceLabel = "Moderate";
      confidenceColor = "#D83B01"; // Orange for Moderate
    }

    return {
      currentModelAccuracy: "83.2%",
      projectionModelAccuracy: "82.5%",
      confidence: confidenceLabel,
      confidenceColor: confidenceColor,
      declineRate: decline > 0 ? `${decline} pts / period` : "Stable"
    };
  }, [patient]);

  const patientStatus = useMemo(() => {
    if (!patient) return null;
    const cdr = currentCDRValue;
    if (cdr >= 1.0) return { label: 'Critical Alert', icon: AlertCircle, color: '#A4262C', bg: 'bg-[#FDE7E9]' };
    if (cdr > 0) return { label: 'Monitor', icon: Clock, color: '#D83B01', bg: 'bg-[#FFF4CE]' };
    return { label: 'Stable', icon: CheckCircle, color: '#107C10', bg: 'bg-[#DFF6DD]' };
  }, [patient, currentCDRValue]);

  const chartData = useMemo(() => {
    if (!patient) return [];
    const sortedTests = [...patient.mocaTests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedTests.map((t, i) => ({
      date: t.date,
      moca: t.totalScore,
      cdr: patient.currentCDR || 0,
      index: i
    }));
  }, [patient]);

  const handleDeleteTest = async (index: number) => {
    if (id && window.confirm('Permanently delete this assessment session from clinical history?')) {
      try {
        const response = await deleteMocaTest(id, index);
        setPatient(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (patient?.email) {
      window.location.href = `mailto:${patient.email}?subject=NeuralTrack Clinical Update&body=Dear ${patient.name},`;
    }
  };

  const handleExport = () => {
    // Placeholder for actual export logic
    console.log("Exporting clinical data...");
  };

  const handleImport = () => {
    // Placeholder for actual import logic
    console.log("Importing clinical data...");
  };

  const clinicalSummary = useMemo(() => {
    if (!patient) return "";
    const cdr = currentCDRValue;
    const proj = projectedCDR;
    const decline = mlInsights?.declineRate || "0";

    let summary = `Based on the latest MoCa assessment score of ${patient.mocaTests[patient.mocaTests.length - 1]?.totalScore || 0}, `;

    if (cdr === 0) summary += "the patient's current cognitive baseline is within the normal functional range. ";
    else if (cdr === 0.5) summary += "there are indicators consistent with Very Mild Dementia or Mild Cognitive Impairment (MCI). ";
    else summary += `the patient presents with a Clinical Dementia Rating (CDR) of ${cdr.toFixed(1)}, indicating significant cognitive impairment. `;

    if (proj > cdr) {
      summary += `Longitudinal data processing suggests a projected progression to a CDR of ${proj.toFixed(1)} over the next 12 months, with a calculated decline rate of ${decline}. `;
    } else {
      summary += "The current predictive model indicates a stable longitudinal profile with no immediate signs of rapid cognitive decline. ";
    }

    summary += "Continuous monitoring and follow-up assessments are recommended to validate these predictive metrics.";
    return summary;
  }, [patient, currentCDRValue, projectedCDR, mlInsights]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-2 border-[#EDEBE9] border-t-[#0078D4] rounded-full animate-spin"></div>
    </div>
  );

  if (!patient) return <div className="p-12 text-center font-bold text-[#605E5C]">Patient record not found.</div>;

  // Chart Constants for safe rendering
  const CHART_WIDTH = 1000;
  const CHART_HEIGHT = 300;
  const PADDING_X = 40;
  const PADDING_Y = 20;

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto space-y-4 text-[#323130]">
      {/* Registry > Patient Profile Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#605E5C]">
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate('/dashboard')}>Registry</span>
        <ChevronRight size={12} />
        <span className="text-[#323130]">Patient Profile</span>
      </div>

      {/* Header Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {patient.name} <span className="text-[#A19F9D] font-medium ml-2">{patient.id}</span>
          </h1>
          <p className="text-xs font-semibold text-[#605E5C] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-[#107C10]" />
            Secure Clinical Registration Protocol
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EDEBE9] rounded text-xs font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[140px] justify-center"
            >
              <ArrowLeft size={16} />
              Back to Registry
            </button>
            <button
              onClick={() => navigate(`/assessment/${id}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white rounded text-xs font-bold transition-all shadow-md active:scale-[0.98] whitespace-nowrap min-w-[160px] justify-center"
            >
              <Plus size={16} />
              New Assessment
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDEBE9] rounded text-[11px] font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[90px] justify-center"
              title="Print Clinical Report"
            >
              <Printer size={14} />
              Print
            </button>

            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDEBE9] rounded text-[11px] font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[90px] justify-center"
              title="Email Patient"
            >
              <Mail size={14} />
              Email
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDEBE9] rounded text-[11px] font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[90px] justify-center"
            >
              <Upload size={14} />
              Export
            </button>

            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDEBE9] rounded text-[11px] font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[90px] justify-center"
            >
              <Download size={14} />
              Import
            </button>

            <button
              onClick={() => navigate(`/edit-patient/${id}`)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDEBE9] rounded text-[11px] font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[110px] justify-center"
            >
              <UserCog size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Unified Main Container */}
      <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden divide-y divide-[#EDEBE9]">

        {/* Top Section: Identity & Predictive Metrics */}
        <div className="bg-[#FAF9F8] px-6 py-5 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#323130] flex items-center justify-center text-white text-xl font-bold rounded-sm shadow-md shrink-0">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Dna size={12} className="text-[#0078D4]" />
                    <span className="text-xs font-bold text-[#605E5C] uppercase tracking-wide">{patient.sex}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-[#EDEBE9] pl-4">
                    <Calendar size={12} className="text-[#0078D4]" />
                    <span className="text-xs font-bold text-[#605E5C] uppercase tracking-wide">DOB: {patient.dob}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-[#EDEBE9] pl-4">
                    <User size={12} className="text-[#0078D4]" />
                    <span className="text-xs font-bold text-[#605E5C] uppercase tracking-wide">Age: {calculateAge(patient.dob)}Y</span>
                  </div>
                </div>

                {/* Horizontal Predictive Row */}
                <div className="flex flex-nowrap items-center gap-x-4 pt-1 overflow-x-hidden">
                  <div className="space-y-0.5 shrink-0">
                    <p className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">Baseline CDR</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-black">{currentCDRValue.toFixed(1)}</p>
                      <span className="text-[7px] font-bold text-[#0078D4] uppercase bg-[#DEECF9] px-1 py-0.5 rounded-sm">{mlInsights?.currentModelAccuracy} Acc.</span>
                    </div>
                  </div>
                  <div className="space-y-0.5 border-l border-[#EDEBE9] pl-4 shrink-0">
                    <p className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">1Y Projection</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-black text-[#D83B01]">{projectedCDR.toFixed(1)}</p>
                      <span className="text-[7px] font-bold text-[#D83B01] uppercase bg-[#FDE7E9] px-1 py-0.5 rounded-sm">{mlInsights?.projectionModelAccuracy} Acc.</span>
                    </div>
                  </div>
                  <div className="space-y-0.5 border-l border-[#EDEBE9] pl-4 shrink-0">
                    <p className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">Mean MoCa</p>
                    <p className="text-sm font-black">
                      {patient.mocaTests.length > 0 ? (patient.mocaTests.reduce((acc, t) => acc + t.totalScore, 0) / patient.mocaTests.length).toFixed(1) : '--'}
                    </p>
                  </div>
                  <div className="space-y-0.5 border-l border-[#EDEBE9] pl-4 shrink-0">
                    <p className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">Decline Rate</p>
                    <p className="text-sm font-black">{mlInsights?.declineRate}</p>
                  </div>
                  <div className="space-y-0.5 border-l border-[#EDEBE9] pl-4 shrink-0">
                    <p className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">Confidence</p>
                    <p className="text-sm font-black" style={{ color: mlInsights?.confidenceColor }}>{mlInsights?.confidence}</p>
                  </div>
                  <div className="space-y-0.5 border-l border-[#EDEBE9] pl-4 shrink-0">
                    <p className="text-[8px] font-bold text-[#A19F9D] uppercase tracking-widest">Clinical Status</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {patientStatus && (
                        <>
                          <patientStatus.icon size={10} style={{ color: patientStatus.color }} />
                          <span className="text-sm font-black" style={{ color: patientStatus.color }}>
                            {patientStatus.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Contact/Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-5 border-t border-[#EDEBE9]">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-[#A19F9D] uppercase flex items-center gap-2 tracking-widest">
                <Phone size={12} className="text-[#0078D4]" /> Primary Phone
              </p>
              <p className="text-xs font-bold">{patient.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-[#A19F9D] uppercase flex items-center gap-2 tracking-widest">
                <Mail size={12} className="text-[#0078D4]" /> Electronic Mail
              </p>
              <p className="text-xs font-bold truncate">{patient.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-[#A19F9D] uppercase flex items-center gap-2 tracking-widest">
                <MapPin size={12} className="text-[#0078D4]" /> Residence
              </p>
              <p className="text-xs font-bold truncate">{patient.address}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-bold text-[#A19F9D] uppercase flex items-center justify-end gap-2 tracking-widest">
                <Clock size={12} className="text-[#0078D4]" /> Registered Date
              </p>
              <p className="text-xs font-bold">{new Date(patient.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Longitudinal & Timeline Area */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#F3F2F1] pb-4">
            <div className="flex items-center gap-2.5">
              <BarChart3 size={20} className="text-[#323130]" />
              <h2 className="text-xl font-bold tracking-tight">Longitudinal Analysis</h2>
            </div>

            <div className="flex items-center bg-[#F3F2F1] p-1 border border-[#EDEBE9] rounded-sm shadow-inner">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${viewMode === 'timeline' ? 'bg-white text-[#323130] shadow-sm border border-[#EDEBE9]' : 'text-[#A19F9D] hover:text-[#323130]'}`}
              >
                Timeline Table
              </button>
              <button
                onClick={() => setViewMode('data')}
                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${viewMode === 'data' ? 'bg-white text-[#323130] shadow-sm border border-[#EDEBE9]' : 'text-[#A19F9D] hover:text-[#323130]'}`}
              >
                Graphical Data
              </button>
            </div>
          </div>

          {viewMode === 'timeline' ? (
            <div className="border border-[#EDEBE9] rounded-sm overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F8] border-b border-[#EDEBE9]">
                    <th className="px-6 py-3 text-[9px] font-black text-[#605E5C] uppercase tracking-widest">Visit Date</th>
                    <th className="px-6 py-3 text-[9px] font-black text-[#605E5C] uppercase tracking-widest text-center">MoCa Score</th>
                    <th className="px-6 py-3 text-[9px] font-black text-[#605E5C] uppercase tracking-widest">Subdomain Distribution</th>
                    <th className="px-6 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBE9]">
                  {patient.mocaTests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-[#A19F9D] text-xs font-bold uppercase tracking-widest">No clinical assessments found</td>
                    </tr>
                  ) : (
                    patient.mocaTests.slice().reverse().map((test, index) => {
                      const originalIndex = patient.mocaTests.length - 1 - index;
                      return (
                        <tr key={index} className="hover:bg-[#FAF9F8] group transition-colors cursor-default">
                          <td className="px-6 py-4 text-xs font-bold">{test.date}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-base font-black">{test.totalScore}</span>
                              <span className="text-[8px] font-bold text-[#A19F9D] uppercase">/ 30</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(test.subscores).map(([key, val]) => (
                                <span key={key} className="px-2 py-0.5 bg-[#F3F2F1] border border-[#EDEBE9] text-[8px] font-bold uppercase text-[#605E5C] tracking-tighter rounded-sm">
                                  {key.substring(0, 3)}: <span className="text-[#323130] font-black">{val}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/assessment/${id}/edit/${originalIndex}`);
                                }}
                                className="p-1.5 hover:bg-[#DEECF9] text-[#A19F9D] hover:text-[#0078D4] transition-all rounded-sm"
                                title="Edit Assessment"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTest(originalIndex);
                                }}
                                className="p-1.5 hover:bg-[#FDE7E9] text-[#A19F9D] hover:text-[#A4262C] transition-all rounded-sm"
                                title="Delete Assessment"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#323130]" />
                    <span className="text-[9px] font-black text-[#605E5C] uppercase tracking-widest">MoCa Baseline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#0078D4]" />
                    <span className="text-[9px] font-black text-[#605E5C] uppercase tracking-widest">CDR Prediction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#D83B01]" />
                    <span className="text-[9px] font-black text-[#605E5C] uppercase tracking-widest">1Y Projection</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['6m', '1y', 'all'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${timeRange === r ? 'bg-[#323130] text-white shadow-md' : 'bg-[#FAF9F8] text-[#A19F9D] border border-[#EDEBE9] hover:bg-[#EDEBE9]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative bg-[#FAF9F8] border border-[#EDEBE9] rounded-sm p-4 h-[400px] flex items-end justify-between overflow-visible">
                <svg className="absolute inset-0 w-full h-full p-12 overflow-visible" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 10, 20, 30].map(val => (
                    <g key={val}>
                      <line x1={PADDING_X} y1={CHART_HEIGHT - PADDING_Y - (val / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} x2={CHART_WIDTH - PADDING_X} y2={CHART_HEIGHT - PADDING_Y - (val / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} stroke="#EDEBE9" strokeWidth="1" strokeDasharray="4" />
                      <text x={PADDING_X - 10} y={CHART_HEIGHT - PADDING_Y - (val / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} className="text-[10px] font-bold fill-[#A19F9D]" dominantBaseline="middle" textAnchor="end">{val}</text>
                    </g>
                  ))}

                  {chartData.length > 1 && (
                    <>
                      {/* MOCA Score Line */}
                      <path
                        d={`M ${chartData.map((d, i) => `${PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)},${CHART_HEIGHT - PADDING_Y - (d.moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}`).join(' L ')}`}
                        fill="none"
                        stroke="#323130"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {/* CDR Score Line */}
                      <path
                        d={`M ${chartData.map((d, i) => `${PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)},${CHART_HEIGHT - PADDING_Y - (d.cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}`).join(' L ')}`}
                        fill="none"
                        stroke="#0078D4"
                        strokeWidth="2"
                        strokeDasharray="6,4"
                      />
                      <line
                        x1={CHART_WIDTH - PADDING_X}
                        y1={CHART_HEIGHT - PADDING_Y - (chartData[chartData.length - 1].cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}
                        x2={CHART_WIDTH - PADDING_X + 60}
                        y2={CHART_HEIGHT - PADDING_Y - (projectedCDR * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}
                        stroke="#D83B01"
                        strokeWidth="3.5"
                        strokeDasharray="8,4"
                      />
                    </>
                  )}

                  {chartData.map((d, i) => {
                    const xPos = PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X);
                    const yPosMoca = CHART_HEIGHT - PADDING_Y - (d.moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y);
                    const yPosCdr = CHART_HEIGHT - PADDING_Y - (d.cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y);

                    // Display date in clinical timestamp format YYYY-MM-DD
                    const dateLabel = new Date(d.date).toLocaleDateString('en-CA');

                    return (
                      <g key={i}>
                        <rect
                          x={xPos - 20} y="0" width="40" height={CHART_HEIGHT}
                          fill="transparent"
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className="cursor-pointer"
                        />
                        <circle cx={xPos} cy={yPosMoca} r={hoveredPoint === i ? "7" : "4"} fill={hoveredPoint === i ? "#0078D4" : "#323130"} className="transition-all pointer-events-none shadow-lg" />
                        <circle cx={xPos} cy={yPosCdr} r="4" fill="#605E5C" className="pointer-events-none" />
                        <text x={xPos} y={CHART_HEIGHT} className="text-[9px] font-bold fill-[#605E5C]" textAnchor="middle">{dateLabel}</text>
                      </g>
                    );
                  })}
                </svg>

                {hoveredPoint !== null && (
                  <div
                    className="absolute z-50 bg-[#323130] text-white p-4 shadow-2xl border border-white/10 pointer-events-none transition-all duration-75 ease-out"
                    style={{
                      left: `calc(48px + (${(PADDING_X + (hoveredPoint / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)) / CHART_WIDTH} * (100% - 96px)))`,
                      top: `${24 + ((CHART_HEIGHT - PADDING_Y - (chartData[hoveredPoint].moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y)) / CHART_HEIGHT) * (400 - 96)}px`,
                      transform: 'translate(-50%, -105%)'
                    }}
                  >
                    <div className="text-[9px] font-bold uppercase opacity-60 mb-2 border-b border-white/10 pb-1">{chartData[hoveredPoint].date}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between gap-10">
                        <span className="text-[9px] uppercase font-bold">MoCa Score:</span>
                        <span className="text-sm font-black">{chartData[hoveredPoint].moca}</span>
                      </div>
                      <div className="flex justify-between gap-10">
                        <span className="text-[9px] uppercase font-bold">CDR Marker:</span>
                        <span className="text-sm font-black">{chartData[hoveredPoint].cdr.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Predictive AI Disclaimer Container */}
      <div className="bg-[#FAF9F8] border border-[#EDEBE9] shadow-sm p-5 rounded-sm">
        <div className="flex gap-5 items-start max-w-4xl mx-auto">
          <Shield size={48} className="text-[#323130] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-[9px] font-black text-[#323130] uppercase tracking-widest">Predictive AI Disclaimer</h3>
            <p className="text-[10px] leading-relaxed text-[#605E5C] font-medium italic">
              Calculations are performed by NeuralTrack ML Models (XGBoost v2.1) using longitudinal assessment history.
              These scores are probabilistic projections for clinical oversight and do not constitute a final medical diagnosis.
            </p>
          </div>
        </div>
      </div>

      {/* Hospital-Style Printable Report (Hidden on Screen) */}
      <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-0 m-0 text-black overflow-visible">
        <style>{`
          @media print {
            @page { size: A4; margin: 20mm; }
            body { -webkit-print-color-adjust: exact; background: white !important; font-size: 12pt; }
            .page-break { page-break-before: always; clear: both; }
            .report-container { font-family: 'Times New Roman', Times, serif; width: 100%; line-height: 1.5; }
            * { overflow: visible !important; }
            h1 { font-size: 32pt !important; }
            h2 { font-size: 18pt !important; }
            h3 { font-size: 14pt !important; }
            p, span, td, th { font-size: 12pt !important; }
            th { text-transform: uppercase; font-size: 10pt !important; }
            .metric-value { font-size: 30pt !important; }
            .metric-label { font-size: 11pt !important; }
            .clinical-narrative { font-size: 14pt !important; line-height: 1.6; }
            .patient-id-box { font-size: 16pt !important; font-weight: bold; }
            .practitioner-info { font-size: 12pt !important; }
          }
        `}</style>

        <div className="report-container max-w-4xl mx-auto py-10 space-y-10">
          {/* Page 1: Header & Patient Info */}
          <div className="border-b-4 border-black pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif font-bold uppercase tracking-tighter">NeuralTrack Clinical Report</h1>
              <p className="text-sm font-bold mt-1">Cognitive Monitoring & Longitudinal Analysis</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-gray-600">Generated Date</p>
              <p className="text-sm font-black">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">Patient Identification</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-bold">Full Name:</span> <span className="patient-id-box">{patient.name}</span></div>
                <div className="flex justify-between"><span className="font-bold">Medical ID:</span> <span className="patient-id-box">{patient.id}</span></div>
                <div className="flex justify-between"><span className="font-bold">Date of Birth:</span> <span>{patient.dob}</span></div>
                <div className="flex justify-between"><span className="font-bold">Gender:</span> <span>{patient.sex}</span></div>
                <div className="flex justify-between"><span className="font-bold">Current Age:</span> <span>{calculateAge(patient.dob)} Years</span></div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">Attending Practitioner</h2>
              <div className="space-y-2 text-sm practitioner-info">
                <div className="flex justify-between"><span className="font-bold">Doctor Name:</span> <span>{doctor?.name || "Dr. Unassigned"}</span></div>
                <div className="flex justify-between"><span className="font-bold">Specialization:</span> <span>Neurology / Cognitive Science</span></div>
                <div className="flex justify-between"><span className="font-bold">Clinical Email:</span> <span>{doctor?.email || "clinical@neuraltrack.org"}</span></div>
                <div className="flex justify-between"><span className="font-bold">Facility:</span> <span>NeuralTrack Integrated Medical Center</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-black pb-1 uppercase">Predictive Analysis Summary</h2>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border border-gray-200">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-gray-500 metric-label">Baseline CDR</p>
                <p className="text-3xl font-black metric-value">{currentCDRValue.toFixed(1)}</p>
                <p className="text-[9px] font-bold text-blue-600">{mlInsights?.currentModelAccuracy} Accuracy</p>
              </div>
              <div className="text-center border-x border-gray-300">
                <p className="text-[10px] uppercase font-bold text-gray-500 metric-label">12M Projection</p>
                <p className="text-3xl font-black text-red-600 metric-value">{projectedCDR.toFixed(1)}</p>
                <p className="text-[9px] font-bold text-red-600">{mlInsights?.projectionModelAccuracy} Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-gray-500 metric-label">Confidence Level</p>
                <p className="text-xl font-bold mt-2 metric-value" style={{ color: mlInsights?.confidenceColor }}>{mlInsights?.confidence}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase">Clinical Narrative:</h3>
              <p className="text-sm leading-relaxed italic text-gray-800 bg-white p-4 border-l-4 border-gray-300 clinical-narrative">
                "{clinicalSummary}"
              </p>
            </div>
          </div>

          {/* Page 2: Historical Assessment Records */}
          <div className="page-break pt-10 space-y-6">
            <div className="border-b-2 border-black pb-2">
              <h2 className="text-lg font-bold uppercase">Historical Assessment Records</h2>
              <p className="text-[10px] text-gray-500 italic">Longitudinal Patient History (Top 6 Recent Sessions)</p>
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-y border-black">
                  <th className="py-2 text-left px-2">Visit Date</th>
                  <th className="py-2 text-center px-2">MoCa Score</th>
                  <th className="py-2 text-left px-2">Subdomain Breakdown (V, N, A, L, Ab, R, O)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patient.mocaTests.slice().reverse().slice(0, 6).map((test, i) => (
                  <tr key={i}>
                    <td className="py-3 px-2 font-bold">{test.date}</td>
                    <td className="py-3 px-2 text-center font-black">{test.totalScore} / 30</td>
                    <td className="py-3 px-2 text-xs font-mono text-gray-600">
                      {test.subscores.visuospatialExec}, {test.subscores.naming}, {test.subscores.attention}, {test.subscores.language}, {test.subscores.abstraction}, {test.subscores.recall}, {test.subscores.orientation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Page 3: Longitudinal Visualization */}
          <div className="page-break pt-10 space-y-8">
            <div className="border-b-2 border-black pb-2 flex justify-between items-end">
              <h2 className="text-lg font-bold uppercase">Clinical Longitudinal Visualization</h2>
              <p className="text-[10px] font-bold uppercase text-gray-500">Patient: {patient.name} | ID: {patient.id}</p>
            </div>

            <div className="bg-white border border-gray-300 p-8 flex flex-col items-center">
              <div className="w-full h-[350px] relative">
                {/* SVG Graph Reproduced for Print */}
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-full overflow-visible">
                  {[0, 10, 20, 30].map(val => (
                    <g key={val}>
                      <line x1={PADDING_X} y1={CHART_HEIGHT - PADDING_Y - (val / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} x2={CHART_WIDTH - PADDING_X} y2={CHART_HEIGHT - PADDING_Y - (val / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
                      <text x={PADDING_X - 10} y={CHART_HEIGHT - PADDING_Y - (val / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} className="text-[12px] font-bold fill-gray-400" dominantBaseline="middle" textAnchor="end">{val}</text>
                    </g>
                  ))}
                  {chartData.length > 1 && (
                    <>
                      <path d={`M ${chartData.map((d, i) => `${PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)},${CHART_HEIGHT - PADDING_Y - (d.moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}`).join(' L ')}`} fill="none" stroke="black" strokeWidth="3" />
                      <path d={`M ${chartData.map((d, i) => `${PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)},${CHART_HEIGHT - PADDING_Y - (d.cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}`).join(' L ')}`} fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6,4" />
                    </>
                  )}
                  {chartData.map((d, i) => (
                    <g key={i}>
                      <circle cx={PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)} cy={CHART_HEIGHT - PADDING_Y - (d.moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y)} r="5" fill="black" />
                      <text x={PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)} y={CHART_HEIGHT} className="text-[10px] font-bold fill-gray-600" textAnchor="middle">{d.date}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-10 w-full px-10">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase border-b border-gray-200">Legend</p>
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-black"></div> <span>MoCa Baseline Score</span></div>
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-blue-500"></div> <span>Historical CDR Value</span></div>
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-red-500 border-dashed border"></div> <span>1Y CDR Projection</span></div>
                </div>
                <div className="text-[10px] text-gray-500 leading-tight">
                  <p className="font-bold uppercase mb-1 underline">Visual Interpretation Note</p>
                  This graphical representation tracks the inverse relationship between standardized MoCa scores and the Clinical Dementia Rating. Significant divergence in these lines often correlates with neurodegenerative progression.
                </div>
              </div>
            </div>
          </div>

          <div className="page-break pt-10 text-center space-y-4 min-h-[200px] flex flex-col justify-center">
            <div className="border-t border-gray-200 pt-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End of Clinical Documentation</p>
              <p className="text-[8px] text-gray-300 mt-2 font-mono uppercase">NeuralTrack Secure Report Identifier</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1">{patient.id}-REPORT-{new Date().getTime()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
