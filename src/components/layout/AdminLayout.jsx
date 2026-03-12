import { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, LogOut, BarChart3, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Categories', icon: Tag, path: '/admin/categories' },
];

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user || user.role !== 'admin') {
        navigate('/login');
        return null;
    }

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex-shrink-0 flex flex-col min-h-screen fixed left-0 top-0 z-40">
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="text-xl font-serif tracking-widest uppercase">WearStylewithImtisall</Link>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">Admin Panel</p>
                </div>
                <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
                    {NAV_ITEMS.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-200 ${active ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                <item.icon size={16} />
                                <span>{item.label}</span>
                                {active && <ChevronRight size={14} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-medium">
                            {user.name?.[0]}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-[10px] text-white/50">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
