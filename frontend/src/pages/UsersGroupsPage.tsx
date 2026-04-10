import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { User, Group, fetchUsers, fetchGroups, createUser, updateUser, deleteUser, createGroup, updateGroup, deleteGroup } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export default function UsersGroupsPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [editingGroup, setEditingGroup] = useState<Partial<Group> | null>(null);

    useEffect(() => {
        if (currentUser?.is_staff) {
            loadData();
        }
    }, [currentUser]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, groupsRes] = await Promise.all([fetchUsers(), fetchGroups()]);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data as any).results || []);
            setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : (groupsRes.data as any).results || []);
        } catch (error) {
            console.error("Failed to load users/groups", error);
        }
        setLoading(false);
    };

    if (!currentUser?.is_staff) {
        return <div className="p-12 text-center text-red-400">Accès refusé. Réservé aux administrateurs.</div>;
    }

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            if (editingUser.id) {
                await updateUser(editingUser.id, editingUser);
            } else {
                await createUser(editingUser);
            }
            setEditingUser(null);
            loadData();
        } catch (error: any) {
            alert("Erreur lors de l'enregistrement: " + (error.response?.data?.detail || "Erreur inconnue"));
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Supprimer cet utilisateur ?")) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleSaveGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGroup) return;
        try {
            if (editingGroup.id) {
                await updateGroup(editingGroup.id, editingGroup);
            } else {
                await createGroup(editingGroup);
            }
            setEditingGroup(null);
            loadData();
        } catch (error: any) {
            alert("Erreur lors de l'enregistrement: " + (error.response?.data?.name?.[0] || "Erreur inconnue"));
        }
    };

    const handleDeleteGroup = async (id: number) => {
        if (!confirm("Supprimer ce groupe ?")) return;
        try {
            await deleteGroup(id);
            setGroups(groups.filter(g => g.id !== id));
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleGroupToggle = (groupId: number) => {
        if (!editingUser) return;
        const currentGroupIds = (editingUser as any).group_ids || (editingUser as any).groups?.map((g: any) => g.id) || [];
        const newGroupIds = currentGroupIds.includes(groupId)
            ? currentGroupIds.filter((id: number) => id !== groupId)
            : [...currentGroupIds, groupId];
        setEditingUser({ ...editingUser, group_ids: newGroupIds });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
                            <FiUsers className="text-surface-900 dark:text-white" size={22} />
                        </span>
                        Utilisateurs & Groupes
                    </h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-1">Gérez les accès à l'application</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-800">
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'users' ? 'border-primary-500 text-primary-400' : 'border-transparent text-surface-400 hover:text-surface-200 hover:border-surface-600'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Utilisateurs
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'groups' ? 'border-primary-500 text-primary-400' : 'border-transparent text-surface-400 hover:text-surface-200 hover:border-surface-600'}`}
                    onClick={() => setActiveTab('groups')}
                >
                    Groupes
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="p-12 text-center text-surface-600 dark:text-surface-400">Chargement...</div>
            ) : (
                <div className="glass-card overflow-hidden">
                    {activeTab === 'users' ? (
                        <div>
                            <div className="p-4 border-b border-surface-800 flex justify-end">
                                <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm" onClick={() => setEditingUser({ username: '', email: '', password: '', group_ids: [] })}>
                                    <FiUserPlus size={16} /> Nouvel Utilisateur
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-surface-800 bg-surface-900/50">
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Identifiant</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Email</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Prénom / Nom</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Statut</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Groupes</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                                            <td className="p-4 font-medium text-surface-900 dark:text-white">{u.username}</td>
                                            <td className="p-4 text-sm text-surface-300">{u.email}</td>
                                            <td className="p-4 text-sm text-surface-300">{u.first_name} {u.last_name}</td>
                                            <td className="p-4">
                                                {u.is_staff ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                        <FiShield size={12} /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        Actif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {((u as any).groups || []).map((g: any) => (
                                                        <span key={g.id} className="px-2 py-0.5 rounded text-xs bg-surface-800 text-surface-300 border border-surface-700">{g.name}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => setEditingUser({ 
                                                        ...u, 
                                                        password: '', 
                                                        group_ids: (u as any).groups?.map((g:any) => g.id) || [] 
                                                    })} className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors" title="Modifier">
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors" title="Supprimer">
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>
                            <div className="p-4 border-b border-surface-800 flex justify-end">
                                <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm" onClick={() => setEditingGroup({ name: '' })}>
                                    <FiUserPlus size={16} /> Nouveau Groupe
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-surface-800 bg-surface-900/50">
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">ID</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Nom du Groupe</th>
                                        <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map(g => (
                                        <tr key={g.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                                            <td className="p-4 text-sm text-surface-400">#{g.id}</td>
                                            <td className="p-4 font-medium text-surface-900 dark:text-white">{g.name}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => setEditingGroup(g)} className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors" title="Modifier">
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteGroup(g.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors" title="Supprimer">
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Editing User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-surface-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-surface-900 dark:text-white">{editingUser.id ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
                            <button onClick={() => setEditingUser(null)} className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"><FiX size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="user-form" onSubmit={handleSaveUser} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-surface-300">Identifiant</label>
                                        <input type="text" value={editingUser.username || ''} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} className="input-field w-full" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-surface-300">Email</label>
                                        <input type="email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="input-field w-full" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-surface-300">Prénom</label>
                                        <input type="text" value={editingUser.first_name || ''} onChange={e => setEditingUser({ ...editingUser, first_name: e.target.value })} className="input-field w-full" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-surface-300">Nom</label>
                                        <input type="text" value={editingUser.last_name || ''} onChange={e => setEditingUser({ ...editingUser, last_name: e.target.value })} className="input-field w-full" />
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-surface-300">Mot de passe {editingUser.id && '(Laisser vide pour ne pas changer)'}</label>
                                    <input type="password" value={editingUser.password || ''} onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} className="input-field w-full" minLength={6} />
                                </div>

                                <div className="pt-4 border-t border-surface-800">
                                    <label className="text-sm font-semibold text-surface-300 mb-2 block">Groupes d'appartenance</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {groups.map(g => {
                                            const isSelected = ((editingUser as any).group_ids || []).includes(g.id);
                                            return (
                                                <div key={g.id} onClick={() => handleGroupToggle(g.id)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-primary-500/10 border-primary-500/50 text-surface-900 dark:text-white' : 'bg-surface-950/50 border-surface-700/50 text-surface-400 hover:border-surface-600'}`}>
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-surface-600'}`}>
                                                        {isSelected && <FiCheck size={14} className="text-surface-900 dark:text-white" />}
                                                    </div>
                                                    <span className="text-sm font-medium truncate">{g.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-surface-800">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-surface-700/50 bg-surface-950/30">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editingUser.is_staff ? 'bg-primary-500 border-primary-500' : 'border-surface-600'}`}>
                                            {editingUser.is_staff && <FiCheck size={14} className="text-surface-900 dark:text-white" />}
                                        </div>
                                        <span className="text-sm font-medium text-surface-200">Administrateur (Accès total)</span>
                                        <input type="checkbox" className="hidden" checked={editingUser.is_staff || false} onChange={e => setEditingUser({ ...editingUser, is_staff: e.target.checked })} />
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-surface-800 flex justify-end gap-3 bg-surface-900/50">
                            <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg font-medium text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-800 transition-colors">Annuler</button>
                            <button type="submit" form="user-form" className="btn-primary py-2 px-6">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Editing Group Modal */}
            {editingGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-surface-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-surface-900 dark:text-white">{editingGroup.id ? 'Modifier' : 'Ajouter'} un groupe</h2>
                            <button onClick={() => setEditingGroup(null)} className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"><FiX size={20} /></button>
                        </div>
                        <div className="p-6">
                            <form id="group-form" onSubmit={handleSaveGroup} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-surface-300">Nom du groupe</label>
                                    <input type="text" value={editingGroup.name || ''} onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })} className="input-field w-full" required />
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-surface-800 flex justify-end gap-3 bg-surface-900/50">
                            <button type="button" onClick={() => setEditingGroup(null)} className="px-4 py-2 rounded-lg font-medium text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-800 transition-colors">Annuler</button>
                            <button type="submit" form="group-form" className="btn-primary py-2 px-6">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
