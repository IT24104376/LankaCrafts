import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCartIcon,
    HeartIcon,
    StarIcon,
    MapPinIcon,
    SearchIcon,
    ChevronRightIcon,
    XIcon,
    CheckIcon,
    TruckIcon,
    ShieldCheckIcon,
    RefreshCwIcon,
    AwardIcon,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────
interface Product {
    id: number;
    name: string;
    artisan: string;
    artisanId: number;
    region: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
    description: string;
    materials: string[];
    stock: number;
}

// ── Product Data ───────────────────────────────────────────────
const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Kandyan Lacquer Vase',
        artisan: 'Nimal Perera',
        artisanId: 1,
        region: 'Kandy',
        category: 'Lacquerwork',
        price: 4800,
        originalPrice: 6200,
        rating: 4.9,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop',
        badge: 'Best Seller',
        description: 'Hand-turned vase with traditional Kandyan geometric patterns applied using natural lacquer dyes.',
        materials: ['Kaduru Wood', 'Natural Lacquer', 'Mineral Dyes'],
        stock: 5,
    },
    {
        id: 2,
        name: 'Batik Silk Sarong',
        artisan: 'Kamala Wijesinghe',
        artisanId: 2,
        region: 'Kandy',
        category: 'Batik',
        price: 3200,
        rating: 4.8,
        reviews: 94,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
        badge: 'Handmade',
        description: 'Wax-resist dyed silk sarong featuring flora and fauna motifs inspired by ancient Sinhala art.',
        materials: ['Pure Silk', 'Natural Wax', 'Resist Dyes'],
        stock: 12,
    },
    {
        id: 3,
        name: 'Ceremonial Kolam Mask',
        artisan: 'Suresh Fernando',
        artisanId: 3,
        region: 'Ambalangoda',
        category: 'Mask Carving',
        price: 8500,
        originalPrice: 10000,
        rating: 5.0,
        reviews: 61,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop',
        badge: 'Heritage Piece',
        description: 'Traditional healing mask carved from kaduru wood and painted with natural pigments. Each mask is unique.',
        materials: ['Kaduru Wood', 'Herbal Pigments', 'Coconut-Shell Lacquer'],
        stock: 3,
    },
    {
        id: 4,
        name: 'Hand-Thrown Pottery Set (3pc)',
        artisan: 'Rohan De Silva',
        artisanId: 4,
        region: 'Kelaniya',
        category: 'Pottery',
        price: 5600,
        rating: 4.7,
        reviews: 76,
        image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop',
        badge: 'Eco-Friendly',
        description: 'Set of 3 unglazed earthenware pieces thrown on an ancient kick-wheel. Perfect for table decor.',
        materials: ['Red Clay', 'Natural Glaze', 'Kiln-fired'],
        stock: 8,
    },
    {
        id: 5,
        name: 'Dumbara Mat (Traditional)',
        artisan: 'Priya Bandara',
        artisanId: 5,
        region: 'Dumbara Valley',
        category: 'Handloom',
        price: 6800,
        rating: 4.9,
        reviews: 43,
        image: 'https://images.unsplash.com/photo-1606722590560-4f4c1e4ea1a4?w=600&auto=format&fit=crop',
        badge: 'GI Tagged',
        description: 'Authentic Dumbara mat woven with highland grass using geometric patterns that encode ancestral stories.',
        materials: ['Hana Grass', 'Natural Fibres', 'Plant-based Dyes'],
        stock: 6,
    },
    {
        id: 6,
        name: 'Temple Brass Oil Lamp',
        artisan: 'Anura Mendis',
        artisanId: 6,
        region: 'Colombo',
        category: 'Brasswork',
        price: 7200,
        originalPrice: 9000,
        rating: 4.8,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop',
        badge: 'Artisan Pick',
        description: 'Five-pronged Pahana crafted using lost-wax casting, a 2000-year-old Sri Lankan metalworking technique.',
        materials: ['Pure Brass', 'Cast Bronze Base', 'Etched Detailing'],
        stock: 10,
    },
    {
        id: 7,
        name: 'Lacquer Jewelry Box',
        artisan: 'Nimal Perera',
        artisanId: 1,
        region: 'Kandy',
        category: 'Lacquerwork',
        price: 2900,
        rating: 4.6,
        reviews: 55,
        image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600&auto=format&fit=crop',
        description: 'Small lacquerwork box with satin interior. Ideal for storing jewellery or as a keepsake gift.',
        materials: ['Kaduru Wood', 'Red Lacquer', 'Velvet Lining'],
        stock: 15,
    },
    {
        id: 8,
        name: 'Batik Wall Hanging',
        artisan: 'Kamala Wijesinghe',
        artisanId: 2,
        region: 'Kandy',
        category: 'Batik',
        price: 4100,
        rating: 4.7,
        reviews: 37,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&auto=format&fit=crop',
        badge: 'New Arrival',
        description: 'Large batik panel depicting the sacred Sigiriya rock fortress. Perfect statement art for any home.',
        materials: ['Cotton Canvas', 'Reactive Dyes', 'Wooden Frame'],
        stock: 7,
    },
    {
        id: 9,
        name: 'Brasswork Elephant Statuette',
        artisan: 'Anura Mendis',
        artisanId: 6,
        region: 'Colombo',
        category: 'Brasswork',
        price: 3600,
        rating: 4.9,
        reviews: 112,
        image: 'https://images.unsplash.com/photo-1565636291267-7e0d6064f5c9?w=600&auto=format&fit=crop',
        badge: 'Tourist Favourite',
        description: 'Intricately etched brass elephant, symbol of Sri Lankan culture, handcrafted by a third-generation artisan.',
        materials: ['Pure Brass', 'Burnished Finish'],
        stock: 20,
    },
];

