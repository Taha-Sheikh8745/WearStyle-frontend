import { useState, useEffect } from 'react';
import { Mail, User, Calendar, MessageSquare, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

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
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif mb-1 text-primary">Client Inquiries</h1>
                    <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">Manage questions & requests</p>
                </div>
                <div className="bg-[#faf8f5] border border-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary">{contacts.length} Total Messages</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xs text-xs sm:text-sm mb-6 flex items-center gap-3">
                    <Trash2 size={16} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {contacts.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xs">
                        <MessageSquare className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-gray-400 font-serif text-sm italic">No client inquiries found yet.</p>
                    </div>
                ) : (
                    contacts.map((contact, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            key={contact._id}
                            className="bg-white border border-gray-100 rounded-xs p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow group"
                        >
                            <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                                {/* Sender Info Side */}
                                <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-accent flex-shrink-0">
                                            <User size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-primary truncate">{contact.name}</h3>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-400">Client</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors truncate">
                                            <Mail size={13} className="text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{contact.email}</span>
                                        </a>
                                        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                                            <Calendar size={13} className="flex-shrink-0" />
                                            <span>{formatDate(contact.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2.5 gap-2">
                                            <h4 className="font-serif text-base sm:text-lg text-primary">{contact.subject}</h4>
                                            <div className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-accent/10 text-accent flex-shrink-0">
                                                {contact.status || 'Received'}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed bg-[#fbf9f6] p-3.5 sm:p-4 rounded-xs border border-gray-100/80">
                                            {contact.message}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end">
                                        <a 
                                            href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
                                            className="px-5 py-2 bg-primary text-white text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent transition-colors rounded-xs inline-flex items-center gap-2"
                                        >
                                            <span>Reply to Client</span>
                                            <ExternalLink size={11} />
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
