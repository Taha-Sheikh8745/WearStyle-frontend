import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Search, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [keyword, setKeyword] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', price: '', category: '', sizes: [], stock: '', isFeatured: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/categories')
            ]);
            setProducts(productsRes.data.products || productsRes.data);
            setCategories(categoriesRes.data.categories || categoriesRes.data);
            if (categoriesRes.data.length > 0) {
                setForm(f => ({ ...f, category: categoriesRes.data[0]._id }));
            }
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(ps => ps.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete product.');
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            price: '',
            category: categories[0]?._id || '',
            sizes: [],
            stock: '',
            isFeatured: false
        });
        setSelectedImages([]);
        setImagePreviews([]);
        setEditProduct(null);
        setShowForm(false);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setForm({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category._id || product.category,
            sizes: product.sizes || [],
            stock: product.stock,
            isFeatured: product.isFeatured || false
        });
        setShowForm(true);
    };

    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 5) {
            alert('Maximum 5 images allowed.');
            return;
        }

        setSelectedImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };

            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (key === 'sizes') {
                    formData.append(key, JSON.stringify(form[key]));
                } else {
                    formData.append(key, form[key]);
                }
            });

            selectedImages.forEach(image => {
                formData.append('images', image);
            });

            if (editProduct) {
                const { data } = await axios.put(`/api/products/${editProduct._id}`, formData, config);
                setProducts(ps => ps.map(p => p._id === editProduct._id ? data : p));
            } else {
                const { data } = await axios.post('/api/products', formData, config);
                setProducts(ps => [...ps, data]);
            }
            resetForm();
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSize = (size) => {
        setForm(f => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size] }));
    };

    const filtered = products.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm uppercase tracking-widest font-serif">Curating catalog...</p>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif mb-1">Products</h1>
                    <p className="text-gray-500 text-sm">{products.length} products in catalog</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-lg font-serif">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-primary transition-colors text-xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Product Title *</label>
                                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="Noor Chikankari Luxury Set" />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Description *</label>
                                <textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors resize-none" placeholder="Describe the product..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Price ($) *</label>
                                    <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="189" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Stock *</label>
                                    <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="30" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Product Images (2-3 recommended) *</label>
                                <div className="border border-gray-200 p-4 border-dashed rounded-sm">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
                                        <Plus size={24} className="text-gray-400" />
                                        <span className="text-xs text-gray-500 uppercase tracking-widest">Select Images</span>
                                    </label>
                                </div>
                                {imagePreviews.length > 0 && (
                                    <div className="flex gap-3 mt-4 flex-wrap">
                                        {imagePreviews.map((url, idx) => (
                                            <div key={idx} className="relative w-20 h-24 border border-gray-100 group">
                                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 mb-3 block">Sizes</label>
                                <div className="flex gap-2 flex-wrap">
                                    {SIZES.map(size => (
                                        <button type="button" key={size} onClick={() => toggleSize(size)} className={`border px-3 py-1.5 text-xs transition-colors ${form.sizes?.includes(size) ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="accent-primary" />
                                <label htmlFor="featured" className="text-sm">Featured Product (shown on homepage)</label>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={resetForm} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                                    {isSubmitting ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="border border-gray-200 w-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Stock</th>
                                <th className="px-6 py-4 font-medium">Featured</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(product => (
                                <tr key={product._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-14 overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img src={product.images?.[0]?.url || 'https://via.placeholder.com/100x120?text=No+Image'} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm font-medium">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</td>
                                    <td className="px-6 py-4 text-sm font-medium">${product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded ${product.isFeatured ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}`}>
                                            {product.isFeatured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-gray-400 text-sm">No products found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
