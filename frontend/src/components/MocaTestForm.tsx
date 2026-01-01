import React, { useState } from 'react';
import { MocaTest } from '../types';

interface MocaTestFormProps {
  onSubmit: (test: MocaTest) => void;
}

const MocaTestForm: React.FC<MocaTestFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [abstraction, setAbstraction] = useState(0);
  const [recall, setRecall] = useState(0);
  const [orientation, setOrientation] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      totalScore,
      subscores: {
        visuospatialExec: 0,
        naming: 0,
        attention: 0,
        language: 0,
        abstraction,
        recall,
        orientation,
      },
    });
    // Reset form
    setDate('');
    setTotalScore(0);
    setAbstraction(0);
    setRecall(0);
    setOrientation(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">Assessment Date</label>
        <input
          type="date"
          className="w-full bg-blue-500 border border-blue-400 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-white/50 outline-none placeholder:text-blue-300"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">Total MOCA Score (0-30)</label>
          <input
            type="number"
            max="30"
            min="0"
            className="w-full bg-blue-500 border border-blue-400 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-white/50 outline-none"
            value={totalScore}
            onChange={(e) => setTotalScore(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">Abstraction</label>
          <input
            type="number"
            className="w-full bg-blue-500 border border-blue-400 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-white/50 outline-none"
            value={abstraction}
            onChange={(e) => setAbstraction(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">Recall</label>
          <input
            type="number"
            className="w-full bg-blue-500 border border-blue-400 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-white/50 outline-none"
            value={recall}
            onChange={(e) => setRecall(Number(e.target.value))}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20 mt-2"
      >
        Save Assessment
      </button>
    </form>
  );
};

export default MocaTestForm;
