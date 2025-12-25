import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPatient } from '../utils/api';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Check,
  Fingerprint
} from 'lucide-react';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    address: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tempId = `NT-${Math.floor(10000 + Math.random() * 90000)}`;
      const payload = {
        ...formData,
        id: tempId,
        createdAt: new Date().toISOString(),
        mocaTests: []
      };
      await addPatient(payload as any);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 pt-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#888] hover:text-[#333] font-black uppercase tracking-widest text-xs transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Abort Registration
          </button>

          <div className="w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center text-[#333] border border-white">
            <Fingerprint size={24} />
          </div>
        </div>

        <div className="text-left">
          <h1 className="text-5xl font-black text-[#333] tracking-tighter leading-tight">Patient Entry</h1>
          <p className="text-[#888] font-bold uppercase tracking-[0.3em] text-xs mt-2 ml-0.5">Secure Clinical Record Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white space-y-14">
          {/* Identity Section */}
          <section className="space-y-10">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
              <User className="text-[#333]" size={20} />
              <h2 className="text-xs font-black text-[#333] uppercase tracking-[0.2em]">Identity Details</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-3 group">
                <label className="text-xs font-black text-[#888] uppercase tracking-widest ml-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DDD]" size={20} />
                  <input
                    type="text"
                    placeholder="Enter patient full name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-100 transition-all outline-none font-bold text-base text-[#333]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="text-xs font-black text-[#888] uppercase tracking-widest ml-1">Birth Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DDD]" size={20} />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-100 transition-all outline-none font-bold text-sm text-[#333]"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#888] uppercase tracking-widest ml-1">Biological Sex</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-100 transition-all outline-none font-bold text-sm text-[#333] appearance-none"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Residential Metadata */}
          <section className="space-y-10">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
              <MapPin className="text-[#333]" size={20} />
              <h2 className="text-xs font-black text-[#333] uppercase tracking-[0.2em]">Residential Metadata</h2>
            </div>
            <div className="space-y-3 group">
              <label className="text-xs font-black text-[#888] uppercase tracking-widest ml-1">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DDD]" size={20} />
                <input
                  type="text"
                  placeholder="Complete residential address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-100 transition-all outline-none font-bold text-base text-[#333]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-10">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
              <Phone className="text-[#333]" size={20} />
              <h2 className="text-xs font-black text-[#333] uppercase tracking-[0.2em]">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <label className="text-xs font-black text-[#888] uppercase tracking-widest ml-1">Primary Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DDD]" size={20} />
                  <input
                    type="tel"
                    placeholder="+1 ..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-100 transition-all outline-none font-bold text-sm text-[#333]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3 group">
                <label className="text-xs font-black text-[#888] uppercase tracking-widest ml-1">Primary Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DDD]" size={20} />
                  <input
                    type="email"
                    placeholder="patient@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-100 transition-all outline-none font-bold text-sm text-[#333]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-10 border-t border-slate-50 flex flex-col items-center gap-6">
            <button
              type="submit"
              className="w-full bg-[#333] hover:bg-black text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-black/20 active:scale-[0.99] flex items-center justify-center gap-3 text-base uppercase tracking-[0.2em]"
            >
              <Check size={22} strokeWidth={3} />
              Confirmed Entry
            </button>
            <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-[0.2em]">
              Security validation active • Session reset on refresh
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
