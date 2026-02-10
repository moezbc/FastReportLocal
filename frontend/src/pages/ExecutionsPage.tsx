import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiLoader, FiRefreshCw } from 'react-icons/fi';
import api from '../api/client';

interface Execution {
    id: number;
    report: number;
    report_name: string;
    user_username: string;
    output_type: string;
    routing_mode: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    started_at: string;
    completed_at: string | null;
    error_message: string;
}

const STATUS_MAP = {
    pending: { icon: FiClock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'En attente' },
    running: { icon: FiLoader, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'En cours' },
    success: { icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Succès' },
    failed: { icon: FiXCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Échoué' },
};

export default function ExecutionsPage() {
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/report-launcher/executions/');
            const data = Array.isArray(res.data) ? res.data : (res.data as any).results || [];
            setExecutions(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                            <FiClock className="text-white" size={22} />
                        </span>
                        Historique des exécutions
                    </h1>
                    <p className="text-slate-400 mt-1">Suivi des exécutions de rapports</p>
                </div>
                <button onClick={loadData} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                    <FiRefreshCw size={18} />
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Chargement...</div>
                ) : executions.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">Aucune exécution enregistrée</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Rapport</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Utilisateur</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Sortie</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Routage</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Durée</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Erreur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {executions.map(exec => {
                                const st = STATUS_MAP[exec.status];
                                const StatusIcon = st.icon;
                                const duration = exec.completed_at && exec.started_at
                                    ? Math.round((new Date(exec.completed_at).getTime() - new Date(exec.started_at).getTime()) / 1000)
                                    : null;
                                return (
                                    <React.Fragment key={exec.id}>
                                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 font-medium text-white">{exec.report_name}</td>
                                            <td className="p-4 text-sm text-slate-400">{exec.user_username}</td>
                                            <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300">{exec.output_type}</span></td>
                                            <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300">{exec.routing_mode}</span></td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>
                                                    <StatusIcon size={12} className={exec.status === 'running' ? 'animate-spin' : ''} /> {st.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-slate-400">
                                                {new Date(exec.started_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4 text-sm text-slate-400">{duration !== null ? `${duration}s` : '\u2014'}</td>
                                            <td className="p-4">
                                                {exec.status === 'failed' && exec.error_message ? (
                                                    <button onClick={() => setExpandedId(expandedId === exec.id ? null : exec.id)} className="text-xs text-red-400 hover:text-red-300 underline">
                                                        {expandedId === exec.id ? 'Masquer' : 'Voir erreur'}
                                                    </button>
                                                ) : '\u2014'}
                                            </td>
                                        </tr>
                                        {expandedId === exec.id && exec.error_message && (
                                            <tr className="bg-red-500/5">
                                                <td colSpan={8} className="px-4 py-3">
                                                    <div className="text-sm text-red-400 font-mono whitespace-pre-wrap break-all bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                                        {exec.error_message}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
