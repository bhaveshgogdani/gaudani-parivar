import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import UploadResultPage from './pages/UploadResultPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageVillages from './pages/ManageVillages';
import ManageStandards from './pages/ManageStandards';
import ViewReports from './pages/ViewReports';
import ManageResults from './pages/ManageResults';
import TopThreeRankingPage from './pages/TopThreeRankingPage';
import ResultSuccessPage from './pages/ResultSuccessPage';
import ViewResultsPage from './pages/ViewResultsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload-result" element={<UploadResultPage />} />
          <Route path="/view-results" element={<ViewResultsPage />} />
          <Route path="/result-success" element={<ResultSuccessPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-villages"
            element={
              <PrivateRoute>
                <ManageVillages />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-standards"
            element={
              <PrivateRoute>
                <ManageStandards />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/view-reports"
            element={
              <PrivateRoute>
                <ViewReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-results"
            element={
              <PrivateRoute>
                <ManageResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/top-three"
            element={
              <PrivateRoute>
                <TopThreeRankingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;

