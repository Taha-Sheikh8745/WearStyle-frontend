export const STATIC_CATEGORIES = [
    {
        _id: 'new-arrival',
        name: 'New Arrival',
        slug: 'new-arrival',
        children: []
    },
    {
        _id: 'unstitched',
        name: 'Unstitched',
        slug: 'unstitched',
        children: [
            { _id: 'un-summer', name: 'Summer wear', slug: 'unstitched-summer-wear' },
            { _id: 'un-winter', name: 'Winter wear', slug: 'unstitched-winter-wear' },
            { _id: 'un-eid', name: 'Eid collection', slug: 'unstitched-eid-collection' },
            { _id: 'un-solids', name: 'solids', slug: 'unstitched-solids' },
            { _id: 'un-all', name: 'shop all', slug: 'unstitched' }
        ]
    },
    {
        _id: 'pret-stitched',
        name: 'Pret/Stitched',
        slug: 'pret-stitched',
        children: [
            { _id: 'pret-winter', name: 'Winter wear', slug: 'pret-winter-wear' },
            { _id: 'pret-summer', name: 'Summer wear', slug: 'pret-summer-wear' }
        ]
    },
    {
        _id: 'fancy-wear',
        name: 'Fancy Wear',
        slug: 'fancy-wear',
        children: []
    },
    {
        _id: 'bridal-wear',
        name: 'Bridal Wear',
        slug: 'bridal-wear',
        children: []
    },
    {
        _id: 'contact',
        name: 'Contact Us',
        slug: 'contact-us',
        isPage: true
    }
];

// Helper to get flatten list for dropdowns (excluding contact and main categories if they have no products)
export const getFlattenedCategories = () => {
    const list = [];
    STATIC_CATEGORIES.forEach(cat => {
        if (cat.isPage) return;
        
        // Add the category itself
        list.push({ _id: cat.slug, name: cat.name });
        
        // Add children with special labels
        if (cat.children && cat.children.length > 0) {
            cat.children.forEach(child => {
                // Skip the "shop all" as it's redundant for the admin to select
                if (child.slug === cat.slug) return;
                list.push({ _id: child.slug, name: `${cat.name} - ${child.name}` });
            });
        }
    });
    return list;
};

// Helper to get category name by slug/id
export const getCategoryName = (slug) => {
    for (const cat of STATIC_CATEGORIES) {
        if (cat.slug === slug) return cat.name;
        if (cat.children) {
            const child = cat.children.find(c => c.slug === slug);
            if (child) return child.name;
        }
    }
    return slug; // fallback
};
