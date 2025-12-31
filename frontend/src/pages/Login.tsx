import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Shield, Info, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMicrosoftLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Logic for real Microsoft login would go here
      setError('Microsoft login is currently in demo mode. Please use standard login.');
    } catch (err: any) {
      setError('Microsoft login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Logic for real Google login would go here
      setError('Google login is currently in demo mode. Please use standard login.');
    } catch (err: any) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      console.error('Login Error details:', err.response?.data);
      const serverMessage = err.response?.data?.message;
      const serverError = err.response?.data?.error;
      
      if (serverMessage === 'Incorrect password') {
        setError('Incorrect password. Please check your credentials.');
      } else if (serverMessage === 'User not found') {
        setError('No account found with this email/username.');
      } else if (serverError) {
        setError(`Server Error: ${serverError}`);
      } else {
        setError(serverMessage || 'Connection failed. Ensure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    localStorage.setItem('token', 'dev-token');
    window.location.href = '/';
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
              <Brain size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#323130]">Sign In</h1>
            <p className="text-[10px] font-bold text-[#A19F9D] uppercase tracking-[0.2em]">Clinical Portal Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-[#FDE7E9] border border-[#F1707B]/20 text-[#A4262C] text-[10px] font-bold flex items-center gap-2 rounded-none">
                <Shield size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Rectangular Floating Input Container */}
              <div className="relative group">
                <div className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-black text-[#A19F9D] uppercase tracking-widest z-10 group-focus-within:text-[#323130] transition-colors">
                  Identity
                </div>
                <input
                  type="text"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#EDEBE9] group-hover:border-[#A19F9D] focus:border-[#323130] text-sm focus:outline-none transition-all placeholder:text-[#A19F9D]/30 font-medium rounded-none shadow-sm"
                  placeholder="Username or email"
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
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin" /> : 'Log In'}
              </button>
            </div>
          </form>

          {/* Social Sign In */}
          <div className="space-y-6 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EDEBE9]" />
              </div>
              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest">
                <span className="bg-white px-4 text-[#A19F9D]">Or sign in via</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-2 py-3 px-2 bg-white border border-[#EDEBE9] hover:bg-[#F3F2F1] transition-all text-[9px] font-bold uppercase tracking-wider shadow-sm rounded-none"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" /><path fill="#81bc06" d="M12 1h10v10H12z" /><path fill="#05a6f0" d="M1 12h10v10H1z" /><path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Microsoft
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-3 px-2 bg-white border border-[#EDEBE9] hover:bg-[#F3F2F1] transition-all text-[9px] font-bold uppercase tracking-wider shadow-sm rounded-none"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest">
                No account?{' '}
                <Link to="/register" className="text-[#323130] underline underline-offset-4 decoration-2 hover:text-black transition-colors">
                  Register
                </Link>
              </p>
              
              <button 
                type="button"
                onClick={handleDevLogin}
                className="text-[9px] font-bold text-[#A19F9D] hover:text-[#323130] uppercase tracking-[0.2em] transition-colors"
              >
                Dev Bypass
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Static Footer */}
      <footer className="relative z-10 w-full p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-[#A19F9D]">
          <span>© 2025 NeuralTrack</span>
        </div>
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-[#605E5C]">
          <a href="#" className="hover:text-[#323130] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#323130] transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
