import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MocaTest } from '../types';
import { addMocaTest, fetchPatientById } from '../utils/api';
import { ArrowLeft, Save, Brain, Info } from 'lucide-react';

const AddAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalScore: 0,
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
    <div className="p-8 lg:p-12 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(`/patient/${id}`)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </button>

      <div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">New Assessment</h1>
        <p className="text-slate-500 mt-2 font-medium">Record a MOCA screening session for the patient.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-10">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <Brain size={20} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Session Data</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Assessment Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Total MOCA Score (0-30)</label>
              <input 
                type="number" 
                max="30"
                min="0"
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                value={formData.totalScore} 
                onChange={(e) => setFormData({...formData, totalScore: Number(e.target.value)})} 
                required 
              />
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Info size={20} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Subscores</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Abstraction</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                value={formData.abstraction} 
                onChange={(e) => setFormData({...formData, abstraction: Number(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Recall</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                value={formData.recall} 
                onChange={(e) => setFormData({...formData, recall: Number(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Orientation</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                value={formData.orientation} 
                onChange={(e) => setFormData({...formData, orientation: Number(e.target.value)})} 
              />
            </div>
          </div>
        </section>

        <div className="pt-8">
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssessment;

