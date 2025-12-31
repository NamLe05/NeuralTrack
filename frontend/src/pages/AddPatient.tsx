import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePatient, addPatient, fetchPatientById, updatePatient } from '../utils/api';
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
  Globe,
  UserPlus,
  UserCog,
  Trash2
} from 'lucide-react';

const AddPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
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

  useEffect(() => {
    if (isEditMode && id) {
      const loadPatient = async () => {
        try {
          const response = await fetchPatientById(id);
          const p = response.data;
          if (p) {
            // Split address back into components if possible, or just put in street
            const addressParts = p.address.split(', ');
            const street = addressParts[0] || '';
            const stateZip = addressParts[1] || '';
            const stateZipParts = stateZip.split(' ');
            const state = stateZipParts[0] || '';
            const zip = stateZipParts[1] || '';

            setFormData({
              name: p.name,
              dob: p.dob,
              sex: p.sex as any,
              streetAddress: street,
              state: state,
              zipCode: zip,
              phone: p.phone,
              email: p.email,
            });
          }
        } catch (err) {
          console.error("Failed to load patient", err);
        } finally {
          setLoading(false);
        }
      };
      loadPatient();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Concatenate address for the unified address field in the data model
      const fullAddress = `${formData.streetAddress}, ${formData.state} ${formData.zipCode}`;

      if (isEditMode && id) {
        const payload = {
          name: formData.name,
          dob: formData.dob,
          sex: formData.sex,
          address: fullAddress,
          phone: formData.phone,
          email: formData.email,
        };
        await updatePatient(id, payload);
        navigate(`/patient/${id}`);
      } else {
        const tempId = `NT-${Math.floor(10000 + Math.random() * 90000)}`;
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
        navigate('/patients');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePatient = async () => {
    if (isEditMode && id && window.confirm(`PERMANENT DELETION: Are you sure you want to remove ${formData.name} and all associated MoCA assessments? This action is irreversible.`)) {
      try {
        await deletePatient(id);
        navigate('/patients');
      } catch (err) {
        console.error('Deletion failed:', err);
        alert('Failed to delete patient. Ensure the backend is running and you have proper permissions.');
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-2 border-[#EDEBE9] border-t-[#0078D4] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#605E5C]">
        <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate('/patients')}>Registry</span>
        <ChevronRight size={12} />
        {isEditMode && (
          <>
            <span className="hover:text-[#0078D4] cursor-pointer" onClick={() => navigate(`/patient/${id}`)}>Patient Profile</span>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-[#323130]">{isEditMode ? 'Modify Record' : 'New Patient Entry'}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EDEBE9] pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#323130]">
            {isEditMode ? 'Edit Patient Profile' : 'Register New Patient'}
          </h1>
          <p className="text-xs font-semibold text-[#605E5C] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-[#107C10]" />
            Secure Clinical Registration Protocol
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(isEditMode ? `/patient/${id}` : '/patients')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EDEBE9] rounded text-xs font-bold text-[#323130] hover:bg-[#FAF9F8] transition-colors shadow-sm whitespace-nowrap min-w-[140px] justify-center"
          >
            <ArrowLeft size={16} />
            {isEditMode ? 'Back to Profile' : 'Back to Directory'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Profile Container */}
          <div className="bg-white border border-[#EDEBE9] rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-[#FAF9F8] border-b border-[#EDEBE9] flex items-center gap-3">
              {isEditMode ? <UserCog className="text-[#0078D4]" size={20} /> : <Fingerprint className="text-[#0078D4]" size={20} />}
              <h2 className="text-sm font-bold text-[#323130]">
                {isEditMode ? 'Identity Amendment' : 'Patient Profile & Identity'}
              </h2>
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

        {/* Centered Footer Buttons */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="flex items-center gap-3">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeletePatient}
                className="px-10 py-3 bg-white border border-[#A4262C] text-[#A4262C] font-bold rounded shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] hover:bg-[#FDE7E9]"
              >
                <Trash2 size={18} strokeWidth={3} />
                Delete Profile
              </button>
            )}
            <button
              type="submit"
              className="px-10 py-3 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold rounded shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
            >
              <Check size={18} strokeWidth={3} />
              {isEditMode ? 'Update Profile' : 'Register Patient'}
            </button>
          </div>
          <p className="text-[10px] font-bold text-[#AAA] uppercase tracking-widest">
            Protocol Verified • Clinical Log Entry Pending
          </p>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
