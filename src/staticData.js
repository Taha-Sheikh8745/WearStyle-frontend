export const STATIC_CATEGORIES = [
    { _id: 'cat1', name: 'New Arrival', slug: 'new-arrival', showInNavbar: true, order: 1 },
    { _id: 'cat2', name: 'Eid Collection', slug: 'eid-collection', showInNavbar: true, order: 2 },
    { _id: 'cat3', name: 'Pret', slug: 'pret', showInNavbar: true, order: 3 },
    { _id: 'cat4', name: 'Cotton', slug: 'cotton', parent: 'cat3', showInNavbar: true, order: 1 },
    { _id: 'cat5', name: 'Fancy', slug: 'fancy', parent: 'cat3', showInNavbar: true, order: 2 },
];

export const STATIC_PRODUCTS = [
    {
        _id: 'p1',
        title: 'Floral Bloom Unstitched',
        description: 'A delicate floral print on premium lawn fabric, perfect for the upcoming Eid festivities.',
        price: 85,
        comparePrice: 110,
        category: { _id: 'cat1', name: 'New Arrival' },
        images: [{ url: 'https://images.unsplash.com/photo-1550614000-4b95d4662d06?q=80&w=2070' }],
        rating: 4.8,
        numReviews: 45,
        stock: 15,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        isFeatured: true
    },
    {
        _id: 'p2',
        title: 'Crimson Eid Luxury',
        description: 'Deep crimson suit with intricate gold embroidery and a chiffon dupatta.',
        price: 155,
        comparePrice: 195,
        category: { _id: 'cat2', name: 'Eid Collection' },
        images: [{ url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974' }],
        rating: 4.9,
        numReviews: 28,
        stock: 10,
        sizes: ['S', 'M', 'L', 'XL'],
        isFeatured: true
    },
    {
        _id: 'p3',
        title: 'Shadow Black Cotton Pret',
        description: 'Classic black cotton kurta with subtle thread work on the neckline.',
        price: 65,
        comparePrice: 85,
        category: { _id: 'cat4', name: 'Cotton' },
        images: [{ url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070' }],
        rating: 4.7,
        numReviews: 32,
        stock: 20,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        isFeatured: false
    },
    {
        _id: 'p4',
        title: 'Gold Dust Fancy Pret',
        description: 'Luxury fancy wear piece with gold dusting and sequin embellishments.',
        price: 125,
        comparePrice: null,
        category: { _id: 'cat5', name: 'Fancy' },
        images: [{ url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080' }],
        rating: 5.0,
        numReviews: 14,
        stock: 5,
        sizes: ['S', 'M', 'L'],
        isFeatured: true
    },
    {
        _id: 'p5',
        title: 'Mint Green Summer Lawn',
        description: 'Breathable mint green lawn suit, ideal for hot summer days.',
        price: 75,
        comparePrice: 95,
        category: { _id: 'cat1', name: 'New Arrival' },
        images: [{ url: 'https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=2070' }],
        rating: 4.6,
        numReviews: 19,
        stock: 25,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        isFeatured: false
    },
    {
        _id: 'p6',
        title: 'Royal Indigo Eid Special',
        description: 'Regal indigo lawn with heavy embroidery, a standout piece for the Eid collection.',
        price: 175,
        comparePrice: 220,
        category: { _id: 'cat2', name: 'Eid Collection' },
        images: [{ url: 'https://images.unsplash.com/photo-1549439602-43bbcb6d583d?q=80&w=2070' }],
        rating: 4.9,
        numReviews: 12,
        stock: 7,
        sizes: ['S', 'M', 'L'],
        isFeatured: true
    },
    {
        _id: 'p7',
        title: 'Ivory Lace Cotton Pret',
        description: 'Soft ivory cotton with delicate lace inserts, effortless elegance.',
        price: 95,
        comparePrice: 125,
        category: { _id: 'cat4', name: 'Cotton' },
        images: [{ url: 'https://images.unsplash.com/photo-1532332248682-206cc786359f?q=80&w=1978' }],
        rating: 4.8,
        numReviews: 23,
        stock: 12,
        sizes: ['S', 'M', 'L', 'XL'],
        isFeatured: false
    },
    {
        _id: 'p8',
        title: 'Midnight Sparkle Fancy Pret',
        description: 'Show-stopping midnight blue fancy piece with hand-work crystals.',
        price: 210,
        comparePrice: 275,
        category: { _id: 'cat5', name: 'Fancy' },
        images: [{ url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2080' }],
        rating: 5.0,
        numReviews: 8,
        stock: 3,
        sizes: ['S', 'M'],
        isFeatured: true
    }
];

export const STATIC_USER = {
    _id: 'demo-user-123',
    name: 'Demo Account',
    email: 'visitor@noorluxe.com',
    role: 'user'
};
