import { useState, useEffect } from 'react';
import { Search, Loader2, Calendar, Mail, ExternalLink, Eye, LayoutGrid, List as ListIcon, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminPayments = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/orders');
            // Filter orders that have screenshots
            const allOrders = data.orders || data;
            const ordersWithScreenshots = allOrders.filter(o => o.paymentScreenshot);
            setOrders(ordersWithScreenshots);
        } catch (err) {
            toast.error('Failed to retrieve payment history');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(o => {
        return (
            (o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase())) ||
            (o.orderId?.toLowerCase().includes(search.toLowerCase())) ||
            (o._id?.toLowerCase().includes(search.toLowerCase()))
        );
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Accessing Payment Archives...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-primary">Payment Screenshots</h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-widest">
                        Verify manual transfers via Easypaisa
                    </p>
                </div>
                <div className="flex bg-white border border-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
                    >
                        <ListIcon size={18} />
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="bg-white p-4 border border-gray-100 shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Customer Name or Order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white border border-gray-100 p-20 text-center rounded-xl shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                        <ShoppingBag size={32} className="text-gray-200" />
                    </div>
                    <h3 className="text-xl font-serif text-primary italic">No payment proofs found.</h3>
                    <p className="text-sm text-gray-400 mt-2">Screenshots will appear here once customers place Easypaisa orders.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredOrders.map((order) => (
                        <motion.div 
                            layout
                            key={order._id}
                            className="bg-white border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-xl flex flex-col"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border-b border-gray-50">
                                <img 
                                    src={order.paymentScreenshot} 
                                    alt={`Proof for ${order.orderId}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <a 
                                        href={order.paymentScreenshot} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white text-primary p-3 rounded-full shadow-2xl hover:scale-110 transition-transform"
                                    >
                                        <Eye size={20} />
                                    </a>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter block mb-1">#{order.orderId || order._id.slice(-8).toUpperCase()}</span>
                                        <h3 className="text-sm font-bold text-primary truncate max-w-[150px]">{order.shippingAddress?.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-accent">Rs. {Math.round(order.totalPrice)?.toLocaleString()}</p>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Mail size={12} />
                                        <span className="text-[10px] truncate max-w-[100px]">{order.shippingAddress?.email}</span>
                                    </div>
                                    <a 
                                        href={order.paymentScreenshot} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        Full Image <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Screenshot</th>
                                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order Details</th>
                                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Customer</th>
                                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</th>
                                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="w-16 h-16 rounded overflow-hidden bg-gray-50 border border-gray-100">
                                                <img src={order.paymentScreenshot} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-mono text-gray-400 mb-1">#{order.orderId || order._id.slice(-8).toUpperCase()}</span>
                                                <div className="flex items-center gap-1.5 text-gray-300">
                                                    <Calendar size={10} />
                                                    <span className="text-[10px] font-medium uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-primary mb-1">{order.shippingAddress?.name}</span>
                                                <span className="text-[10px] text-gray-400">{order.shippingAddress?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-bold text-accent">Rs. {Math.round(order.totalPrice)?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <a 
                                                href={order.paymentScreenshot} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 hover:bg-accent hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                <Eye size={12} /> View Proof
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayments;
