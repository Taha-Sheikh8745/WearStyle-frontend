import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const { data } = await api.post('/api/contact', formData);
            if (data.success) {
                setStatus({ type: 'success', message: 'Your message has been sent successfully!' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            setStatus({ type: 'error', message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-secondary py-16 mb-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-accent text-[11px] uppercase tracking-[0.4em] mb-4">Connect With Us</p>
                    <h1 className="text-4xl md:text-5xl font-serif mb-6 uppercase">Contact Our Team</h1>
                    <div className="w-16 h-[1px] bg-accent mx-auto" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-accent" />
                                Get In Touch
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                Have a question about our collections or need assistance with your order? 
                                Our customer service team is here to help you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-widest font-semibold mb-2">Email Us</h4>
                                    <p className="text-gray-500 text-sm">Imtinas23@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-widest font-semibold mb-2">Call Us</h4>
                                    <p className="text-gray-500 text-sm">03218003319</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Quote */}
                        <div className="pt-8 border-t border-gray-100">
                            <p className="italic text-gray-400 text-sm font-serif">
                                "Elegance is not standing out, but being remembered."
                            </p>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-white p-8 md:p-12 shadow-2xl shadow-gray-100 border border-gray-50 relative animate-fade-in-up">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-secondary border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-secondary border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-secondary border-none px-4 py-3 text-sm focus:ring-1 focus:ring-accent outline-none transition-all"
                                    placeholder="Order related / General inquiry"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-secondary border-none px-4 py-4 text-sm focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            {status && (
                                <div className={`p-4 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {status.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 text-xs uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Submit Message
                                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
