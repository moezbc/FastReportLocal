import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiPlay } from 'react-icons/fi';
import { fetchReport, createReport, updateReport, testQuery, Report, ReportParameter } from '../api/reports';
import { fetchActiveDataSources, DataSource } from '../api/settings';
import ReportPermissionsPanel from '../components/reports/ReportPermissionsPanel';

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
        category: '',
        email_body: '',
        embed_results: false,
        email_body_header: '',
        email_body_footer: '',
    });

    const [parameters, setParameters] = useState<ReportParameter[]>([]);
    const [datasources, setDatasources] = useState<DataSource[]>([]);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'sql' | 'params' | 'output' | 'permissions'>('general');

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
                    category: d.category || '',
                    email_body: d.email_body || '',
                    embed_results: d.embed_results || false,
                    email_body_header: d.email_body_header || '',
                    email_body_footer: d.email_body_footer || '',
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

    const tabs: { key: 'general' | 'sql' | 'params' | 'output' | 'permissions', label: string }[] = [
        { key: 'general', label: 'Général' },
        { key: 'sql', label: 'Requête SQL' },
        { key: 'params', label: `Paramètres (${parameters.length})` },
        { key: 'output', label: 'Sortie & Routage' },
    ];
    if (isEdit) {
        tabs.push({ key: 'permissions', label: 'Droits d\'accès' });
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/reports')} className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                        {isEdit ? 'Modifier le rapport' : 'Nouveau rapport'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {isEdit && (
                        <button onClick={handleTest} disabled={testing} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-white/10 transition-colors">
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
                                ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-surface-900 dark:text-white border border-surface-200 dark:border-white/10'
                                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-white/5'
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
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nom du rapport *</label>
                            <input
                                type="text" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="input-field w-full" placeholder="Ex: Ventes mensuelles"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="input-field w-full h-24 resize-none" placeholder="Description du rapport..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Source de données *</label>
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
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Catégorie</label>
                            <select
                                value={form.category || ''}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="input-field w-full"
                            >
                                <option value="">— Sélectionner une catégorie —</option>
                                <option value="Retail">Retail</option>
                                <option value="Finance">Finance</option>
                                <option value="industrie">Industrie</option>
                                <option value="distribution">Distribution</option>
                                <option value="Taiwan">Taiwan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Visibilité</label>
                            <div className="flex gap-3">
                                {(['private', 'public'] as const).map(v => (
                                    <button
                                        key={v} type="button"
                                        onClick={() => setForm({ ...form, visibility: v })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.visibility === v
                                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                : 'bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10'
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
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Requête SQL * <span className="text-surface-500 dark:text-surface-500 text-xs ml-2">Utilisez :param_name pour les paramètres</span>
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
                                        <div className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                            {testResult.row_count} ligne(s) retournée(s) {testResult.truncated && '(tronqué à 100)'}
                                        </div>
                                        <div className="overflow-x-auto max-h-64">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr>
                                                        {(testResult.columns || []).map((col: string) => (
                                                            <th key={col} className="text-left p-2 text-xs font-medium text-surface-600 dark:text-surface-400 border-b border-surface-200 dark:border-white/5">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(testResult.rows || []).slice(0, 20).map((row: any, i: number) => (
                                                        <tr key={i} className="border-b border-surface-200 dark:border-white/5">
                                                            {(testResult.columns || []).map((col: string) => (
                                                                <td key={col} className="p-2 text-surface-700 dark:text-surface-300 truncate max-w-[200px]">{String(row[col] ?? '')}</td>
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
                            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-surface-200 dark:border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Paramètre {idx + 1}</span>
                                    <button onClick={() => removeParameter(idx)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-surface-600 dark:text-surface-400 hover:text-red-400">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-surface-500 dark:text-surface-500 mb-1 block">Nom (dans SQL)</label>
                                        <input type="text" value={param.name} onChange={e => updateParameter(idx, 'name', e.target.value)}
                                            className="input-field w-full text-sm" placeholder="param_name" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-surface-500 dark:text-surface-500 mb-1 block">Libellé</label>
                                        <input type="text" value={param.label} onChange={e => updateParameter(idx, 'label', e.target.value)}
                                            className="input-field w-full text-sm" placeholder="Libellé affiché" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-surface-500 dark:text-surface-500 mb-1 block">Type</label>
                                        <select value={param.param_type} onChange={e => updateParameter(idx, 'param_type', e.target.value)}
                                            className="input-field w-full text-sm">
                                            {PARAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-surface-500 dark:text-surface-500 mb-1 block">Valeur par défaut</label>
                                        <input type="text" value={param.default_value} onChange={e => updateParameter(idx, 'default_value', e.target.value)}
                                            className="input-field w-full text-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                                        <input type="checkbox" checked={param.required} onChange={e => updateParameter(idx, 'required', e.target.checked)}
                                            className="rounded border-surface-300 dark:border-white/20 bg-surface-100 dark:bg-white/5" />
                                        Obligatoire
                                    </label>
                                    <div className="flex-1">
                                        <label className="text-xs text-surface-500 dark:text-surface-500 mb-1 block">Opérateurs</label>
                                        <div className="flex flex-wrap gap-1">
                                            {OPERATORS.map(op => (
                                                <button key={op} type="button"
                                                    onClick={() => updateParameter(idx, 'operators', toggleArrayItem(param.operators, op))}
                                                    className={`px-2 py-0.5 rounded text-xs transition-colors ${param.operators.includes(op)
                                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                            : 'bg-surface-100 dark:bg-white/5 text-surface-500 dark:text-surface-500 border border-surface-200 dark:border-white/5 hover:bg-surface-200 dark:hover:bg-white/10'
                                                        }`}>
                                                    {op}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addParameter} className="w-full p-3 rounded-xl border border-dashed border-surface-200 dark:border-white/10 text-surface-600 dark:text-surface-400 hover:border-violet-500/30 hover:text-violet-300 transition-colors flex items-center justify-center gap-2">
                            <FiPlus size={16} /> Ajouter un paramètre
                        </button>
                    </div>
                )}

                {/* Output & Routing Tab */}
                {activeTab === 'output' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Types de sortie</label>
                            <div className="flex flex-wrap gap-2">
                                {OUTPUT_OPTIONS.map(opt => (
                                    <button key={opt} type="button"
                                        onClick={() => setForm({ ...form, output_types: toggleArrayItem(form.output_types, opt) })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.output_types.includes(opt)
                                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                                : 'bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10'
                                            }`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {form.output_types.includes('CSV') && (
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Séparateur CSV</label>
                                <div className="flex gap-2">
                                    {[',', ';', '\t', '|'].map(sep => (
                                        <button key={sep} type="button"
                                            onClick={() => setForm({ ...form, csv_separator: sep })}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.csv_separator === sep
                                                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                    : 'bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10'
                                                }`}>
                                            {sep === '\t' ? 'TAB' : sep === '|' ? 'PIPE' : sep}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Modes de routage</label>
                            <div className="flex flex-wrap gap-2">
                                {ROUTING_OPTIONS.map(opt => (
                                    <button key={opt} type="button"
                                        onClick={() => setForm({ ...form, routing_modes: toggleArrayItem(form.routing_modes, opt) })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.routing_modes.includes(opt)
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : 'bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10'
                                            }`}>
                                        {opt === 'screen' ? '🖥️ Écran' : opt === 'email' ? '📧 Email' : opt === 'sftp' ? '🔒 SFTP' : opt === 'ftp' ? '📂 FTP' : '💾 Local'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {form.routing_modes.includes('email') && (
                            <div className="space-y-4 pt-2 border-t border-surface-200 dark:border-white/5">
                                <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                                    <input type="checkbox" checked={form.embed_results} onChange={e => setForm({ ...form, embed_results: e.target.checked })}
                                        className="rounded border-surface-300 dark:border-white/20 bg-surface-100 dark:bg-white/5 text-violet-500 focus:ring-violet-500" />
                                    <span className="font-medium">Intégrer les résultats dans le corps de l'email (Tableau HTML)</span>
                                </label>
                                {form.embed_results ? (
                                    <div className="space-y-4 pl-6 border-l-2 border-violet-500/30 ml-2">
                                        <div>
                                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Texte d'introduction</label>
                                            <textarea
                                                value={form.email_body_header}
                                                onChange={e => setForm({ ...form, email_body_header: e.target.value })}
                                                className="input-field w-full h-24 resize-y" placeholder="Bonjour, veuillez trouver ci-dessous les résultats du rapport..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Signature / Texte de fin</label>
                                            <textarea
                                                value={form.email_body_footer}
                                                onChange={e => setForm({ ...form, email_body_footer: e.target.value })}
                                                className="input-field w-full h-24 resize-y" placeholder="Cordialement, l'équipe..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Corps de l'email</label>
                                        <textarea
                                            value={form.email_body}
                                            onChange={e => setForm({ ...form, email_body: e.target.value })}
                                            className="input-field w-full h-32 resize-y" placeholder="Bonjour, voici le rapport demandé..."
                                        />
                                        <p className="text-xs text-surface-500 mt-1">Sera utilisé comme contenu du message lors de l'envoi par email (la pièce jointe sera ajoutée automatiquement).</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Permissions Tab */}
                {activeTab === 'permissions' && isEdit && (
                    <ReportPermissionsPanel reportId={Number(id)} />
                )}
            </div>
        </div>
    );
}
