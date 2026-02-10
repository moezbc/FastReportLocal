import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    HiOutlineRocketLaunch,
    HiOutlineArrowRightOnRectangle,
    HiOutlineDocumentText,
    HiOutlineCircleStack,
    HiOutlineCog6Tooth,
    HiOutlineClock,
    HiOutlineCalendarDays,
} from 'react-icons/hi2';

interface AppLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { path: '/launcher', icon: HiOutlineRocketLaunch, label: 'Lanceur' },
    { path: '/reports', icon: HiOutlineDocumentText, label: 'Rapports' },
    { path: '/connections', icon: HiOutlineCircleStack, label: 'Connexions' },
    { path: '/executions', icon: HiOutlineClock, label: 'Exécutions' },
    { path: '/schedules', icon: HiOutlineCalendarDays, label: 'Planifications' },
    { path: '/settings', icon: HiOutlineCog6Tooth, label: 'Paramétrage' },
];

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="min-h-screen bg-surface-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-900/80 border-r border-surface-800 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-surface-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">FastReport</h1>
                            <p className="text-xs text-surface-500">Lanceur de rapports</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.path)
                                ? 'bg-primary-600/15 text-primary-300 border border-primary-500/20 shadow-glow'
                                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-surface-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                                <span className="text-white text-xs font-bold uppercase">
                                    {user?.username?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-200">{user?.username}</p>
                                <p className="text-xs text-surface-500">{user?.is_staff ? 'Admin' : 'Utilisateur'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-surface-500 hover:text-red-400 rounded-lg hover:bg-surface-800/60 transition-all"
                            title="Déconnexion"
                        >
                            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
