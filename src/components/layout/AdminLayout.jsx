import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminNavbar from '../admin/AdminNavbar';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex font-sans text-primary selection:bg-accent selection:text-white">
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#111',
                        color: '#fff',
                        borderRadius: '0px',
                        fontSize: '14px',
                        padding: '16px 24px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#c2a67a',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminNavbar />
                
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={window.location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                <footer className="px-8 py-6 border-t border-gray-100/50 bg-white/50 text-[10px] uppercase tracking-widest text-gray-400 font-medium flex justify-between">
                    <span>&copy; {new Date().getFullYear()} Imtisall Admin v1.0.0</span>
                    <span className="text-accent underline decoration-accent/20 underline-offset-4 pointer-events-none">Handcrafted Excellence</span>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
