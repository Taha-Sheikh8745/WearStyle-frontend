import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', otp: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isVerifying) {
                const { data } = await axios.post('/api/auth/verify-email', {
                    email: form.email,
                    otp: form.otp
                });
                login(data.user, data.token);
                setSuccess('Email verified successfully!');
                setTimeout(() => navigate(data.user.role === 'admin' ? '/admin' : '/'), 1500);
            } else if (isLogin) {
                const { data } = await axios.post('/api/auth/login', {
                    email: form.email,
                    password: form.password
                });
                login(data.user, data.token);
                navigate(data.user.role === 'admin' ? '/admin' : '/');
            } else {
                if (form.password !== form.confirmPassword) {
                    setError('Passwords do not match.');
                    setLoading(false);
                    return;
                }
                const { data } = await axios.post('/api/auth/register', {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                    confirmPassword: form.confirmPassword
                });
                setSuccess(data.message);
                setIsVerifying(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
            if (err.response?.data?.isVerified === false) {
                setIsVerifying(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/auth/resend-otp', { email: form.email });
            setSuccess(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen flex">
            {/* Left — Decorative Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550614000-4b95d4662d06?q=80&w=2070&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50" />
                <div className="absolute inset-8 border border-white/10" />
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <Link to="/" className="font-serif text-2xl tracking-widest mb-auto uppercase">WearStylewithImtisall</Link>
                    <div>
                        <p className="text-accent text-xs uppercase tracking-[0.25em] mb-3">Welcome Back</p>
                        <h2 className="text-4xl font-serif mb-4 leading-tight">Your gateway to<br />timeless elegance.</h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                            Access your personal curation, track orders, and discover exclusive member offers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center bg-secondary px-6 py-16">
                <div className="w-full max-w-md">
                    <Link to="/" className="font-serif text-2xl tracking-widest mb-10 block text-center lg:hidden uppercase">WearStylewithImtisall</Link>

                    <div className="bg-white border border-gray-100 p-10 shadow-sm animate-scale-in">
                        {!isVerifying && (
                            <div className="flex mb-8 border-b border-gray-100">
                                {['Sign In', 'Create Account'].map((label, i) => (
                                    <button
                                        key={label}
                                        onClick={() => { setIsLogin(i === 0); setError(''); setSuccess(''); }}
                                        className={`flex-1 pb-3 text-xs uppercase tracking-widest transition-all duration-300 ${(i === 0) === isLogin
                                            ? 'border-b-2 border-primary text-primary font-medium -mb-px'
                                            : 'text-gray-400 hover:text-primary'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isVerifying && (
                            <div className="mb-8 text-center">
                                <ShieldCheck className="mx-auto text-primary mb-3" size={40} />
                                <h2 className="text-xl font-serif mb-2">Verify Your Email</h2>
                                <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">
                                    We've sent a 6-digit code to <br />
                                    <strong className="text-primary">{form.email}</strong>
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 text-red-600 text-xs px-4 py-3 mb-6 rounded-r">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-400 text-green-600 text-xs px-4 py-3 mb-6 rounded-r">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {isVerifying ? (
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-1 block font-semibold">Verification Code</label>
                                    <input
                                        type="text" required maxLength={6} minLength={6} value={form.otp}
                                        onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/g, '') }))}
                                        className="border border-gray-200 w-full px-4 py-4 text-center text-3xl font-serif tracking-[0.4em] outline-none focus:border-accent transition-all rounded-none bg-secondary/30 text-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-[10px] text-accent hover:text-accent-dark transition-colors uppercase tracking-[0.2em] font-bold text-center w-full"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {!isLogin && (
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">First Name</label>
                                                <input
                                                    type="text" required={!isLogin} value={form.firstName}
                                                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                                    className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all rounded-none bg-secondary/30 text-primary"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Last Name</label>
                                                <input
                                                    type="text" required={!isLogin} value={form.lastName}
                                                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                                    className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all rounded-none bg-secondary/30 text-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Email Address</label>
                                        <input
                                            type="email" required value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all rounded-none bg-secondary/30 text-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'} required
                                                value={form.password}
                                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                                className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all pr-12 rounded-none bg-secondary/30 text-primary"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {form.password && form.password.length < 6 && (
                                            <p className="text-[10px] text-red-500 uppercase tracking-wider font-medium animate-fade-in">
                                                Password must be at least 6 characters
                                            </p>
                                        )}
                                        {isLogin && (
                                            <div className="flex justify-end mt-1">
                                                <Link
                                                    to="/forgot-password"
                                                    className="text-[10px] uppercase tracking-widest text-accent hover:text-accent-dark font-bold transition-colors"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    {!isLogin && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'} required={!isLogin}
                                                    value={form.confirmPassword}
                                                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                                    className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all pr-12 rounded-none bg-secondary/30 text-primary"
                                                />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors">
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-2 flex flex-col gap-6">
                                <button
                                    type="submit" disabled={loading}
                                    className={`btn-primary w-full flex items-center justify-center gap-3 py-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading
                                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : isVerifying ? 'Verify Securely' : isLogin ? 'Sign In' : 'Create Account'
                                    }
                                </button>

                                {!isVerifying && (
                                    <div className="text-center">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">
                                            {isLogin ? (
                                                <>
                                                    Don't have an account?{' '}
                                                    <button
                                                        type="button"
                                                        onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                                                        className="text-accent hover:text-accent-dark font-bold transition-colors"
                                                    >
                                                        Register
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    Already have an account?{' '}
                                                    <button
                                                        type="button"
                                                        onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                                                        className="text-accent hover:text-accent-dark font-bold transition-colors"
                                                    >
                                                        Sign In
                                                    </button>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {isVerifying && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsVerifying(false); setError(''); setSuccess(''); }}
                                        className="text-[10px] text-gray-400 hover:text-accent transition-colors uppercase tracking-[0.2em] text-center"
                                    >
                                        ← Back to Login
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
