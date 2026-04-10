import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiLoader, FiRefreshCw, FiSearch } from 'react-icons/fi';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

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

    const filteredExecutions = executions.filter(exec => {
        const matchText = exec.report_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exec.user_username.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchDate = true;
        if (dateFrom || dateTo) {
            const execDate = new Date(exec.started_at);
            if (dateFrom) {
                matchDate = matchDate && execDate >= new Date(dateFrom);
            }
            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);
                matchDate = matchDate && execDate <= to;
            }
        }
        return matchText && matchDate;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                            <FiClock className="text-surface-900 dark:text-white" size={22} />
                        </span>
                        Historique des exécutions
                    </h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-1">Suivi des exécutions de rapports</p>
                </div>
                <button onClick={loadData} className="p-2.5 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-white/10 hover:text-surface-900 dark:hover:text-white transition-colors">
                    <FiRefreshCw size={18} />
                </button>
            </div>

            <div className="glass-card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600 dark:text-surface-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une exécution (rapport ou utilisateur)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-surface-600 dark:text-surface-400 text-sm">Du</span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="input-field text-sm"
                        />
                        <span className="text-surface-600 dark:text-surface-400 text-sm">Au</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="input-field text-sm"
                        />
                        {(dateFrom || dateTo) && (
                            <button
                                onClick={() => { setDateFrom(''); setDateTo(''); }}
                                className="ml-2 text-xs text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white underline min-w-max"
                            >
                                Effacer
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-surface-600 dark:text-surface-400">Chargement...</div>
                ) : executions.length === 0 ? (
                    <div className="p-12 text-center text-surface-600 dark:text-surface-400">Aucune exécution enregistrée</div>
                ) : filteredExecutions.length === 0 ? (
                    <div className="p-12 text-center text-surface-600 dark:text-surface-400">Aucun résultat pour "{searchQuery}"</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-200 dark:border-white/5">
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Rapport</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Utilisateur</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Sortie</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Routage</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Statut</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Date</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Durée</th>
                                <th className="text-left p-4 text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Erreur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExecutions.map(exec => {
                                const st = STATUS_MAP[exec.status];
                                const StatusIcon = st.icon;
                                const duration = exec.completed_at && exec.started_at
                                    ? Math.round((new Date(exec.completed_at).getTime() - new Date(exec.started_at).getTime()) / 1000)
                                    : null;
                                return (
                                    <React.Fragment key={exec.id}>
                                        <tr className="border-b border-surface-200 dark:border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 font-medium text-surface-900 dark:text-white">{exec.report_name}</td>
                                            <td className="p-4 text-sm text-surface-600 dark:text-surface-400">{exec.user_username}</td>
                                            <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-surface-100 dark:bg-white/5 text-surface-700 dark:text-surface-300">{exec.output_type}</span></td>
                                            <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-surface-100 dark:bg-white/5 text-surface-700 dark:text-surface-300">{exec.routing_mode}</span></td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>
                                                    <StatusIcon size={12} className={exec.status === 'running' ? 'animate-spin' : ''} /> {st.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-surface-600 dark:text-surface-400">
                                                {new Date(exec.started_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4 text-sm text-surface-600 dark:text-surface-400">{duration !== null ? `${duration}s` : '\u2014'}</td>
                                            <td className="p-4">
                                                {exec.error_message ? (
                                                    <button 
                                                        onClick={() => setExpandedId(expandedId === exec.id ? null : exec.id)} 
                                                        className={`text-xs underline ${exec.status === 'failed' ? 'text-red-400 hover:text-red-300' : 'text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300'}`}
                                                    >
                                                        {expandedId === exec.id ? 'Masquer' : (exec.status === 'failed' ? 'Voir erreur' : 'Voir message')}
                                                    </button>
                                                ) : '\u2014'}
                                            </td>
                                        </tr>
                                        {expandedId === exec.id && exec.error_message && (
                                            <tr className={exec.status === 'failed' ? "bg-red-500/5" : "bg-amber-500/5"}>
                                                <td colSpan={8} className="px-4 py-3">
                                                    <div className={`text-sm font-mono whitespace-pre-wrap break-all rounded-lg p-3 border ${exec.status === 'failed' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
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
