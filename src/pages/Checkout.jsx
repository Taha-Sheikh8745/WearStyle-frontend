import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CheckCircle, AlertCircle, Loader2, Smartphone, Wallet, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const STEPS = ['Shipping', 'Review', 'Confirmation'];

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [shipping, setShipping] = useState({
        name: '',
        email: '',
        street: '', city: '', state: '', zipCode: '', country: 'Pakistan', phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [onlineMethod, setOnlineMethod] = useState('easypaisa');
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const shippingCost = 350;
    const total = cartTotal + shippingCost;

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            const orderItems = cartItems.map(item => ({
                product: item._id,
                title: item.title,
                image: item.images?.[0]?.url,
                price: item.price,
                selectedSize: item.selectedSize,
                quantity: item.quantity
            }));

            const finalPaymentMethod = paymentMethod === 'online' ? onlineMethod : paymentMethod;

            const formData = new FormData();
            formData.append('items', JSON.stringify(orderItems));
            formData.append('shippingAddress', JSON.stringify(shipping));
            formData.append('paymentMethod', finalPaymentMethod);

            if (finalPaymentMethod === 'easypaisa' && paymentScreenshot) {
                formData.append('paymentScreenshot', paymentScreenshot);
            }

            const { data } = await api.post('/api/orders', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                setOrderId(data.order.orderId || data.order._id);
                setOrderPlaced(true);
                clearCart();
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Failed to place order. Please try again.';
            setError(errorMessage);
            console.error('[Checkout Error]:', err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !orderPlaced) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="pt-16 sm:pt-20 md:pt-24 min-h-screen bg-[#faf8f5]">
            <div className="container mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 max-w-5xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6 sm:mb-8 text-primary">Checkout</h1>

                {/* Responsive Stepper */}
                <div className="flex items-center gap-1 mb-8 sm:mb-12 bg-white p-3 sm:p-4 rounded-xs border border-gray-100 shadow-xs">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`flex items-center gap-1.5 sm:gap-2 font-semibold ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all flex-shrink-0 ${
                                    i < step 
                                        ? 'bg-primary border-primary text-white' 
                                        : i === step 
                                            ? 'border-primary text-primary bg-accent/10' 
                                            : 'border-gray-200 text-gray-400'
                                }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className="uppercase tracking-wider text-[10px] xs:text-xs hidden xs:inline font-semibold">{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-[1px] mx-1.5 sm:mx-4 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Order Summary (shows ABOVE form on mobile, hidden on lg) */}
                    {step < 2 && (
                        <div className="lg:hidden bg-white border border-gray-100 p-4 sm:p-5 rounded-xs shadow-xs mb-6">
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <h3 className="text-sm font-serif text-primary">Order Summary</h3>
                                    <span className="text-xs font-bold text-accent font-serif">Rs. {Math.round(cartTotal + 350)?.toLocaleString()}</span>
                                </summary>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 text-xs text-gray-600">
                                    {cartItems.map(item => (
                                        <div key={`${item._id}-${item.selectedSize}`} className="flex justify-between gap-2">
                                            <span className="truncate flex-1">{item.title} ×{item.quantity}</span>
                                            <span className="font-semibold text-primary whitespace-nowrap">Rs. {Math.round(item.price * item.quantity)?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-gray-400 pt-2 border-t border-gray-100">
                                        <span>Shipping</span><span>Rs. 350</span>
                                    </div>
                                </div>
                            </details>
                        </div>
                    )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
                    {/* Main Steps Content */}
                    <div className="lg:col-span-2">
                        {/* Step 0: Shipping */}
                        {step === 0 && (
                            <div className="bg-white border border-gray-100 p-4 sm:p-6 md:p-8 rounded-xs shadow-xs">
                                <h2 className="text-base sm:text-lg font-serif mb-6 pb-2 border-b border-gray-100 text-primary">Shipping Information</h2>
                                
                                <form onSubmit={handleShippingSubmit} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">Full Name *</label>
                                            <input 
                                                required 
                                                value={shipping.name} 
                                                onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} 
                                                className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                                placeholder="Ayesha Khan" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">Email Address *</label>
                                            <input 
                                                required 
                                                type="email" 
                                                value={shipping.email} 
                                                onChange={e => setShipping(s => ({ ...s, email: e.target.value }))} 
                                                className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                                placeholder="ayesha@example.com" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">Phone Number *</label>
                                        <input 
                                            required 
                                            value={shipping.phone} 
                                            onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} 
                                            className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                            placeholder="0300 1234567" 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">Street Address *</label>
                                        <input 
                                            required 
                                            value={shipping.street} 
                                            onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} 
                                            className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                            placeholder="House 12, Street 4, Block B" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">City *</label>
                                            <input 
                                                required 
                                                value={shipping.city} 
                                                onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} 
                                                className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                                placeholder="Lahore" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">Province</label>
                                            <input 
                                                value={shipping.state} 
                                                onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} 
                                                className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                                placeholder="Punjab" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">ZIP Code *</label>
                                            <input 
                                                required 
                                                value={shipping.zipCode} 
                                                onChange={e => setShipping(s => ({ ...s, zipCode: e.target.value }))} 
                                                className="border border-gray-200 w-full p-3 text-sm outline-none focus:border-primary transition-colors rounded-xs" 
                                                placeholder="54000" 
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">Payment Method</h3>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { value: 'cod', label: 'Cash on Delivery (COD)' }, 
                                                { value: 'online', label: 'Online Payment (Easypaisa Direct)' }
                                            ].map(opt => (
                                                <label 
                                                    key={opt.value} 
                                                    className={`flex items-center gap-3 border p-3.5 sm:p-4 cursor-pointer transition-all rounded-xs ${
                                                        paymentMethod === opt.value ? 'border-primary bg-accent/5' : 'border-gray-200 bg-white'
                                                    }`}
                                                >
                                                    <input 
                                                        type="radio" 
                                                        name="payment" 
                                                        value={opt.value} 
                                                        checked={paymentMethod === opt.value} 
                                                        onChange={e => setPaymentMethod(e.target.value)} 
                                                        className="accent-primary w-4 h-4" 
                                                    />
                                                    <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                                                </label>
                                            ))}
                                            
                                            {paymentMethod === 'online' && (
                                                <div className="mt-1 flex flex-col gap-3 p-3.5 sm:p-4 border border-gray-200 bg-[#fbf9f6] rounded-xs">
                                                    <p className="text-xs text-gray-500 font-medium">Selected Provider:</p>
                                                    <div className="max-w-xs">
                                                        <label className={`flex flex-col items-center justify-center gap-2 border p-3 cursor-pointer transition-all rounded-xs ${onlineMethod === 'easypaisa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white'}`}>
                                                            <input type="radio" name="onlinePayment" value="easypaisa" checked={onlineMethod === 'easypaisa'} onChange={e => setOnlineMethod(e.target.value)} className="sr-only" />
                                                            <svg viewBox="0 0 140 36" className="h-7 mb-1">
                                                                <rect width="140" height="36" rx="6" fill="#42B029" />
                                                                <text x="70" y="24" textAnchor="middle" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="18" letterSpacing="-0.5">easypaisa</text>
                                                            </svg>
                                                            <span className="text-xs font-bold">Easypaisa Verified</span>
                                                        </label>
                                                    </div>
                                                    
                                                    {onlineMethod === 'easypaisa' && (
                                                        <div className="mt-2 p-3.5 sm:p-4 border border-green-200 bg-white rounded-xs flex flex-col gap-3">
                                                            <div className="text-xs sm:text-sm text-gray-700">
                                                                <p className="font-semibold text-primary mb-1">Transfer instructions:</p>
                                                                <p className="text-gray-500 text-xs">Please send Rs. {Math.round(total)?.toLocaleString()} to the Easypaisa account:</p>
                                                                <div className="bg-gray-50 p-3 mt-2 rounded border border-gray-200 text-xs font-mono">
                                                                    <p><span className="text-gray-400 mr-2">Number:</span> <span className="font-bold text-sm sm:text-base text-gray-800">03218003319</span></p>
                                                                    <p className="mt-1"><span className="text-gray-400 mr-2">Account Title:</span> <span className="font-bold text-gray-800 uppercase">AMTISAL NASIR</span></p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-1">
                                                                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 block">Upload Payment Screenshot *</label>
                                                                <input 
                                                                    type="file" 
                                                                    accept="image/*"
                                                                    required={onlineMethod === 'easypaisa'}
                                                                    onChange={e => setPaymentScreenshot(e.target.files[0])}
                                                                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors border border-gray-200 rounded p-1 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary mt-4 py-3.5 text-xs">
                                        Continue to Order Review
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 1: Review */}
                        {step === 1 && (
                            <div className="bg-white border border-gray-100 p-4 sm:p-6 md:p-8 rounded-xs shadow-xs">
                                <h2 className="text-base sm:text-lg font-serif mb-6 pb-2 border-b border-gray-100 text-primary">Review Your Order</h2>
                                
                                <div className="mb-6 text-xs sm:text-sm text-gray-600 border border-gray-100 p-4 bg-[#fbf9f6] rounded-xs">
                                    <p className="font-bold text-primary mb-1">{shipping.name}</p>
                                    <p>{shipping.street}, {shipping.city}, {shipping.state} {shipping.zipCode}</p>
                                    <p>{shipping.country} | {shipping.phone} | {shipping.email}</p>
                                    <p className="mt-2 pt-2 border-t border-gray-200/50 text-gray-500">
                                        Payment: <span className="font-semibold text-primary capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'online' ? 'Online Easypaisa' : paymentMethod}</span>
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-100 mb-6">
                                    {cartItems.map(item => (
                                        <div key={`${item._id}-${item.selectedSize}`} className="flex items-center gap-3.5 py-3.5">
                                            <div className="w-14 h-18 flex-shrink-0 overflow-hidden bg-gray-50 rounded-xs border border-gray-100">
                                                <img src={item.images?.[0]?.url || ''} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-primary truncate">{item.title}</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-xs sm:text-sm font-bold font-serif text-primary flex-shrink-0">
                                                Rs. {Math.round(item.price * item.quantity)?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-600 p-4 border-l-4 border-red-500 text-xs sm:text-sm rounded-xs">
                                        <AlertCircle size={18} className="flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <button
                                        onClick={() => setStep(0)}
                                        disabled={loading}
                                        className="btn-secondary flex-1 py-3 text-xs disabled:opacity-50 text-center"
                                    >
                                        Back to Shipping
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="btn-primary flex-1 py-3.5 text-xs flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={15} className="animate-spin" />
                                                Processing Order...
                                            </>
                                        ) : (
                                            'Confirm & Place Order'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Confirmation */}
                        {step === 2 && (
                            <div className="bg-white border border-gray-100 p-8 sm:p-12 text-center rounded-xs shadow-xs">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                                    <CheckCircle size={40} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-serif mb-2 text-primary">Order Confirmed!</h2>
                                <p className="text-gray-500 text-xs sm:text-sm mb-1">Thank you for ordering from WearStylewithImtisall.</p>
                                <p className="text-accent text-xs sm:text-sm mb-4 font-semibold italic">A confirmation summary has been dispatched.</p>
                                <div className="text-xs bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xs inline-block mb-8 font-mono">
                                    Order Reference: <span className="font-bold text-primary">{orderId}</span>
                                </div>
                                <div className="flex justify-center">
                                    <button onClick={() => navigate('/shop')} className="btn-primary py-3.5 px-8 text-xs">
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar (Desktop only — lg+; mobile sees collapsible above) */}
                    {step < 2 && (
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-xs shadow-xs lg:sticky lg:top-28">
                                <h3 className="text-base font-serif mb-4 pb-2 border-b border-gray-100 text-primary">Order Summary</h3>
                                <div className="flex flex-col gap-2.5 text-xs sm:text-sm mb-4 max-h-48 overflow-y-auto pr-1">
                                    {cartItems.map(item => (
                                        <div key={`${item._id}-${item.selectedSize}`} className="flex justify-between text-gray-600 gap-2">
                                            <span className="truncate flex-1">{item.title} ×{item.quantity}</span>
                                            <span className="font-semibold text-primary whitespace-nowrap">Rs. {Math.round(item.price * item.quantity)?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 text-xs sm:text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>Rs. {Math.round(cartTotal)?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span>Rs. {shippingCost}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm sm:text-base mt-2 pt-3 border-t border-gray-100 text-primary">
                                        <span>Total</span>
                                        <span className="font-serif">Rs. {Math.round(total)?.toLocaleString()}</span>
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
