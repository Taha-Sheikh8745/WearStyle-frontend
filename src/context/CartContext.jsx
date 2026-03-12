import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, size = null, qty = 1) => {
        setCartItems(prev => {
            const exists = prev.find(
                item => item._id === product._id && item.selectedSize === size
            );
            if (exists) {
                return prev.map(item =>
                    item._id === product._id && item.selectedSize === size
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prev, { ...product, selectedSize: size, quantity: qty }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prev =>
            prev.filter(item => !(item._id === productId && item.selectedSize === size))
        );
    };

    const updateQuantity = (productId, size, qty) => {
        if (qty <= 0) return removeFromCart(productId, size);
        setCartItems(prev =>
            prev.map(item =>
                item._id === productId && item.selectedSize === size
                    ? { ...item, quantity: qty }
                    : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
        >
            {children}
        </CartContext.Provider>
    );
};
