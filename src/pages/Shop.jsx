import { Link, useSearchParams } from 'react-router-dom';
import { Heart, SlidersHorizontal, X, Star, Loader2, Search, Filter } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useState, useEffect, useContext } from 'react';
import productService from '../services/productService';
import { STATIC_CATEGORIES, getCategoryName } from '../constants/categories';
import { motion, AnimatePresence } from 'framer-motion';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={11} fill={s <= Math.round(rating) ? '#FBBF24' : 'none'} stroke={s <= Math.round(rating) ? '#FBBF24' : '#D1D5DB'} />
        ))}
    </div>
);

const ProductCard = ({ product, index }) => {
    const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const wishlisted = isWishlisted(product._id);
    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group product-card"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-50 rounded-sm">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800'}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {discount && (
                        <span className="bg-accent text-white text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-bold shadow-sm">
                            -{discount}%
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="bg-primary text-white text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-bold shadow-sm">
                            Exclusive
                        </span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${wishlisted ? 'bg-red-50 text-red-500 opacity-100' : 'bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100'} hover:scale-110`}
                >
                    <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Quick Add */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                    <button
                        onClick={() => addToCart(product, 'M', 1)}
                        className="w-full bg-primary/95 text-white text-[10px] uppercase tracking-[0.25em] py-4 hover:bg-accent transition-colors duration-300 backdrop-blur-sm font-bold"
                    >
                        + Add To Cart
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="text-center">
                <p className="text-[9px] text-accent uppercase tracking-[0.3em] mb-1.5 font-bold">
                    {getCategoryName(product.category)}
                </p>
                <Link to={`/product/${product._id}`} className="block group/title">
                    <h3 className="text-sm font-medium tracking-tight mb-2 group-hover/title:text-accent transition-colors duration-300 line-clamp-1 px-2">{product.title}</h3>
                </Link>
                <div className="flex items-center justify-center gap-2 mb-2.5">
                    <StarRating rating={product.rating || 0} />
                    <span className="text-[10px] text-gray-300 font-mono">({product.numReviews || 0})</span>
                </div>
                <div className="flex items-center justify-center gap-2.5">
                    <span className="text-sm font-bold text-primary italic font-serif">Rs. {Math.round(product.price)?.toLocaleString()}</span>
                    {product.comparePrice > 0 && (
                        <span className="text-xs text-gray-300 line-through font-mono">Rs. {Math.round(product.comparePrice)?.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const Shop = () => {
    const [searchParams] = useSearchParams();
    const urlKeyword = searchParams.get('search') || '';
    const urlCat = searchParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(urlCat);
    const [selectedSize, setSelectedSize] = useState('');
    const [priceRange, setPriceRange] = useState([0, 50000]); // Increased range for PKR
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [keyword, setKeyword] = useState(urlKeyword);

    useEffect(() => {
        // Use static categories instead of fetching from DB
        setCategories(STATIC_CATEGORIES);
        
        // Re-sync with URL
        if (urlCat !== 'All') {
            setSelectedCategory(urlCat);
        }
    }, [urlCat]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    category: selectedCategory === 'All' ? '' : selectedCategory,
                    keyword: keyword,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    size: selectedSize,
                    sort: sortBy
                };
                const data = await productService.getAllProducts(params);
                setProducts(data.products || []);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, keyword, priceRange, selectedSize, sortBy]);

    return (
        <div className="pt-24 min-h-screen bg-white animate-fade-in text-primary">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <p className="text-accent text-[11px] uppercase tracking-[0.4em] mb-4">Curated Curation</p>
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">World Collection</h2>
                    <div className="w-16 h-[1px] bg-accent mx-auto" />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={14} />
                            <input 
                                type="text"
                                placeholder="Search styles..."
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                className="pl-9 pr-4 py-2 text-xs uppercase tracking-widest border border-gray-100 outline-none focus:border-accent/40 bg-gray-50/30 transition-all rounded-sm w-64"
                            />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold border-l border-gray-100 pl-4">
                            {products.length} Pieces Found
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="border-none bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-accent transition-colors"
                            >
                                <option value="newest">Initial Launch</option>
                                <option value="price-asc">Price Ascending</option>
                                <option value="price-desc">Price Descending</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-3 px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold border rounded-full transition-all duration-500 ${showFilters ? 'bg-primary text-white border-primary shadow-lg shadow-black/10' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}
                        >
                            <SlidersHorizontal size={14} /> 
                            <span>Refine Search</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filter Sidebar */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.aside 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                className="w-full lg:w-64 flex-shrink-0"
                            >
                                <div className="sticky top-28 space-y-12 bg-gray-50/50 p-8 pt-0">
                                    {/* Category Filter */}
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 font-bold text-primary flex items-center gap-2">
                                            <Filter size={12} /> Collections
                                        </h4>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => setSelectedCategory('All')}
                                                className={`text-[11px] text-left uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'text-accent font-bold translate-x-2' : 'text-gray-400 hover:text-primary hover:translate-x-1'}`}
                                            >
                                                Show All
                                            </button>
                                            {categories.filter(c => !c.isPage).map(cat => (
                                                <button
                                                    key={cat.slug}
                                                    onClick={() => setSelectedCategory(cat.slug)}
                                                    className={`text-[11px] text-left uppercase tracking-widest transition-all ${selectedCategory === cat.slug ? 'text-accent font-bold translate-x-2' : 'text-gray-400 hover:text-primary hover:translate-x-1'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Filter */}
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 font-bold text-primary">Valuation Range</h4>
                                        <div className="px-2">
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="50000" 
                                                step="500"
                                                value={priceRange[1]} 
                                                onChange={e => setPriceRange([0, Number(e.target.value)])} 
                                                className="w-full accent-accent h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                            />
                                            <div className="flex justify-between mt-4">
                                                <span className="text-[10px] text-gray-300 font-mono">Rs. 0</span>
                                                <span className="text-[10px] text-accent font-bold font-mono tracking-tight">UP TO Rs. {Math.round(priceRange[1])?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Size Filter */}
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] mb-6 font-bold text-primary">Tailoring Size</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {SIZES.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                                    className={`w-10 h-10 flex items-center justify-center text-[10px] font-bold border transition-all rounded-sm ${selectedSize === size ? 'bg-primary text-white border-primary shadow-md' : 'border-gray-100 text-gray-400 hover:border-accent hover:text-accent bg-white'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => { setSelectedCategory('All'); setKeyword(''); setPriceRange([0, 50000]); setSelectedSize(''); }}
                                        className="w-full py-4 bg-white border border-gray-100 text-[9px] uppercase tracking-[0.25em] font-bold text-gray-400 hover:border-red-100 hover:text-red-500 transition-all rounded-sm"
                                    >
                                        Expunge Filters
                                    </button>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Consulting Collection Archives...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-40">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100/50">
                                    <Search size={32} className="text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-serif mb-3 italic">No matching pieces found.</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-8 font-medium">Refine your criteria or expand the valuation range.</p>
                                <button 
                                    onClick={() => { setSelectedCategory('All'); setKeyword(''); setPriceRange([0, 50000]); setSelectedSize(''); }} 
                                    className="px-10 py-3.5 bg-primary text-white text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-accent transition-colors duration-500 rounded-sm"
                                >
                                    View Full Journal
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                                {products.map((product, i) => (
                                    <ProductCard key={product._id} product={product} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
