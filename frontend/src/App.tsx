import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientDetails from './pages/PatientDetails';
import AddPatient from './pages/AddPatient';
import AddAssessment from './pages/AddAssessment';
import PatientDirectory from './pages/PatientDirectory';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes wrapped in Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/patients" element={<Layout><PatientDirectory /></Layout>} />
            <Route path="/patient/:id" element={<Layout><PatientDetails /></Layout>} />
            <Route path="/add-patient" element={<Layout><AddPatient /></Layout>} />
            <Route path="/edit-patient/:id" element={<Layout><AddPatient /></Layout>} />
            <Route path="/assessment/:id" element={<Layout><AddAssessment /></Layout>} />
            <Route path="/assessment/:id/edit/:testIndex" element={<Layout><AddAssessment /></Layout>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
