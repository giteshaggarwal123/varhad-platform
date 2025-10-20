import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientDatabase from './pages/ClientDatabase';
import ClientOutreach from './pages/ClientOutreach';
import HIVTesting from './pages/HIVTesting';
import PrEPInitiation from './pages/PrEPInitiation';
import FollowUps from './pages/FollowUps';
import Inventory from './pages/Inventory';
import Documents from './pages/Documents';
import AssetManagement from './pages/AssetManagement';
import HRAttendance from './pages/HRAttendance';
import PrEPConsent from './pages/PrEPConsent';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="outreach" element={<ClientOutreach />} />
            <Route path="hiv-testing" element={<HIVTesting />} />
            <Route path="prep" element={<PrEPInitiation />} />
            <Route path="documents" element={<Documents />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="asset-management" element={<AssetManagement />} />
            <Route path="followups" element={<FollowUps />} />
            <Route path="hr-attendance" element={<HRAttendance />} />
            <Route path="prep-consent" element={<PrEPConsent />} />
            <Route path="clients" element={<ClientDatabase />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
