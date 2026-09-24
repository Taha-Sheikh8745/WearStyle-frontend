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
    const [status, setStatus] = useState(null);

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
        <div className="pt-16 sm:pt-20 md:pt-24 min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-secondary py-10 sm:py-16 mb-8 sm:mb-16 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-accent text-[10px] sm:text-[11px] uppercase tracking-[0.4em] mb-3 font-semibold">Connect With Us</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 uppercase text-primary">Contact Our Concierge</h1>
                    <div className="w-12 sm:w-16 h-[1px] bg-accent mx-auto" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-20 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">
                    
                    {/* Left: Contact Info */}
                    <div className="space-y-8 sm:space-y-12">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-serif mb-4 sm:mb-6 flex items-center gap-3 text-primary">
                                <span className="w-6 sm:w-8 h-[1px] bg-accent" />
                                Get In Touch
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-md">
                                Have a question about our collections or need assistance with your order? 
                                Our customer service team is here to assist you with bespoke Pakistani fashion inquiries.
                            </p>
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            <div className="flex items-start gap-4 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center text-accent flex-shrink-0 shadow-xs">
                                    <Mail size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mb-1">Email Us</h4>
                                    <a href="mailto:Imtinas23@gmail.com" className="text-gray-500 hover:text-accent text-xs sm:text-sm transition-colors">
                                        Imtinas23@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center text-accent flex-shrink-0 shadow-xs">
                                    <Phone size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mb-1">Call & WhatsApp</h4>
                                    <a href="tel:03218003319" className="text-gray-500 hover:text-accent text-xs sm:text-sm transition-colors">
                                        0321 8003319
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Quote */}
                        <div className="pt-6 sm:pt-8 border-t border-gray-100">
                            <p className="italic text-gray-400 text-xs sm:text-sm font-serif">
                                "Elegance is not standing out, but being remembered."
                            </p>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-white p-5 sm:p-8 md:p-12 shadow-xl shadow-gray-100 border border-gray-100 relative rounded-xs">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 block">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-[#fbf9f6] border border-gray-200/70 px-3.5 py-3 text-sm focus:border-accent focus:bg-white outline-none transition-all rounded-xs"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 block">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#fbf9f6] border border-gray-200/70 px-3.5 py-3 text-sm focus:border-accent focus:bg-white outline-none transition-all rounded-xs"
                                        placeholder="Your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 block">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-[#fbf9f6] border border-gray-200/70 px-3.5 py-3 text-sm focus:border-accent focus:bg-white outline-none transition-all rounded-xs"
                                    placeholder="Order inquiry / Styling advice"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 block">Message *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-[#fbf9f6] border border-gray-200/70 px-3.5 py-3 text-sm focus:border-accent focus:bg-white outline-none transition-all resize-none rounded-xs"
                                    placeholder="Write your thoughts or questions here..."
                                ></textarea>
                            </div>

                            {status && (
                                <div className={`p-3.5 text-xs sm:text-sm rounded-xs ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {status.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 sm:py-4 text-xs tracking-[0.25em] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Sending Message...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send size={13} />
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
