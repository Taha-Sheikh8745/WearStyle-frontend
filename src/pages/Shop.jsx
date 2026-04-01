import { Link, useSearchParams } from 'react-router-dom';
import { Heart, SlidersHorizontal, X, Star, Loader2 } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';

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
        <div
            className="group product-card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-50 rounded-sm">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800'}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {discount && (
                        <span className="bg-accent text-white text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium">
                            -{discount}%
                        </span>
                    )}
                    {product.rating >= 4.7 && (
                        <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-2 py-0.5">
                            Top Rated
                        </span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${wishlisted ? 'bg-red-50 text-red-500 opacity-100' : 'bg-white text-gray-500 opacity-0 group-hover:opacity-100'} hover:scale-110`}
                >
                    <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

                {/* Quick Add */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                    <button
                        onClick={() => addToCart(product, 'M', 1)}
                        className="w-full bg-primary/95 text-white text-[11px] uppercase tracking-widest py-3.5 hover:bg-accent transition-colors duration-300 backdrop-blur-sm"
                    >
                        + Quick Add (Size M)
                    </button>
                </div>
            </div>

            {/* Info */}
            <Link to={`/product/${product._id}`} className="block text-center group/text">
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] mb-1">{product.category?.name || 'Uncategorized'}</p>
                <h3 className="text-sm font-medium tracking-wide mb-2 group-hover/text:text-accent transition-colors">{product.title}</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <StarRating rating={product.rating || 0} />
                    <span className="text-[10px] text-gray-400">({product.numReviews || 0})</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium">Rs. {product.price}</span>
                    {product.comparePrice && (
                        <span className="text-xs text-gray-400 line-through">Rs. {product.comparePrice}</span>
                    )}
                </div>
            </Link>
        </div>
    );
};

const Shop = () => {
    const [searchParams] = useSearchParams();
    const urlKeyword = searchParams.get('search') || '';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSize, setSelectedSize] = useState('');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [keyword, setKeyword] = useState(urlKeyword);

    useEffect(() => {
        setKeyword(urlKeyword);
    }, [urlKeyword]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catRes = await axios.get('/api/categories');
                const allCats = catRes.data.categories || [];
                setCategories(allCats);

                const urlCat = searchParams.get('category');
                if (urlCat) {
                    const matchedCat = allCats.find(c => c.slug === urlCat || c._id === urlCat);
                    if (matchedCat) setSelectedCategory(matchedCat._id);
                }
            } catch (err) { console.error('Error fetching categories:', err); }
        };
        fetchCategories();
    }, [searchParams]);

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
                const { data } = await axios.get('/api/products', { params });
                setProducts(data.products || []);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, keyword, priceRange, selectedSize, sortBy]);

    const sorted = products; // Sorting is now handled by the backend

    return (
        <div className="pt-20 min-h-screen bg-white">

            <div className="container mx-auto px-4 md:px-8 py-10">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-primary">{sorted.length}</span> pieces found
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary transition-colors rounded-sm"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 text-xs uppercase tracking-wide border px-4 py-2 transition-colors rounded-sm ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}
                        >
                            <SlidersHorizontal size={14} /> Filters
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filter Sidebar */}
                    {showFilters && (
                        <aside className="w-52 flex-shrink-0">
                            <div className="sticky top-24">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-medium uppercase tracking-wide text-xs">Filters</h3>
                                    <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-primary"><X size={14} /></button>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-8">
                                    <h4 className="text-[11px] uppercase tracking-widest mb-4 font-medium text-gray-500">Price Range</h4>
                                    <input type="range" min="0" max="500" value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full accent-accent" />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>Rs. 0</span><span className="font-medium text-primary">Rs. {priceRange[1]}</span>
                                    </div>
                                </div>

                                {/* Size Filter */}
                                <div className="mb-8">
                                    <h4 className="text-[11px] uppercase tracking-widest mb-4 font-medium text-gray-500">Size</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {SIZES.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                                className={`text-[11px] border px-2.5 py-1.5 transition-all duration-200 rounded-sm ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                                <p className="text-sm text-gray-400 uppercase tracking-widest">Loading Collection...</p>
                            </div>
                        ) : sorted.length === 0 ? (
                            <div className="text-center py-32 text-gray-400">
                                <p className="text-4xl mb-4">👗</p>
                                <p className="text-lg mb-2 font-serif">No pieces found.</p>
                                <button onClick={() => { setSelectedCategory('All'); setKeyword(''); setPriceRange([0, 500]); setSelectedSize(''); }} className="text-sm underline hover:text-primary mt-2">Clear all filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sorted.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
