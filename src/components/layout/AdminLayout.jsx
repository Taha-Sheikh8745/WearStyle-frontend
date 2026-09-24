import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminNavbar from '../admin/AdminNavbar';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex font-sans text-primary selection:bg-accent selection:text-white">
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#111',
                        color: '#fff',
                        borderRadius: '2px',
                        fontSize: '13px',
                        padding: '12px 20px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#c2a67a',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Responsive Sidebar (Drawer on < lg, sticky column on >= lg) */}
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                <footer className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100/60 bg-white/50 text-[10px] uppercase tracking-widest text-gray-400 font-medium flex flex-col sm:flex-row justify-between gap-2 text-center sm:text-left">
                    <span>&copy; {new Date().getFullYear()} Imtisall Admin Console</span>
                    <span className="text-accent underline decoration-accent/20 underline-offset-4 pointer-events-none">Handcrafted Excellence</span>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
