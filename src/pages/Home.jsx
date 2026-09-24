import { Link } from 'react-router-dom';
import { STATIC_CATEGORIES } from '../constants/categories';
import HeroCarousel from '../components/home/HeroCarousel';
import bridalImg from '../assets/bridal.png';
import fancyImg from '../assets/fancy.png';
import unstitchedImg from '../assets/unstitched.png';
import pretImg from '../assets/pret.png';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const categoryImages = {
    'sale': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    'new-arrival': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    'unstitched': unstitchedImg,
    'pret-stitched': pretImg,
    'fancy-wear': fancyImg,
    'bridal-wear': bridalImg
};

// ── Home Page ───────────────────────────────────────────────
const Home = () => {
    const displayCategories = STATIC_CATEGORIES.filter(c => !c.isPage);

    return (
        <div className="mt-[56px] xs:mt-[60px] sm:mt-[68px] md:mt-[76px] lg:mt-[80px] overflow-hidden">
            {/* ── Hero Carousel ────────────────────────────────── */}
            <HeroCarousel />

            {/* ── Value Props Banner (Responsive 1-col on mobile, 2 on tablet, 4 on desktop) ── */}
            <div className="border-y border-gray-100 bg-[#fbf9f6] py-6 sm:py-8 px-4 sm:px-6 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                    <div className="flex flex-col items-center p-2">
                        <Truck size={22} className="text-accent mb-2" />
                        <h4 className="text-[11px] uppercase tracking-widest font-bold">Express Delivery</h4>
                        <p className="text-[10px] text-gray-500 mt-1">Across Pakistan & Worldwide</p>
                    </div>
                    <div className="flex flex-col items-center p-2">
                        <Sparkles size={22} className="text-accent mb-2" />
                        <h4 className="text-[11px] uppercase tracking-widest font-bold">100% Pure Fabric</h4>
                        <p className="text-[10px] text-gray-500 mt-1">Authentic Artisanal Craft</p>
                    </div>
                    <div className="flex flex-col items-center p-2">
                        <ShieldCheck size={22} className="text-accent mb-2" />
                        <h4 className="text-[11px] uppercase tracking-widest font-bold">Secure Payments</h4>
                        <p className="text-[10px] text-gray-500 mt-1">COD & Instant Easypaisa</p>
                    </div>
                    <div className="flex flex-col items-center p-2">
                        <RefreshCw size={22} className="text-accent mb-2" />
                        <h4 className="text-[11px] uppercase tracking-widest font-bold">Bespoke Fitting</h4>
                        <p className="text-[10px] text-gray-500 mt-1">Tailoring Upon Request</p>
                    </div>
                </div>
            </div>

            {/* ── Category Showcase ──────────────────────────────── */}
            <section className="w-full bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14 md:mb-16">
                        <p className="text-accent text-[10px] sm:text-[11px] uppercase tracking-[0.4em] mb-2 sm:mb-3 font-semibold">Discover</p>
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif text-primary">Shop by Category</h2>
                        <div className="w-12 sm:w-16 h-[1px] bg-accent mx-auto mt-4 sm:mt-6" />
                    </div>
                    
                    {/* Responsive Grid: 1 col on tiny phones, 2 cols on xs/tablet, 3 cols on laptop & desktop */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
                        {displayCategories.map((cat, index) => (
                            <Link 
                                to={`/shop?category=${cat.slug}`} 
                                key={cat._id}
                                className="group relative h-[300px] xs:h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] w-full overflow-hidden flex items-center justify-center cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500 rounded-xs"
                            >
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-108"
                                    style={{ backgroundImage: `url('${categoryImages[cat.slug]}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:via-black/35 transition-colors duration-500" />
                                <div className="absolute inset-0 border-[0.5px] border-white/20 m-3 sm:m-4 pointer-events-none transition-all duration-500 group-hover:m-5 sm:group-hover:m-6" />
                                
                                <div className="relative z-10 text-center flex flex-col items-center mt-auto mb-10 sm:mb-14 px-4 w-full">
                                    <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-serif tracking-widest uppercase text-shadow-sm group-hover:-translate-y-1 transition-transform duration-300">
                                        {cat.name}
                                    </h3>
                                <span className="mt-3 flex items-center gap-2 text-white border-b border-white/40 group-hover:border-white text-[9px] sm:text-[10px] uppercase tracking-[0.25em] transition-all duration-300 pb-1 opacity-90 xs:opacity-0 xs:group-hover:opacity-100 xs:transform xs:translate-y-2 xs:group-hover:translate-y-0">
                                        <span>Explore Now</span>
                                        <ArrowRight size={12} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
