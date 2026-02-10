import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiDatabase, FiEye, FiEyeOff } from 'react-icons/fi';
import { fetchReports, deleteReport, Report } from '../api/reports';

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { loadReports(); }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const res = await fetchReports();
            setReports(Array.isArray(res.data) ? res.data : (res.data as any).results || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Supprimer le rapport "${name}" ?`)) return;
        try {
            await deleteReport(id);
            setReports(r => r.filter(x => x.id !== id));
        } catch (e) { console.error(e); }
    };

    const filtered = reports.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                            <FiDatabase className="text-white" size={22} />
                        </span>
                        Rapports
                    </h1>
                    <p className="text-slate-400 mt-1">Gérez vos rapports SQL</p>
                </div>
                <button
                    onClick={() => navigate('/reports/new')}
                    className="btn-gradient flex items-center gap-2"
                >
                    <FiPlus size={18} />
                    Nouveau rapport
                </button>
            </div>

            {/* Search */}
            <div className="glass-card p-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un rapport..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-10 w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Chargement...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        {reports.length === 0 ? 'Aucun rapport créé' : 'Aucun résultat'}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Nom</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Visibilité</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Sorties</th>
                                <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Modifié</th>
                                <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(report => (
                                <tr
                                    key={report.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => navigate(`/reports/${report.id}/edit`)}
                                >
                                    <td className="p-4">
                                        <div className="font-medium text-white">{report.name}</div>
                                        <div className="text-sm text-slate-400 truncate max-w-xs">{report.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                            <FiDatabase size={12} />
                                            {report.datasource_name || '—'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {report.visibility === 'public' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <FiEye size={12} /> Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <FiEyeOff size={12} /> Privé
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {(report.output_types || []).map(t => (
                                                <span key={t} className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300">{t}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {new Date(report.updated_at).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => navigate(`/reports/${report.id}/edit`)}
                                                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                                title="Modifier"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(report.id, report.name)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
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
