import Navbar from './Navbar';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

                    <div className="col-span-1 md:col-span-1">
                        <h3 className="font-serif text-xl tracking-wider mb-6 uppercase">WearStylewithImtisall</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Defining modern elegance and unstitched luxury fashion. Crafted with meticulous attention to detail.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest font-medium mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Unstitched Collections</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ready to Wear</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Bridal Couture</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest font-medium mb-6">Client Care</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest font-medium mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Subscribe to receive updates on new collections and exclusive offers.
                        </p>
                        <form className="flex border-b border-gray-600 pb-2">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="bg-transparent w-full text-sm outline-none placeholder:text-gray-500"
                            />
                            <button type="submit" className="text-sm uppercase tracking-wider hover:text-accent transition-colors">
                                Join
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} WearStylewithImtisall. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">TERMS</a>
                        <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
