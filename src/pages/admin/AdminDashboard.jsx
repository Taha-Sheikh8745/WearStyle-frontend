import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [analyticsRes, ordersRes, productsRes] = await Promise.all([
                    axios.get('/api/orders/analytics', config),
                    axios.get('/api/orders?limit=5', config),
                    axios.get('/api/products')
                ]);

                setStats({
                    revenue: analyticsRes.data.totalRevenue,
                    orders: analyticsRes.data.totalOrders,
                    products: productsRes.data.total,
                    users: 0 // Fetch users count later if needed
                });
                setRecentOrders(ordersRes.data.orders);
            } catch (err) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const STATUS_COLORS = {
        Processing: 'bg-yellow-50 text-yellow-700',
        Confirmed: 'bg-blue-50 text-blue-700',
        Shipped: 'bg-purple-50 text-purple-700',
        Delivered: 'bg-green-50 text-green-700',
        Cancelled: 'bg-red-50 text-red-700',
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm uppercase tracking-widest font-serif">Generating insights...</p>
        </div>
    );

    const STAT_CARDS = [
        { label: 'Total Revenue', value: `$${stats?.revenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
        { label: 'Total Orders', value: stats?.orders || 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Products', value: stats?.products || 0, icon: Package, color: 'bg-purple-50 text-purple-600' },
        // { label: 'Total Users', value: stats?.users || 0, icon: Users, color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-serif mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {STAT_CARDS.map(stat => (
                    <div key={stat.label} className="bg-white border border-gray-100 rounded-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                        <p className="text-2xl font-medium mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { to: '/admin/products', label: '+ Add Product', color: 'bg-primary text-white' },
                    { to: '/admin/orders', label: 'View Orders', color: 'bg-white border border-gray-200 text-primary' },
                    { to: '/admin/categories', label: 'Manage Categories', color: 'bg-white border border-gray-200 text-primary' },
                    { to: '/admin/users', label: 'Manage Users', color: 'bg-white border border-gray-200 text-primary' },
                ].map(action => (
                    <Link
                        key={action.to}
                        to={action.to}
                        className={`${action.color} text-center text-xs uppercase tracking-widest py-3 px-4 hover:opacity-80 transition-opacity font-medium`}
                    >
                        {action.label}
                    </Link>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border border-gray-100 rounded-sm">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-base font-serif">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-xs uppercase tracking-wide text-gray-400 hover:text-primary transition-colors">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-widest text-gray-500 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{order._id}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{order.user?.name}</td>
                                    <td className="px-6 py-4 text-sm">${order.totalPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.orderStatus]}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-sm">No recent orders.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
