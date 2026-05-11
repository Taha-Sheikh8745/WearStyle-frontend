import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import local images
import banner1 from '../../assets/banner_1.jpeg';
import banner2 from '../../assets/banner_2.jpeg';
import banner3 from '../../assets/banner_3.jpeg';
import banner4 from '../../assets/banner_4.jpeg';
import banner5 from '../../assets/shop-bg.jpeg';

const slides = [
    {
        id: 1,
        image: banner1,
        link: "/shop?category=bridal-wear",
        showText: false
    },
    {
        id: 2,
        image: banner2,
        link: "/shop?category=unstitched",
        showText: false
    },
    {
        id: 3,
        image: banner3,
        link: "/shop?category=pret",
        showText: false
    },
    {
        id: 4,
        image: banner4,
        link: "/shop?category=fancy-wear",
        showText: false
    },
    {
        id: 5,
        image: banner5,
        link: "/shop",
        showText: false
    }
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 12000); // 12 seconds
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
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.8 }
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.8 }
            }
        })
    };

    if (!slides || slides.length === 0) return null;

    const activeSlide = slides[current] || slides[0];

    return (
        <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden bg-[#fbf9f6] py-0">
            <div className="max-w-[1400px] mx-auto h-full relative">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 overflow-hidden shadow-sm"
                    >
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            {/* Blurred Background Layer */}
                            <div 
                                className="absolute inset-0 z-0 opacity-40 blur-3xl scale-110"
                                style={{ 
                                    backgroundImage: `url(${activeSlide.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                            
                            {/* Main Sharp Image */}
                            <img 
                                src={activeSlide.image} 
                                alt="Banner"
                                className="relative z-10 w-full h-full object-contain"
                            />
                        </div>

                        {/* Centered Explore Button */}
                        <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 md:pb-16 z-20">
                            <Link
                                to="/shop"
                                className="px-8 md:px-12 py-3 md:py-4 bg-white/80 backdrop-blur-md text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold hover:bg-primary hover:text-white transition-all duration-500 shadow-xl border border-primary/20"
                            >
                                Explore Collection
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
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
            </div>
        </div>
    );
};

export default HeroCarousel;
