import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import {
    HiOutlineDocumentText,
    HiOutlineCalendarDays,
    HiOutlineBolt,
    HiOutlineCheckBadge,
    HiArrowTrendingUp
} from 'react-icons/hi2';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardStats {
    total_reports: number;
    active_schedules: number;
    recent_executions: {
        id: number;
        report_name: string;
        status: string;
        started_at: string;
        user: string;
    }[];
    execution_stats: {
        success: number;
        failed: number;
        total_last_7_days: number;
    };
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/reports/stats/');
            setStats(response.data);
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                {error}
            </div>
        );
    }

    if (!stats) return null;

    // Calculs
    const successRate = stats.execution_stats.total_last_7_days > 0 
        ? Math.round((stats.execution_stats.success / stats.execution_stats.total_last_7_days) * 100) 
        : 100;
        
    const pendingCount = 0; // Donnée non retournée par l'API actuellement

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Tableau de bord</h1>
                    <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mt-1">Vue d'ensemble de votre activité</p>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="glass-card p-5 flex flex-col justify-between h-36">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <HiOutlineDocumentText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-surface-900 dark:text-white mt-3">{stats.total_reports}</p>
                        <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Rapports</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="glass-card p-5 flex flex-col justify-between h-36">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <HiOutlineBolt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-surface-900 dark:text-white mt-3">{stats.execution_stats.total_last_7_days}</p>
                        <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Exécutions</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="glass-card p-5 flex flex-col justify-between h-36">
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                        <HiOutlineCheckBadge className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-surface-900 dark:text-white mt-3">{successRate}%</p>
                        <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Taux de succès</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="glass-card p-5 flex flex-col justify-between h-36">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <HiOutlineCalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-surface-900 dark:text-white mt-3">{stats.active_schedules}</p>
                        <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Planifications actives</p>
                    </div>
                </div>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Dernières exécutions (span 2) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
                        <HiArrowTrendingUp className="w-5 h-5 text-blue-500" />
                        Dernières exécutions
                    </h2>
                    <div className="glass-card overflow-hidden">
                        {stats.recent_executions.length === 0 ? (
                            <div className="p-8 text-center text-sm font-medium text-surface-500 dark:text-surface-400">
                                Aucune exécution récente
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {stats.recent_executions.map((exec) => (
                                    <div key={exec.id} className="p-4 border-b border-surface-200 dark:border-white/5 hover:bg-surface-50 dark:hover:bg-white/[0.02] flex items-center justify-between transition-colors last:border-0">
                                        <div className="flex items-center gap-4">
                                            {/* Status Dot */}
                                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${
                                                exec.status === 'success' ? 'bg-green-500 shadow-green-500/40' : 
                                                exec.status === 'failed' ? 'bg-red-500 shadow-red-500/40' : 
                                                'bg-orange-500 shadow-orange-500/40'
                                            }`} />
                                            <div>
                                                <p className="font-bold text-sm text-surface-900 dark:text-white">{exec.report_name}</p>
                                                <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mt-0.5">
                                                    {exec.user} - {format(new Date(exec.started_at), 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                exec.status === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 
                                                exec.status === 'failed' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20' : 
                                                'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20'
                                            }`}>
                                                {exec.status === 'success' ? 'Succès' : exec.status === 'failed' ? 'Échoué' : 'En attente'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Graphs & Tops (span 1) */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Répartition des exécutions */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-surface-900 dark:text-white mb-6">Répartition des exécutions</h3>
                        <div className="space-y-5">
                            {/* Succès */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-surface-600 dark:text-surface-300">Succès</span>
                                    <span className="font-bold text-surface-900 dark:text-white">{stats.execution_stats.success}</span>
                                </div>
                                <div className="w-full bg-surface-100 dark:bg-surface-800/50 rounded-full h-2 border border-surface-200 dark:border-surface-700">
                                    <div className="bg-green-500 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" style={{ width: `${stats.execution_stats.total_last_7_days > 0 ? (stats.execution_stats.success / stats.execution_stats.total_last_7_days) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                            
                            {/* En attente */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-surface-600 dark:text-surface-300">En attente</span>
                                    <span className="font-bold text-surface-900 dark:text-white">{pendingCount}</span>
                                </div>
                                <div className="w-full bg-surface-100 dark:bg-surface-800/50 rounded-full h-2 border border-surface-200 dark:border-surface-700">
                                    <div className="bg-orange-500 h-2 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" style={{ width: `${stats.execution_stats.total_last_7_days > 0 ? (pendingCount / stats.execution_stats.total_last_7_days) * 100 : 0}%` }}></div>
                                </div>
                            </div>

                            {/* Échoué */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-surface-600 dark:text-surface-300">Échoué</span>
                                    <span className="font-bold text-surface-900 dark:text-white">{stats.execution_stats.failed}</span>
                                </div>
                                <div className="w-full bg-surface-100 dark:bg-surface-800/50 rounded-full h-2 border border-surface-200 dark:border-surface-700">
                                    <div className="bg-red-500 h-2 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]" style={{ width: `${stats.execution_stats.total_last_7_days > 0 ? (stats.execution_stats.failed / stats.execution_stats.total_last_7_days) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top rapports (Mocked until API provides it) */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-6">
                            <span className="text-yellow-500 text-lg">🏆</span> Top rapports
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: "Liste magasins", count: 31 },
                                { name: "Rapport Ticket Vente ESP J-1", count: 9 },
                                { name: "CONTRÔLE EAN 26PE DANS STLD", count: 5 },
                                { name: "Fichier analyse de la marge", count: 2 },
                                { name: "Audit CA Journalier", count: 1 }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-400 text-xs flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-bold text-surface-900 dark:text-surface-200 truncate max-w-[160px] md:max-w-[180px]" title={item.name}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">{item.count} exec.</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
