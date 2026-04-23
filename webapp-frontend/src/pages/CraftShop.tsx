import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCartIcon,
    HeartIcon,
    StarIcon,
    MapPinIcon,
    SearchIcon,
    XIcon,
    CheckIcon,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { getCrafts, getSavedCrafts, addSavedCraft, removeSavedCraft, getCraftById } from '../services/api';

// ── Types ──────────────────────────────────────────────────────
interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    images: string[];
    stock: number;
    isAvailable: boolean;
    artistId?: {
        fullName: string;
        _id: string;
        craftType?: string;
    };
}

const CATEGORIES = ['All', 'Lacquerwork', 'Batik', 'Mask Carving', 'Pottery', 'Handloom', 'Brasswork', 'Wood Carving', 'Jewelry', 'Other'];

// ── Cart Toast ──────────────────────────────────────────────────
function CartToast({ show, name }: { show: boolean; name: string }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 60, scale: 0.9 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#2F5D50] text-white px-5 py-3.5 rounded-2xl shadow-2xl"
                >
                    <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center shrink-0">
                        <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm font-semibold font-body">
                        <span className="text-[#C9A227]">{name}</span> added to cart!
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── Product Card ───────────────────────────────────────────────
function ProductCard({
    product,
    onAddToCart,
    isWished,
    onToggleWish,
}: {
    product: Product;
    onAddToCart: (p: Product) => void;
    isWished: boolean;
    onToggleWish: (id: string) => void;
}) {
    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: 240 }}>
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Wishlist button */}
                <button
                    onClick={() => onToggleWish(product._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                    <HeartIcon
                        className="w-4 h-4 transition-colors duration-200"
                        style={{ color: isWished ? '#E11D48' : '#9CA3AF' }}
                        fill={isWished ? '#E11D48' : 'none'}
                    />
                </button>

                {/* Add to cart hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={() => onAddToCart(product)}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#2F5D50' }}
                    >
                        <ShoppingCartIcon className="w-4 h-4" /> Add to Cart
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
                {/* Category tag */}
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C9A227' }}>
                        {product.category}
                    </span>
                </div>

                <h3
                    className="font-bold text-[#1E1E1E] text-base mb-0.5 leading-snug font-display"
                    style={{ fontFamily: 'Fraunces, serif' }}
                >
                    {product.name}
                </h3>

                {product.artistId && (
                    <Link
                        to={`/artist/${product.artistId._id}`}
                        className="text-xs font-body mb-3 hover:underline transition-colors"
                        style={{ color: '#2F5D50' }}
                    >
                        by {product.artistId.fullName}
                    </Link>
                )}

                {/* Price row */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-lg font-black text-[#2F5D50]" style={{ fontFamily: 'Fraunces, serif' }}>
                            {product.currency === 'USD' ? '$' : 'LKR '}{product.price.toLocaleString()}
                        </span>
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="text-[10px] font-bold text-[#C65D3B] bg-[#FEF0EB] px-2 py-1 rounded-full">
                            Only {product.stock} left
                        </span>
                    )}
                    {!product.isAvailable && (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Unavailable
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── Main Page ──────────────────────────────────────────────────
export function CraftShop() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [cart, setCart] = useState<string[]>([]);
    const [toastProduct, setToastProduct] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        loadCrafts();
        loadSavedCrafts();
        checkAuth();
    }, [activeCategory]);

    const checkAuth = () => {
        // Simple check for auth - will be replaced with proper auth context
        const token = localStorage.getItem('firebaseToken');
        setIsLoggedIn(!!token);
    };

    const loadSavedCrafts = async () => {
        if (!isLoggedIn) return;
        try {
            const response = await getSavedCrafts();
            setWishlist(response.data.savedCrafts || []);
        } catch (err) {
            console.error('Failed to load saved crafts:', err);
        }
    };

    const loadCrafts = async () => {
        try {
            setLoading(true);
            const category = activeCategory !== 'All' ? activeCategory : undefined;
            const response = await getCrafts(1, 50, category);
            
            // Filter by search if provided
            let crafts = response.data.crafts || [];
            if (search.trim()) {
                const q = search.toLowerCase();
                crafts = crafts.filter(
                    (p: Product) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
                );
            }
            
            setProducts(crafts);
        } catch (err: any) {
            console.error('Failed to load crafts:', err);
            setError('Failed to load crafts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleWish = async (id: string) => {
        if (!isLoggedIn) {
            alert('Please log in to save crafts to your wishlist');
            return;
        }

        const isWished = wishlist.includes(id);
        
        try {
            if (isWished) {
                await removeSavedCraft(id);
                setWishlist((prev) => prev.filter((i) => i !== id));
            } else {
                await addSavedCraft(id);
                setWishlist((prev) => [...prev, id]);
            }
        } catch (err) {
            console.error('Failed to update wishlist:', err);
        }
    };

    const addToCart = (product: Product) => {
        setCart((prev) => [...prev, product._id]);
        setToastProduct(product.name);
        setTimeout(() => setToastProduct(null), 2500);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadCrafts();
    };

    return (
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F6F3EE' }}>
            <Navbar />

            {/* ── HERO BANNER ──────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-20" style={{ minHeight: 300 }}>
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #2F5D50 0%, #1A3D33 50%, #0F2822 100%)',
                    }}
                />
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="batik-hero" width="80" height="80" patternUnits="userSpaceOnUse">
                                <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="white" strokeWidth="1.5" />
                                <circle cx="40" cy="40" r="8" fill="none" stroke="white" strokeWidth="1" />
                                <circle cx="40" cy="40" r="2" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#batik-hero)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-white max-w-xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black mb-4 leading-tight"
                            style={{ fontFamily: 'Fraunces, serif' }}
                        >
                            Shop
                            <br />
                            <span style={{ color: '#C9A227' }}>Crafts</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.16 }}
                            className="text-white/70 text-base leading-relaxed"
                        >
                            Discover authentic Sri Lankan crafts directly from master artisans.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* ── FILTERS & SEARCH ──────────────────────────────────── */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-0 w-full md:max-w-sm">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search crafts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-all"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XIcon className="w-4 h-4" />
                            </button>
                        )}
                    </form>

                    {/* Category tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                                style={{
                                    backgroundColor: activeCategory === cat ? '#2F5D50' : '#F3F4F6',
                                    color: activeCategory === cat ? '#fff' : '#6B7280',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Cart indicator */}
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                            <ShoppingCartIcon className="w-4 h-4" style={{ color: '#2F5D50' }} />
                        </div>
                        {cart.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#C65D3B' }}>
                                {cart.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Results count */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2
                            className="text-2xl font-black text-[#1E1E1E]"
                            style={{ fontFamily: 'Fraunces, serif' }}
                        >
                            {activeCategory === 'All' ? 'All Crafts' : activeCategory}
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5 font-body">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    {wishlist.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100">
                            <HeartIcon className="w-4 h-4 text-red-500" fill="#EF4444" />
                            <span className="text-sm font-semibold text-red-600">{wishlist.length} saved</span>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                                    <div className="h-60 bg-gray-200 animate-pulse" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : products.length > 0 ? (
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAddToCart={addToCart}
                                    isWished={wishlist.includes(product._id)}
                                    onToggleWish={toggleWish}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24"
                        >
                            <p className="text-6xl mb-4">🔍</p>
                            <h3 className="text-xl font-bold text-[#1E1E1E] font-display mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
                                No products found
                            </h3>
                            <p className="text-gray-400 font-body text-sm">Try changing your filters or search term</p>
                            <button
                                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                                className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                                style={{ backgroundColor: '#2F5D50' }}
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Cart Toast */}
            <CartToast show={!!toastProduct} name={toastProduct ?? ''} />

            <Footer />
        </div>
    );
}
