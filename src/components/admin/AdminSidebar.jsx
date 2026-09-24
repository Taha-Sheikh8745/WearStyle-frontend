import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, ShoppingBag, MessageSquare, CreditCard, X, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin-portal-xyz123' },
    { title: 'View Products', icon: List, path: '/admin-portal-xyz123/products' },
    { title: 'Add Product', icon: PlusCircle, path: '/admin-portal-xyz123/add-product' },
    { title: 'Orders', icon: ShoppingBag, path: '/admin-portal-xyz123/orders' },
    { title: 'Payments', icon: CreditCard, path: '/admin-portal-xyz123/payments' },
    { title: 'Messages', icon: MessageSquare, path: '/admin-portal-xyz123/contacts' },
];

const AdminSidebar = ({ isOpen, onClose }) => {
    const sidebarContent = (
        <div className="flex flex-col h-full bg-white">
            {/* Sidebar Header */}
            <div className="p-6 sm:p-8 pb-6 sm:pb-8 flex items-center justify-between border-b border-gray-50">
                <div>
                    <h1 className="text-lg sm:text-xl font-serif tracking-widest uppercase text-primary">Imtisall</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mt-0.5">Admin Console</p>
                </div>
                {/* Close Button on Mobile Drawer */}
                <button
                    onClick={onClose}
                    aria-label="Close Sidebar"
                    className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin-portal-xyz123'}
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg text-xs sm:text-sm transition-all duration-200 group
                            ${isActive
                                ? 'bg-primary text-white shadow-md shadow-black/5 font-semibold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-primary font-medium'}
                        `}
                    >
                        <item.icon size={17} className="transition-transform group-hover:scale-110 flex-shrink-0" />
                        <span className="tracking-wide">{item.title}</span>
                    </NavLink>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-100">
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs text-accent hover:bg-accent/10 transition-colors font-semibold"
                    >
                        <span className="tracking-wider uppercase text-[10px]">View Live Boutique</span>
                        <ExternalLink size={13} />
                    </Link>
                </div>
            </nav>

            {/* Admin Profile Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-50">
                <div className="bg-[#faf8f5] rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-serif text-base font-bold flex-shrink-0">
                        A
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-bold text-primary truncate">Admin User</p>
                        <p className="text-[9px] text-gray-400 truncate uppercase tracking-wider">Super Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Permanent Sidebar (1024px+) */}
            <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 flex-shrink-0 z-20">
                {sidebarContent}
            </aside>

            {/* Mobile & Tablet Off-Canvas Drawer (< 1024px) */}
            <div 
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                    onClick={onClose}
                />

                {/* Sliding Drawer */}
                <aside 
                    className={`absolute top-0 left-0 w-[80%] max-w-xs h-full bg-white shadow-2xl transition-transform duration-300 ease-out z-10 ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {sidebarContent}
                </aside>
            </div>
        </>
    );
};

export default AdminSidebar;
