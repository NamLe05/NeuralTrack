import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientDetails from './pages/PatientDetails';
import AddPatient from './pages/AddPatient';
import AddAssessment from './pages/AddAssessment';
import PatientDirectory from './pages/PatientDirectory';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientDirectory />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/assessment/:id" element={<AddAssessment />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
