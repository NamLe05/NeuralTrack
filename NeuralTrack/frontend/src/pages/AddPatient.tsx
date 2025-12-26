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
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    streetAddress: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tempId = `NT-${Math.floor(10000 + Math.random() * 90000)}`;

      // Concatenate address for the unified address field in the data model
      const fullAddress = `${formData.streetAddress}, ${formData.state} ${formData.zipCode}`;

      const payload = {
        id: tempId,
        name: formData.name,
        dob: formData.dob,
        sex: formData.sex,
        address: fullAddress,
        phone: formData.phone,
        email: formData.email,
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
    <div className="animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#605E5C]">
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate('/dashboard')}>Registry</span>
        <ChevronRight size={12} />
        <span className="text-[#323130]">New Patient Entry</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#323130]">Register New Patient</h1>
          <p className="text-xs font-semibold text-[#605E5C] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-[#107C10]" />
            Secure Clinical Registration Protocol
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EDEBE9] rounded text-xs font-semibold text-[#323130] hover:bg-[#FAF9F8] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Directory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Profile Container */}
          <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#FAF9F8] border-b border-[#EDEBE9] flex items-center gap-3">
              <Fingerprint className="text-[#0078D4]" size={20} />
              <h2 className="text-sm font-bold text-[#323130]">Patient Profile & Identity</h2>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                    <input
                      type="text"
                      placeholder="Enter patient full name"
                      className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Birth Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                      <input
                        type="date"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Biological Sex</label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130] appearance-none"
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

              {/* Enhanced Address Section */}
              <div className="space-y-4 pt-4 border-t border-[#EDEBE9]">
                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Home Residence</label>
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                      <input
                        type="text"
                        placeholder="State / Province"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Zip Code"
                      className="w-full px-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Container */}
          <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#FAF9F8] border-b border-[#EDEBE9] flex items-center gap-3">
              <Phone className="text-[#0078D4]" size={20} />
              <h2 className="text-sm font-bold text-[#323130]">Contact Information</h2>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Primary Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest ml-1">Patient Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19F9D]" size={18} />
                    <input
                      type="email"
                      placeholder="patient@medical.org"
                      className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded focus:bg-white focus:border-[#0078D4] transition-all outline-none font-bold text-sm text-[#323130]"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDEBE9]">
                <div className="flex items-start gap-4 bg-[#F3F2F1] p-4 rounded-sm">
                  <Check className="text-[#107C10] mt-0.5 shrink-0" size={16} />
                  <p className="text-[10px] font-semibold text-[#605E5C] leading-relaxed">
                    Contact data will be used for automated correspondence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Footer Button */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <button
            type="submit"
            className="px-12 py-3 bg-[#323130] hover:bg-black text-white font-black rounded shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
          >
            <Check size={20} strokeWidth={3} />
            Register Patient
          </button>
          <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-widest">
            Encryption active • Clinical log entry pending
          </p>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
