import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import LauncherPage from './pages/LauncherPage';
import ReportsPage from './pages/ReportsPage';
import ReportFormPage from './pages/ReportFormPage';
import ConnectionsPage from './pages/ConnectionsPage';
import SettingsPage from './pages/SettingsPage';
import ExecutionsPage from './pages/ExecutionsPage';
import SchedulesPage from './pages/SchedulesPage';
import AppLayout from './components/layout/AppLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-950">
                <div className="animate-pulse-slow">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                </div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/launcher" replace />} />
                                        <Route path="/launcher" element={<LauncherPage />} />
                                        <Route path="/reports" element={<ReportsPage />} />
                                        <Route path="/reports/new" element={<ReportFormPage />} />
                                        <Route path="/reports/:id/edit" element={<ReportFormPage />} />
                                        <Route path="/connections" element={<ConnectionsPage />} />
                                        <Route path="/settings" element={<SettingsPage />} />
                                        <Route path="/executions" element={<ExecutionsPage />} />
                                        <Route path="/schedules" element={<SchedulesPage />} />
                                    </Routes>
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
