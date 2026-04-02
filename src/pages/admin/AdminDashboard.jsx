import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, ArrowUpRight, Loader2, Calendar, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, ordersRes, productsRes] = await Promise.all([
                api.get('/api/orders/analytics'),
                api.get('/api/orders?limit=5'),
                api.get('/api/products')
            ]);

            setStats({
                revenue: analyticsRes.data.totalRevenue,
                orders: analyticsRes.data.totalOrders,
                products: productsRes.data.total || (productsRes.data.products?.length || 0),
                users: 0 
            });
            setRecentOrders(ordersRes.data.orders || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const STATUS_COLORS = {
        Processing: 'bg-amber-50 text-amber-700 border-amber-100',
        Confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
        Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Compiling Analytics...</p>
        </div>
    );

    const STAT_CARDS = [
        { label: 'Total Revenue', value: `Rs. ${stats?.revenue?.toLocaleString() || 0}`, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Orders', value: stats?.orders || 0, icon: ShoppingBag, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Products', value: stats?.products || 0, icon: Package, trend: 'Flat', color: 'text-accent', bg: 'bg-accent/10' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-primary">Executive Summary</h2>
                    <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Performance overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Export Report</button>
                    <Link to="/admin/add-product" className="btn-primary px-6 py-2.5 flex items-center gap-2">
                        <TrendingUp size={14} />
                        <span>Scale Catalog</span>
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STAT_CARDS.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label} 
                        className="bg-white border border-gray-100 p-8 relative overflow-hidden group hover:border-accent/30 transition-colors"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full opacity-20 -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded tracking-tight">{stat.trend}</span>
                        </div>
                        <h3 className="text-3xl font-serif text-primary mb-1">{stat.value}</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xl font-serif text-primary">Recent Transactions</h3>
                        <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                            Full Journal <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Ref No.</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Client</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-5 text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-bold text-primary">{order.user?.name || 'Guest Client'}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-primary">Rs. {order.totalPrice.toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] px-3 py-1 border rounded-full font-bold uppercase tracking-widest ${STATUS_COLORS[order.orderStatus]}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-400 font-serif italic">No recent transactions recorded.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-6">
                    <h3 className="text-xl font-serif text-primary">Navigational Links</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { to: '/admin/products', label: 'Global Inventory', desc: 'Manage styles and stock', icon: Package },
                            { to: '/admin/add-product', label: 'New Masterpiece', desc: 'Launch a new creation', icon: TrendingUp },
                            { to: '/admin/orders', label: 'Sales Registry', desc: 'Track client orders', icon: ShoppingBag },
                            { to: '/admin/users', label: 'Client Directory', desc: 'Manage user profiles', icon: Users },
                        ].map((item, idx) => (
                            <Link 
                                key={item.to} 
                                to={item.to}
                                className="p-5 bg-white border border-gray-100 flex items-center gap-4 hover:border-accent/40 group transition-all hover:translate-x-2"
                            >
                                <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-accent group-hover:text-white transition-colors">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{item.label}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                                </div>
                                <ChevronRight size={14} className="ml-auto text-gray-200 group-hover:text-accent transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
