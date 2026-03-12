import { Link } from 'react-router-dom';

// ── Marquee Ticker ──────────────────────────────────────────
const TICKER_ITEMS = [
    '✦ Free Shipping on Orders Over $100',
    '✦ New Chikankari Collection 2026',
    '✦ Handcrafted with Love',
    '✦ Authentic Luxury Fabrics',
    '✦ Easy Returns Within 14 Days',
    '✦ Exclusive Bridal Couture',
];

const MarqueeTicker = () => (
    <div className="bg-primary text-white py-2.5 overflow-hidden">
        <div className="marquee-wrapper">
            <div className="marquee-track">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} className="text-[11px] uppercase tracking-[0.2em] px-8 opacity-90">{item}</span>
                ))}
            </div>
        </div>
    </div>
);

// ── Stats Section ───────────────────────────────────────────
const STATS = [
    { number: '500+', label: 'Luxury Pieces' },
    { number: '10K+', label: 'Happy Clients' },
    { number: '12+', label: 'Years of Craft' },
    { number: '100%', label: 'Authentic Fabric' },
];

const StatsSection = () => (
    <section className="py-16 bg-primary text-white relative overflow-hidden">
        {/* Decorative gold diagonal stripe */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(194,166,122,0.3) 80px, rgba(194,166,122,0.3) 82px)' }}></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                {STATS.map((s, i) => (
                    <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}>
                        <p className="text-gradient text-4xl md:text-5xl font-serif mb-2">{s.number}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── Category Card ───────────────────────────────────────────
