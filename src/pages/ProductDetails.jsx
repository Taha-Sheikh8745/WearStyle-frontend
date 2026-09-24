import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import productService from '../services/productService';
import toast from 'react-hot-toast';
import { getCategoryName } from '../constants/categories';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isWishlisted } = useContext(WishlistContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const [currentImage, setCurrentImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    // Review state
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const fetchProduct = async () => {
        try {
            const data = await productService.getProductById(id);
            setProduct(data.product);
            if (data.product?.sizes?.length > 0) {
                setSelectedSize(data.product.sizes[0]);
            }
        } catch (err) {
            console.error('Error fetching product details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            toast.error('Please share your thoughts in a comment.');
            return;
        }

        setReviewLoading(true);
        try {
            await productService.addReview(id, {
                name: reviewName.trim() || 'Anonymous Guest',
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success('Thank you for your review!');
            setReviewComment('');
            setReviewName('');
            setReviewRating(5);
            fetchProduct();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit review';
            toast.error(message);
        } finally {
            setReviewLoading(false);
        }
    };

    const handleAddToCart = () => {
        const hasSizes = product.sizes && product.sizes.length > 0;
        if (hasSizes && !selectedSize) { 
            setSizeError(true); 
            return; 
        }
        setSizeError(false);
        addToCart(product, selectedSize || 'Free Size', qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    if (loading) {
        return (
            <div className="pt-32 sm:pt-40 min-h-screen flex flex-col items-center justify-center px-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Curating Elegance...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-32 sm:pt-40 min-h-screen text-center px-4">
                <h2 className="text-2xl font-serif mb-4">Piece Not Found</h2>
                <p className="text-gray-500 mb-8 text-sm">The collection might have updated. Explore our other pieces.</p>
                <Link to="/shop" className="btn-primary inline-block">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="pt-16 sm:pt-20 md:pt-24 min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-12">
                
                {/* Responsive Breadcrumb */}
                <nav className="text-[11px] sm:text-xs text-gray-400 mb-6 sm:mb-8 uppercase tracking-wide flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1">
                    <Link to="/" className="hover:text-primary transition-colors flex-shrink-0">Home</Link>
                    <span>/</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors flex-shrink-0">
                        {getCategoryName(product.category)}
                    </Link>
                    <span>/</span>
                    <span className="text-primary truncate max-w-[200px] sm:max-w-none">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 xl:gap-20 items-start">
                    
                    {/* Left: Responsive Image Gallery */}
                    <div className="w-full">
                        <div className="relative aspect-[3/4] sm:aspect-[4/5] mb-3 sm:mb-4 overflow-hidden bg-gray-50 rounded-xs shadow-xs">
                            <img
                                src={product.images?.[currentImage]?.url || 'https://via.placeholder.com/800x1000'}
                                alt={product.title}
                                className="w-full h-full object-cover transition-all duration-300"
                            />
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full p-2 sm:p-2.5 shadow-md hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                                        disabled={currentImage === 0}
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.min(product.images.length - 1, i + 1))}
                                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full p-2 sm:p-2.5 shadow-md hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                                        disabled={currentImage === product.images.length - 1}
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails row */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        aria-label={`View photo ${idx + 1}`}
                                        className={`w-14 sm:w-20 aspect-square flex-shrink-0 overflow-hidden border-2 transition-all rounded-xs ${
                                            currentImage === idx ? 'border-primary shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info & Purchasing Actions */}
                    <div className="flex flex-col">
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-accent font-bold mb-2">
                            {getCategoryName(product.category)}
                        </p>
                        
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary mb-3 sm:mb-4">
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={14} fill={s <= Math.round(product.rating || 0) ? '#FBBF24' : 'none'} stroke={s <= Math.round(product.rating || 0) ? '#FBBF24' : '#D1D5DB'} />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                {product.rating || 0} ({product.numReviews || 0} reviews)
                            </span>
                        </div>

                        {/* Price & Savings */}
                        <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 border-b border-gray-100">
                            <span className="text-2xl sm:text-3xl font-bold font-serif text-primary">
                                Rs. {Math.round(product.price)?.toLocaleString()}
                            </span>
                            {product.comparePrice > 0 && (
                                <span className="text-base sm:text-lg text-gray-400 line-through font-mono font-bold">
                                    Rs. {Math.round(product.comparePrice)?.toLocaleString()}
                                </span>
                            )}
                            {product.comparePrice > product.price && (
                                <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 font-bold rounded-xs uppercase tracking-wider">
                                    Save Rs. {Math.round(product.comparePrice - product.price)?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Size Selection */}
                        {(product.sizes && product.sizes.length > 0) && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Select Size</h3>
                                    <button className="text-xs underline text-gray-500 hover:text-primary transition-colors">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex gap-2 sm:gap-2.5 flex-wrap">
                                    {product.sizes?.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                            className={`min-w-[44px] h-11 px-4 flex items-center justify-center border text-xs font-bold transition-all rounded-xs ${
                                                selectedSize === size 
                                                    ? 'bg-primary text-white border-primary shadow-sm' 
                                                    : 'border-gray-200 text-gray-700 hover:border-primary bg-white'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {sizeError && <p className="text-red-500 text-xs mt-2 font-medium">Please select a size to continue.</p>}
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-xs uppercase tracking-widest font-semibold text-primary mb-3">Quantity</h3>
                            <div className="flex items-center border border-gray-200 w-fit rounded-xs bg-white">
                                <button 
                                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                                    className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <span className="px-4 text-sm font-medium min-w-[40px] text-center">{qty}</span>
                                <button 
                                    onClick={() => setQty(q => q + 1)} 
                                    className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions (Touch-friendly & full-width responsive) */}
                        <div className="flex flex-col xs:flex-row gap-3 mb-8 sm:mb-10">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 uppercase tracking-[0.2em] text-xs sm:text-sm font-bold transition-all duration-300 rounded-xs shadow-md active:scale-98 ${
                                    addedToCart ? 'bg-green-600 text-white' : 'btn-primary'
                                }`}
                            >
                                <ShoppingBag size={18} />
                                <span>{addedToCart ? 'Added to Bag!' : 'Add to Shopping Bag'}</span>
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                aria-label="Toggle Wishlist"
                                className={`xs:w-14 w-full h-12 xs:h-auto flex items-center justify-center gap-2 xs:gap-0 border transition-all duration-300 rounded-xs shadow-xs ${
                                    isWishlisted(product._id) 
                                        ? 'border-red-400 text-red-500 bg-red-50' 
                                        : 'border-gray-200 text-gray-600 hover:border-primary bg-white'
                                }`}
                            >
                                <Heart size={20} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
                                <span className="xs:hidden text-xs font-semibold uppercase tracking-widest ml-1">
                                    {isWishlisted(product._id) ? 'Wishlisted' : 'Add to Wishlist'}
                                </span>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-100 pt-6 sm:pt-8">
                            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-primary mb-3">Description & Artisanal Details</h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-14 sm:mt-20 border-t border-gray-100 pt-10 sm:pt-14">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                        
                        {/* List of Reviews */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl sm:text-2xl font-serif mb-6 sm:mb-8 text-primary">Client Reflections</h2>
                            {!product.reviews || product.reviews.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No reviews yet for this piece. Be the first to share your thoughts.</p>
                            ) : (
                                <div className="space-y-6">
                                    {product.reviews.map(review => (
                                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm text-primary">{review.name || review.user?.name || 'Anonymous Guest'}</span>
                                                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5 mb-2.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={11} fill={s <= review.rating ? '#FBBF24' : 'none'} stroke={s <= review.rating ? '#FBBF24' : '#D1D5DB'} />
                                                ))}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Leave a Review Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#faf8f5] p-5 sm:p-8 rounded-xs border border-gray-100">
                                <h3 className="text-base sm:text-lg font-serif mb-5 text-primary">Write a Review</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-5">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Your Name</label>
                                        <input
                                            value={reviewName}
                                            onChange={(e) => setReviewName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-white border border-gray-200 p-3 text-sm outline-none focus:border-accent transition-colors rounded-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Your Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="p-1 hover:scale-110 active:scale-95 transition-transform"
                                                    aria-label={`Rate ${star} stars`}
                                                >
                                                    <Star
                                                        size={22}
                                                        fill={star <= reviewRating ? '#FBBF24' : 'none'}
                                                        stroke={star <= reviewRating ? '#FBBF24' : '#D1D5DB'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Your Thoughts</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="What did you love about this piece?"
                                            className="w-full bg-white border border-gray-200 p-3 text-sm outline-none focus:border-accent transition-colors resize-none rounded-xs"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={reviewLoading}
                                        className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
                                    >
                                        {reviewLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
