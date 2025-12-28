import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Shield, UserPlus, ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#F3F2F1] flex flex-col items-center justify-start font-sans text-[#323130] pt-12 pb-20">
      {/* 3D Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large Light Grey Shape */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-[#EDEBE9]/40 to-transparent blur-3xl transform -rotate-12" />

        {/* Dark Grey Geometric Shape 1 */}
        <div className="absolute top-[20%] -right-[5%] w-[400px] h-[400px] bg-[#323130]/5 backdrop-blur-[2px] border border-[#323130]/10 transform rotate-45 animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Light Grey Geometric Shape 2 */}
        <div className="absolute -bottom-[5%] left-[15%] w-[300px] h-[300px] bg-[#A19F9D]/10 backdrop-blur-[1px] border border-[#A19F9D]/20" />
      </div>

      <main className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-white/90 backdrop-blur-xl border border-[#EDEBE9] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-10 space-y-8 rounded-none">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-[#323130] shadow-lg mb-2 rounded-none">
              <UserPlus size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#323130]">Join Registry</h1>
            <p className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-[0.2em]">Practitioner Registration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-[#FDE7E9] border border-[#F1707B]/20 text-[#A4262C] text-[10px] font-bold flex items-center gap-2 rounded-none">
                <Shield size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Floating Input Container */}
              <div className="relative group">
                <div className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-black text-[#A19F9D] uppercase tracking-widest z-10 group-focus-within:text-[#323130] transition-colors">
                  Identity
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#EDEBE9] group-hover:border-[#A19F9D] focus:border-[#323130] text-sm focus:outline-none transition-all placeholder:text-[#A19F9D]/30 font-medium rounded-none shadow-sm"
                  placeholder="Full legal name"
                />
              </div>

              <div className="relative group">
                <div className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-black text-[#A19F9D] uppercase tracking-widest z-10 group-focus-within:text-[#323130] transition-colors">
                  Username
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#EDEBE9] group-hover:border-[#A19F9D] focus:border-[#323130] text-sm focus:outline-none transition-all placeholder:text-[#A19F9D]/30 font-medium rounded-none shadow-sm"
                  placeholder="Username"
                />
              </div>

              <div className="relative group">
                <div className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-black text-[#A19F9D] uppercase tracking-widest z-10 group-focus-within:text-[#323130] transition-colors">
                  Email
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#EDEBE9] group-hover:border-[#A19F9D] focus:border-[#323130] text-sm focus:outline-none transition-all placeholder:text-[#A19F9D]/30 font-medium rounded-none shadow-sm"
                  placeholder="name@clinic.org"
                />
              </div>

              <div className="relative group">
                <div className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-black text-[#A19F9D] uppercase tracking-widest z-10 group-focus-within:text-[#323130] transition-colors">
                  Security
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#EDEBE9] group-hover:border-[#A19F9D] focus:border-[#323130] text-sm focus:outline-none transition-all placeholder:text-[#A19F9D]/30 font-medium rounded-none shadow-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#323130] hover:bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] py-4 transition-all shadow-md active:scale-[0.99] flex items-center justify-center disabled:opacity-50 rounded-none"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin" /> : 'Register Account'}
              </button>
            </div>
          </form>

          <div className="pt-4 flex flex-col items-center">
            <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest">
              Already a member?{' '}
              <Link to="/login" className="text-[#323130] underline underline-offset-4 decoration-2 hover:text-black transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Static Footer */}
      <footer className="relative z-10 w-full p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-[#A19F9D]">
          <span>© 2025 NeuralTrack</span>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5C]">
          <a href="#" className="hover:text-[#323130] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#323130] transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
