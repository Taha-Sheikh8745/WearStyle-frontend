import { useState, useEffect } from 'react';
import { Search, Loader2, Filter, ChevronRight, Eye, MoreVertical, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLING = {
    Processing: 'bg-amber-50 text-amber-700 border-amber-100',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/orders');
            setOrders(data.orders || data);
        } catch (err) {
            toast.error('Failed to retrieve order history');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const toastId = toast.loading('Updating status...');
        try {
            await api.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus });
            toast.success(`Order marked as ${newStatus}`, { id: toastId });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (err) {
            toast.error('Failed to update status', { id: toastId });
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = 
            (o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase())) ||
            (o.shippingAddress?.email?.toLowerCase().includes(search.toLowerCase())) ||
            (o._id?.toLowerCase().includes(search.toLowerCase())) ||
            (o.orderId?.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Accessing Sales Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h2 className="text-3xl font-serif text-primary">Sales Registry</h2>
                <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                    <span>Journal</span>
                    <ChevronRight size={14} />
                    <span className="text-accent font-medium">{orders.length} Transactions</span>
                </p>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search client name or order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-gray-300" size={18} />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 md:w-56 py-3 px-4 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Transaction Ref</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Client Identity</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Items</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Valuation</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Payment Proof</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Lifecycle State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.map((order) => (
                                <motion.tr 
                                    layout
                                    key={order._id} 
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono text-gray-400 mb-1 leading-none">#{order._id.slice(-8).toUpperCase()}</span>
                                            <div className="flex items-center gap-1.5 text-gray-300">
                                                <Calendar size={10} />
                                                <span className="text-[10px] font-medium uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary mb-1">{order.shippingAddress?.name || 'Guest Client'}</span>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                                <span className="flex items-center gap-1"><Mail size={10} /> {order.shippingAddress?.email || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-primary">
                                            {order.items?.length || 0}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary">Rs. {Math.round(order.totalPrice)?.toLocaleString()}</span>
                                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Paid</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {order.paymentScreenshot ? (
                                            <a 
                                                href={order.paymentScreenshot} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors bg-accent/10 px-3 py-1.5 rounded"
                                            >
                                                <Eye size={12} /> View Proof
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">-</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`
                                                    text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 border rounded-full outline-none appearance-none cursor-pointer transition-all
                                                    ${STATUS_STYLING[order.orderStatus]}
                                                `}
                                            >
                                                {ORDER_STATUSES.map(s => (
                                                    <option key={s} value={s} className="bg-white text-gray-700 capitalize">{s}</option>
                                                ))}
                                            </select>
                                            <button className="p-2 text-gray-300 hover:text-accent opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-serif italic">No transactions match your current view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
