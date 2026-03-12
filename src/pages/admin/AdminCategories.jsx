import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';

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
            const { data } = await axios.get('/api/categories');
            // Backend returns { success: true, categories: [...] }
            setCategories(data.categories || []);
        } catch (err) {
            console.error('Failed to fetch categories');
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
        if (!window.confirm('Delete this category? This might affect products in this category.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(c => c.filter(x => x._id !== id));
        } catch (err) {
            alert('Failed to delete category.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Prepare submission data (handle null parent)
            const submitData = { ...form };
            if (!submitData.parent) submitData.parent = null;

            if (editItem) {
                const { data } = await axios.put(`/api/categories/${editItem._id}`, submitData, config);
                const updatedCategory = data.category || data;
                setCategories(c => c.map(x => x._id === editItem._id ? updatedCategory : x));
            } else {
                const { data } = await axios.post('/api/categories', submitData, config);
                const newCategory = data.category || data;
                setCategories(c => [...c, newCategory]);
            }
            resetForm();
            fetchCategories(); // Refresh to get populated parent info
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm uppercase tracking-widest font-serif">Loading categories...</p>
        </div>
    );

    // Filter out the current category being edited from parent options to avoid circular refs
    const parentOptions = categories.filter(c => editItem ? c._id !== editItem._id : true);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif mb-1 uppercase tracking-tight">Category Catalog</h1>
                    <p className="text-gray-500 text-sm">{categories.length} segments available</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> New Category
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-gray-100 p-8 shadow-sm mb-8 animate-scale-in">
                    <h2 className="text-lg font-serif mb-6 uppercase tracking-widest text-primary border-b border-gray-50 pb-3">
                        {editItem ? 'Edit Category' : 'Create New Category'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 block">Category Name *</label>
                                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border border-gray-200 w-full p-4 text-sm outline-none focus:border-accent transition-colors bg-secondary/20" placeholder="e.g. Luxury Lawn" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 block">Parent Category</label>
                                <select
                                    value={form.parent}
                                    onChange={e => setForm(f => ({ ...f, parent: e.target.value }))}
                                    className="border border-gray-200 w-full p-4 text-sm outline-none focus:border-accent transition-colors bg-secondary/20 appearance-none"
                                >
                                    <option value="">None (Top Level)</option>
                                    {parentOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1 italic">Select a parent if this is a sub-category.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-full flex flex-col">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5 block">Description</label>
                                <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border border-gray-200 w-full p-4 text-sm outline-none focus:border-accent transition-colors resize-none bg-secondary/20 flex-1" placeholder="Describe this category collection..." />
                            </div>
                        </div>

                        {/* Navbar Settings */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50/50 rounded-sm">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="showInNavbar"
                                    checked={form.showInNavbar}
                                    onChange={e => setForm(f => ({ ...f, showInNavbar: e.target.checked }))}
                                    className="w-4 h-4 accent-primary"
                                />
                                <label htmlFor="showInNavbar" className="text-xs uppercase tracking-widest font-bold text-gray-600">Show in Navbar</label>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Display Order</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                                    className="border border-gray-200 w-24 p-2 text-sm outline-none focus:border-accent transition-colors"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-4 pt-4 border-t border-gray-50 mt-2">
                            <button type="button" onClick={resetForm} className="btn-secondary flex-1 py-4">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-4">
                                {isSubmitting ? 'Processing...' : editItem ? 'Update Collection' : 'Create Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <div key={cat._id} className="bg-white border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group relative">
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                            {cat.parent && (
                                <span className="bg-gray-100 text-gray-500 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">
                                    Sub of: {typeof cat.parent === 'object' ? cat.parent.name : 'Category'}
                                </span>
                            )}
                            {cat.showInNavbar && (
                                <span className="bg-accent/10 text-accent text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse"></span>
                                    In Navbar (#{cat.order})
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pt-2">
                                <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-1">Collection</p>
                                <h3 className="font-serif text-lg mb-1 truncate text-primary uppercase tracking-tight">{cat.name}</h3>
                                <p className="text-[9px] text-gray-300 font-mono mb-4 uppercase tracking-widest">{cat.slug}</p>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed italic">{cat.description || 'No description provided for this collection.'}</p>
                            </div>
                            <div className="flex gap-1 ml-4 flex-shrink-0">
                                <button onClick={() => handleEdit(cat)} className="p-2 text-gray-300 hover:text-accent hover:bg-accent/5 rounded-full transition-all">
                                    <Pencil size={15} />
                                </button>
                                <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {categories.length === 0 && (
                <div className="py-32 text-center">
                    <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Tag className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-serif">Your catalog is currently empty.</p>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
