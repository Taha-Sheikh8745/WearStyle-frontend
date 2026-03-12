import { useState, useEffect } from 'react';
import { Trash2, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data.users || data);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/auth/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Failed to update user role.');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user.');
        }
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email.toLowerCase().includes(keyword.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm uppercase tracking-widest font-serif">Loading users...</p>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-serif mb-1">Users</h1>
                <p className="text-gray-500 text-sm">{users.length} registered users</p>
            </div>

            <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search users..." value={keyword} onChange={e => setKeyword(e.target.value)} className="border border-gray-200 w-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white" />
            </div>

            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                                            {user.name ? user.name[0] : '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={e => handleRoleChange(user._id, e.target.value)}
                                        className={`text-xs px-3 py-1.5 rounded border outline-none cursor-pointer ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(user._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm">No users found.</div>}
            </div>
        </div>
    );
};

export default AdminUsers;
