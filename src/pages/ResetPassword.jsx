import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        setLoading(true);

        try {
            const { data } = await api.post('/api/auth/reset-password', {
                email,
                otp,
                password
            });
            setSuccess(data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen flex items-center justify-center bg-secondary px-6 pb-16">
            <div className="w-full max-w-md">
                <Link to="/" className="font-serif text-2xl tracking-widest mb-10 block text-center uppercase">WearStylewithImtisall</Link>

                <div className="bg-white border border-gray-100 p-10 shadow-sm animate-scale-in">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="text-primary" size={28} />
                        </div>
                        <h2 className="text-2xl font-serif mb-2">Reset Password</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                            Please enter the 6-digit code sent to your email <br />
                            along with your new password.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 text-red-600 text-[10px] uppercase tracking-wider font-medium px-4 py-3 mb-6 rounded-r">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-400 text-green-600 text-[10px] uppercase tracking-wider font-medium px-4 py-3 mb-6 rounded-r">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all rounded-none bg-secondary/10 text-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Verification Code</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="border border-gray-200 w-full pl-12 pr-5 py-3.5 text-lg font-serif tracking-[0.3em] outline-none focus:border-accent transition-all rounded-none bg-secondary/10 text-primary"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all pr-12 rounded-none bg-secondary/10 text-primary"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block font-bold">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border border-gray-200 w-full px-5 py-3.5 text-sm outline-none focus:border-accent transition-all rounded-none bg-secondary/10 text-primary"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary w-full flex items-center justify-center gap-3 py-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="text-[10px] text-gray-400 hover:text-accent transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                ← Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
