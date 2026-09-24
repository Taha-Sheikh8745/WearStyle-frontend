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
            const data = await productService.getAllProducts({ limit: 1000 });
            setProducts(data.products || (Array.isArray(data) ? data : []));
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
            toast.success('Product removed from catalog', { id: toastId });
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
            <div className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={36} />
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Loading Collection...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-primary">Catalog Management</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                        <span>Collections</span>
                        <ChevronRight size={13} />
                        <span className="text-accent font-semibold">{products.length} Items</span>
                    </p>
                </div>
                <Link 
                    to="/admin-portal-xyz123/add-product" 
                    className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs self-start sm:self-auto"
                >
                    <Plus size={16} />
                    <span>New Creation</span>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xs border border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center shadow-xs">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCFB] border border-gray-100 focus:border-accent/40 focus:bg-white outline-none transition-all text-xs sm:text-sm rounded-xs"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 flex-shrink-0" size={16} />
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-52 py-2.5 px-3 bg-[#FDFCFB] border border-gray-100 focus:border-accent/40 focus:bg-white outline-none transition-all text-xs sm:text-sm cursor-pointer rounded-xs"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table with Responsive Overflow */}
            <div className="bg-white border border-gray-100 rounded-xs overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[620px]">
                        <thead>
                            <tr className="bg-[#FDFCFB] border-b border-gray-100">
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">In-Stock Item</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Value</th>
                                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                            {filteredProducts.map((product) => (
                                <motion.tr 
                                    layout
                                    key={product._id} 
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-14 bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0 rounded-xs">
                                                <img 
                                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/100x120?text=No+Image'} 
                                                    alt={product.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs sm:text-sm font-bold text-primary mb-0.5 line-clamp-1">{product.title}</h4>
                                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                                                    {product.sizes?.join(', ') || 'Standard'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                                            {getCategoryName(product.category) || 'Unset'}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 font-bold font-serif text-primary whitespace-nowrap">
                                        Rs. {Math.round(product.price)?.toLocaleString()}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <Link 
                                                to={`/product/${product._id}`} 
                                                className="p-2 text-gray-400 hover:text-accent hover:bg-white rounded-md transition-all shadow-xs"
                                                title="View in Shop"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link 
                                                to={`/admin-portal-xyz123/edit-product/${product._id}`} 
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-md transition-all shadow-xs"
                                                title="Edit Details"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-all shadow-xs"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-xs font-serif italic">
                            No products match your search criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsList;
