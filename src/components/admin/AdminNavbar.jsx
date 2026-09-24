import { Bell, Menu, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AdminNavbar = ({ onToggleSidebar }) => {
    const location = useLocation();
    const currentSection = location.pathname.split('/').pop() || 'Dashboard';

    return (
        <header className="h-16 sm:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
            <div className="flex items-center space-x-3 sm:space-x-6">
                {/* Mobile / Tablet Hamburger Button */}
                <button 
                    onClick={onToggleSidebar}
                    aria-label="Toggle Navigation Drawer"
                    className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-primary transition-colors hover:bg-gray-100 rounded-lg focus:outline-none"
                >
                    <Menu size={22} />
                </button>
                
                <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-gray-500 font-medium">
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] sm:text-[10px]">Portal</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-primary font-semibold capitalize truncate max-w-[120px] sm:max-w-none">{currentSection}</span>
                </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <button 
                        aria-label="Notifications"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 transition-all rounded-lg relative"
                    >
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
                    </button>
                    <button 
                        aria-label="Settings"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 transition-all rounded-lg hidden xs:block"
                    >
                        <Settings size={18} />
                    </button>
                </div>

                <div className="h-6 w-[1px] bg-gray-200 mx-1 sm:mx-2"></div>

                <div className="flex items-center gap-2.5">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs sm:text-sm font-bold text-primary leading-tight">Admin</p>
                        <p className="text-[9px] text-accent uppercase tracking-widest font-semibold">Super Admin</p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-xs">
                        <User size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
