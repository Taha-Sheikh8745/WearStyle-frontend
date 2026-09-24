import { useState, useEffect } from 'react';
import { Search, Loader2, Calendar, Mail, ExternalLink, Eye, LayoutGrid, List as ListIcon, ShoppingBag, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminPayments = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/orders');
            const allOrders = data.orders || data;
            const ordersWithScreenshots = allOrders.filter(o => o.paymentScreenshot);
            setOrders(ordersWithScreenshots);
        } catch (err) {
            toast.error('Failed to retrieve payment history');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteScreenshot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this payment screenshot?')) return;

        try {
            await api.delete(`/api/orders/${id}/screenshot`);
            toast.success('Screenshot deleted successfully');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete screenshot');
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
            <div className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={36} />
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Accessing Payment Archives...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-primary">Payment Screenshots</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 font-medium uppercase tracking-wider">
                        Verify manual transfers via Easypaisa
                    </p>
                </div>
                <div className="flex bg-white border border-gray-100 p-1 rounded-xs self-end sm:self-auto">
                    <button 
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                        className={`p-2 rounded-xs transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-xs' : 'text-gray-400 hover:text-primary'}`}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        aria-label="Table view"
                        className={`p-2 rounded-xs transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-xs' : 'text-gray-400 hover:text-primary'}`}
                    >
                        <ListIcon size={16} />
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="bg-white p-3 sm:p-4 border border-gray-100 rounded-xs shadow-xs">
                <div className="relative w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by customer name or order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCFB] border border-gray-100 focus:border-accent/40 focus:bg-white outline-none transition-all text-xs sm:text-sm rounded-xs"
                    />
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white border border-gray-100 p-12 sm:p-20 text-center rounded-xs shadow-xs">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <ShoppingBag size={28} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif text-primary italic">No payment proofs found.</h3>
                    <p className="text-xs text-gray-400 mt-1.5">Screenshots will appear here once customers place Easypaisa orders.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredOrders.map((order) => (
                        <motion.div 
                            layout
                            key={order._id}
                            className="bg-white border border-gray-100 overflow-hidden group hover:shadow-lg transition-all rounded-xs flex flex-col"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border-b border-gray-100">
                                <img 
                                    src={order.paymentScreenshot} 
                                    alt={`Proof for ${order.orderId}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <a 
                                        href={order.paymentScreenshot} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white text-primary p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                        title="View Proof"
                                    >
                                        <Eye size={18} />
                                    </a>
                                    <button 
                                        onClick={() => handleDeleteScreenshot(order._id)}
                                        className="bg-white text-red-500 p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                        title="Delete Proof"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-mono text-gray-400 block mb-0.5">#{order.orderId || order._id.slice(-6).toUpperCase()}</span>
                                        <h3 className="text-xs sm:text-sm font-bold text-primary truncate">{order.shippingAddress?.name}</h3>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-bold text-accent">Rs. {Math.round(order.totalPrice)?.toLocaleString()}</p>
                                        <p className="text-[9px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                                    <span className="text-[11px] text-gray-400 truncate max-w-[130px]">{order.shippingAddress?.phone || order.shippingAddress?.email}</span>
                                    <a 
                                        href={order.paymentScreenshot} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold uppercase tracking-wider text-accent hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        Inspect <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-100 overflow-hidden shadow-xs rounded-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[620px]">
                            <thead>
                                <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                    <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Screenshot</th>
                                    <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order Details</th>
                                    <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Customer</th>
                                    <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</th>
                                    <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3">
                                            <div className="w-12 h-16 rounded overflow-hidden bg-gray-50 border border-gray-200">
                                                <img src={order.paymentScreenshot} alt="Proof" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <p className="font-mono text-gray-400 text-xs">#{order.orderId || order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <p className="font-bold text-primary">{order.shippingAddress?.name}</p>
                                            <p className="text-[11px] text-gray-400">{order.shippingAddress?.phone}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 font-bold text-primary font-serif">
                                            Rs. {Math.round(order.totalPrice)?.toLocaleString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a 
                                                    href={order.paymentScreenshot} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-accent"
                                                >
                                                    <Eye size={16} />
                                                </a>
                                                <button 
                                                    onClick={() => handleDeleteScreenshot(order._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
