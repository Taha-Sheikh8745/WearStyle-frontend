import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, Upload, CheckCircle2, AlertCircle, Loader2, ChevronLeft, Image as ImageIcon, Sparkles } from 'lucide-react';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import { getFlattenedCategories } from '../../constants/categories';
import { motion, AnimatePresence } from 'framer-motion';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        sizes: [],
    });

    const [isSale, setIsSale] = useState(false);
    const [discountPercent, setDiscountPercent] = useState('');

    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const flattened = getFlattenedCategories();
            setCategories(flattened);

            const productData = await productService.getProductById(id);
            const p = productData.product || productData;
            
            setForm({
                title: p.title,
                description: p.description,
                price: p.price,
                comparePrice: p.comparePrice || '',
                category: p.category?._id || p.category,
                sizes: p.sizes || [],
            });
            setIsSale(p.comparePrice > 0);
            setExistingImages(p.images || []);
        } catch (error) {
            toast.error('Failed to load creation details');
            navigate('/admin-portal-xyz123/products');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const applyDiscount = (percent) => {
        const p = parseFloat(form.comparePrice || form.price);
        if (p && percent) {
            const salePrice = Math.round(p * (1 - percent / 100));
            setForm(prev => ({ 
                ...prev, 
                price: salePrice.toString(),
                comparePrice: prev.comparePrice || prev.price 
            }));
            setDiscountPercent(percent);
        }
    };

    const toggleSize = (size) => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + newFiles.length + files.length > 8) {
            toast.error('Maximum 8 images allowed');
            return;
        }

        setNewFiles(prev => [...prev, ...files]);
        
        const previews = files.map(file => URL.createObjectURL(file));
        setNewPreviews(prev => [...prev, ...previews]);
    };

    const removeNewImage = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Note: Backend currently appends images. To remove existing ones, 
    // we would need to update the backend logic. For now, we'll just show them.
    const removeExistingImage = (index) => {
        // This won't actually remove from DB without backend change, 
        // so we'll just alert or skip for now to avoid confusion.
        toast.error('Direct removal of existing images requires backend adjustments. Only addition is supported currently.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'sizes') {
                formData.append(key, JSON.stringify(form[key]));
            } else {
                formData.append(key, form[key]);
            }
        });

        newFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            setIsSubmitting(true);
            const toastId = toast.loading('Updating the collection...');
            await productService.updateProduct(id, formData);
            toast.success('Creation updated successfully!', { id: toastId });
            navigate('/admin-portal-xyz123/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Retrying archive...</p>
            </div>
        );
    }

    const selectedCatObj = categories.find(c => c._id === form.category);
    const isUnstitched = selectedCatObj?.name?.toLowerCase().includes('unstitched');

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs uppercase tracking-widest font-bold">Return to Catalog</span>
            </button>

            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-primary">Edit Creation</h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-wider">Refine the details of your exquisite piece</p>
                </div>
                <div className="bg-accent/10 px-4 py-2 rounded-full flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles size={14} /> ID: {id.slice(-6)}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Media */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 border border-gray-100 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 block">Current & New Imagery</label>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {existingImages.map((img, index) => (
                                <div key={index} className="relative aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden group">
                                    <img src={img.url} alt="existing" className="w-full h-full object-cover" />
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-accent text-white text-[8px] font-bold rounded uppercase">Active</div>
                                </div>
                            ))}
                            <AnimatePresence>
                                {newPreviews.map((url, index) => (
                                    <motion.div 
                                        key={url}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative aspect-[3/4] bg-gray-50 border border-accent/20 overflow-hidden group"
                                    >
                                        <img src={url} alt="new" className="w-full h-full object-cover opacity-70" />
                                        <button 
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-100"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-gray-900 text-white text-[8px] font-bold rounded uppercase">New</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="relative group">
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                id="image-upload"
                            />
                            <div className="border border-dashed border-gray-200 group-hover:border-accent/40 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all bg-gray-50/30">
                                <Plus size={18} className="text-accent mb-2" />
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wide">Add More Media</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Creation Title</label>
                                <input 
                                    required
                                    type="text" 
                                    name="title"
                                    value={form.title}
                                    onChange={handleInputChange}
                                    className="w-full py-4 border-b border-gray-100 outline-none focus:border-accent transition-all text-lg font-serif italic"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Artisanal Story (Description)</label>
                                <textarea 
                                    required
                                    rows={4}
                                    name="description"
                                    value={form.description}
                                    onChange={handleInputChange}
                                    className="w-full py-4 border-b border-gray-100 outline-none focus:border-accent transition-all text-sm leading-relaxed resize-none"
                                />
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-gray-50/50 p-6 border border-gray-100 space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Pricing & Offers</label>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const newIsSale = !isSale;
                                        setIsSale(newIsSale);
                                        if (!newIsSale) {
                                            setForm(prev => ({ ...prev, comparePrice: '' }));
                                        } else if (!form.comparePrice) {
                                            setForm(prev => ({ ...prev, comparePrice: prev.price }));
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest ${isSale ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                >
                                    <Sparkles size={12} />
                                    {isSale ? 'Sale Active' : 'Enable Sale'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {!isSale ? (
                                    <div className="md:col-span-1">
                                        <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Product Price (PKR)</label>
                                        <div className="relative">
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 font-medium text-sm">Rs.</span>
                                            <input 
                                                required
                                                type="number" 
                                                name="price"
                                                value={form.price}
                                                onChange={handleInputChange}
                                                className="w-full pl-8 py-3 border-b border-gray-200 outline-none focus:border-accent transition-all font-bold text-primary bg-transparent"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Regular Price (Strike)</label>
                                            <div className="relative">
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 font-medium text-sm">Rs.</span>
                                                <input 
                                                    required
                                                    type="number" 
                                                    name="comparePrice"
                                                    value={form.comparePrice}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-8 py-3 border-b border-gray-200 outline-none focus:border-accent transition-all font-medium text-gray-400 italic bg-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Sale Price (Active)</label>
                                            <div className="relative">
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 font-medium text-sm">Rs.</span>
                                                <input 
                                                    required
                                                    type="number" 
                                                    name="price"
                                                    value={form.price}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-8 py-3 border-b border-gray-200 outline-none focus:border-accent transition-all font-bold text-accent bg-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end pb-1">
                                            <div className="flex gap-2">
                                                {[10, 20, 30, 50].map(pct => (
                                                    <button 
                                                        key={pct}
                                                        type="button"
                                                        onClick={() => applyDiscount(pct)}
                                                        className="px-2 py-1 bg-white border border-gray-100 text-[8px] font-bold text-gray-500 hover:border-accent hover:text-accent transition-all rounded"
                                                    >
                                                        -{pct}%
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className={isSale ? 'lg:col-span-3' : 'md:col-span-2'}>
                                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Collection Category</label>
                                    <select 
                                        required
                                        name="category"
                                        value={form.category}
                                        onChange={handleInputChange}
                                        className="w-full py-3 border-b border-gray-200 outline-none focus:border-accent transition-all font-medium text-primary appearance-none bg-transparent cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {!isUnstitched && (
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 block">Tailoring Sizes</label>
                                <div className="flex flex-wrap gap-3">
                                    {SIZES.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`
                                                w-12 h-12 flex items-center justify-center text-[11px] font-bold border transition-all
                                                ${form.sizes.includes(size)
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-black/5'
                                                    : 'border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-gray-50 flex gap-4">
                            <button 
                                type="button"
                                onClick={() => navigate('/admin-portal-xyz123/products')}
                                className="flex-1 btn-secondary"
                            >
                                Discard Changes
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] btn-primary flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        <span>Update Creation</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
