import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Search, Filter, Loader2, ChevronRight, Eye } from 'lucide-react';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import { STATIC_CATEGORIES, getCategoryName, getFlattenedCategories } from '../../constants/categories';
import { motion } from 'framer-motion';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        const flattened = getFlattenedCategories();
        setCategories(flattened);
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data.products || data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product permanently?')) return;
        const toastId = toast.loading('Deleting product...');
        try {
            await productService.deleteProduct(id);
            toast.success('Product removed catalog', { id: toastId });
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            toast.error('Deletion failed', { id: toastId });
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Loading Boutique Collection...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-serif text-primary">Catalog Management</h2>
                    <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                        <span>Collections</span>
                        <ChevronRight size={14} />
                        <span className="text-accent font-medium">{products.length} Items</span>
                    </p>
                </div>
                <Link 
                    to="/admin/add-product" 
                    className="btn-primary inline-flex items-center gap-3 px-8 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>New Creation</span>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-gray-300" size={18} />
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex-1 md:w-48 py-3 px-4 bg-[#FDFCFB] border border-transparent focus:border-accent/30 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">In-Stock Item</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Value</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Inv.</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <motion.tr 
                                    layout
                                    key={product._id} 
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-16 bg-gray-50 overflow-hidden border border-gray-100 group-hover:border-accent/30 transition-colors">
                                                <img 
                                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/100x120?text=No+Image'} 
                                                    alt={product.title} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-primary mb-1 line-clamp-1">{product.title}</h4>
                                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{product.sizes?.join(', ') || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{getCategoryName(product.category) || 'Unset'}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-primary">Rs. {product.price.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`text-[11px] font-bold px-2 py-1 ${product.stock > 10 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <Link 
                                                to={`/product/${product._id}`} 
                                                className="p-2.5 text-gray-400 hover:text-accent hover:bg-white rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-black/5"
                                                title="View in Shop"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link 
                                                to={`/admin/edit-product/${product._id}`} 
                                                className="p-2.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-black/5"
                                                title="Edit Details"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-black/5"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-serif italic">No creations found matching your request.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsList;
