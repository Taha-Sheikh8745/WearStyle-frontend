import { Link } from 'react-router-dom';
import logo from '../../assets/logo_v2.png';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-10 sm:pt-14 pb-6 sm:pb-8 border-t border-gray-900">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-10 sm:mb-12">

                    {/* Brand — spans full width on mobile, 2 cols on sm */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-block mb-4">
                            <img src={logo} alt="WearStyle" className="h-14 sm:h-18 object-contain brightness-110" />
                        </Link>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xs sm:max-w-sm mb-4">
                            Defining modern elegance and unstitched luxury fashion. Crafted with meticulous attention to Pakistani artisanal detail.
                        </p>
                    </div>

                    {/* Shop Collections */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] font-semibold mb-3 sm:mb-4 text-accent">Collections</h4>
                        <ul className="space-y-2 sm:space-y-2.5 text-xs text-gray-400">
                            <li><Link to="/shop?category=new-arrival" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop?category=unstitched" className="hover:text-white transition-colors">Unstitched Collections</Link></li>
                            <li><Link to="/shop?category=pret-stitched" className="hover:text-white transition-colors">Ready to Wear</Link></li>
                            <li><Link to="/shop?category=bridal-wear" className="hover:text-white transition-colors">Bridal Couture</Link></li>
                            <li><Link to="/shop?category=sale" className="hover:text-accent transition-colors font-medium">Seasonal Sale</Link></li>
                        </ul>
                    </div>

                    {/* Client Care */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] font-semibold mb-3 sm:mb-4 text-accent">Client Care</h4>
                        <ul className="space-y-2 sm:space-y-2.5 text-xs text-gray-400">
                            <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact Our Concierge</Link></li>
                            <li><Link to="/cart" className="hover:text-white transition-colors">Your Shopping Bag</Link></li>
                            <li>
                                <a href="tel:03218003319" className="text-gray-500 hover:text-white transition-colors">
                                    Phone: 0321 8003319
                                </a>
                            </li>
                            <li>
                                <a href="mailto:Imtinas23@gmail.com" className="text-gray-500 hover:text-white transition-colors break-all">
                                    Imtinas23@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter — spans full width on mobile */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                        <h4 className="text-xs uppercase tracking-[0.25em] font-semibold mb-3 sm:mb-4 text-accent">Newsletter</h4>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">
                            Subscribe to receive previews of new launches and private bespoke showcases.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-gray-700 pb-2 focus-within:border-accent transition-colors max-w-xs">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="bg-transparent w-full text-xs outline-none placeholder:text-gray-500 text-white"
                            />
                            <button type="submit" className="text-xs uppercase tracking-wider text-accent font-medium hover:text-white transition-colors ml-2 flex-none">
                                Join
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-5 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-gray-500 tracking-wider">
                    <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} WearStylewithImtisall. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-5 sm:gap-6">
                        <Link to="/contact-us" className="hover:text-white transition-colors">TERMS</Link>
                        <Link to="/contact-us" className="hover:text-white transition-colors">PRIVACY</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
