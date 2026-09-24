import { Link, useSearchParams } from 'react-router-dom';
import { Heart, SlidersHorizontal, X, Star, Loader2, Search, Filter, ArrowRight } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useState, useEffect, useContext } from 'react';
import productService from '../services/productService';
import { STATIC_CATEGORIES, getCategoryName } from '../constants/categories';
import { motion, AnimatePresence } from 'framer-motion';
import wearStyleBg from '../assets/shop-bg.jpeg';

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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
            className="group product-card flex flex-col h-full bg-white rounded-xs"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[3/4] mb-3 sm:mb-4 bg-gray-50 rounded-xs">
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800'}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-108"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
                    {discount && (
                        <span className="bg-red-600 text-white text-[8px] sm:text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 sm:px-2 sm:py-1 font-bold shadow-xs">
                            -{discount}%
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="bg-primary text-white text-[8px] sm:text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 sm:px-2 sm:py-1 font-bold shadow-xs">
                            Exclusive
                        </span>
                    )}
                </div>

                {/* Wishlist button (Accessible on mobile touch & desktop) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-20 ${
                        wishlisted 
                            ? 'bg-red-50 text-red-500 opacity-100' 
                            : 'bg-white/95 text-gray-400 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-500'
                    } hover:scale-110 active:scale-90`}
                >
                    <Heart size={14} className="sm:w-4 sm:h-4" fill={wishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Quick Add Overlay on Desktop & Tablet Hover */}
                <div className="hidden sm:block absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <button
                        onClick={() => addToCart(product, product.sizes?.[0] || 'M', 1)}
                        className="w-full bg-primary/95 text-white text-[10px] uppercase tracking-[0.25em] py-3.5 hover:bg-accent transition-colors duration-200 backdrop-blur-xs font-bold active:scale-98"
                    >
                        + Quick Add
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="text-center px-1 pb-2 flex-1 flex flex-col justify-between">
                <div>
                    <p className="text-[8px] sm:text-[9px] text-accent uppercase tracking-[0.25em] mb-1 font-bold truncate">
                        {getCategoryName(product.category)}
                    </p>
                    <Link to={`/product/${product._id}`} className="block group/title">
                        <h3 className="text-xs sm:text-sm font-medium tracking-tight mb-1.5 group-hover/title:text-accent transition-colors duration-200 line-clamp-1">
                            {product.title}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                        <StarRating rating={product.rating || 0} />
                        <span className="text-[9px] sm:text-[10px] text-gray-300 font-mono">({product.numReviews || 0})</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1 border-t border-gray-50">
                    <span className="text-xs sm:text-sm font-bold text-primary font-serif">
                        Rs. {Math.round(product.price)?.toLocaleString()}
                    </span>
                    {product.comparePrice > 0 && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through font-mono font-bold">
                            Rs. {Math.round(product.comparePrice)?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Mobile Quick Add Button (Visible on screens < sm for touch accessibility) */}
                <div className="sm:hidden mt-2 pt-2 border-t border-gray-100">
                    <button
                        onClick={() => addToCart(product, product.sizes?.[0] || 'M', 1)}
                        className="w-full py-1.5 bg-secondary text-primary hover:bg-primary hover:text-white text-[9px] uppercase tracking-widest font-bold transition-colors rounded-xs"
                    >
                        + Add To Bag
                    </button>
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
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [keyword, setKeyword] = useState(urlKeyword);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, keyword, priceRange, selectedSize, sortBy]);

    useEffect(() => {
        setCategories(STATIC_CATEGORIES);
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
                    sort: sortBy,
                    page: page
                };
                const data = await productService.getAllProducts(params);
                setProducts(data.products || []);
                setTotalPages(data.pages || 1);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, keyword, priceRange, selectedSize, sortBy, page]);

    const resetFilters = () => {
        setSelectedCategory('All');
        setKeyword('');
        setPriceRange([0, 50000]);
        setSelectedSize('');
    };

    const filterControls = (
        <div className="space-y-8 p-1">
            {/* Category Filter */}
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.25em] mb-4 font-bold text-primary flex items-center gap-2">
                    <Filter size={12} className="text-accent" /> Collections
                </h4>
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`text-[11px] text-left uppercase tracking-widest transition-all ${
                            selectedCategory === 'All' ? 'text-accent font-bold translate-x-1.5' : 'text-gray-500 hover:text-primary hover:translate-x-1'
                        }`}
                    >
                        Show All
                    </button>
                    {categories.filter(c => !c.isPage).map(cat => (
                        cat.children && cat.children.length > 0 ? (
                            <div key={cat.slug} className="flex flex-col gap-2 mt-1">
                                <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-primary/80">{cat.name}</span>
                                <div className="flex flex-col gap-2 pl-2 border-l border-gray-200">
                                    {cat.children.map(child => (
                                        <button
                                            key={child.slug}
                                            onClick={() => setSelectedCategory(child.slug)}
                                            className={`text-[10px] text-left uppercase tracking-widest transition-all ${
                                                selectedCategory === child.slug ? 'text-accent font-bold translate-x-1' : 'text-gray-500 hover:text-primary hover:translate-x-1'
                                            }`}
                                        >
                                            {child.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <button
                                key={cat.slug}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`text-[11px] text-left uppercase tracking-widest transition-all ${
                                    selectedCategory === cat.slug ? 'text-accent font-bold translate-x-1.5' : 'text-gray-500 hover:text-primary hover:translate-x-1'
                                }`}
                            >
                                {cat.name}
                            </button>
                        )
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-gray-200/60 pt-6">
                <h4 className="text-[10px] uppercase tracking-[0.25em] mb-4 font-bold text-primary">Price Ceiling</h4>
                <div>
                    <input 
                        type="range" 
                        min="0" 
                        max="50000" 
                        step="500"
                        value={priceRange[1]} 
                        onChange={e => setPriceRange([0, Number(e.target.value)])} 
                        className="w-full accent-accent h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-[10px] text-gray-400 font-mono">Rs. 0</span>
                        <span className="text-[11px] text-accent font-bold font-mono tracking-tight">Up to Rs. {Math.round(priceRange[1])?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Size Filter */}
            <div className="border-t border-gray-200/60 pt-6">
                <h4 className="text-[10px] uppercase tracking-[0.25em] mb-4 font-bold text-primary">Tailoring Size</h4>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                            className={`w-9 h-9 flex items-center justify-center text-[10px] font-bold border transition-all rounded-xs ${
                                selectedSize === size ? 'bg-primary text-white border-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-accent hover:text-accent bg-white'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
            
            <button 
                onClick={resetFilters}
                className="w-full py-3 bg-white border border-gray-200 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 hover:border-red-200 hover:text-red-500 transition-all rounded-xs"
            >
                Reset Filters
            </button>
        </div>
    );

    return (
        <div 
            className="pt-16 sm:pt-20 md:pt-24 min-h-screen animate-fade-in text-primary bg-fixed bg-cover bg-center"
            style={{ backgroundImage: `url(${wearStyleBg})` }}
        >
            <div className="container mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-10">
                <div className="bg-white/90 backdrop-blur-md rounded-sm p-4 sm:p-6 md:p-10 shadow-xl border border-white/60">

                {/* Responsive Toolbar */}
                    <div className="flex flex-col gap-4 mb-6 sm:mb-10 pb-5 sm:pb-6 border-b border-gray-100">
                        {/* Top row: Search + count */}
                        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
                            <div className="relative group flex-1 xs:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search styles..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 text-xs uppercase tracking-widest border border-gray-200 outline-none focus:border-accent bg-white/80 transition-all rounded-xs"
                                />
                                {keyword && (
                                    <button 
                                        onClick={() => setKeyword('')} 
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold xs:border-l xs:border-gray-200 xs:pl-4 whitespace-nowrap self-center">
                                {products.length} Pieces Found
                            </span>
                        </div>

                        {/* Bottom row: Sort + Filter toggle */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold hidden xs:inline">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="border border-gray-200 bg-white px-2.5 py-1.5 rounded-xs text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-accent transition-colors"
                                >
                                    <option value="newest">Initial Launch</option>
                                    <option value="price-asc">Price: Low–High</option>
                                    <option value="price-desc">Price: High–Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-2 text-[10px] uppercase tracking-widest font-bold border rounded-full transition-all duration-300 ${
                                    showFilters 
                                        ? 'bg-primary text-white border-primary shadow-sm' 
                                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary bg-white'
                                }`}
                            >
                                <SlidersHorizontal size={13} /> 
                                <span>{showFilters ? 'Hide Filters' : 'Refine Search'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Layout Area */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                        {/* Desktop Sidebar (Only visible on screens >= lg) */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.aside 
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 260 }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="hidden lg:block flex-shrink-0 overflow-hidden"
                                >
                                    <div className="w-[260px] sticky top-28 bg-[#faf8f5] p-6 rounded-xs border border-gray-100 shadow-xs">
                                        {filterControls}
                                    </div>
                                </motion.aside>
                            )}
                        </AnimatePresence>

                        {/* Mobile & Tablet Drawer Modal (< lg screens) */}
                        <div 
                            className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                                showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <div 
                                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                                onClick={() => setShowFilters(false)}
                            />
                            <aside 
                                className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white text-primary flex flex-col shadow-2xl transition-transform duration-300 ease-out z-10 ${
                                    showFilters ? 'translate-x-0' : 'translate-x-full'
                                }`}
                            >
                                <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#fbf9f6]">
                                    <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-primary flex items-center gap-2">
                                        <SlidersHorizontal size={14} className="text-accent" /> Refine Collection
                                    </h3>
                                    <button 
                                        onClick={() => setShowFilters(false)}
                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-5">
                                    {filterControls}
                                </div>
                                <div className="p-4 border-t border-gray-100 bg-[#fbf9f6]">
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="w-full btn-primary text-center py-3 text-xs"
                                    >
                                        View ({products.length}) Results
                                    </button>
                                </div>
                            </aside>
                        </div>

                        {/* Product Grid Area */}
                        <div className="flex-1 min-w-0">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32">
                                    <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Consulting Archives...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-28 sm:py-36 px-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                        <Search size={28} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-serif mb-2 italic">No matching pieces found.</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-6 font-medium">Refine your criteria or expand the valuation range.</p>
                                    <button 
                                        onClick={resetFilters} 
                                        className="px-8 py-3 bg-primary text-white text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-accent transition-colors rounded-xs"
                                    >
                                        View Full Journal
                                    </button>
                                </div>
                            ) : (
                                /* Responsive Product Grid: 2 cols on all phones, 3 on tablet/iPad, 4 on wide desktops */
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
                                    {products.map((product, i) => (
                                        <ProductCard key={product._id} product={product} index={i} />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && products.length > 0 && totalPages > 1 && (
                                <div className="flex flex-wrap justify-center items-center gap-2 mt-12 sm:mt-16 pb-6 border-t border-gray-100 pt-8">
                                    <button
                                        onClick={() => {
                                            setPage(p => Math.max(1, p - 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={page === 1}
                                        className="px-4 sm:px-6 py-2 border border-gray-200 text-[10px] uppercase tracking-[0.2em] font-bold text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors rounded-xs"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1.5 mx-2 flex-wrap justify-center">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => {
                                                    setPage(i + 1);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] font-bold rounded-xs transition-all ${
                                                    page === i + 1 
                                                        ? 'bg-primary text-white shadow-xs' 
                                                        : 'text-gray-500 hover:bg-gray-100 hover:text-primary'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setPage(p => Math.min(totalPages, p + 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={page === totalPages}
                                        className="px-4 sm:px-6 py-2 border border-gray-200 text-[10px] uppercase tracking-[0.2em] font-bold text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors rounded-xs"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
