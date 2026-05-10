import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
        title: "New Arrivals",
        subtitle: "The Season's Finest Collection",
        link: "/shop?category=new-arrival",
        color: "text-white"
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=1600&auto=format&fit=crop',
        title: "Unstitched",
        subtitle: "Premium Fabrics & Intricate Designs",
        link: "/shop?category=unstitched",
        color: "text-white"
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1600&auto=format&fit=crop',
        title: "Pret / Stitched",
        subtitle: "Effortless Style for Every Day",
        link: "/shop?category=pret-stitched",
        color: "text-white"
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1518767761162-d5335a54c665?q=80&w=1600&auto=format&fit=crop',
        title: "Fancy Wear",
        subtitle: "Radiate Glamour in Every Step",
        link: "/shop?category=fancy-wear",
        color: "text-white"
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1595776613215-fe04b78de7d0?q=80&w=1600&auto=format&fit=crop',
        title: "Bridal Couture",
        subtitle: "A Royal Legacy for Your Big Day",
        link: "/shop?category=bridal-wear",
        color: "text-white"
    }
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [current]);

    const nextSlide = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.8 },
                scale: { duration: 1.2 }
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.8 }
            }
        })
    };

    if (!slides || slides.length === 0) return null;

    const activeSlide = slides[current] || slides[0];

    return (
        <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-white py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto h-full px-4 relative">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-x-4 inset-y-0 overflow-hidden shadow-2xl rounded-sm"
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center md:bg-[center_top]"
                            style={{ backgroundImage: `url(${activeSlide.image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                        </div>
                        
                        <div className="relative h-full flex flex-col justify-center px-8 md:px-20 max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <p className="text-accent text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 font-bold drop-shadow-md">
                                    {activeSlide.subtitle}
                                </p>
                                <h2 className="text-white text-4xl md:text-6xl font-serif mb-8 tracking-tight leading-tight">
                                    {activeSlide.title}
                                </h2>
                                <Link
                                    to={activeSlide.link}
                                    className="inline-block px-12 py-4 bg-white text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold hover:bg-accent hover:text-white transition-all duration-500 shadow-xl"
                                >
                                    Explore Now
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows - Repositioned inside the container */}
                <button
                    onClick={prevSlide}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-500 backdrop-blur-md hidden md:flex"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/50 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-500 backdrop-blur-md hidden md:flex"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-12 left-8 md:left-24 z-20 flex gap-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > current ? 1 : -1);
                                setCurrent(index);
                            }}
                            className="group flex flex-col items-start gap-2"
                        >
                            <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${index === current ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                                0{index + 1}
                            </span>
                            <div className={`h-[2px] transition-all duration-500 ${index === current ? 'bg-accent w-12' : 'bg-white/20 w-6 group-hover:w-8'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
