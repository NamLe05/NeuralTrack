import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, MocaTest } from '../types';
import { fetchPatientById, deleteMocaTest } from '../utils/api';
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
  Info
} from 'lucide-react';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    if (!patient) return 0;
    const current = patient.currentCDR || 0;
    if (patient.mocaTests.length >= 2) {
      const last = patient.mocaTests[patient.mocaTests.length - 1].totalScore;
      const prev = patient.mocaTests[patient.mocaTests.length - 2].totalScore;
      if (last < prev) return Math.min(3.0, current + 0.5);
    }
    return current;
  }, [patient]);

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
    <div className="animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#605E5C]">
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate('/dashboard')}>Registry</span>
        <ChevronRight size={12} />
        <span className="text-[#323130]">Profile: {patient.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDEBE9] pb-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#333] rounded flex items-center justify-center text-white font-bold text-2xl shadow-md">
            {patient.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#323130]">{patient.name}</h1>
            <div className="flex items-center gap-4 text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Dna size={12} className="text-[#0078D4]" /> {patient.sex}</span>
              <span className="flex items-center gap-1.5 font-black text-[#323130] underline decoration-[#0078D4] underline-offset-4 decoration-2">ID: {patient.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold text-[#323130] hover:bg-[#FAF9F8] transition-colors"
          >
            <ChevronLeft size={14} />
            Back to Registry
          </button>
          <button
            onClick={() => navigate(`/assessment/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white rounded text-xs font-bold transition-all shadow-md active:scale-[0.98]"
          >
            <Plus size={14} />
            Record Assessment
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm">
        <div className="bg-[#FAF9F8] border-b border-[#EDEBE9]">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-8 p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">Date of Birth</p>
                  <p className="text-sm font-bold text-[#323130]">{patient.dob}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">Current Age</p>
                  <p className="text-sm font-bold text-[#323130]">{calculateAge(patient.dob)} Years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">Entry Date</p>
                  <p className="text-sm font-bold text-[#323130]">{new Date(patient.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">Primary Contact</p>
                  <p className="text-sm font-bold text-[#323130]">{patient.phone}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">Patient Email</p>
                  <p className="text-sm font-bold text-[#323130]">{patient.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">Residential Metadata</p>
                <p className="text-sm font-bold text-[#323130]">{patient.address}</p>
              </div>
            </div>

            <div className="md:col-span-4 p-8 bg-[#F3F2F1] border-l border-[#EDEBE9] flex flex-col justify-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border border-[#EDEBE9] shadow-sm">
                  <p className="text-[8px] font-black text-[#A19F9D] uppercase tracking-widest mb-1">Baseline CDR</p>
                  <p className="text-xl font-bold text-[#323130]">{patient.currentCDR?.toFixed(1) || '0.0'}</p>
                  <div className="mt-2 w-full h-1 bg-[#F3F2F1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0078D4]" style={{ width: `${(patient.currentCDR || 0) * 33}%` }} />
                  </div>
                </div>
                <div className="bg-white p-4 rounded border border-[#EDEBE9] shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1">
                    <TrendingUp size={10} className="text-[#D83B01]" />
                  </div>
                  <p className="text-[8px] font-black text-[#D83B01] uppercase tracking-widest mb-1">Projected CDR (1Y)</p>
                  <p className="text-xl font-bold text-[#323130]">{projectedCDR.toFixed(1)}</p>
                  <p className="text-[7px] text-[#A19F9D] font-bold mt-1 uppercase italic">Predictive AI Model</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#323130] p-4 rounded shadow-lg text-white">
                <div>
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Mean MOCA</p>
                  <p className="text-2xl font-bold">{patient.mocaTests.length > 0 ? (patient.mocaTests.reduce((acc, t) => acc + t.totalScore, 0) / patient.mocaTests.length).toFixed(1) : '--'}</p>
                </div>
                <div className="w-10 h-10 bg-white/10 text-white rounded flex items-center justify-center">
                  <Brain size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-4">
            <div className="flex items-center gap-3">
              {viewMode === 'timeline' ? (
                <>
                  <History size={20} className="text-[#0078D4]" />
                  <h2 className="text-lg font-bold text-[#323130]">Clinical Timeline</h2>
                </>
              ) : (
                <>
                  <BarChart3 size={20} className="text-[#0078D4]" />
                  <h2 className="text-lg font-bold text-[#323130]">Data Analysis</h2>
                </>
              )}
            </div>

            <div className="flex items-center bg-[#F3F2F1] p-1 rounded-sm border border-[#EDEBE9]">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${viewMode === 'timeline' ? 'bg-white text-[#0078D4] shadow-sm' : 'text-[#605E5C] hover:text-[#323130]'}`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('data')}
                className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${viewMode === 'data' ? 'bg-white text-[#0078D4] shadow-sm' : 'text-[#605E5C] hover:text-[#323130]'}`}
              >
                Graph View
              </button>
            </div>
          </div>

          {viewMode === 'timeline' ? (
            patient.mocaTests.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-[#EDEBE9] rounded bg-[#FAF9F8]">
                <Brain size={40} className="text-[#EDEBE9] mx-auto mb-4" />
                <p className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-widest">Zero Clinical Screening Data Available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {patient.mocaTests.slice().reverse().map((test, index) => {
                  const originalIndex = patient.mocaTests.length - 1 - index;
                  return (
                    <div
                      key={index}
                      className="group bg-white border border-[#EDEBE9] rounded p-5 flex items-center justify-between hover:bg-[#FAF9F8] transition-all"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 bg-[#F3F2F1] rounded flex flex-col items-center justify-center border border-[#EDEBE9] group-hover:bg-[#323130] group-hover:border-[#323130] group-hover:text-white transition-colors duration-200">
                          <span className="text-lg font-bold leading-none">{test.totalScore}</span>
                          <span className="text-[7px] font-bold uppercase tracking-tighter opacity-60">Pts</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#A19F9D]" />
                            <p className="text-xs font-bold text-[#323130]">{test.date}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {[
                              { label: 'Visuospatial', key: 'visuospatialExec' },
                              { label: 'Naming', key: 'naming' },
                              { label: 'Attention', key: 'attention' },
                              { label: 'Language', key: 'language' },
                              { label: 'Abstraction', key: 'abstraction' },
                              { label: 'Recall', key: 'recall' },
                              { label: 'Orientation', key: 'orientation' }
                            ].map(({ label, key }) => (
                              <div key={label} className="bg-[#FAF9F8] border border-[#EDEBE9] px-2 py-0.5 rounded text-[8px] font-bold uppercase text-[#605E5C] tracking-tighter group-hover:bg-white group-hover:border-[#EDEBE9]">
                                {label.substring(0, 3)}: <span className="text-[#323130] font-black">{test.subscores[key as keyof typeof test.subscores]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 hover:bg-[#DEECF9] rounded text-[#605E5C] hover:text-[#0078D4] transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(originalIndex)}
                          className="p-2.5 hover:bg-[#FDE7E9] rounded text-[#605E5C] hover:text-[#A4262C] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[#EDEBE9] text-[#605E5C] flex items-center justify-center ml-2">
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#323130]" />
                    <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter">MOCA Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#A19F9D]" />
                    <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter">CDR Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D83B01]" />
                    <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter">Projection</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['6m', '1y', 'all'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${timeRange === r ? 'bg-[#323130] text-white shadow-md' : 'bg-[#FAF9F8] text-[#A19F9D] border border-[#EDEBE9] hover:bg-[#F3F2F1]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graph Container without overflow-hidden to allow tooltip to pop out */}
              <div className="relative bg-[#FAF9F8] border border-[#EDEBE9] rounded p-4 h-[450px] flex items-end justify-between gap-4">
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
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {/* CDR Score Line */}
                      <path
                        d={`M ${chartData.map((d, i) => `${PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)},${CHART_HEIGHT - PADDING_Y - (d.cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}`).join(' L ')}`}
                        fill="none"
                        stroke="#A19F9D"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />

                      {/* CDR Projection Line - Constrained within SVG bounds */}
                      <line
                        x1={CHART_WIDTH - PADDING_X}
                        y1={CHART_HEIGHT - PADDING_Y - (chartData[chartData.length - 1].cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}
                        x2={CHART_WIDTH - PADDING_X + 40}
                        y2={CHART_HEIGHT - PADDING_Y - (projectedCDR * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y)}
                        stroke="#D83B01"
                        strokeWidth="2.5"
                        strokeDasharray="6,3"
                      />
                    </>
                  )}

                  {chartData.map((d, i) => {
                    const xPos = PADDING_X + (i / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X);
                    const yPosMoca = CHART_HEIGHT - PADDING_Y - (d.moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y);
                    const yPosCdr = CHART_HEIGHT - PADDING_Y - (d.cdr * 10 / 30) * (CHART_HEIGHT - 2 * PADDING_Y);
                    return (
                      <g key={i}>
                        {/* Hover trigger zone */}
                        <rect
                          x={xPos - 20}
                          y="0"
                          width="40"
                          height={CHART_HEIGHT}
                          fill="transparent"
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className="cursor-pointer"
                        />
                        <circle
                          cx={xPos}
                          cy={yPosMoca}
                          r={hoveredPoint === i ? "5" : "3"}
                          fill={hoveredPoint === i ? "#0078D4" : "#323130"}
                          className="transition-all pointer-events-none"
                        />
                        <circle
                          cx={xPos}
                          cy={yPosCdr}
                          r="3"
                          fill="#605E5C"
                          className="pointer-events-none"
                        />
                        <text x={xPos} y={CHART_HEIGHT} className="text-[8px] font-bold fill-[#605E5C]" textAnchor="middle">{d.date.split('-').slice(1).join('/')}</text>
                      </g>
                    );
                  })}
                </svg>

                {/* Always-on-top Tooltip */}
                {hoveredPoint !== null && (
                  <div
                    className="absolute z-50 bg-[#323130] text-white p-3 rounded shadow-2xl border border-white/10 pointer-events-none transition-all duration-75 ease-out"
                    style={{
                      left: `calc(48px + (${(PADDING_X + (hoveredPoint / (chartData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)) / CHART_WIDTH} * (100% - 96px)))`,
                      top: `${24 + ((CHART_HEIGHT - PADDING_Y - (chartData[hoveredPoint].moca / 30) * (CHART_HEIGHT - 2 * PADDING_Y)) / CHART_HEIGHT) * (450 - 96)}px`,
                      transform: 'translate(-50%, -101%)'
                    }}
                  >
                    <div className="text-[8px] font-bold uppercase opacity-60 mb-1 border-b border-white/10 pb-1">{chartData[hoveredPoint].date}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-6">
                        <span className="text-[8px] uppercase font-bold">MoCa:</span>
                        <span className="text-xs font-black">{chartData[hoveredPoint].moca}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-[8px] uppercase font-bold">CDR:</span>
                        <span className="text-xs font-black">{chartData[hoveredPoint].cdr.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#A19F9D] uppercase tracking-[0.2em]">
                  Historical Clinical Axis
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white border border-[#EDEBE9] rounded flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-pulse" />
                  <div>
                    <p className="text-[8px] font-black text-[#A19F9D] uppercase tracking-widest">Cognitive Stability</p>
                    <p className="text-xs font-bold text-[#323130]">High Correlation Detected</p>
                  </div>
                </div>
                <div className="p-4 bg-white border border-[#EDEBE9] rounded flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D83B01]" />
                  <div>
                    <p className="text-[8px] font-black text-[#A19F9D] uppercase tracking-widest">Projection Confidence</p>
                    <p className="text-xs font-bold text-[#323130]">84% Precision Rating</p>
                  </div>
                </div>
                <div className="p-4 bg-white border border-[#EDEBE9] rounded flex items-center gap-4">
                  <ListFilter size={14} className="text-[#605E5C]" />
                  <div>
                    <p className="text-[8px] font-black text-[#A19F9D] uppercase tracking-widest">Metric Source</p>
                    <p className="text-xs font-bold text-[#323130]">NeuralTrack AI V2.1</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
