import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, Heart, User, LogOut, ShoppingBag } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { useState } from 'react';
import axios from 'axios';

// Demo order data
const STATUS_COLORS = {
    Processing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    Delivered: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const Dashboard = () => {
    const { user, token, logout } = useContext(AuthContext);
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    // Orders state
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Password change states
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get('/api/orders/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched orders:', data.orders);
                setOrders(data.orders);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setOrdersLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { data } = await axios.put('/api/auth/update-password', passForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(data.message);
            setPassForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="pt-20 min-h-screen bg-secondary">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <h1 className="text-3xl font-serif mb-10">My Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 p-6 mb-4">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-serif text-lg">
                                    {(user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {[
                                    { icon: Package, label: 'Orders', href: '#orders' },
                                    { icon: Heart, label: 'Wishlist', href: '#wishlist' },
                                    { icon: User, label: 'Profile Settings', href: '#profile' },
                                ].map(item => (
                                    <a key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors rounded">
                                        <item.icon size={16} /> {item.label}
                                    </a>
                                ))}
                                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors rounded mt-2">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </nav>
                        </div>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="block bg-primary text-white text-center text-xs uppercase tracking-widest py-3 hover:bg-accent transition-colors">
                                Admin Dashboard →
                            </Link>
                        )}
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3 flex flex-col gap-8">
                        {/* Orders */}
                        <section id="orders">
                            <h2 className="text-xl font-serif mb-5">My Orders</h2>
                            {ordersLoading ? (
                                <div className="flex flex-col gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-white border border-gray-100 p-6 animate-pulse">
                                            <div className="h-4 bg-gray-100 w-24 mb-2" />
                                            <div className="h-3 bg-gray-50 w-32" />
                                        </div>
                                    ))}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="bg-white border border-gray-100 p-12 text-center">
                                    <ShoppingBag size={40} className="text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No orders yet.</p>
                                    <Link to="/shop" className="btn-primary mt-6 inline-block">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {orders.map(order => (
                                        <div key={order._id} className="bg-white border border-gray-100 p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-mono mb-1"># {order.orderId || order._id}</p>
                                                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xs border px-3 py-1 rounded-full ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50'}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                    <span className="font-medium text-sm">Rs. {order.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 flex flex-col gap-1">
                                                {order.items.map((item, i) => (
                                                    <p key={i} className="flex justify-between items-center">
                                                        <span>{item.title}</span>
                                                        <span className="text-xs text-gray-400">×{item.quantity} · {item.selectedSize}</span>
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Wishlist */}
                        <section id="wishlist">
                            <h2 className="text-xl font-serif mb-5">Wishlist ({wishlist.length})</h2>
                            {wishlist.length === 0 ? (
                                <div className="bg-white border border-gray-100 p-12 text-center">
                                    <Heart size={40} className="text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-sm">Your wishlist is empty.</p>
                                    <Link to="/shop" className="text-xs underline text-gray-400 hover:text-primary mt-3 inline-block">Browse Collections</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {wishlist.map(item => (
                                        <Link key={item._id} to={`/product/${item._id}`} className="bg-white border border-gray-100 p-4 hover:border-primary transition-colors group">
                                            <div className="aspect-square overflow-hidden mb-3 bg-gray-50">
                                                <img src={item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <p className="text-xs font-medium truncate">{item.title}</p>
                                            <p className="text-xs text-gray-400">Rs. {item.price}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Profile Settings */}
                        <section id="profile">
                            <h2 className="text-xl font-serif mb-5">Profile Settings</h2>
                            <div className="bg-white border border-gray-100 p-8">
                                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Change Password</h3>

                                {error && <div className="bg-red-50 text-red-600 text-xs p-3 mb-4 rounded border-l-4 border-red-400">{error}</div>}
                                {success && <div className="bg-green-50 text-green-600 text-xs p-3 mb-4 rounded border-l-4 border-green-400">{success}</div>}

                                <form onSubmit={handleUpdatePassword} className="max-w-md flex flex-col gap-5">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 block">Current Password</label>
                                        <input
                                            type="password" required
                                            value={passForm.currentPassword}
                                            onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                                            className="w-full border border-gray-100 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 block">New Password</label>
                                            <input
                                                type="password" required minLength={6}
                                                value={passForm.newPassword}
                                                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                                                className="w-full border border-gray-100 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 block">Confirm New Password</label>
                                            <input
                                                type="password" required minLength={6}
                                                value={passForm.confirmNewPassword}
                                                onChange={e => setPassForm({ ...passForm, confirmNewPassword: e.target.value })}
                                                className="w-full border border-gray-100 px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit" disabled={loading}
                                        className="btn-primary py-3 text-xs self-start px-8 disabled:opacity-50"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
