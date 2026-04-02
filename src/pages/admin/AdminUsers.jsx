import { useState, useEffect } from 'react';
import { Trash2, Search, Loader2, User, Mail, Calendar, Shield, ChevronRight, Filter } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/auth/users');
            setUsers(data.users || data);
        } catch (err) {
            toast.error('Failed to load clientele directory');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        const toastId = toast.loading('Updating permissions...');
        try {
            await api.put(`/api/auth/users/${userId}/role`, { role: newRole });
            toast.success(`Access level updated to ${newRole}`, { id: toastId });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            toast.error('Privilege update failed', { id: toastId });
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Remove this user from the directory?')) return;
        const toastId = toast.loading('Removing user...');
        try {
            await api.delete(`/api/auth/users/${userId}`);
            toast.success('User removed successfully', { id: toastId });
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            toast.error('Removal failed', { id: toastId });
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Consulting Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h2 className="text-3xl font-serif text-primary">Clientele Directory</h2>
                <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                    <span>Community</span>
                    <ChevronRight size={14} />
                    <span className="text-accent font-medium">{users.length} Members</span>
                </p>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-gray-300" size={18} />
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="flex-1 md:w-48 py-3 px-4 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="user">Standard User</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Member Identity</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Access Level</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Registration Date</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <motion.tr 
                                    layout
                                    key={user._id} 
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-white shadow-sm font-serif text-lg">
                                                {user.name ? user.name[0] : '?'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-primary mb-0.5">{user.name}</h4>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                    <Mail size={10} />
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className={`
                                                text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 border rounded-full outline-none appearance-none cursor-pointer transition-all
                                                ${user.role === 'admin' 
                                                    ? 'bg-primary text-white border-primary' 
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-accent hover:text-accent'}
                                            `}
                                        >
                                            <option value="user">Standard</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-300" />
                                            <span className="text-xs font-medium">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                                            title="Revoke Membership"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-gray-400 font-serif italic text-sm">No members found matching your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
