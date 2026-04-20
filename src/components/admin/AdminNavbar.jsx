import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminNavbar = () => {
    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center space-x-6">
                <button className="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-lg">
                    <Menu size={20} />
                </button>
                <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500 font-medium">
                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Portal</span>
                    <span className="text-gray-200">/</span>
                    <span className="text-primary capitalize">{window.location.pathname.split('/').pop() || 'Dashboard'}</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 mr-4">
                    <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-xl relative group">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-xl">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                    <div className="text-right hidden sm:block">
                        <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-bold text-primary"
                        >
                            Admin
                        </motion.p>
                        <p className="text-[10px] text-accent uppercase tracking-widest font-medium">Administrator</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                        <User size={18} />
                    </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
