import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/new.jpg';
import { useState, useContext, useEffect } from 'react';
import { STATIC_CATEGORIES } from '../../constants/categories';


const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState(STATIC_CATEGORIES);
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    // Transparent nav on home top, white bg fully when scrolling or on other pages
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on initial load
        return () => window.removeEventListener('scroll', handleScroll);
    }, [user]); // Re-fetch on login/logout

    const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${isScrolled || !isHome || isMobileMenuOpen
        ? 'bg-white text-primary shadow-sm py-4'
        : 'bg-transparent text-white py-6'
        }`;

    const linkClasses = `nav-link ${isScrolled || !isHome || isMobileMenuOpen ? 'after:bg-primary' : 'after:bg-white'
        }`;



    return (
        <nav className={navbarClasses}>
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo (Left) */}
                <Link to="/" className="flex-none items-center hidden md:flex">
                    <img src={logo} alt="WearStylewithImtisall" className="h-8 md:h-10 object-contain" />
                </Link>

                {/* Mobile Logo (Center on mobile only) */}
                <Link to="/" className="md:hidden flex-1 flex justify-center items-center">
                    <img src={logo} alt="WearStylewithImtisall" className="h-8 object-contain" />
                </Link>

                {/* Desktop Nav Links (Center) */}
                <div className="hidden md:flex gap-6 lg:gap-8 justify-center flex-1 items-center">
                    {categories.map(cat => (
                        cat.children && cat.children.length > 0 ? (
                            <div key={cat._id} className="relative group/dropdown py-2">
                                <Link to={`/shop?category=${cat.slug}`} className={`${linkClasses} flex items-center gap-1 whitespace-nowrap`}>
                                    {cat.name}
                                    <svg className="w-3 h-3 transition-transform group-hover/dropdown:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                                <div className="absolute top-full left-0 w-48 bg-white shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform translate-y-2 group-hover/dropdown:translate-y-0 border border-gray-50 py-2 z-50">
                                    {cat.children.map(child => (
                                        <Link
                                            key={child._id}
                                            to={`/shop?category=${child.slug}`}
                                            className="block px-6 py-2.5 text-[10px] uppercase tracking-widest text-gray-600 hover:bg-secondary hover:text-accent transition-colors"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link key={cat._id} to={cat.isPage ? `/${cat.slug}` : `/shop?category=${cat.slug}`} className={`${linkClasses} whitespace-nowrap text-center`}>
                                {cat.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Icons (Right) */}
                <div className="flex justify-end gap-4 md:gap-6 flex-none md:flex-1 items-center">
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="text-[10px] uppercase tracking-widest font-medium text-accent hover:opacity-70 transition-opacity hidden md:block">
                            Admin Panel
                        </Link>
                    )}
                    <Link to={user ? '/dashboard' : '/login'} className="hover:opacity-70 transition-opacity hidden md:block">
                        <User size={20} />
                    </Link>
                    <Link to="/cart" className="hover:opacity-70 transition-opacity relative">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white text-primary flex-col border-t border-gray-100 transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-[80vh] overflow-y-auto border-b' : 'max-h-0 border-transparent'}`}>
                <div className="px-4 py-6 flex flex-col gap-4">
                    {categories.map(cat => (
                        <div key={cat._id} className="flex flex-col gap-2 border-b border-gray-50 pb-2">
                            {cat.children && cat.children.length > 0 ? (
                                <>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent mb-1">{cat.name}</span>
                                    {cat.children.map(child => (
                                        <Link
                                            key={child._id}
                                            to={`/shop?category=${child.slug}`}
                                            className="text-[10px] uppercase tracking-widest pl-4 py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </>
                            ) : (
                                <Link
                                    to={cat.isPage ? `/${cat.slug}` : `/shop?category=${cat.slug}`}
                                    className="text-[10px] uppercase tracking-widest py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                            )}
                        </div>
                    ))}

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="text-[10px] uppercase tracking-widest py-2 border-b border-gray-50 text-accent font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                            Admin Panel
                        </Link>
                    )}
                    <Link to={user ? '/dashboard' : '/login'} className="text-[10px] uppercase tracking-widest py-2 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <User size={16} /> Account
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
