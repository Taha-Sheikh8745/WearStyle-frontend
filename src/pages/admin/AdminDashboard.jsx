import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, MessageSquare, TrendingUp, DollarSign, ArrowUpRight, Loader2, Calendar, ChevronRight } from 'lucide-react';
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
        <div className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-4">
            <Loader2 className="animate-spin text-accent" size={36} />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Compiling Analytics...</p>
        </div>
    );

    const STAT_CARDS = [
        { label: 'Total Revenue', value: `Rs. ${stats?.revenue?.toLocaleString() || 0}`, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Orders', value: stats?.orders || 0, icon: ShoppingBag, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Products', value: stats?.products || 0, icon: Package, trend: 'Catalog', color: 'text-accent', bg: 'bg-accent/10' },
    ];

    return (
        <div className="space-y-6 sm:space-y-10 animate-fade-in">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-primary">Executive Summary</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>Performance overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <Link to="/admin-portal-xyz123/add-product" className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2">
                        <TrendingUp size={14} />
                        <span>New Creation</span>
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {STAT_CARDS.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        key={stat.label} 
                        className="bg-white border border-gray-100 p-5 sm:p-8 relative overflow-hidden rounded-xs shadow-xs"
                    >
                        <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} rounded-bl-full opacity-30 -mr-6 -mt-6 pointer-events-none`}></div>
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-tight">{stat.trend}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif text-primary mb-1">{stat.value}</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Recent Orders Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg sm:text-xl font-serif text-primary">Recent Transactions</h3>
                        <Link to="/admin-portal-xyz123/orders" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                            Full Journal <ArrowUpRight size={12} />
                        </Link>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xs shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[500px]">
                                <thead>
                                    <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                        <th className="px-4 sm:px-6 py-3.5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Ref No.</th>
                                        <th className="px-4 sm:px-6 py-3.5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Client</th>
                                        <th className="px-4 sm:px-6 py-3.5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</th>
                                        <th className="px-4 sm:px-6 py-3.5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 sm:px-6 py-4 font-mono text-gray-400 text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <p className="font-bold text-primary truncate max-w-[150px] sm:max-w-none">{order.shippingAddress?.name || 'Guest Client'}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 font-bold text-primary">Rs. {Math.round(order.totalPrice)?.toLocaleString()}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`text-[9px] px-2.5 py-1 border rounded-full font-bold uppercase tracking-wider ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-700'}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-gray-400 font-serif italic text-xs">No recent transactions recorded.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-serif text-primary">Quick Navigation</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { to: '/admin-portal-xyz123/products', label: 'Global Inventory', desc: 'Manage styles and stock', icon: Package },
                            { to: '/admin-portal-xyz123/add-product', label: 'New Masterpiece', desc: 'Launch a new creation', icon: TrendingUp },
                            { to: '/admin-portal-xyz123/orders', label: 'Sales Registry', desc: 'Track client orders', icon: ShoppingBag },
                            { to: '/admin-portal-xyz123/contacts', label: 'Messages', desc: 'Review client inquiries', icon: MessageSquare },
                        ].map((item) => (
                            <Link 
                                key={item.to} 
                                to={item.to}
                                className="p-4 bg-white border border-gray-100 rounded-xs flex items-center gap-3.5 hover:border-accent/40 group transition-all"
                            >
                                <div className="w-9 h-9 rounded bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
                                    <item.icon size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary truncate">{item.label}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.desc}</p>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-accent transition-colors flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
