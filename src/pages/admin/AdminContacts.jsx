import { useState, useEffect } from 'react';
import { Mail, User, Calendar, MessageSquare, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/api/contact');
            if (data.success) {
                setContacts(data.contacts);
            }
        } catch (err) {
            setError('Failed to fetch messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Customer Messages</h1>
                    <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">Manage your inquiries</p>
                </div>
                <div className="bg-secondary px-6 py-3 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{contacts.length} Total Messages</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 flex items-center gap-3">
                    <Trash2 size={16} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {contacts.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
                        <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
                        <p className="text-gray-400 font-serif">No messages found yet.</p>
                    </div>
                ) : (
                    contacts.map((contact, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={contact._id}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Sender Info Side */}
                                <div className="lg:w-1/4 border-r border-gray-50 pr-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-primary truncate w-32">{contact.name}</h3>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400">Sender</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-xs text-gray-500 hover:text-accent transition-colors">
                                            <Mail size={14} />
                                            {contact.email}
                                        </a>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <Calendar size={14} />
                                            {formatDate(contact.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-serif text-lg text-primary">{contact.subject}</h4>
                                            <div className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                                                contact.status === 'new' ? 'bg-accent/10 text-accent' : 'bg-green-50 text-green-600'
                                            }`}>
                                                {contact.status}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed bg-secondary/30 p-4 rounded-xl border border-gray-50 italic">
                                            "{contact.message}"
                                        </p>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a 
                                            href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                            className="px-6 py-2 bg-primary text-white text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors rounded-lg flex items-center gap-2"
                                        >
                                            Reply Now
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminContacts;
