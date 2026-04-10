import React, { useEffect, useState } from 'react';
import axios from '../api/client';
import {
    HiOutlineDocumentText,
    HiOutlineCalendarDays,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlinePlay,
    HiPresentationChartLine
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

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Tableau de bord</h1>
                    <p className="text-surface-500 dark:text-surface-400">Aperçu de l'activité de vos rapports</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <HiOutlineDocumentText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Rapports totaux</p>
                            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.total_reports}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <HiOutlineCalendarDays className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Planifications actives</p>
                            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.active_schedules}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                            <HiPresentationChartLine className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Exécutions (7 jours)</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-surface-900 dark:text-white">
                                    {stats.execution_stats.total_last_7_days}
                                </p>
                                <span className="text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                    {stats.execution_stats.success} succès
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Executions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
                        <HiOutlinePlay className="w-5 h-5 text-primary-500" />
                        Exécutions récentes
                    </h2>
                    <div className="glass-card overflow-hidden">
                        {stats.recent_executions.length === 0 ? (
                            <div className="p-8 text-center text-surface-400">
                                Aucune exécution récente
                            </div>
                        ) : (
                            <table className="w-full text-left bg-transparent">
                                <thead>
                                    <tr className="border-b border-surface-200 dark:border-surface-700/50 text-xs text-surface-400 uppercase">
                                        <th className="px-6 py-4 font-medium">Rapport</th>
                                        <th className="px-6 py-4 font-medium">Statut</th>
                                        <th className="px-6 py-4 font-medium text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-200 dark:divide-surface-700/50">
                                    {stats.recent_executions.map((exec) => (
                                        <tr key={exec.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-surface-900 dark:text-surface-200">{exec.report_name}</p>
                                                <p className="text-xs text-surface-500">par {exec.user}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {exec.status === 'success' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                        <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Succès
                                                    </span>
                                                ) : exec.status === 'failed' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                        <HiOutlineXCircle className="w-3.5 h-3.5" /> Échec
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> En cours
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-surface-500">
                                                {format(new Date(exec.started_at), 'dd MMM HH:mm', { locale: fr })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions (Future scope, maybe shortcuts?) */}
                <div className="space-y-4">
                    {/* Placeholder for future widgets or charts */}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
