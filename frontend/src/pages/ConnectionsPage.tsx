import { useState, useEffect } from 'react';
import { FiDatabase, FiPlus, FiEdit2, FiTrash2, FiZap, FiCheck, FiX } from 'react-icons/fi';
import { fetchDataSources, createDataSource, updateDataSource, deleteDataSource, testDataSourceConnection, DataSource } from '../api/settings';

const DB_TYPES = [
    { value: 'postgresql', label: 'PostgreSQL', port: 5432 },
    { value: 'mysql', label: 'MySQL', port: 3306 },
    { value: 'oracle', label: 'Oracle', port: 1521 },
    { value: 'sqlserver', label: 'SQL Server', port: 1433 },
];

const emptyForm = (): Partial<DataSource> => ({
    name: '', db_type: 'postgresql', host: '', port: 5432, database_name: '', username: '', password: '', is_active: true, options: {},
});

export default function ConnectionsPage() {
    const [datasources, setDatasources] = useState<DataSource[]>([]);
    const [form, setForm] = useState<Partial<DataSource>>(emptyForm());
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testResults, setTestResults] = useState<Record<number, { success: boolean; message: string }>>({});

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchDataSources();
            setDatasources(Array.isArray(res.data) ? res.data : (res.data as any).results || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editId) { await updateDataSource(editId, form); }
            else { await createDataSource(form); }
            setShowForm(false); setForm(emptyForm()); setEditId(null);
            loadData();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const handleEdit = (ds: DataSource) => {
        setForm({ ...ds, password: '' });
        setEditId(ds.id); setShowForm(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Supprimer la source "${name}" ?`)) return;
        try { await deleteDataSource(id); loadData(); } catch (e) { console.error(e); }
    };

    const handleTest = async (id: number) => {
        try {
            const res = await testDataSourceConnection(id);
            setTestResults(prev => ({ ...prev, [id]: res.data }));
        } catch (e: any) {
            setTestResults(prev => ({ ...prev, [id]: { success: false, message: e.response?.data?.message || 'Erreur' } }));
        }
        setTimeout(() => setTestResults(prev => { const copy = { ...prev }; delete copy[id]; return copy; }), 5000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                            <FiDatabase className="text-white" size={22} />
                        </span>
                        Sources de données
                    </h1>
                    <p className="text-slate-400 mt-1">Connexions aux bases de données externes</p>
                </div>
                <button onClick={() => { setForm(emptyForm()); setEditId(null); setShowForm(true); }} className="btn-gradient flex items-center gap-2">
                    <FiPlus size={18} /> Nouvelle connexion
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="glass-card p-6 space-y-4 border border-violet-500/20">
                    <h2 className="text-lg font-semibold text-white">{editId ? 'Modifier' : 'Nouvelle'} connexion</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Nom *</label>
                            <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="input-field w-full" placeholder="Production DB" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Type de base *</label>
                            <select value={form.db_type || 'postgresql'}
                                onChange={e => { const t = e.target.value as DataSource['db_type']; setForm({ ...form, db_type: t, port: DB_TYPES.find(d => d.value === t)?.port }); }}
                                className="input-field w-full">
                                {DB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Hôte *</label>
                            <input type="text" value={form.host || ''} onChange={e => setForm({ ...form, host: e.target.value })}
                                className="input-field w-full" placeholder="192.168.1.100" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Port</label>
                            <input type="number" value={form.port || ''} onChange={e => setForm({ ...form, port: Number(e.target.value) })}
                                className="input-field w-full" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Nom de la base *</label>
                            <input type="text" value={form.database_name || ''} onChange={e => setForm({ ...form, database_name: e.target.value })}
                                className="input-field w-full" placeholder="my_database" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Utilisateur *</label>
                            <input type="text" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })}
                                className="input-field w-full" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm text-slate-400 mb-1 block">
                                Mot de passe {editId && <span className="text-xs text-slate-500">(laisser vide pour conserver)</span>}
                            </label>
                            <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })}
                                className="input-field w-full" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button onClick={handleSave} disabled={saving} className="btn-gradient flex items-center gap-2">
                            <FiCheck size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10">
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* DataSources List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="glass-card p-8 text-center text-slate-400">Chargement...</div>
                ) : datasources.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-400">Aucune source de données configurée</div>
                ) : datasources.map(ds => (
                    <div key={ds.id} className="glass-card p-5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${ds.is_active ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-slate-500'}`}>
                                <FiDatabase size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-white flex items-center gap-2">
                                    {ds.name}
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ds.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {ds.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-400 mt-0.5">
                                    {DB_TYPES.find(t => t.value === ds.db_type)?.label} — {ds.host}:{ds.port} / {ds.database_name}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {testResults[ds.id] && (
                                <span className={`text-sm flex items-center gap-1 ${testResults[ds.id].success ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {testResults[ds.id].success ? <FiCheck /> : <FiX />} {testResults[ds.id].message}
                                </span>
                            )}
                            <button onClick={() => handleTest(ds.id)} className="p-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-colors" title="Tester la connexion">
                                <FiZap size={16} />
                            </button>
                            <button onClick={() => handleEdit(ds)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" title="Modifier">
                                <FiEdit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(ds.id, ds.name)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors" title="Supprimer">
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
