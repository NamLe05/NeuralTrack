import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MocaTest } from '../types';
import { addMocaTest } from '../utils/api';
import {
  ArrowLeft,
  Brain,
  Info,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Activity,
  Fingerprint,
  Check
} from 'lucide-react';

const AddAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalScore: 0,
    visuospatialExec: 0,
    naming: 0,
    attention: 0,
    language: 0,
    abstraction: 0,
    recall: 0,
    orientation: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        const test: MocaTest = {
          date: formData.date,
          totalScore: formData.totalScore,
          subscores: {
            visuospatialExec: formData.visuospatialExec,
            naming: formData.naming,
            attention: formData.attention,
            language: formData.language,
            abstraction: formData.abstraction,
            recall: formData.recall,
            orientation: formData.orientation,
          },
        };
        await addMocaTest(id, test);
        navigate(`/patient/${id}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#605E5C]">
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate('/dashboard')}>Registry</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate(`/patient/${id}`)}>Patient Profile</span>
        <ChevronRight size={12} />
        <span className="text-[#323130]">New Assessment</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#323130]">New MOCA Assessment</h1>
          <p className="text-xs font-semibold text-[#605E5C] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-[#107C10]" />
            Secure Clinical Registration Protocol
          </p>
        </div>
        <button
          onClick={() => navigate(`/patient/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold text-[#323130] hover:bg-[#FAF9F8] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Metrics Container */}
          <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 bg-[#FAF9F8] border-b border-[#EDEBE9] flex items-center gap-3">
              <Brain className="text-[#0078D4]" size={20} />
              <h2 className="text-sm font-bold text-[#323130]">Assessment Metrics</h2>
            </div>

            <div className="p-8 space-y-10 flex-1">
              <div className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Assessment Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Total MOCA Score (0-30)</label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                    <input
                      type="number"
                      max="30"
                      min="0"
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.totalScore}
                      onChange={(e) => setFormData({ ...formData, totalScore: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscores Container */}
          <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 bg-[#FAF9F8] border-b border-[#EDEBE9] flex items-center gap-3">
              <Fingerprint className="text-[#0078D4]" size={20} />
              <h2 className="text-sm font-bold text-[#323130]">Subscores Breakdown</h2>
            </div>

            <div className="p-8 space-y-10 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Visuospatial / Exec (0-5)</label>
                  <input
                    type="number"
                    max="5"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.visuospatialExec}
                    onChange={(e) => setFormData({ ...formData, visuospatialExec: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Naming (0-3)</label>
                  <input
                    type="number"
                    max="3"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.naming}
                    onChange={(e) => setFormData({ ...formData, naming: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Attention (0-6)</label>
                  <input
                    type="number"
                    max="6"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.attention}
                    onChange={(e) => setFormData({ ...formData, attention: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Language (0-3)</label>
                  <input
                    type="number"
                    max="3"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Abstraction (0-2)</label>
                  <input
                    type="number"
                    max="2"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.abstraction}
                    onChange={(e) => setFormData({ ...formData, abstraction: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Recall (0-5)</label>
                  <input
                    type="number"
                    max="5"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.recall}
                    onChange={(e) => setFormData({ ...formData, recall: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Orientation (0-6)</label>
                  <input
                    type="number"
                    max="6"
                    min="0"
                    className="w-full px-4 py-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                    value={formData.orientation}
                    onChange={(e) => setFormData({ ...formData, orientation: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDEBE9]">
                <div className="flex items-start gap-4 bg-[#F3F2F1] p-4 rounded-sm">
                  <Info className="text-[#0078D4] mt-0.5 shrink-0" size={16} />
                  <p className="text-[10px] font-semibold text-[#605E5C] leading-relaxed">
                    Verify orientation questions across all domains before final clinical submission. All subscores must sum to the total score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Footer Button */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-12 py-4 bg-[#323130] hover:bg-black text-white font-black rounded shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
          >
            <Check size={20} strokeWidth={3} />
            Save Assessment
          </button>
          <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-widest">
            Protocol Verified • Digital Log Entry Pending
          </p>
        </div>
      </form>
    </div>
  );
};

export default AddAssessment;
