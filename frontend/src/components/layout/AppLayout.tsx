import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import {
    HiOutlineRocketLaunch,
    HiOutlineArrowRightOnRectangle,
    HiOutlineDocumentText,
    HiOutlineCircleStack,
    HiOutlineCog6Tooth,
    HiOutlineClock,
    HiOutlineCalendarDays,
    HiOutlineHome,
    HiOutlineUserGroup,
} from 'react-icons/hi2';

interface AppLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Tableau de bord' },
    { path: '/launcher', icon: HiOutlineRocketLaunch, label: 'Lanceur' },
    { path: '/reports', icon: HiOutlineDocumentText, label: 'Rapports' },
    { path: '/connections', icon: HiOutlineCircleStack, label: 'Connexions' },
    { path: '/executions', icon: HiOutlineClock, label: 'Exécutions' },
    { path: '/schedules', icon: HiOutlineCalendarDays, label: 'Planifications' },
    { path: '/users-groups', icon: HiOutlineUserGroup, label: 'Utilisateurs & Groupes', adminOnly: true },
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
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-surface-900/80 border-r border-surface-200 dark:border-surface-800 flex flex-col transition-colors duration-200">
                {/* Logo */}
                <div className="p-6 border-b border-surface-200 dark:border-surface-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">FastReport</h1>
                            <p className="text-xs text-surface-500">Lanceur de rapports</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => {
                        if (item.adminOnly && !user?.is_staff) return null;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.path)
                                    ? 'bg-primary-50 dark:bg-primary-600/15 text-primary-600 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 shadow-sm dark:shadow-glow'
                                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-surface-200 dark:border-surface-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                                <span className="text-surface-900 dark:text-white text-xs font-bold uppercase">
                                    {user?.username?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-700 dark:text-surface-200">{user?.username}</p>
                                <p className="text-xs text-surface-500">{user?.is_staff ? 'Admin' : 'Utilisateur'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-surface-800/60 rounded-lg transition-all"
                                title="Déconnexion"
                            >
                                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                            </button>
                        </div>
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
