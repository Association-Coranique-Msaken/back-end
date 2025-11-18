import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './landing-page/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ProtectedRoute from './components/dashboard/ProtectedRoute';
import DashboardHome from './pages/admin/DashboardHome';
import UsersPage from './pages/admin/UsersPage';
import TeachersPage from './pages/admin/TeachersPage';
import GroupsPage from './pages/admin/GroupsPage';
import CompetitionsPage from './pages/admin/CompetitionsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="competitions" element={<CompetitionsPage />} />
          <Route path="admins" element={<div>Admins Page (Coming Soon)</div>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
