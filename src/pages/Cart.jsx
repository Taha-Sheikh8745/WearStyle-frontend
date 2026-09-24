import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <div className="pt-24 sm:pt-32 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-secondary">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xs mb-6 border border-gray-200/60">
                    <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-2 text-primary">Your Bag is Empty</h1>
                <p className="text-gray-500 text-xs sm:text-sm mb-8 max-w-sm">Looks like you haven't added any exquisite pieces yet.</p>
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                    <span>Explore Collections</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-16 sm:pt-20 md:pt-24 min-h-screen bg-[#faf8f5]">
            <div className="container mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary">Shopping Bag</h1>
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                        {cartItems.length} {cartItems.length === 1 ? 'Creation' : 'Creations'} Selected
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-xs border border-gray-100 shadow-xs">
                        
                        {/* Desktop Table Header */}
                        <div className="hidden md:grid grid-cols-12 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 pb-4 border-b border-gray-100">
                            <span className="col-span-6">Creation</span>
                            <span className="col-span-2 text-center">Unit Price</span>
                            <span className="col-span-2 text-center">Quantity</span>
                            <span className="col-span-2 text-right">Subtotal</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={`${item._id}-${item.selectedSize}`} className="py-5 sm:py-6">
                                    
                                    {/* Desktop Row View (>= md) */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                        {/* Image + Title */}
                                        <div className="col-span-6 flex gap-4 items-center">
                                            <div className="w-18 h-24 flex-shrink-0 overflow-hidden bg-gray-50 rounded-xs border border-gray-100">
                                                <img 
                                                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200'} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div>
                                                <Link to={`/product/${item._id}`} className="text-sm font-semibold text-primary hover:text-accent transition-colors line-clamp-1">
                                                    {item.title}
                                                </Link>
                                                <p className="text-xs text-gray-400 mt-1">Size: <span className="font-semibold text-primary">{item.selectedSize}</span></p>
                                                <button 
                                                    onClick={() => removeFromCart(item._id, item.selectedSize)} 
                                                    className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors mt-2"
                                                >
                                                    <Trash2 size={12} /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2 text-center">
                                            <span className="text-sm font-semibold text-primary">Rs. {Math.round(item.price)?.toLocaleString()}</span>
                                            {item.comparePrice > item.price && (
                                                <p className="text-[10px] text-gray-400 line-through">Rs. {Math.round(item.comparePrice)?.toLocaleString()}</p>
                                            )}
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center border border-gray-200 rounded-xs bg-white">
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)} 
                                                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-50 text-gray-600 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)} 
                                                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-50 text-gray-600 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-2 text-right">
                                            <span className="text-sm font-bold font-serif text-primary">
                                                Rs. {Math.round(item.price * item.quantity)?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile & Tablet Card View (< md) */}
                                    <div className="md:hidden flex gap-3.5 sm:gap-4 items-start">
                                        <div className="w-20 sm:w-24 aspect-[3/4] flex-shrink-0 overflow-hidden bg-gray-50 rounded-xs border border-gray-100">
                                            <img 
                                                src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200'} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <Link to={`/product/${item._id}`} className="text-xs sm:text-sm font-semibold text-primary hover:text-accent transition-colors line-clamp-1">
                                                        {item.title}
                                                    </Link>
                                                    <button 
                                                        onClick={() => removeFromCart(item._id, item.selectedSize)} 
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-gray-500 mt-0.5">Size: <span className="font-semibold text-primary">{item.selectedSize}</span></p>
                                                <p className="text-xs font-semibold text-accent mt-1">Rs. {Math.round(item.price)?.toLocaleString()}</p>
                                            </div>

                                            {/* Quantity and Line Total */}
                                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                                <div className="flex items-center border border-gray-200 rounded-xs bg-white">
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)} 
                                                        className="w-7 h-7 flex items-center justify-center text-xs hover:bg-gray-50 text-gray-600"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)} 
                                                        className="w-7 h-7 flex items-center justify-center text-xs hover:bg-gray-50 text-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className="text-sm font-bold font-serif text-primary">
                                                    Rs. {Math.round(item.price * item.quantity)?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 p-5 sm:p-8 rounded-xs shadow-xs lg:sticky lg:top-28">
                            <h2 className="text-lg font-serif mb-6 pb-3 border-b border-gray-100 text-primary">Order Summary</h2>
                            
                            <div className="flex flex-col gap-3 mb-6 text-xs sm:text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Bag Subtotal</span>
                                    <span className="font-medium text-primary">Rs. {Math.round(cartTotal)?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Flat Rate Shipping</span>
                                    <span className="font-medium text-primary">Rs. 350</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                                <span className="font-bold text-sm text-primary">Estimated Total</span>
                                <span className="font-bold text-lg sm:text-xl font-serif text-primary">
                                    Rs. {Math.round(cartTotal + 350)?.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <Link to="/checkout" className="btn-primary block text-center w-full py-3.5 text-xs">
                                    Proceed to Checkout
                                </Link>
                                <Link to="/shop" className="btn-secondary block text-center w-full py-3 text-xs">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
