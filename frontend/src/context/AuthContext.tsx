import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../utils/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token === 'dev-token') {
        setUser({
          id: 'dev-user-id',
          name: 'Dr. Le Nam (Dev)',
          username: 'lenam_dev',
          email: 'nle7147@clinic.com',
          specialization: 'Administrator'
        });
        setLoading(false);
        return;
      }
      
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (data: any) => {
    const res = await authApi.login(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const googleLogin = async (data: any) => {
    if (localStorage.getItem('token') === 'dev-token') {
      localStorage.setItem('token', 'dev-token');
      setUser({
        id: 'dev-google-id',
        name: data.name || 'Google Dev User',
        username: (data.email || 'googleuser').split('@')[0],
        email: data.email || 'google@neuraltrack.org'
      });
      return;
    }
    const res = await authApi.googleLogin(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

