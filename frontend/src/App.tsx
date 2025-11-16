import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';
import UploadResultPage from './pages/UploadResultPage';
import ViewResultsPage from './pages/ViewResultsPage';
import TopThreeRankingPage from './pages/TopThreeRankingPage';
import EventInformationPage from './pages/EventInformationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageVillages from './pages/ManageVillages';
import ManageStandards from './pages/ManageStandards';
import ViewReports from './pages/ViewReports';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload-result" element={<UploadResultPage />} />
          <Route path="/view-results" element={<ViewResultsPage />} />
          <Route path="/top-three-ranking" element={<TopThreeRankingPage />} />
          <Route path="/event-information" element={<EventInformationPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;

