import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TripsListPage from './pages/Trips/TripsListPage';
import CreateTripPage from './pages/Trips/CreateTripPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsListPage />} />
            <Route path="/trips/new" element={<CreateTripPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
