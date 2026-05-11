import { Link } from 'react-router-dom';
import { STATIC_CATEGORIES } from '../constants/categories';
import HeroCarousel from '../components/home/HeroCarousel';
import backgroundPic from '../assets/shop-bg.jpeg';
import bridalImg from '../assets/bridal.png';
import fancyImg from '../assets/fancy.png';
import unstitchedImg from '../assets/unstitched.png';
import pretImg from '../assets/pret.png';

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
        <div className="mt-[79px] md:mt-[95px]">
            {/* ── Hero Carousel ────────────────────────────────── */}
            <HeroCarousel />


            {/* ── Category Showcase ──────────────────────────────── */}
            <div className="w-full bg-white py-24 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <p className="text-accent text-[11px] uppercase tracking-[0.4em] mb-4">Discover</p>
                        <h2 className="text-3xl md:text-5xl font-serif text-primary">Shop by Category</h2>
                        <div className="w-16 h-[1px] bg-accent mx-auto mt-6" />
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {displayCategories.map((cat, index) => (
                            <Link 
                                to={`/shop?category=${cat.slug}`} 
                                key={cat._id}
                                className="group relative h-[450px] md:h-[550px] w-full md:w-[calc(33.333%-2rem)] max-w-[400px] overflow-hidden flex items-center justify-center cursor-pointer animate-fade-in-up shadow-lg"
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
