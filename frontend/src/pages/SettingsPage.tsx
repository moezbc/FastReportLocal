import { useState, useEffect } from 'react';
import { FiMail, FiServer, FiPlus, FiEdit2, FiTrash2, FiCheck, FiStar, FiZap } from 'react-icons/fi';
import {
    fetchSmtpConfigs, createSmtpConfig, updateSmtpConfig, deleteSmtpConfig, testSmtpConnection, SmtpConfig,
    fetchFtpConfigs, createFtpConfig, updateFtpConfig, deleteFtpConfig, FtpConfig,
} from '../api/settings';

type ActiveSection = 'smtp' | 'ftp';

export default function SettingsPage() {
    const [section, setSection] = useState<ActiveSection>('smtp');
    const [smtpList, setSmtpList] = useState<SmtpConfig[]>([]);
    const [ftpList, setFtpList] = useState<FtpConfig[]>([]);
    const [loading, setLoading] = useState(true);

    // SMTP form
    const [smtpForm, setSmtpForm] = useState<Partial<SmtpConfig>>({});
    const [smtpEditId, setSmtpEditId] = useState<number | null>(null);
    const [showSmtp, setShowSmtp] = useState(false);

    // FTP form
    const [ftpForm, setFtpForm] = useState<Partial<FtpConfig>>({});
    const [ftpEditId, setFtpEditId] = useState<number | null>(null);
    const [showFtp, setShowFtp] = useState(false);

    const [saving, setSaving] = useState(false);
    const [testResult, setTestResult] = useState<{ id: number; success: boolean; message: string } | null>(null);
    const [testing, setTesting] = useState<number | null>(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [sRes, fRes] = await Promise.all([fetchSmtpConfigs(), fetchFtpConfigs()]);
            setSmtpList(Array.isArray(sRes.data) ? sRes.data : (sRes.data as any).results || []);
            setFtpList(Array.isArray(fRes.data) ? fRes.data : (fRes.data as any).results || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // ─── SMTP ────────────────────────────
    const saveSmtp = async () => {
        setSaving(true);
        try {
            const payload = { ...smtpForm };
            if (smtpEditId && !payload.password) delete payload.password;
            if (smtpEditId) await updateSmtpConfig(smtpEditId, payload);
            else await createSmtpConfig(payload);
            setShowSmtp(false); setSmtpEditId(null); setSmtpForm({});
            load();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const editSmtp = (s: SmtpConfig) => { setSmtpForm({ ...s, password: '' }); setSmtpEditId(s.id); setShowSmtp(true); };
    const delSmtp = async (id: number, n: string) => { if (confirm(`Supprimer "${n}" ?`)) { await deleteSmtpConfig(id); load(); } };
    const testSmtp = async (id: number) => {
        setTesting(id); setTestResult(null);
        try {
            const res = await testSmtpConnection(id);
            setTestResult({ id, success: res.data.success, message: res.data.message });
        } catch (e: any) {
            const msg = e.response?.data?.message || e.message || 'Erreur inconnue';
            setTestResult({ id, success: false, message: msg });
        }
        setTesting(null);
    };

    // ─── FTP ─────────────────────────────
    const saveFtp = async () => {
        setSaving(true);
        try {
            const payload = { ...ftpForm };
            if (ftpEditId && !payload.password) delete payload.password;
            if (ftpEditId) await updateFtpConfig(ftpEditId, payload);
            else await createFtpConfig(payload);
            setShowFtp(false); setFtpEditId(null); setFtpForm({});
            load();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const editFtp = (f: FtpConfig) => { setFtpForm({ ...f, password: '' }); setFtpEditId(f.id); setShowFtp(true); };
    const delFtp = async (id: number, n: string) => { if (confirm(`Supprimer "${n}" ?`)) { await deleteFtpConfig(id); load(); } };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                        <FiServer className="text-surface-900 dark:text-white" size={22} />
                    </span>
                    Paramétrage
                </h1>
                <p className="text-surface-600 dark:text-surface-400 mt-1">Configuration des serveurs de messagerie et de transfert</p>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 p-1 glass-card rounded-xl">
                <button onClick={() => setSection('smtp')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${section === 'smtp' ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-surface-900 dark:text-white border border-surface-200 dark:border-white/10' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-white/5'
                        }`}>
                    <FiMail size={16} /> SMTP ({smtpList.length})
                </button>
                <button onClick={() => setSection('ftp')}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${section === 'ftp' ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-surface-900 dark:text-white border border-surface-200 dark:border-white/10' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-white/5'
                        }`}>
                    <FiServer size={16} /> FTP/SFTP ({ftpList.length})
                </button>
            </div>

            {/* ═══ SMTP Section ═══ */}
            {section === 'smtp' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={() => { setSmtpForm({ name: '', host: '', port: 587, username: '', password: '', use_tls: true, from_email: '', is_default: false }); setSmtpEditId(null); setShowSmtp(true); }}
                            className="btn-gradient flex items-center gap-2 text-sm"><FiPlus size={16} /> Nouveau SMTP</button>
                    </div>

                    {showSmtp && (
                        <div className="glass-card p-6 space-y-4 border border-violet-500/20">
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{smtpEditId ? 'Modifier' : 'Nouveau'} serveur SMTP</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Nom *</label>
                                    <input type="text" value={smtpForm.name || ''} onChange={e => setSmtpForm({ ...smtpForm, name: e.target.value })} className="input-field w-full" /></div>
                                <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Serveur SMTP *</label>
                                    <input type="text" value={smtpForm.host || ''} onChange={e => setSmtpForm({ ...smtpForm, host: e.target.value })} className="input-field w-full" placeholder="smtp.gmail.com" /></div>
                                <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Port</label>
                                    <input type="number" value={smtpForm.port || 587} onChange={e => setSmtpForm({ ...smtpForm, port: Number(e.target.value) })} className="input-field w-full" /></div>
                                <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Email expéditeur *</label>
                                    <input type="email" value={smtpForm.from_email || ''} onChange={e => setSmtpForm({ ...smtpForm, from_email: e.target.value })} className="input-field w-full" /></div>
                                <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Utilisateur</label>
                                    <input type="text" value={smtpForm.username || ''} onChange={e => setSmtpForm({ ...smtpForm, username: e.target.value })} className="input-field w-full" /></div>
                                <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Mot de passe</label>
                                    <input type="password" value={smtpForm.password || ''} onChange={e => setSmtpForm({ ...smtpForm, password: e.target.value })} className="input-field w-full" placeholder={smtpEditId ? '(laisser vide pour conserver)' : ''} /></div>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                                    <input type="checkbox" checked={smtpForm.use_tls ?? true} onChange={e => setSmtpForm({ ...smtpForm, use_tls: e.target.checked })} className="rounded" /> Utiliser TLS
                                </label>
                                <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                                    <input type="checkbox" checked={smtpForm.is_default ?? false} onChange={e => setSmtpForm({ ...smtpForm, is_default: e.target.checked })} className="rounded" /> Par défaut
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={saveSmtp} disabled={saving} className="btn-gradient flex items-center gap-2"><FiCheck size={16} /> Enregistrer</button>
                                <button onClick={() => setShowSmtp(false)} className="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-white/10">Annuler</button>
                            </div>
                        </div>
                    )}

                    {loading ? <div className="glass-card p-8 text-center text-surface-600 dark:text-surface-400">Chargement...</div> : smtpList.length === 0 ? (
                        <div className="glass-card p-12 text-center text-surface-600 dark:text-surface-400">Aucun serveur SMTP configuré</div>
                    ) : smtpList.map(s => (
                        <div key={s.id} className="space-y-2">
                            <div className="glass-card p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400"><FiMail size={20} /></div>
                                    <div>
                                        <div className="font-medium text-surface-900 dark:text-white flex items-center gap-2">{s.name} {s.is_default && <FiStar className="text-amber-400" size={14} />}</div>
                                        <div className="text-sm text-surface-600 dark:text-surface-400">{s.host}:{s.port} — {s.from_email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => testSmtp(s.id)} disabled={testing === s.id} className="p-2 rounded-lg hover:bg-amber-500/10 text-surface-600 dark:text-surface-400 hover:text-amber-400" title="Tester la connexion SMTP">
                                        {testing === s.id ? <FiZap size={16} className="animate-pulse text-amber-400" /> : <FiZap size={16} />}
                                    </button>
                                    <button onClick={() => editSmtp(s)} className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"><FiEdit2 size={16} /></button>
                                    <button onClick={() => delSmtp(s.id, s.name)} className="p-2 rounded-lg hover:bg-red-500/10 text-surface-600 dark:text-surface-400 hover:text-red-400"><FiTrash2 size={16} /></button>
                                </div>
                            </div>
                            {testResult && testResult.id === s.id && (
                                <div className={`p-3 rounded-lg text-sm ${testResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {testResult.success ? '✅' : '❌'} {testResult.message}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )
            }

            {/* ═══ FTP Section ═══ */}
            {
                section === 'ftp' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button onClick={() => { setFtpForm({ name: '', protocol: 'sftp', host: '', port: 22, username: '', password: '', remote_path: '/', is_default: false }); setFtpEditId(null); setShowFtp(true); }}
                                className="btn-gradient flex items-center gap-2 text-sm"><FiPlus size={16} /> Nouveau FTP/SFTP</button>
                        </div>

                        {showFtp && (
                            <div className="glass-card p-6 space-y-4 border border-violet-500/20">
                                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{ftpEditId ? 'Modifier' : 'Nouveau'} serveur FTP/SFTP</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Nom *</label>
                                        <input type="text" value={ftpForm.name || ''} onChange={e => setFtpForm({ ...ftpForm, name: e.target.value })} className="input-field w-full" /></div>
                                    <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Protocole</label>
                                        <select value={ftpForm.protocol || 'sftp'} onChange={e => setFtpForm({ ...ftpForm, protocol: e.target.value as 'ftp' | 'sftp', port: e.target.value === 'sftp' ? 22 : 21 })}
                                            className="input-field w-full">
                                            <option value="sftp">SFTP</option><option value="ftp">FTP</option>
                                        </select></div>
                                    <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Hôte *</label>
                                        <input type="text" value={ftpForm.host || ''} onChange={e => setFtpForm({ ...ftpForm, host: e.target.value })} className="input-field w-full" /></div>
                                    <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Port</label>
                                        <input type="number" value={ftpForm.port || 22} onChange={e => setFtpForm({ ...ftpForm, port: Number(e.target.value) })} className="input-field w-full" /></div>
                                    <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Utilisateur</label>
                                        <input type="text" value={ftpForm.username || ''} onChange={e => setFtpForm({ ...ftpForm, username: e.target.value })} className="input-field w-full" /></div>
                                    <div><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Mot de passe</label>
                                        <input type="password" value={ftpForm.password || ''} onChange={e => setFtpForm({ ...ftpForm, password: e.target.value })} className="input-field w-full" placeholder={ftpEditId ? '(laisser vide pour conserver)' : ''} /></div>
                                    <div className="col-span-2"><label className="text-sm text-surface-600 dark:text-surface-400 mb-1 block">Chemin distant</label>
                                        <input type="text" value={ftpForm.remote_path || '/'} onChange={e => setFtpForm({ ...ftpForm, remote_path: e.target.value })} className="input-field w-full" placeholder="/upload/reports" /></div>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                                    <input type="checkbox" checked={ftpForm.is_default ?? false} onChange={e => setFtpForm({ ...ftpForm, is_default: e.target.checked })} className="rounded" /> Par défaut
                                </label>
                                <div className="flex gap-3">
                                    <button onClick={saveFtp} disabled={saving} className="btn-gradient flex items-center gap-2"><FiCheck size={16} /> Enregistrer</button>
                                    <button onClick={() => setShowFtp(false)} className="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-white/10">Annuler</button>
                                </div>
                            </div>
                        )}

                        {loading ? <div className="glass-card p-8 text-center text-surface-600 dark:text-surface-400">Chargement...</div> : ftpList.length === 0 ? (
                            <div className="glass-card p-12 text-center text-surface-600 dark:text-surface-400">Aucun serveur FTP/SFTP configuré</div>
                        ) : ftpList.map(f => (
                            <div key={f.id} className="glass-card p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><FiServer size={20} /></div>
                                    <div>
                                        <div className="font-medium text-surface-900 dark:text-white flex items-center gap-2">{f.name} {f.is_default && <FiStar className="text-amber-400" size={14} />}
                                            <span className="px-2 py-0.5 rounded text-xs bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-400">{f.protocol.toUpperCase()}</span>
                                        </div>
                                        <div className="text-sm text-surface-600 dark:text-surface-400">{f.host}:{f.port} — {f.remote_path}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => editFtp(f)} className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"><FiEdit2 size={16} /></button>
                                    <button onClick={() => delFtp(f.id, f.name)} className="p-2 rounded-lg hover:bg-red-500/10 text-surface-600 dark:text-surface-400 hover:text-red-400"><FiTrash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
