import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MocaTest } from '../types';
import { addMocaTest, fetchPatientById, updateMocaTest } from '../utils/api';
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
  const { id, testIndex } = useParams<{ id: string; testIndex?: string }>();
  const isEditMode = testIndex !== undefined;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    totalScore: '',
    visuospatialExec: '',
    naming: '',
    attention: '',
    language: '',
    abstraction: '',
    recall: '',
    orientation: '',
  });

  useEffect(() => {
    if (isEditMode && id && testIndex !== undefined) {
      const loadTestData = async () => {
        try {
          const response = await fetchPatientById(id);
          const patient = response.data;
          const index = parseInt(testIndex);
          if (patient && patient.mocaTests && patient.mocaTests[index]) {
            const test = patient.mocaTests[index];
            setFormData({
              date: test.date,
              totalScore: test.totalScore,
              visuospatialExec: test.subscores.visuospatialExec,
              naming: test.subscores.naming,
              attention: test.subscores.attention,
              language: test.subscores.language,
              abstraction: test.subscores.abstraction,
              recall: test.subscores.recall,
              orientation: test.subscores.orientation,
            });
          }
        } catch (err) {
          console.error("Failed to load assessment data", err);
        } finally {
          setLoading(false);
        }
      };
      loadTestData();
    }
  }, [isEditMode, id, testIndex]);

  const handleNumberChange = (field: string, value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setFormData({ ...formData, [field]: '' });
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) {
      setFormData({ ...formData, [field]: num });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        const test: MocaTest = {
          date: formData.date,
          totalScore: Number(formData.totalScore) || 0,
          subscores: {
            visuospatialExec: Number(formData.visuospatialExec) || 0,
            naming: Number(formData.naming) || 0,
            attention: Number(formData.attention) || 0,
            language: Number(formData.language) || 0,
            abstraction: Number(formData.abstraction) || 0,
            recall: Number(formData.recall) || 0,
            orientation: Number(formData.orientation) || 0,
          },
        };

        if (isEditMode && testIndex !== undefined) {
          await updateMocaTest(id, parseInt(testIndex), test);
        } else {
          await addMocaTest(id, test);
        }
        
        // Immediate navigation after successful save
        navigate(`/patient/${id}`, { replace: true });
      } catch (err) {
        console.error("Save error:", err);
        alert("Failed to save assessment. Please check clinical connectivity.");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-2 border-[#EDEBE9] border-t-[#0078D4] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#605E5C]">
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate('/dashboard')}>Registry</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate(`/patient/${id}`)}>Patient Profile</span>
        <ChevronRight size={12} />
        <span className="text-[#323130]">{isEditMode ? 'Edit Assessment' : 'New Assessment'}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#323130]">
            {isEditMode ? 'Modify MoCA Assessment' : 'New MoCA Assessment'}
          </h1>
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

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Unified Assessment Container */}
        <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden divide-y divide-[#EDEBE9]">
          <div className="px-6 py-4 bg-[#FAF9F8] border-b border-[#EDEBE9] flex items-center gap-3">
            <Activity className="text-[#0078D4]" size={18} />
            <h2 className="text-sm font-bold text-[#323130]">
              {isEditMode ? 'Record Amendment' : 'Clinical Assessment Protocol'}
            </h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Primary Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Assessment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={16} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Total MOCA Score (0-30)</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={16} />
                  <input
                    type="number"
                    max="30"
                    min="0"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.totalScore}
                    onChange={(e) => handleNumberChange('totalScore', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Subscores Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F3F2F1] pb-2">
                <Fingerprint className="text-[#0078D4]" size={14} />
                <h3 className="text-[10px] font-black text-[#323130] uppercase tracking-widest">Subscores Breakdown</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Visuospatial (0-5)</label>
                  <input
                    type="number"
                    max="5"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.visuospatialExec}
                    onChange={(e) => handleNumberChange('visuospatialExec', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Naming (0-3)</label>
                  <input
                    type="number"
                    max="3"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.naming}
                    onChange={(e) => handleNumberChange('naming', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Attention (0-6)</label>
                  <input
                    type="number"
                    max="6"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.attention}
                    onChange={(e) => handleNumberChange('attention', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Language (0-3)</label>
                  <input
                    type="number"
                    max="3"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.language}
                    onChange={(e) => handleNumberChange('language', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Abstraction (0-2)</label>
                  <input
                    type="number"
                    max="2"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.abstraction}
                    onChange={(e) => handleNumberChange('abstraction', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Recall (0-5)</label>
                  <input
                    type="number"
                    max="5"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.recall}
                    onChange={(e) => handleNumberChange('recall', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-[#605E5C] uppercase tracking-tighter ml-1">Orientation (0-6)</label>
                  <input
                    type="number"
                    max="6"
                    min="0"
                    className="w-full px-3 py-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-xs text-[#323130]"
                    value={formData.orientation}
                    onChange={(e) => handleNumberChange('orientation', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-start gap-4 bg-[#F3F2F1] p-3 rounded-sm">
                <Info className="text-[#0078D4] mt-0.5 shrink-0" size={14} />
                <p className="text-[9px] font-semibold text-[#605E5C] leading-relaxed">
                  Verify orientation questions across all domains before final clinical submission. All subscores must sum to the total score recorded in the primary metrics section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Footer Button */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-10 py-3 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold rounded shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
          >
            <Check size={18} strokeWidth={3} />
            Save Assessment
          </button>
          <p className="text-[9px] font-bold text-[#A19F9D] uppercase tracking-widest">
            Protocol Verified • Digital Log Entry Pending
          </p>
        </div>
      </form>
    </div>
  );
};

export default AddAssessment;
