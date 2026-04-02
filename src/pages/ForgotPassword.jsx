import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            console.log('Sending forgot password request for:', email);
            const { data } = await api.post('/api/auth/forgot-password', { email });
            console.log('Forgot password response:', data);
            setSuccess(data.message);
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            console.error('Forgot password error:', err);
            const message = err.response?.data?.message || err.message || 'Something went wrong.';
            setError(message);
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
                            <Mail className="text-primary" size={28} />
                        </div>
                        <h2 className="text-2xl font-serif mb-2">Forgot Password?</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                            Enter your email address below and we'll send you <br />
                            a 6-digit code to reset your password.
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
                                className="border border-gray-200 w-full px-5 py-4 text-sm outline-none focus:border-accent transition-all rounded-none bg-secondary/10 text-primary"
                                placeholder="e.g. name@example.com"
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
                                'Send Reset Code'
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="text-[10px] text-gray-400 hover:text-accent transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                <ArrowLeft size={12} /> Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
