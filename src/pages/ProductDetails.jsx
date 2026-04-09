import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import toast from 'react-hot-toast';
import { getCategoryName } from '../constants/categories';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user: authUser } = useContext(AuthContext);
    const { toggleWishlist, isWishlisted } = useContext(WishlistContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const [currentImage, setCurrentImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    // Review state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const fetchProduct = async () => {
        try {
            const data = await productService.getProductById(id);
            setProduct(data.product);
        } catch (err) {
            console.error('Error fetching product details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchProduct();
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
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success('Thank you for your review!');
            setReviewComment('');
            setReviewRating(5);
            fetchProduct(); // Refresh to show new review and updated average
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit review';
            toast.error(message);
        } finally {
            setReviewLoading(false);
        }
    };

    const handleAddToCart = () => {
        const hasSizes = product.sizes && product.sizes.length > 0;
        if (hasSizes && !selectedSize) { setSizeError(true); return; }
        setSizeError(false);
        addToCart(product, selectedSize, qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    if (loading) {
        return (
            <div className="pt-40 min-h-screen flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Curating Elegance...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-40 min-h-screen text-center">
                <h2 className="text-2xl font-serif mb-4">Piece Not Found</h2>
                <p className="text-gray-500 mb-8">The collection might have updated. Explore our other pieces.</p>
                <Link to="/shop" className="btn-primary">Return to Shop</Link>
            </div>
        );
    }


    return (


        <div className="pt-20 min-h-screen">
            <div className="container mx-auto px-4 md:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 uppercase tracking-wide flex items-center gap-2">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{getCategoryName(product.category)}</Link>
                    <span>/</span>
                    <span className="text-primary">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                    {/* Image Gallery */}
                    <div>
                        <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-gray-50">
                            <img
                                src={product.images?.[currentImage]?.url || 'https://via.placeholder.com/800x1000'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:shadow-md transition-shadow"
                                        disabled={currentImage === 0}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.min(product.images.length - 1, i + 1))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:shadow-md transition-shadow"
                                        disabled={currentImage === product.images.length - 1}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImage(idx)}
                                    className={`w-20 aspect-square overflow-hidden border-2 transition-colors ${currentImage === idx ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{getCategoryName(product.category)}</p>
                        <h1 className="text-3xl md:text-4xl font-serif mb-4">{product.title}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={14} fill={s <= Math.round(product.rating || 0) ? '#FBBF24' : 'none'} stroke={s <= Math.round(product.rating || 0) ? '#FBBF24' : '#D1D5DB'} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{product.rating || 0} ({product.numReviews || 0} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl font-medium">Rs. {Math.round(product.price)}</span>
                            {product.comparePrice > 0 && (
                                <span className="text-lg text-gray-400 line-through">Rs. {Math.round(product.comparePrice)}</span>
                            )}
                            {product.comparePrice > 0 && (
                                <span className="text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                    Save Rs. {Math.round(product.comparePrice - product.price)}
                                </span>
                            )}
                        </div>

                        {/* Size Selection */}
                        {(product.sizes && product.sizes.length > 0) && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs uppercase tracking-widest font-medium">Select Size</h3>
                                    <button className="text-xs underline text-gray-500 hover:text-primary transition-colors">Size Guide</button>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes?.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                            className={`border px-4 py-2 text-sm transition-all duration-200 ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700 hover:border-primary'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {sizeError && <p className="text-red-500 text-xs mt-2">Please select a size to continue.</p>}
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="text-xs uppercase tracking-widest font-medium mb-3">Quantity</h3>
                            <div className="flex items-center border border-gray-200 w-fit">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg hover:bg-gray-50 transition-colors">−</button>
                                <span className="px-5 py-2 text-sm font-medium min-w-[50px] text-center">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-lg hover:bg-gray-50 transition-colors">+</button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 uppercase tracking-widest text-sm font-medium transition-all duration-300 ${addedToCart ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-accent'}`}
                            >
                                <ShoppingBag size={16} />
                                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`border px-5 flex items-center justify-center transition-all duration-300 ${isWishlisted(product._id) ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-300 text-gray-600 hover:border-primary'}`}
                            >
                                <Heart size={16} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-xs uppercase tracking-widest font-medium mb-4">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-20 border-t border-gray-100 pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* List of Reviews */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-serif mb-8">Customer Reviews</h2>
                            {!product.reviews || product.reviews.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No reviews yet for this piece. Be the first to share your thoughts.</p>
                            ) : (
                                <div className="space-y-6">
                                    {product.reviews.map(review => (
                                        <div key={review._id} className="border-b border-gray-50 pb-6 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">{review.name || review.user?.name || 'Anonymous Guest'}</span>
                                                <span className="text-[10px] uppercase tracking-widest text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex gap-0.5 mb-3">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={10} fill={s <= review.rating ? '#FBBF24' : 'none'} stroke={s <= review.rating ? '#FBBF24' : '#D1D5DB'} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed font-light">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Leave a Review Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50/50 p-8 rounded-sm sticky top-28">
                                <h3 className="text-lg font-serif mb-6">Write a Review</h3>
                                {authUser ? (
                                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">Your Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewRating(star)}
                                                        className="transition-transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <Star
                                                            size={20}
                                                            fill={star <= reviewRating ? '#FBBF24' : 'none'}
                                                            stroke={star <= reviewRating ? '#FBBF24' : '#D1D5DB'}
                                                            className={star <= reviewRating ? 'drop-shadow-sm' : ''}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">Your Thoughts</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="What did you love about this piece?"
                                                className="w-full bg-white border border-gray-100 p-4 text-sm outline-none focus:border-accent transition-colors resize-none placeholder:text-gray-300 font-light"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={reviewLoading}
                                            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                                        >
                                            {reviewLoading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                'Submit Review'
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-gray-500 mb-6 italic leading-relaxed">Only our registered guests can share their experiences.</p>
                                        <Link
                                            to="/login"
                                            className="inline-block px-8 py-3 border border-primary text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-white transition-all"
                                        >
                                            Login to Review
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
