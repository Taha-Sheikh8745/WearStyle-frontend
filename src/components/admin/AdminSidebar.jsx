import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, User, LogOut, ShoppingBag, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { title: 'View Products', icon: List, path: '/admin/products' },
    { title: 'Add Product', icon: PlusCircle, path: '/admin/add-product' },
    { title: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
];

const AdminSidebar = ({ user, handleLogout }) => {
    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            <div className="p-8 pb-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-xl font-serif tracking-widest uppercase text-primary">Imtisall</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mt-1">Admin Console</p>
                </motion.div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {NAV_ITEMS.map((item, index) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm transition-all duration-300 group
                            ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-black/5'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}
                        `}
                    >
                        <item.icon size={18} className="transition-transform group-hover:scale-110" />
                        <span className="font-medium tracking-wide">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-gray-50">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-serif text-lg">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-primary truncate">{user?.name || 'Admin'}</p>
                        <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">Super Admin</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
