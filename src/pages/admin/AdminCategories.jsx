import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Tag, ChevronRight, Layout, AlignLeft, Hash, Globe, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', parent: '', showInNavbar: true, order: 0 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/categories');
            setCategories(data.categories || data);
        } catch (err) {
            toast.error('Failed to retrieve categories');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', parent: '', showInNavbar: true, order: 0 });
        setEditItem(null);
        setShowForm(false);
    };

    const handleEdit = (cat) => {
        setEditItem(cat);
        setForm({
            name: cat.name,
            description: cat.description || '',
            parent: cat.parent?._id || cat.parent || '',
            showInNavbar: cat.showInNavbar || false,
            order: cat.order || 0
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this collection segment? This will affect associated creations.')) return;
        const toastId = toast.loading('Removing collection...');
        try {
            await api.delete(`/api/categories/${id}`);
            toast.success('Collection removed successfully', { id: toastId });
            setCategories(c => c.filter(x => x._id !== id));
        } catch (err) {
            toast.error('Failed to remove segment', { id: toastId });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading(editItem ? 'Refining collection...' : 'Creating new collection...');
        try {
            const submitData = { ...form };
            if (!submitData.parent) submitData.parent = null;

            if (editItem) {
                const { data } = await api.put(`/api/categories/${editItem._id}`, submitData);
                const updated = data.category || data;
                setCategories(c => c.map(x => x._id === editItem._id ? updated : x));
                toast.success('Collection refined', { id: toastId });
            } else {
                const { data } = await api.post('/api/categories', submitData);
                const newlyCreated = data.category || data;
                setCategories(c => [...c, newlyCreated]);
                toast.success('New collection launched', { id: toastId });
            }
            resetForm();
            fetchCategories(); 
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save collection', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Organizing Collections...</p>
        </div>
    );

    const parentOptions = categories.filter(c => editItem ? c._id !== editItem._id : true);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-primary">Department Management</h2>
                    <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                        <span>Classification</span>
                        <ChevronRight size={14} />
                        <span className="text-accent font-medium">{categories.length} Segments</span>
                    </p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowForm(true); }} 
                    className="btn-primary flex items-center gap-3 px-8 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>New Segment</span>
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-gray-100 p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                                <h3 className="text-lg font-serif italic text-primary">
                                    {editItem ? `Refining: ${editItem.name}` : 'Blueprint New Segment'}
                                </h3>
                                <button onClick={resetForm} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Segment Identity *</label>
                                        <div className="relative">
                                            <Tag className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-200" size={16} />
                                            <input 
                                                required 
                                                value={form.name} 
                                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                                                className="w-full pl-8 py-3 border-b border-gray-100 outline-none focus:border-accent transition-all text-sm font-medium" 
                                                placeholder="e.g. Artisanal Pret" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Hierarchy (Parent Selection)</label>
                                        <div className="relative">
                                            <Layout className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-200" size={16} />
                                            <select
                                                value={form.parent}
                                                onChange={e => setForm(f => ({ ...f, parent: e.target.value }))}
                                                className="w-full pl-8 py-3 border-b border-gray-100 outline-none focus:border-accent transition-all text-sm font-medium bg-transparent appearance-none cursor-pointer"
                                            >
                                                <option value="">None (Master Segment)</option>
                                                {parentOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Curation Narrative</label>
                                        <div className="relative flex">
                                            <AlignLeft className="absolute left-0 top-4 text-gray-200" size={16} />
                                            <textarea 
                                                rows={3} 
                                                value={form.description} 
                                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                                                className="w-full pl-8 py-3 border-b border-gray-100 outline-none focus:border-accent transition-all text-sm font-medium resize-none" 
                                                placeholder="A brief story of this collection segment..." 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 pt-4">
                                            <input
                                                type="checkbox"
                                                id="showInNavbar"
                                                checked={form.showInNavbar}
                                                onChange={e => setForm(f => ({ ...f, showInNavbar: e.target.checked }))}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <label htmlFor="showInNavbar" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 flex items-center gap-1.5 cursor-pointer">
                                                <Globe size={12} /> Public Display
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Hash className="text-gray-200" size={16} />
                                            <input
                                                type="number"
                                                value={form.order}
                                                onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                                                className="w-16 py-2 border-b border-gray-100 outline-none focus:border-accent transition-all text-sm font-bold text-center"
                                                title="Sequence Order"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex gap-4 pt-6">
                                    <button type="button" onClick={resetForm} className="flex-1 btn-secondary py-4">Discard</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-[2] btn-primary py-4">
                                        {isSubmitting ? 'Architecting...' : editItem ? 'Seal Refinement' : 'Confirm Segment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <motion.div 
                        layout
                        key={cat._id} 
                        className="bg-white border border-gray-100 p-8 relative group hover:border-accent/40 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-black/5"
                    >
                        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                            {cat.parent && (
                                <span className="bg-gray-50 text-gray-400 text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold border border-gray-100">
                                    Sub of: {typeof cat.parent === 'object' ? cat.parent.name : 'Master'}
                                </span>
                            )}
                            {cat.showInNavbar && (
                                <span className="bg-emerald-50 text-emerald-600 text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold border border-emerald-100 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Active Rank #{cat.order}
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] text-accent uppercase tracking-[0.25em] font-bold mb-1">Segment</p>
                                <h3 className="font-serif text-xl text-primary leading-none lowercase first-letter:uppercase tracking-tight group-hover:text-accent transition-colors">{cat.name}</h3>
                                <p className="text-[10px] text-gray-300 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">/{cat.slug}</p>
                            </div>
                            
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed italic pr-4">
                                {cat.description || '"In this segment, craftsmanship meets contemporary grace, creating a symphony of artisanal excellence."'}
                            </p>

                            <div className="pt-6 flex items-center gap-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                <button 
                                    onClick={() => handleEdit(cat)} 
                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
                                >
                                    <Pencil size={14} /> Refine
                                </button>
                                <div className="h-3 w-[1px] bg-gray-100"></div>
                                <button 
                                    onClick={() => handleDelete(cat._id)} 
                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={14} /> Expunge
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {categories.length === 0 && (
                <div className="py-32 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                        <Tag size={40} />
                    </div>
                    <p className="text-gray-400 text-sm uppercase tracking-[0.3em] font-serif italic text-center max-w-xs">
                        The architectural blueprints for your collections are currently unset.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
