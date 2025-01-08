import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import ManagerDashboard from './pages/manager/dashboard';
import PatientDetails from './pages/manager/patient-details';
import DeliveryTracking from './pages/manager/delivery-tracking';
import PantryDashboard from './pages/pantry/dashboard';
import DeliveryDashboard from './pages/delivery/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Hospital Food Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/patient/:id" element={<PatientDetails />} />
        <Route path="/manager/deliveries" element={<DeliveryTracking />} />
        
        {/* Inner Pantry Routes */}
        <Route path="/pantry/dashboard" element={<PantryDashboard />} />
        
        {/* Delivery Personnel Routes */}
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;