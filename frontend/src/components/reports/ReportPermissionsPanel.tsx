import React, { useEffect, useState } from 'react';
import { FiUser, FiUsers, FiPlus, FiTrash2, FiCheck, FiLock, FiAlertCircle } from 'react-icons/fi';
import { fetchPermissions, addPermission, removePermission, ReportPermission } from '../../api/reports';
import { fetchUsers, fetchGroups, User, Group } from '../../api/auth';

interface Props {
    reportId: number;
}

const ReportPermissionsPanel: React.FC<Props> = ({ reportId }) => {
    const [permissions, setPermissions] = useState<ReportPermission[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedType, setSelectedType] = useState<'user' | 'group'>('user');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [canExecute, setCanExecute] = useState(true);
    const [canModify, setCanModify] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadData();
    }, [reportId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [permsRes, usersRes, groupsRes] = await Promise.all([
                fetchPermissions(reportId),
                fetchUsers(),
                fetchGroups()
            ]);
            setPermissions(permsRes.data);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data as any).results || []);
            setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : (groupsRes.data as any).results || []);
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!selectedId) return;
        setAdding(true);
        setError('');

        const payload: any = {
            can_execute: canExecute,
            can_modify: canModify
        };

        if (selectedType === 'user') {
            payload.user = selectedId;
        } else {
            payload.group = selectedId;
        }

        try {
            const res = await addPermission(reportId, payload);
            setPermissions([...permissions, res.data]);
            setSelectedId(null);
            setCanExecute(true);
            setCanModify(false);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Erreur lors de l'ajout de la permission.");
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (permId: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette permission ?")) return;
        try {
            await removePermission(reportId, permId);
            setPermissions(permissions.filter(p => p.id !== permId));
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="glass-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
                    <FiPlus className="text-primary-400" />
                    Ajouter une permission
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex bg-surface-950 rounded-lg p-1 border border-surface-700/50">
                            <button
                                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${selectedType === 'user' ? 'bg-primary-600 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
                                onClick={() => { setSelectedType('user'); setSelectedId(null); }}
                            >
                                Utilisateur
                            </button>
                            <button
                                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${selectedType === 'group' ? 'bg-primary-600 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
                                onClick={() => { setSelectedType('group'); setSelectedId(null); }}
                            >
                                Groupe
                            </button>
                        </div>

                        <select
                            className="input-field w-full"
                            value={selectedId || ''}
                            onChange={e => setSelectedId(Number(e.target.value) || null)}
                        >
                            <option value="">Sélectionner...</option>
                            {selectedType === 'user'
                                ? users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)
                                : groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)
                            }
                        </select>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-700/50 bg-surface-950/30 cursor-pointer" onClick={() => setCanExecute(!canExecute)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${canExecute ? 'bg-primary-500 border-primary-500' : 'border-surface-600'}`}>
                                {canExecute && <FiCheck size={14} className="text-surface-900 dark:text-white" />}
                            </div>
                            <span className="text-sm text-surface-200">Exécution (Lanceur)</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-700/50 bg-surface-950/30 cursor-pointer" onClick={() => setCanModify(!canModify)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${canModify ? 'bg-primary-500 border-primary-500' : 'border-surface-600'}`}>
                                {canModify && <FiCheck size={14} className="text-surface-900 dark:text-white" />}
                            </div>
                            <span className="text-sm text-surface-200">Modification (Édition)</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!selectedId || adding}
                    className="w-full btn-primary py-2 flex items-center justify-center gap-2"
                >
                    {adding ? 'Ajout...' : 'Ajouter l\'accès'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300">
                    <FiAlertCircle size={20} className="flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
                    <FiLock className="text-primary-400" />
                    Accès existants
                </h3>

                {loading ? (
                    <div className="text-center py-8 text-surface-500">Chargement...</div>
                ) : permissions.length === 0 ? (
                    <div className="text-center py-8 bg-surface-950/30 rounded-xl border border-surface-800 border-dashed text-surface-500">
                        Aucune permission spécifique définie.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {permissions.map(perm => (
                            <div key={perm.id} className="flex items-center justify-between p-4 bg-surface-800/30 border border-surface-800 rounded-xl hover:bg-surface-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${perm.user ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                        {perm.user ? <FiUser size={18} /> : <FiUsers size={18} />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-surface-900 dark:text-white">
                                            {perm.user_username || perm.group_name}
                                        </div>
                                        <div className="text-xs text-surface-400 flex gap-2 mt-0.5">
                                            {perm.can_execute && <span className="text-emerald-400">● Exécution</span>}
                                            {perm.can_modify && <span className="text-amber-400">● Modification</span>}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(perm.id)}
                                    className="p-2 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Révoquer l'accès"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPermissionsPanel;
