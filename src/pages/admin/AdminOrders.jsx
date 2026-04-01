import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
    Processing: 'bg-yellow-50 text-yellow-700',
    Confirmed: 'bg-blue-50 text-blue-700',
    Shipped: 'bg-purple-50 text-purple-700',
    Delivered: 'bg-green-50 text-green-700',
    Cancelled: 'bg-red-50 text-red-700',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data.orders || data);
        } catch (err) {
            console.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (err) {
            alert('Failed to update order status.');
        }
    };

    const filtered = orders
        .filter(o => !filterStatus || o.orderStatus === filterStatus)
        .filter(o => !keyword ||
            o.user?.name.toLowerCase().includes(keyword.toLowerCase()) ||
            (o.orderId || o._id).toLowerCase().includes(keyword.toLowerCase())
        );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm uppercase tracking-widest font-serif">Loading orders...</p>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-serif mb-1">Orders</h1>
                <p className="text-gray-500 text-sm">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by customer or order ID..." value={keyword} onChange={e => setKeyword(e.target.value)} className="border border-gray-200 w-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary bg-white">
                    <option value="">All Statuses</option>
                    {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{order.orderId || order._id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium">{order.user?.name}</p>
                                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">Rs. {order.totalPrice}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.orderStatus}
                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                            className={`text-xs px-2 py-1 rounded border-0 outline-none cursor-pointer ${STATUS_COLORS[order.orderStatus]}`}
                                        >
                                            {ORDER_STATUSES.map(s => <option key={s} className="bg-white text-gray-700">{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm">No orders found.</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