const CategoryCard = ({ to, imageUrl, title, height = 'h-[550px]', extra = '' }) => (
    <Link to={to} className={`group block ${height} ${extra} relative overflow-hidden`}>
        <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />
        {/* Animated corner accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center">
            <div className="w-8 h-[1px] bg-accent mb-4 transition-all duration-500 group-hover:w-16" />
            <h3 className="text-white text-xl md:text-2xl font-serif mb-3 tracking-wide">{title}</h3>
            <span className="text-white/0 group-hover:text-white/90 text-[11px] uppercase tracking-[0.25em] transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                Explore Collection →
            </span>
        </div>
    </Link>
);

// ── Product Skeleton Card ───────────────────────────────────
const SkeletonCard = () => (
    <div className="group cursor-pointer product-card">
        <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm">
            <div className="w-full h-full skeleton" />
        </div>
        <div className="text-center space-y-2">
            <div className="h-3 skeleton rounded w-2/3 mx-auto" />
            <div className="h-3 skeleton rounded w-1/3 mx-auto" />
        </div>
    </div>
);

// ── Home Page ───────────────────────────────────────────────
const Home = () => {
    return (
        <div>
            {/* Marquee Ticker */}
            <MarqueeTicker />

            {/* ── Hero ──────────────────────────────────────── */}
            <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Main image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 animate-scale-in"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')" }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

                {/* Decorative lines */}
                <div className="absolute inset-6 md:inset-10 border border-white/10 pointer-events-none" />

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center gap-4">
                    <p className="text-accent text-[11px] uppercase tracking-[0.4em] animate-fade-in-down delay-100" style={{ animationFillMode: 'both' }}>
                        ✦ Spring / Summer 2026 ✦
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-tight animate-fade-in-up delay-200 uppercase"
                        style={{ animationFillMode: 'both', textShadow: '0 4px 40px rgba(0,0,0,0.3)' }}
                    >
                        WearStylewith<br />
                        <em className="not-italic text-gradient">Imtisall</em>
                    </h1>
                    <p
                        className="text-sm md:text-base font-light tracking-widest max-w-md opacity-90 animate-fade-in-up delay-400"
                        style={{ animationFillMode: 'both' }}
                    >
                        Where craftsmanship meets couture
                    </p>
                    <div
                        className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up delay-500"
                        style={{ animationFillMode: 'both' }}
                    >
                        <Link to="/shop?category=new" className="btn-accent px-10 py-4">
                            Shop the Collection
                        </Link>
                        <Link to="/shop" className="glass-card text-white px-10 py-4 uppercase tracking-widest text-xs font-medium hover:bg-white/20 transition-all duration-300">
                            Explore All
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
                    <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent animate-float" />
                </div>
            </div>

            {/* Marquee Brand Text */}
            <div className="py-5 border-y border-gray-100 overflow-hidden bg-cream">
                <div className="marquee-wrapper">
                    <div className="marquee-track" style={{ animationDuration: '20s' }}>
                        {Array(8).fill(0).map((_, i) => (
                            <span key={i} className="text-2xl font-serif text-accent/30 px-8 tracking-widest select-none uppercase">
                                WearStylewithImtisall &nbsp;✦&nbsp;
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Category Grid ─────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-accent text-[11px] uppercase tracking-[0.3em] mb-3">Our World</p>
                        <h2 className="text-4xl md:text-5xl font-serif mb-5">Curated Selections</h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-16 bg-accent/40" />
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <div className="h-[1px] w-16 bg-accent/40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CategoryCard
                            to="/shop?category=unstitched"
                            imageUrl="https://images.unsplash.com/photo-1550614000-4b95d4662d06?q=80&w=2070&auto=format&fit=crop"
                            title="Unstitched"
                            height="h-[600px]"
                        />
                        <div className="flex flex-col gap-4">
                            <CategoryCard
                                to="/shop?category=pret"
                                imageUrl="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop"
                                title="Pret"
                                height="h-[286px]"
                            />
                            <CategoryCard
                                to="/shop?category=lawn"
                                imageUrl="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070&auto=format&fit=crop"
                                title="Lawn"
                                height="h-[286px]"
                            />
                        </div>
                        <CategoryCard
                            to="/shop?category=wedding"
                            imageUrl="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop"
                            title="Bridal Formals"
                            height="h-[600px]"
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────── */}
            <StatsSection />

            {/* ── New Arrivals ───────────────────────────────── */}
            <section className="py-24 bg-secondary">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-14">
                        <div>
                            <p className="text-accent text-[11px] uppercase tracking-[0.3em] mb-3">Just In</p>
                            <h2 className="text-4xl md:text-5xl font-serif mb-3">New Arrivals</h2>
                            <p className="text-gray-400 text-sm max-w-md">The latest additions to our carefully curated collection, crafted for the modern woman.</p>
                        </div>
                        <Link
                            to="/shop?category=new"
                            className="text-xs uppercase tracking-widest mt-6 md:mt-0 flex items-center gap-2 group hover:text-accent transition-colors"
                        >
                            View All Pieces
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    {/* Product Grid (skeleton placeholders) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </section>

            {/* ── Feature Strip ─────────────────────────────── */}
            <section className="py-16 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: '🚚', title: 'Free Shipping', desc: 'On orders above $100' },
                            { icon: '✦', title: 'Authentic Luxury', desc: 'Handpicked premium fabrics' },
                            { icon: '↩', title: 'Easy Returns', desc: '14-day hassle-free policy' },
                            { icon: '🔒', title: 'Secure Payments', desc: 'Stripe & PayPal protected' },
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 group">
                                <span className="text-3xl group-hover:animate-float transition-all">{f.icon}</span>
                                <h4 className="text-xs uppercase tracking-widest font-medium">{f.title}</h4>
                                <p className="text-xs text-gray-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Full-Width CTA Banner ──────────────────────── */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2080&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-6 border border-white/10 pointer-events-none" />
                <div className="relative z-10 text-center text-white px-4">
                    <p className="text-accent text-[11px] uppercase tracking-[0.4em] mb-4">Limited Collection</p>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">Bridal Couture 2026</h2>
                    <p className="text-white/70 text-sm mb-8 max-w-md mx-auto tracking-wide">
                        Timeless bridal elegance crafted for the most important day of your life.
                    </p>
                    <Link to="/shop?category=wedding" className="btn-accent px-12 py-4">
                        Explore Bridal
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
