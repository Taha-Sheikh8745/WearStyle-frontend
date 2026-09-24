import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown, Phone, Mail, ArrowRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import logo from '../../assets/logo_v2.png';
import { useState, useContext, useEffect } from 'react';
import { STATIC_CATEGORIES } from '../../constants/categories';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [categories] = useState(STATIC_CATEGORIES);
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useContext(CartContext);

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleSubmenu = (catId) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled || !isHome
            ? 'bg-white/95 backdrop-blur-md text-primary shadow-sm py-2 sm:py-2.5'
            : 'bg-white/80 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none text-primary py-3 md:py-4'
    }`;

    const linkClasses = `nav-link text-xs uppercase tracking-widest font-medium relative whitespace-nowrap ${
        isScrolled || !isHome ? 'after:bg-primary' : 'after:bg-primary'
    }`;

    return (
        <>
            <nav className={navbarClasses}>
                <div className="container mx-auto px-3 sm:px-6 md:px-8 flex justify-between items-center">

                    {/* Mobile/Tablet Menu Button (Visible < lg, including iPads portrait) */}
                    <div className="flex items-center lg:hidden flex-none">
                        <button
                            type="button"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            className="p-2 -ml-2 text-primary hover:text-accent transition-colors focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Desktop Logo (Left aligned on lg+) */}
                    <Link to="/" className="hidden lg:flex flex-none items-center py-1">
                        <img 
                            src={logo} 
                            alt="WearStylewithImtisall" 
                            className="h-12 xl:h-15 object-contain transition-all" 
                        />
                    </Link>

                    {/* Mobile/Tablet Logo (Centered on screens < lg) */}
                    <Link to="/" className="lg:hidden flex flex-1 justify-center items-center py-1 px-2">
                        <img 
                            src={logo} 
                            alt="WearStylewithImtisall" 
                            className="h-9 xs:h-11 sm:h-12 object-contain" 
                        />
                    </Link>

                    {/* Desktop Navigation Links (Visible on lg+, 1024px+) */}
                    <div className="hidden lg:flex gap-4 xl:gap-8 justify-center flex-1 items-center px-4">
                        {categories.map(cat => (
                            cat.children && cat.children.length > 0 ? (
                                <div key={cat._id} className="relative group/dropdown py-2">
                                    <div className={`${linkClasses} flex items-center gap-1 cursor-pointer`}>
                                        <span>{cat.name}</span>
                                        <ChevronDown size={12} className="transition-transform duration-300 group-hover/dropdown:rotate-180" />
                                    </div>
                                    <div className="absolute top-full left-0 min-w-[200px] bg-white shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 transform translate-y-2 group-hover/dropdown:translate-y-0 border border-gray-100 py-2 z-50 rounded-sm">
                                        {cat.children.map(child => (
                                            <Link
                                                key={child._id}
                                                to={`/shop?category=${child.slug}`}
                                                className="block px-5 py-2.5 text-[11px] uppercase tracking-widest text-gray-600 hover:bg-secondary hover:text-accent transition-colors"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link 
                                    key={cat._id} 
                                    to={cat.isPage ? `/${cat.slug}` : `/shop?category=${cat.slug}`} 
                                    className={`${linkClasses}`}
                                >
                                    {cat.name}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Right Cart Icon (Accessible with responsive hit area across all devices) */}
                    <div className="flex justify-end items-center flex-none">
                        <Link 
                            to="/cart" 
                            aria-label={`Shopping cart with ${cartCount} items`}
                            className="p-2 -mr-2 hover:opacity-75 transition-opacity relative flex items-center justify-center text-primary"
                        >
                            <ShoppingBag size={22} className="sm:w-6 sm:h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile / Tablet Drawer & Backdrop (Screens < lg, phones + iPads portrait) */}
            <div 
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Dark Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer Container */}
                <aside 
                    className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white text-primary flex flex-col shadow-2xl transition-transform duration-300 ease-out z-10 ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Drawer Header */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#fbf9f6]">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                            <img src={logo} alt="WearStyle" className="h-10 sm:h-12 object-contain" />
                        </Link>
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-200/50 text-gray-500 hover:text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Drawer Links with Accordion */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 divide-y divide-gray-100">
                        <div className="py-2">
                            <Link
                                to="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between py-3 text-xs uppercase tracking-[0.25em] font-semibold text-accent hover:translate-x-1 transition-transform"
                            >
                                <span>Explore All Collections</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="py-3 flex flex-col gap-1">
                            {categories.map(cat => {
                                const hasChildren = cat.children && cat.children.length > 0;
                                const isSubOpen = !!openSubmenus[cat._id];

                                return (
                                    <div key={cat._id} className="py-1">
                                        {hasChildren ? (
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSubmenu(cat._id)}
                                                    className="w-full flex items-center justify-between py-2.5 text-left text-xs uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-accent transition-colors"
                                                >
                                                    <span>{cat.name}</span>
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`text-gray-400 transition-transform duration-200 ${isSubOpen ? 'rotate-180 text-accent' : ''}`} 
                                                    />
                                                </button>

                                                {/* Accordion Submenu */}
                                                <div className={`overflow-hidden transition-all duration-300 ${isSubOpen ? 'max-h-72 opacity-100 my-1' : 'max-h-0 opacity-0'}`}>
                                                    <div className="pl-4 py-1.5 border-l-2 border-accent/30 ml-2 flex flex-col gap-2">
                                                        {cat.children.map(child => (
                                                            <Link
                                                                key={child._id}
                                                                to={`/shop?category=${child.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="py-1.5 text-[11px] uppercase tracking-widest text-gray-500 hover:text-accent transition-colors"
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={cat.isPage ? `/${cat.slug}` : `/shop?category=${cat.slug}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-accent transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Drawer Footer with Quick Support & Cart */}
                    <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#faf8f5] flex flex-col gap-3">
                        <Link 
                            to="/cart" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-center text-xs"
                        >
                            <ShoppingBag size={15} />
                            <span>View Bag ({cartCount})</span>
                        </Link>
                        
                        <div className="pt-2 flex flex-col gap-1.5 text-[11px] text-gray-500 font-sans">
                            <a href="tel:03218003319" className="flex items-center gap-2 hover:text-accent transition-colors">
                                <Phone size={12} className="text-accent" />
                                <span>0321 8003319</span>
                            </a>
                            <a href="mailto:Imtinas23@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                                <Mail size={12} className="text-accent" />
                                <span>Imtinas23@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default Navbar;
