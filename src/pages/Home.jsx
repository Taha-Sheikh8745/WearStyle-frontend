import { Link } from 'react-router-dom';
import { STATIC_CATEGORIES } from '../constants/categories';

const categoryImages = {
    'new-arrival': 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
    'unstitched': 'https://images.unsplash.com/photo-1550614000-4b95d4edaa3f?q=80&w=800&auto=format&fit=crop',
    'pret-stitched': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
};

// ── Home Page ───────────────────────────────────────────────
const Home = () => {
    const displayCategories = STATIC_CATEGORIES.filter(c => !c.isPage);

    return (
        <div>
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
                    <Link
                        to="/shop"
                        className="mt-8 px-10 py-4 border border-white/50 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 animate-fade-in-up delay-300 backdrop-blur-sm"
                        style={{ animationFillMode: 'both' }}
                    >
                        Explore All
                    </Link>
                </div>
            </div>

            {/* ── Category Showcase ──────────────────────────────── */}
            <div className="w-full bg-white py-24 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <p className="text-accent text-[11px] uppercase tracking-[0.4em] mb-4">Discover</p>
                        <h2 className="text-3xl md:text-5xl font-serif text-primary">Shop by Category</h2>
                        <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {displayCategories.map((cat, index) => (
                            <Link 
                                to={`/shop?category=${cat.slug}`} 
                                key={cat._id}
                                className="group relative h-[450px] md:h-[550px] overflow-hidden flex items-center justify-center cursor-pointer animate-fade-in-up shadow-lg"
                                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                            >
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-110"
                                    style={{ backgroundImage: `url('${categoryImages[cat.slug]}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:via-black/40 transition-colors duration-500" />
                                <div className="absolute inset-0 border-[0.5px] border-white/20 m-4 pointer-events-none transition-all duration-500 group-hover:m-6" />
                                
                                <div className="relative z-10 text-center flex flex-col items-center mt-auto mb-16 px-6">
                                    <h3 className="text-white text-3xl font-serif tracking-widest uppercase text-shadow-sm group-hover:-translate-y-2 transition-transform duration-500">
                                        {cat.name}
                                    </h3>
                                    <span className="mt-4 flex items-center gap-2 text-white border-b border-transparent group-hover:border-white/50 text-[10px] uppercase tracking-[0.25em] transition-all duration-500 pb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                                        Explore Now 
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
