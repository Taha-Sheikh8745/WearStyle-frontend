import { Link } from 'react-router-dom';



// ── Home Page ───────────────────────────────────────────────
const Home = () => {
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
        </div>
    );
};

export default Home;
