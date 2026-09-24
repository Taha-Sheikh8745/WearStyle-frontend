import { useState, useEffect } from 'react';
import { Search, Loader2, Filter, ChevronRight, Eye, Calendar, Mail } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLING = {
    Processing: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
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
            <div className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={36} />
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Accessing Sales Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <header>
                <h2 className="text-2xl sm:text-3xl font-serif text-primary">Sales Registry</h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                    <span>Journal</span>
                    <ChevronRight size={13} />
                    <span className="text-accent font-semibold">{orders.length} Transactions</span>
                </p>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xs border border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center shadow-xs">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search client name or order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCFB] border border-gray-100 focus:border-accent/40 focus:bg-white outline-none transition-all text-xs sm:text-sm rounded-xs"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 flex-shrink-0" size={16} />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-56 py-2.5 px-3 bg-[#FDFCFB] border border-gray-100 focus:border-accent/40 focus:bg-white outline-none transition-all text-xs sm:text-sm cursor-pointer rounded-xs"
                    >
                        <option value="All">All Statuses</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className="bg-white border border-gray-100 rounded-xs overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[680px]">
                        <thead>
                            <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Ref No.</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Client Identity</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Items</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Valuation</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Payment Proof</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Lifecycle State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                            {filteredOrders.map((order) => (
                                <motion.tr 
                                    layout
                                    key={order._id} 
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-4 sm:px-6 py-4">
                                        <span className="font-mono text-gray-400 text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                                        <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-0.5">
                                            <Calendar size={10} />
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <span className="font-bold text-primary block truncate max-w-[150px]">{order.shippingAddress?.name || 'Guest Client'}</span>
                                        <span className="text-[11px] text-gray-400 truncate max-w-[150px] block">{order.shippingAddress?.phone || order.shippingAddress?.email || 'N/A'}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-primary">
                                            {order.items?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 font-bold font-serif text-primary whitespace-nowrap">
                                        Rs. {Math.round(order.totalPrice)?.toLocaleString()}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        {order.paymentScreenshot ? (
                                            <a 
                                                href={order.paymentScreenshot} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-primary transition-colors bg-accent/10 px-2.5 py-1 rounded"
                                            >
                                                <Eye size={12} /> Proof
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-gray-300 uppercase tracking-widest font-mono">COD</span>
                                        )}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border rounded-full outline-none cursor-pointer ${STATUS_STYLING[order.orderStatus] || 'bg-gray-50 text-gray-700'}`}
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option key={s} value={s} className="bg-white text-gray-700 capitalize">{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-xs font-serif italic">
                            No transactions match your current view.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
