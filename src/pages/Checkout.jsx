import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const STEPS = ['Shipping', 'Review', 'Confirmation'];

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [shipping, setShipping] = useState({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        street: '', city: '', state: '', zipCode: '', country: 'Pakistan', phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const shippingCost = cartTotal > 100 ? 0 : 15;
    const tax = cartTotal * 0.05;
    const total = cartTotal + shippingCost + tax;

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(1);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    title: item.title,
                    image: item.images?.[0]?.url,
                    price: item.price,
                    selectedSize: item.selectedSize,
                    quantity: item.quantity
                })),
                shippingAddress: shipping,
                paymentMethod
            };

            const { data } = await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setOrderId(data.order.orderId || data.order._id);
                setOrderPlaced(true);
                clearCart();
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !orderPlaced) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="pt-20 min-h-screen bg-secondary">
            <div className="container mx-auto px-4 md:px-8 py-12 max-w-5xl">
                <h1 className="text-3xl font-serif mb-10">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center gap-0 mb-12">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`flex items-center gap-2 text-sm ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary' : 'border-gray-300 text-gray-400'}`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className="uppercase tracking-wide text-xs hidden md:block">{s}</span>
                            </div>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-[1px] mx-4 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 0: Shipping */}
                        {step === 0 && (
                            <div className="bg-white border border-gray-100 p-8">
                                <h2 className="text-lg font-serif mb-6">Shipping Details</h2>
                                <form onSubmit={handleShippingSubmit} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">Full Name *</label>
                                            <input required value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="Ayesha Khan" />
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">Phone *</label>
                                            <input required value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="+92 300 0000000" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">Street Address *</label>
                                        <input required value={shipping.street} onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="House 12, Street 4, Block B" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">City *</label>
                                            <input required value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="Lahore" />
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">Province</label>
                                            <input value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="Punjab" />
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">ZIP Code *</label>
                                            <input required value={shipping.zipCode} onChange={e => setShipping(s => ({ ...s, zipCode: e.target.value }))} className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors" placeholder="54000" />
                                        </div>
                                    </div>
                                    {/* Payment Method */}
                                    <div className="mt-4">
                                        <h3 className="text-xs uppercase tracking-widest font-medium mb-4">Payment Method</h3>
                                        <div className="flex flex-col gap-3">
                                            {[{ value: 'cod', label: 'Cash on Delivery' }, { value: 'stripe', label: 'Credit / Debit Card (Stripe)' }, { value: 'paypal', label: 'PayPal' }].map(opt => (
                                                <label key={opt.value} className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-primary bg-gray-50' : 'border-gray-200'}`}>
                                                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={e => setPaymentMethod(e.target.value)} className="accent-primary" />
                                                    <span className="text-sm">{opt.label}</span>
                                                    {opt.value !== 'cod' && <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Coming Soon</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary mt-4">Continue to Review</button>
                                </form>
                            </div>
                        )}

                        {/* Step 1: Review */}
                        {step === 1 && (
                            <div className="bg-white border border-gray-100 p-8">
                                <h2 className="text-lg font-serif mb-6">Review Your Order</h2>
                                <div className="mb-6 text-sm text-gray-600 border border-gray-100 p-4 bg-gray-50">
                                    <p className="font-medium mb-1">{shipping.name}</p>
                                    <p>{shipping.street}, {shipping.city}, {shipping.state} {shipping.zipCode}</p>
                                    <p>{shipping.country} | {shipping.phone}</p>
                                    <p className="mt-2 text-gray-400">Payment: <span className="capitalize text-gray-600">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span></p>
                                </div>
                                {cartItems.map(item => (
                                    <div key={`${item._id}-${item.selectedSize}`} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                        <div className="w-16 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                                            <img src={item.images?.[0]?.url || ''} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                {error && (
                                    <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-600 p-4 border-l-4 border-red-500 text-sm">
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => setStep(0)}
                                        disabled={loading}
                                        className="btn-secondary flex-1 disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Confirmation */}
                        {step === 2 && (
                            <div className="bg-white border border-gray-100 p-12 text-center">
                                <CheckCircle size={56} className="text-green-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-serif mb-3">Order Confirmed!</h2>
                                <p className="text-gray-500 text-sm mb-1">Thank you for your order. We'll send you shipping updates.</p>
                                <p className="text-accent text-sm mb-4 font-medium italic">We have sent you confirmation email.</p>
                                <p className="text-xs bg-gray-50 border border-gray-200 px-4 py-2 rounded inline-block mb-8 font-mono">Order ID: {orderId}</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button onClick={() => navigate('/dashboard')} className="btn-secondary">View My Orders</button>
                                    <button onClick={() => navigate('/shop')} className="btn-primary">Continue Shopping</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    {step < 2 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-100 p-6 sticky top-28">
                                <h3 className="text-base font-serif mb-5">Order Summary</h3>
                                <div className="flex flex-col gap-3 text-sm mb-5">
                                    {cartItems.map(item => (
                                        <div key={`${item._id}-${item.selectedSize}`} className="flex justify-between text-gray-600">
                                            <span className="truncate flex-1 mr-2">{item.title} ×{item.quantity}</span>
                                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${tax.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-medium text-base mt-2 pt-3 border-t border-gray-100">
                                        <span>Total</span><span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
