import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-secondary">
                <ShoppingBag size={60} className="text-gray-300 mb-6" />
                <h1 className="text-3xl font-serif mb-3">Your Cart is Empty</h1>
                <p className="text-gray-500 text-sm mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-secondary">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <h1 className="text-3xl font-serif mb-10">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 flex flex-col gap-0">
                        {/* Header */}
                        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-gray-500 pb-3 border-b border-gray-200 mb-2">
                            <span className="col-span-6">Product</span>
                            <span className="col-span-2 text-center">Price</span>
                            <span className="col-span-2 text-center">Quantity</span>
                            <span className="col-span-2 text-right">Total</span>
                        </div>

                        {cartItems.map((item) => (
                            <div key={`${item._id}-${item.selectedSize}`} className="grid grid-cols-3 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 last:border-0 items-center">
                                {/* Image + Title */}
                                <div className="col-span-2 md:col-span-6 flex gap-4 items-center">
                                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden">
                                        <img src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200'} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <Link to={`/product/${item._id}`} className="text-sm font-medium hover:text-accent transition-colors">{item.title}</Link>
                                        <p className="text-xs text-gray-400 mt-1">Size: {item.selectedSize}</p>
                                        <button onClick={() => removeFromCart(item._id, item.selectedSize)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-2">
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="hidden md:flex md:col-span-2 justify-center">
                                    <span className="text-sm">Rs. {item.price}</span>
                                </div>

                                {/* Quantity */}
                                <div className="col-span-1 md:col-span-2 flex justify-center">
                                    <div className="flex items-center border border-gray-200 bg-white">
                                        <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)} className="px-3 py-1 text-sm hover:bg-gray-50 transition-colors">−</button>
                                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)} className="px-3 py-1 text-sm hover:bg-gray-50 transition-colors">+</button>
                                    </div>
                                </div>

                                {/* Total */}
                                    <span className="text-sm font-medium">Rs. {item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 p-8 sticky top-28">
                            <h2 className="text-lg font-serif mb-6">Order Summary</h2>
                            <div className="flex flex-col gap-3 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">Rs. {cartTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium">Rs. 350</span>
                                </div>
                            </div>
                             <div className="border-t border-gray-100 pt-4 flex justify-between mb-8">
                                <span className="font-medium">Total</span>
                                <span className="font-medium text-lg">
                                    Rs. {Math.round(cartTotal + 350)}
                                </span>
                            </div>
                            <Link to="/checkout" className="btn-primary block text-center w-full">Proceed to Checkout</Link>
                            <Link to="/shop" className="btn-secondary block text-center w-full mt-3">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
