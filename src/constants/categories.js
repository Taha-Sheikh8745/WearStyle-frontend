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
            { _id: 'u-summer', name: 'Summer wear', slug: 'summer-wear' },
            { _id: 'u-winter', name: 'Winter wear', slug: 'winter-wear' },
            { _id: 'u-eid', name: 'Eid collection', slug: 'eid-collection' },
            { _id: 'u-solids', name: 'solids', slug: 'solids' },
            { _id: 'u-all', name: 'shop all', slug: 'unstitched' }
        ]
    },
    {
        _id: 'pret-stitched',
        name: 'Pret/Stitched',
        slug: 'pret-stitched',
        children: [
            { _id: 'p-winter', name: 'Winter wear', slug: 'winter-wear' },
            { _id: 'p-summer', name: 'Summer wear', slug: 'summer-wear' }
        ]
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
