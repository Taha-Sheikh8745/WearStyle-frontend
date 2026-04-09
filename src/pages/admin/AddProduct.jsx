import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Upload, CheckCircle2, AlertCircle, Loader2, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import { getFlattenedCategories } from '../../constants/categories';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Lawn', 'Pret', 'Formal', 'Unstitched', 'Sale'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        sizes: [],
    });

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        const flattened = getFlattenedCategories();
        setCategories(flattened);
        if (flattened.length > 0) {
            setForm(prev => ({ ...prev, category: flattened[0]._id }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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
        if (images.length + files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setImages(prev => [...prev, ...files]);
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'sizes') {
                formData.append(key, JSON.stringify(form[key]));
            } else {
                formData.append(key, form[key]);
            }
        });

        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            setLoading(true);
            const toastId = toast.loading('Crafting your masterpiece...');
            await productService.createProduct(formData);
            toast.success('Creation added to the gallery!', { id: toastId });
            navigate('/admin/products');
        } catch (error) {
            console.error('[AddProduct] Error:', error.response?.data || error.message);
            const msg = error.response?.data?.message || error.message || 'Failed to create product';
            toast.error(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const selectedCatObj = categories.find(c => c._id === form.category);
    const isUnstitched = selectedCatObj?.name?.toLowerCase().includes('unstitched');

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs uppercase tracking-widest font-bold">Back to Catalog</span>
            </button>

            <div className="mb-10">
                <h2 className="text-3xl font-serif text-primary">New Creation</h2>
                <p className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-wider">Add a new exquisite piece to your collection</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Media */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 border border-gray-100 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 block">Product Imagery</label>
                        
                        <div className="relative group">
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                id="image-upload"
                            />
                            <div className="border-2 border-dashed border-gray-100 group-hover:border-accent/40 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all bg-gray-50/30">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-accent mb-4 transition-transform group-hover:scale-110">
                                    <Upload size={20} />
                                </div>
                                <p className="text-xs font-bold text-primary uppercase tracking-wide">Upload Media</p>
                                <p className="text-[10px] text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <AnimatePresence>
                                {previews.map((url, index) => (
                                    <motion.div 
                                        key={url}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden group"
                                    >
                                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {previews.length < 5 && Array(5 - previews.length).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[3/4] border border-dashed border-gray-100 flex items-center justify-center text-gray-200">
                                    <ImageIcon size={16} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-accent/5 p-6 border border-accent/10">
                        <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold mb-3 flex items-center gap-2">
                            <AlertCircle size={14} /> Style Tip
                        </h4>
                        <p className="text-xs text-accent-dark/80 leading-relaxed italic">
                            "High-quality imagery is the soul of NoorLuxe. Ensure your photos are well-lit and capture the intricate details of the fabric."
                        </p>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-8">
                        {/* Title & Description */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Creation Title</label>
                                <input 
                                    required
                                    type="text" 
                                    name="title"
                                    value={form.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Midnight Silk Chikankari Suit"
                                    className="w-full py-4 border-b border-gray-100 outline-none focus:border-accent transition-all text-lg font-serif italic placeholder:text-gray-200"
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
                                    placeholder="Describe the craftsmanship, fabric choice, and the inspiration behind this piece..."
                                    className="w-full py-4 border-b border-gray-100 outline-none focus:border-accent transition-all text-sm leading-relaxed resize-none placeholder:text-gray-200"
                                />
                            </div>
                        </div>

                        {/* Inventory & Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Price (PKR)</label>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 font-medium text-sm">Rs.</span>
                                    <input 
                                        required
                                        type="number" 
                                        name="price"
                                        value={form.price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full pl-8 py-3 border-b border-gray-100 outline-none focus:border-accent transition-all font-bold text-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category</label>
                                <select 
                                    required
                                    name="category"
                                    value={form.category}
                                    onChange={handleInputChange}
                                    className="w-full py-3 border-b border-gray-100 outline-none focus:border-accent transition-all font-medium text-primary appearance-none bg-transparent cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sizes */}
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

                        {/* Actions */}
                        <div className="pt-8 border-t border-gray-50 flex gap-4">
                            <button 
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="flex-1 btn-secondary"
                            >
                                Discard
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex-[2] btn-primary flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        <span>Save Creation</span>
                                    </>
                                )}
                                {loading && (
                                    <motion.div 
                                        className="absolute bottom-0 left-0 h-1 bg-accent/30"
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2 }}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