const CATEGORIES = ['All', 'Lacquerwork', 'Batik', 'Mask Carving', 'Pottery', 'Handloom', 'Brasswork'];
const REGIONS = ['All', 'Kandy', 'Ambalangoda', 'Kelaniya', 'Dumbara Valley', 'Colombo'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Most Reviews'];

// Badge color map
const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
    'Best Seller': { bg: '#FEF3C7', text: '#92400E' },
    'Handmade': { bg: '#D1FAE5', text: '#065F46' },
    'Heritage Piece': { bg: '#FDE8D8', text: '#9A3412' },
    'Eco-Friendly': { bg: '#DCFCE7', text: '#166534' },
    'GI Tagged': { bg: '#EDE9FE', text: '#5B21B6' },
    'Artisan Pick': { bg: '#FDF8E7', text: '#78400F' },
    'New Arrival': { bg: '#DBEAFE', text: '#1E40AF' },
    'Tourist Favourite': { bg: '#FCE7F3', text: '#9D174D' },
};

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
    onToggleWish: (id: number) => void;
}) {
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;

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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.badge && (
                        <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                            style={{
                                backgroundColor: BADGE_STYLES[product.badge]?.bg ?? '#FDF8E7',
                                color: BADGE_STYLES[product.badge]?.text ?? '#78400F',
                            }}
                        >
                            {product.badge}
                        </span>
                    )}
                    {discount && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#C65D3B] text-white">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={() => onToggleWish(product.id)}
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
                {/* Region tag */}
                <div className="flex items-center gap-1 mb-2">
                    <MapPinIcon className="w-3 h-3" style={{ color: '#C9A227' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C9A227' }}>
                        {product.region}
                    </span>
                    <span className="text-[10px] text-gray-300 mx-1">·</span>
                    <span className="text-[10px] text-gray-400 font-body">{product.category}</span>
                </div>

                <h3
                    className="font-bold text-[#1E1E1E] text-base mb-0.5 leading-snug font-display"
                    style={{ fontFamily: 'Fraunces, serif' }}
                >
                    {product.name}
                </h3>

                <Link
                    to={`/artist/${product.artisanId}`}
                    className="text-xs font-body mb-3 hover:underline transition-colors"
                    style={{ color: '#2F5D50' }}
                >
                    by {product.artisan}
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                                key={s}
                                className="w-3.5 h-3.5"
                                style={{
                                    color: s <= Math.round(product.rating) ? '#C9A227' : '#E5E7EB',
                                    fill: s <= Math.round(product.rating) ? '#C9A227' : 'none',
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-[#1E1E1E]">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>

                {/* Price row */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-lg font-black text-[#2F5D50]" style={{ fontFamily: 'Fraunces, serif' }}>
                            LKR {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-2">
                                LKR {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {product.stock <= 5 && (
                        <span className="text-[10px] font-bold text-[#C65D3B] bg-[#FEF0EB] px-2 py-1 rounded-full">
                            Only {product.stock} left
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
    const [activeRegion, setActiveRegion] = useState('All');
    const [sortBy, setSortBy] = useState('Featured');
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [cart, setCart] = useState<number[]>([]);
    const [toastProduct, setToastProduct] = useState<string | null>(null);

    const toggleWish = (id: number) =>
        setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

    const addToCart = (product: Product) => {
        setCart((prev) => [...prev, product.id]);
        setToastProduct(product.name);
        setTimeout(() => setToastProduct(null), 2500);
    };

    const filtered = useMemo(() => {
        let list = [...PRODUCTS];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) => p.name.toLowerCase().includes(q) || p.artisan.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
            );
        }
        if (activeCategory !== 'All') list = list.filter((p) => p.category === activeCategory);
        if (activeRegion !== 'All') list = list.filter((p) => p.region === activeRegion);
        switch (sortBy) {
            case 'Price: Low to High': list.sort((a, b) => a.price - b.price); break;
            case 'Price: High to Low': list.sort((a, b) => b.price - a.price); break;
            case 'Top Rated': list.sort((a, b) => b.rating - a.rating); break;
            case 'Most Reviews': list.sort((a, b) => b.reviews - a.reviews); break;
        }
        return list;
    }, [search, activeCategory, activeRegion, sortBy]);

    return (
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F6F3EE' }}>
            <Navbar />

            {/* ── HERO BANNER ──────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-20" style={{ minHeight: 440 }}>
                {/* BG gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #2F5D50 0%, #1A3D33 50%, #0F2822 100%)',
                    }}
                />
                {/* Batik-style SVG pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="batik-hero" width="80" height="80" patternUnits="userSpaceOnUse">
                                <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="white" strokeWidth="1.5" />
                                <circle cx="40" cy="40" r="8" fill="none" stroke="white" strokeWidth="1" />
                                <circle cx="40" cy="40" r="2" fill="white" />
                                <polygon points="40,20 56,40 40,60 24,40" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#batik-hero)" />
                    </svg>
                </div>

                {/* Floating decorative orbs */}
                <div className="absolute top-10 right-20 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#C9A227', filter: 'blur(60px)' }} />
                <div className="absolute bottom-0 left-10 w-80 h-40 rounded-full opacity-10" style={{ backgroundColor: '#C65D3B', filter: 'blur(80px)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-white max-w-xl">
                        <motion.span
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-5 px-4 py-1.5 rounded-full"
                            style={{ backgroundColor: 'rgba(201,162,39,0.2)', color: '#C9A227' }}
                        >
                            <AwardIcon className="w-3.5 h-3.5" /> Authentic Sri Lankan Crafts
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="text-5xl md:text-6xl font-black mb-4 leading-tight"
                            style={{ fontFamily: 'Fraunces, serif' }}
                        >
                            Shop the
                            <br />
                            <span style={{ color: '#C9A227' }}>Soul</span> of Lanka
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.16 }}
                            className="text-white/70 text-base leading-relaxed mb-8"
                        >
                            Every piece you purchase directly supports a master artisan and keeps
                            a 2000-year-old tradition alive. Take home a story.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            {[
                                { icon: ShieldCheckIcon, label: 'Authenticity Certified' },
                                { icon: TruckIcon, label: 'Worldwide Shipping' },
                                { icon: RefreshCwIcon, label: '14-Day Returns' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-sm text-white/80">
                                    <Icon className="w-4 h-4" style={{ color: '#C9A227' }} />
                                    {label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Stats block */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:grid grid-cols-2 gap-4 shrink-0"
                    >
                        {[
                            { value: '120+', label: 'Artisans' },
                            { value: '6', label: 'Craft Types' },
                            { value: '9 Prov.', label: 'Coverage' },
                            { value: '4.9★', label: 'Avg Rating' },
                        ].map(({ value, label }) => (
                            <div
                                key={label}
                                className="rounded-2xl px-6 py-5 text-center"
                                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                            >
                                <p className="text-2xl font-black text-white" style={{ fontFamily: 'Fraunces, serif' }}>{value}</p>
                                <p className="text-xs text-white/50 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── CULTURE STRIP ─────────────────────────────────────── */}
            <div
                className="border-y border-[#C9A227]/20 overflow-hidden"
                style={{ backgroundColor: '#FDF8E7' }}
            >
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center md:justify-between items-center gap-4">
                    {[
                        { emoji: '🎨', text: 'Batik – Wax-resist dyeing from Kandy' },
                        { emoji: '⚱️', text: 'Pottery – Ancient wheels of Kelaniya' },
                        { emoji: '🪵', text: 'Masks – Ritual carvings from Ambalangoda' },
                        { emoji: '🧶', text: 'Handloom – Dumbara valley traditions' },
                        { emoji: '🔱', text: 'Lacquerwork – 2000 years of artistry' },
                    ].map(({ emoji, text }) => (
                        <div key={text} className="flex items-center gap-2 text-sm text-[#2F5D50] font-body">
                            <span className="text-lg">{emoji}</span>
                            <span className="font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FILTERS & SEARCH ──────────────────────────────────── */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0 w-full md:max-w-sm">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search crafts, artisans…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-all"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#2F5D50'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,93,80,0.12)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category tabs (scroll on mobile) */}
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

                    {/* Region + Sort */}
                    <div className="flex items-center gap-2 shrink-0">
                        <select
                            value={activeRegion}
                            onChange={(e) => setActiveRegion(e.target.value)}
                            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-white cursor-pointer"
                            style={{ color: '#2F5D50' }}
                        >
                            {REGIONS.map((r) => <option key={r}>{r}</option>)}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-white cursor-pointer"
                            style={{ color: '#2F5D50' }}
                        >
                            {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        {/* Cart indicator */}
                        <div className="relative">
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
                            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
                            {activeRegion !== 'All' && ` in ${activeRegion}`}
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
                    {filtered.length > 0 ? (
                        <motion.div
                            key={`${activeCategory}-${activeRegion}-${sortBy}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filtered.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                    isWished={wishlist.includes(product.id)}
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
                                onClick={() => { setSearch(''); setActiveCategory('All'); setActiveRegion('All'); }}
                                className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                                style={{ backgroundColor: '#2F5D50' }}
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── EXPERIENCE STRIP ────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mt-24 rounded-3xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #2F5D50 0%, #1A3D33 100%)' }}
                >
                    <div className="relative p-10 md:p-14">
                        {/* pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg width="100%" height="100%">
                                <defs>
                                    <pattern id="exp-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                                        <polygon points="30,3 57,30 30,57 3,30" fill="none" stroke="white" strokeWidth="1" />
                                        <circle cx="30" cy="30" r="4" fill="none" stroke="white" strokeWidth="0.8" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#exp-pattern)" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-white max-w-lg">
                                <span
                                    className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1.5 rounded-full"
                                    style={{ backgroundColor: 'rgba(201,162,39,0.2)', color: '#C9A227' }}
                                >
                                    ✦ Beyond Shopping
                                </span>
                                <h2
                                    className="text-3xl md:text-4xl font-black mb-4 leading-tight"
                                    style={{ fontFamily: 'Fraunces, serif' }}
                                >
                                    Experience the Craft,
                                    <br />
                                    Don't Just Own It
                                </h2>
                                <p className="text-white/70 text-base leading-relaxed mb-6">
                                    Our artisans open their workshops to you. Join hands-on sessions,
                                    learn ancient techniques, and create your own masterpiece to take home.
                                </p>
                                <Link
                                    to="/book"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
                                    style={{ backgroundColor: '#C9A227', color: '#2F5D50' }}
                                >
                                    Book a Workshop <ChevronRightIcon className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4 shrink-0">
                                {[
                                    { emoji: '🎨', title: 'Batik Dyeing', time: '3 hrs', price: 'LKR 2,500' },
                                    { emoji: '⚱️', title: 'Pottery', time: '2 hrs', price: 'LKR 2,000' },
                                    { emoji: '🪵', title: 'Mask Carving', time: '4 hrs', price: 'LKR 3,500' },
                                    { emoji: '🔱', title: 'Lacquerwork', time: '3 hrs', price: 'LKR 3,000' },
                                ].map(({ emoji, title, time, price }) => (
                                    <div
                                        key={title}
                                        className="rounded-2xl p-4 text-white"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                                    >
                                        <span className="text-2xl">{emoji}</span>
                                        <p className="font-bold text-sm mt-2 font-body">{title}</p>
                                        <p className="text-[11px] text-white/50 mt-0.5">{time} · {price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── ARTISAN STORY STRIP ──────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mt-16 text-center"
                >
                    <span
                        className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full"
                        style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#C9A227' }}
                    >
                        Why Buy Here?
                    </span>
                    <h2
                        className="text-3xl md:text-4xl font-black text-[#1E1E1E] mb-6"
                        style={{ fontFamily: 'Fraunces, serif' }}
                    >
                        Every Purchase, a Promise
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🤝',
                                title: 'Direct to Artisan',
                                desc: '100% of the product price goes directly to the artisan — no middlemen, maximum impact.',
                            },
                            {
                                icon: '🌿',
                                title: 'Sustainably Made',
                                desc: 'All crafts use natural, locally-sourced materials with zero industrial processing.',
                            },
                            {
                                icon: '📜',
                                title: 'Certificate of Authenticity',
                                desc: 'Every product ships with a handwritten certificate and the artisan\'s workshop story.',
                            },
                        ].map(({ icon, title, desc }) => (
                            <div
                                key={title}
                                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <span className="text-4xl">{icon}</span>
                                <h3
                                    className="text-lg font-bold text-[#1E1E1E] mt-4 mb-2"
                                    style={{ fontFamily: 'Fraunces, serif' }}
                                >
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-body">{desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </main>

            {/* Cart Toast */}
            <CartToast show={!!toastProduct} name={toastProduct ?? ''} />

            <Footer />
        </div>
    );
}
