import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiPlay } from 'react-icons/fi';
import { fetchReport, createReport, updateReport, testQuery, Report, ReportParameter } from '../api/reports';
import { fetchActiveDataSources, DataSource } from '../api/settings';

const OUTPUT_OPTIONS = ['CSV', 'XLSX', 'JSON', 'XML', 'PDF'];
const ROUTING_OPTIONS = ['screen', 'email', 'sftp', 'ftp', 'local'];
const PARAM_TYPES = [
    { value: 'string', label: 'Texte' },
    { value: 'number', label: 'Nombre' },
    { value: 'date', label: 'Date' },
    { value: 'datetime', label: 'Date/Heure' },
    { value: 'enum', label: 'Énumération' },
    { value: 'boolean', label: 'Booléen' },
];
const OPERATORS = ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IN', 'LIKE', 'IS NULL', 'IS NOT NULL'];

export default function ReportFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', description: '', sql_query: '',
        datasource: null as number | null,
        visibility: 'private' as 'private' | 'public',
        output_types: ['CSV', 'XLSX'] as string[],
        routing_modes: ['screen'] as string[],
        csv_separator: ',',
    });

    const [parameters, setParameters] = useState<ReportParameter[]>([]);
    const [datasources, setDatasources] = useState<DataSource[]>([]);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'sql' | 'params' | 'output'>('general');

    useEffect(() => {
        fetchActiveDataSources().then(r => setDatasources(r.data as any)).catch(() => { });
        if (isEdit) {
            fetchReport(Number(id)).then(r => {
                const d = r.data as any;
                setForm({
                    name: d.name, description: d.description, sql_query: d.sql_query,
                    datasource: d.datasource,
                    visibility: d.visibility,
                    output_types: d.output_types || [],
                    routing_modes: d.routing_modes || [],
                    csv_separator: d.csv_separator || ',',
                });
                setParameters(d.parameters || []);
            }).catch(e => setError('Erreur de chargement du rapport'));
        }
    }, [id]);

    const handleSave = async () => {
        if (!form.name || !form.sql_query) { setError('Nom et requête SQL requis'); return; }
        setSaving(true); setError('');
        try {
            const payload = { ...form, parameters };
            if (isEdit) {
                await updateReport(Number(id), payload);
            } else {
                await createReport(payload);
            }
            navigate('/reports');
        } catch (e: any) {
            setError(e.response?.data?.detail || 'Erreur de sauvegarde');
        }
        setSaving(false);
    };

    const handleTest = async () => {
        if (!isEdit) return;
        setTesting(true); setTestResult(null);
        try {
            const res = await testQuery(Number(id));
            setTestResult(res.data);
        } catch (e: any) {
            setTestResult({ error: e.response?.data?.error || 'Erreur de test' });
        }
        setTesting(false);
    };

    const addParameter = () => {
        setParameters([...parameters, {
            name: '', label: '', param_type: 'string', operators: ['='],
            default_value: '', required: false, order: parameters.length, enum_values: [],
        }]);
    };

    const updateParameter = (idx: number, field: string, value: any) => {
        setParameters(p => p.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    const removeParameter = (idx: number) => {
        setParameters(p => p.filter((_, i) => i !== idx));
    };

    const toggleArrayItem = (arr: string[], item: string) =>
        arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

    const tabs = [
        { key: 'general' as const, label: 'Général' },
        { key: 'sql' as const, label: 'Requête SQL' },
        { key: 'params' as const, label: `Paramètres (${parameters.length})` },
        { key: 'output' as const, label: 'Sortie & Routage' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/reports')} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        {isEdit ? 'Modifier le rapport' : 'Nouveau rapport'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {isEdit && (
                        <button onClick={handleTest} disabled={testing} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors">
                            <FiPlay size={16} /> {testing ? 'Test...' : 'Tester'}
                        </button>
                    )}
                    <button onClick={handleSave} disabled={saving} className="btn-gradient flex items-center gap-2">
                        <FiSave size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {error && <div className="glass-card p-4 border-red-500/30 bg-red-500/5 text-red-400">{error}</div>}

            {/* Tabs */}
            <div className="flex gap-1 p-1 glass-card rounded-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="glass-card p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nom du rapport *</label>
                            <input
                                type="text" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="input-field w-full" placeholder="Ex: Ventes mensuelles"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="input-field w-full h-24 resize-none" placeholder="Description du rapport..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Source de données *</label>
                            <select
                                value={form.datasource || ''}
                                onChange={e => setForm({ ...form, datasource: e.target.value ? Number(e.target.value) : null })}
                                className="input-field w-full"
                            >
                                <option value="">— Sélectionner une source —</option>
                                {datasources.map(ds => (
                                    <option key={ds.id} value={ds.id}>
                                        {ds.name} ({ds.db_type} – {ds.host}/{ds.database_name})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Visibilité</label>
                            <div className="flex gap-3">
                                {(['private', 'public'] as const).map(v => (
                                    <button
                                        key={v} type="button"
                                        onClick={() => setForm({ ...form, visibility: v })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.visibility === v
                                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {v === 'private' ? '🔒 Privé' : '🌍 Public'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SQL Tab */}
                {activeTab === 'sql' && (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Requête SQL * <span className="text-slate-500 text-xs ml-2">Utilisez :param_name pour les paramètres</span>
                        </label>
                        <textarea
                            value={form.sql_query}
                            onChange={e => setForm({ ...form, sql_query: e.target.value })}
                            className="input-field w-full font-mono text-sm h-80 resize-y"
                            placeholder="SELECT * FROM table WHERE column = :param1"
                            spellCheck={false}
                        />
                        {testResult && (
                            <div className="mt-4 glass-card p-4">
                                {testResult.error ? (
                                    <div className="text-red-400">{testResult.error}</div>
                                ) : (
                                    <>
                                        <div className="text-sm text-slate-400 mb-3">
                                            {testResult.row_count} ligne(s) retournée(s) {testResult.truncated && '(tronqué à 100)'}
                                        </div>
                                        <div className="overflow-x-auto max-h-64">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr>
                                                        {(testResult.columns || []).map((col: string) => (
                                                            <th key={col} className="text-left p-2 text-xs font-medium text-slate-400 border-b border-white/5">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(testResult.rows || []).slice(0, 20).map((row: any, i: number) => (
                                                        <tr key={i} className="border-b border-white/5">
                                                            {(testResult.columns || []).map((col: string) => (
                                                                <td key={col} className="p-2 text-slate-300 truncate max-w-[200px]">{String(row[col] ?? '')}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Parameters Tab */}
                {activeTab === 'params' && (
                    <div className="space-y-4">
                        {parameters.map((param, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-300">Paramètre {idx + 1}</span>
                                    <button onClick={() => removeParameter(idx)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Nom (dans SQL)</label>
                                        <input type="text" value={param.name} onChange={e => updateParameter(idx, 'name', e.target.value)}
                                            className="input-field w-full text-sm" placeholder="param_name" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Libellé</label>
                                        <input type="text" value={param.label} onChange={e => updateParameter(idx, 'label', e.target.value)}
                                            className="input-field w-full text-sm" placeholder="Libellé affiché" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Type</label>
                                        <select value={param.param_type} onChange={e => updateParameter(idx, 'param_type', e.target.value)}
                                            className="input-field w-full text-sm">
                                            {PARAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Valeur par défaut</label>
                                        <input type="text" value={param.default_value} onChange={e => updateParameter(idx, 'default_value', e.target.value)}
                                            className="input-field w-full text-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                        <input type="checkbox" checked={param.required} onChange={e => updateParameter(idx, 'required', e.target.checked)}
                                            className="rounded border-white/20 bg-white/5" />
                                        Obligatoire
                                    </label>
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block">Opérateurs</label>
                                        <div className="flex flex-wrap gap-1">
                                            {OPERATORS.map(op => (
                                                <button key={op} type="button"
                                                    onClick={() => updateParameter(idx, 'operators', toggleArrayItem(param.operators, op))}
                                                    className={`px-2 py-0.5 rounded text-xs transition-colors ${param.operators.includes(op)
                                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                            : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'
                                                        }`}>
                                                    {op}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addParameter} className="w-full p-3 rounded-xl border border-dashed border-white/10 text-slate-400 hover:border-violet-500/30 hover:text-violet-300 transition-colors flex items-center justify-center gap-2">
                            <FiPlus size={16} /> Ajouter un paramètre
                        </button>
                    </div>
                )}

                {/* Output & Routing Tab */}
                {activeTab === 'output' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">Types de sortie</label>
                            <div className="flex flex-wrap gap-2">
                                {OUTPUT_OPTIONS.map(opt => (
                                    <button key={opt} type="button"
                                        onClick={() => setForm({ ...form, output_types: toggleArrayItem(form.output_types, opt) })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.output_types.includes(opt)
                                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                            }`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {form.output_types.includes('CSV') && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Séparateur CSV</label>
                                <div className="flex gap-2">
                                    {[',', ';', '\t', '|'].map(sep => (
                                        <button key={sep} type="button"
                                            onClick={() => setForm({ ...form, csv_separator: sep })}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.csv_separator === sep
                                                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                                }`}>
                                            {sep === '\t' ? 'TAB' : sep === '|' ? 'PIPE' : sep}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">Modes de routage</label>
                            <div className="flex flex-wrap gap-2">
                                {ROUTING_OPTIONS.map(opt => (
                                    <button key={opt} type="button"
                                        onClick={() => setForm({ ...form, routing_modes: toggleArrayItem(form.routing_modes, opt) })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.routing_modes.includes(opt)
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                            }`}>
                                        {opt === 'screen' ? '🖥️ Écran' : opt === 'email' ? '📧 Email' : opt === 'sftp' ? '🔒 SFTP' : opt === 'ftp' ? '📂 FTP' : '💾 Local'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
