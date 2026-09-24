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
        image: banner5,
        link: "/shop",
        title: "Spring Summer Pret",
        subtitle: "Handcrafted Luxury"
    },
    {
        id: 2,
        image: banner1,
        link: "/shop?category=bridal-wear",
        title: "Bridal Couture",
        subtitle: "Timeless Grandeur"
    },
    {
        id: 3,
        image: banner2,
        link: "/shop?category=unstitched",
        title: "Unstitched Luxury",
        subtitle: "Pure Fabric & Craft"
    },
    {
        id: 4,
        image: banner3,
        link: "/shop?category=pret-stitched",
        title: "Ready to Wear",
        subtitle: "Contemporary Grace"
    },
    {
        id: 5,
        image: banner4,
        link: "/shop?category=fancy-wear",
        title: "Festive Fancy Wear",
        subtitle: "Celebratory Splendor"
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

    const handleDragEnd = (e, { offset, velocity }) => {
        const swipeThreshold = 50;
        if (offset.x > swipeThreshold || velocity.x > 500) {
            prevSlide();
        } else if (offset.x < -swipeThreshold || velocity.x < -500) {
            nextSlide();
        }
    };

    const variants = {
        enter: (dir) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 280, damping: 28 },
                opacity: { duration: 0.6 }
            }
        },
        exit: (dir) => ({
            zIndex: 0,
            x: dir < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 280, damping: 28 },
                opacity: { duration: 0.6 }
            }
        })
    };

    if (!slides || slides.length === 0) return null;

    const activeSlide = slides[current] || slides[0];

    return (
        <div className="relative w-full h-[260px] xs:h-[320px] sm:h-[440px] md:h-[520px] lg:h-[600px] xl:h-[660px] overflow-hidden bg-[#fbf9f6] select-none touch-pan-y">
            <div className="max-w-[1600px] mx-auto h-full relative">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            {/* Blurred Ambient Background Layer */}
                            <div 
                                className="absolute inset-0 z-0 opacity-40 blur-2xl md:blur-3xl scale-110 pointer-events-none"
                                style={{ 
                                    backgroundImage: `url(${activeSlide.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                            
                            {/* Main Sharp Image */}
                            <img 
                                src={activeSlide.image} 
                                alt={activeSlide.title || "Banner"}
                                className="relative z-10 w-full h-full object-contain pointer-events-none"
                                draggable="false"
                            />
                        </div>

                        {/* Overlay Controls & Call to Action */}
                        <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 xs:pb-10 sm:pb-12 md:pb-16 z-20 pointer-events-none">
                            {/* Slide Title/Subtitle */}
                            <div className="text-center mb-4 sm:mb-5 px-4">
                                {activeSlide.subtitle && (
                                    <p className="text-white/80 text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-1 font-medium drop-shadow-sm">
                                        {activeSlide.subtitle}
                                    </p>
                                )}
                                {activeSlide.title && (
                                    <h2 className="text-white text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif drop-shadow-md leading-tight">
                                        {activeSlide.title}
                                    </h2>
                                )}
                            </div>
                            <Link
                                to={activeSlide.link || "/shop"}
                                className="pointer-events-auto px-5 xs:px-7 sm:px-10 md:px-12 py-2.5 sm:py-3 md:py-4 bg-white/90 backdrop-blur-md text-primary text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-xl border border-primary/20 hover:scale-105 active:scale-95"
                            >
                                Explore Collection
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Visible and responsive across phones, tablets & desktops) */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-white/60 rounded-full flex items-center justify-center text-primary sm:text-white bg-white/60 sm:bg-black/20 hover:bg-white hover:text-primary transition-all backdrop-blur-md shadow-md hover:scale-110 active:scale-95"
                >
                    <ChevronLeft size={18} className="md:w-6 md:h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-white/60 rounded-full flex items-center justify-center text-primary sm:text-white bg-white/60 sm:bg-black/20 hover:bg-white hover:text-primary transition-all backdrop-blur-md shadow-md hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={18} className="md:w-6 md:h-6" />
                </button>

                {/* Slide Indicators (Dots for touch & visual feedback) */}
                <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2 pointer-events-auto">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > current ? 1 : -1);
                                setCurrent(idx);
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 transition-all duration-300 rounded-full ${
                                current === idx 
                                    ? 'w-6 sm:w-8 bg-accent shadow-xs' 
                                    : 'w-1.5 sm:w-2 bg-black/30 hover:bg-black/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
