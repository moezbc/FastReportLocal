import React, { useState, useEffect } from 'react';
import { FiCalendar, FiRepeat, FiClock, FiToggleLeft, FiToggleRight, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import api from '../api/client';

interface Schedule {
    id: number;
    report: number;
    report_name: string;
    user_username: string;
    output_type: string;
    routing_mode: string;
    schedule_type: 'once' | 'recurring';
    scheduled_at: string | null;
    cron_expression: string;
    timezone: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

function cronToHuman(cron: string): string {
    if (!cron) return '—';
    const parts = cron.split(' ');
    if (parts.length < 5) return cron;
    const [minute, hour, , , dow] = parts;
    const days: Record<string, string> = { '0': 'Dim', '1': 'Lun', '2': 'Mar', '3': 'Mer', '4': 'Jeu', '5': 'Ven', '6': 'Sam', '*': 'Tous les jours' };
    const dayStr = dow === '*' ? 'Tous les jours' : dow.split(',').map(d => days[d] || d).join(', ');
    return `${dayStr} à ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

export default function SchedulesPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/report-launcher/schedules/');
            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: number) => {
        try {
            const res = await api.patch(`/report-launcher/schedules/${id}/toggle/`);
            setSchedules(prev => prev.map(s => s.id === id ? res.data : s));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSchedule = async (id: number, name: string) => {
        if (!confirm(`Supprimer la planification du rapport "${name}" ?`)) return;
        try {
            await api.delete(`/report-launcher/schedules/${id}/`);
            setSchedules(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Planifications</h1>
                    <p className="text-surface-400 mt-1">Suivi des rapports planifiés</p>
                </div>
                <button onClick={loadData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-surface-400 hover:text-white transition-colors">
                    <FiRefreshCw size={18} />
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-surface-400">Chargement...</div>
                ) : schedules.length === 0 ? (
                    <div className="p-12 text-center text-surface-400">Aucune planification configurée</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Rapport</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Utilisateur</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Planification</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Sortie</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Routage</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map(s => (
                                <tr key={s.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!s.is_active ? 'opacity-50' : ''}`}>
                                    <td className="p-4 font-medium text-white">{s.report_name}</td>
                                    <td className="p-4 text-sm text-slate-400">{s.user_username}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.schedule_type === 'recurring'
                                            ? 'bg-purple-500/10 text-purple-400'
                                            : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {s.schedule_type === 'recurring' ? <FiRepeat size={12} /> : <FiClock size={12} />}
                                            {s.schedule_type === 'recurring' ? 'Récurrent' : 'Une fois'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-300">
                                        {s.schedule_type === 'recurring'
                                            ? cronToHuman(s.cron_expression)
                                            : s.scheduled_at
                                                ? new Date(s.scheduled_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                : '—'
                                        }
                                    </td>
                                    <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300">{s.output_type}</span></td>
                                    <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300">{s.routing_mode}</span></td>
                                    <td className="p-4">
                                        <button onClick={() => toggleActive(s.id)} className="flex items-center gap-1.5" title={s.is_active ? 'Désactiver' : 'Activer'}>
                                            {s.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                                                    <FiToggleRight size={14} /> Actif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                                                    <FiToggleLeft size={14} /> Inactif
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => deleteSchedule(s.id, s.report_name)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                            title="Supprimer"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
