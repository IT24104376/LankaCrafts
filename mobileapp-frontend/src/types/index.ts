// TypeScript type definitions for LankaCrafts Mobile App

// ============================================
// Artist Types
// ============================================

export interface ArtistAddress {
  number?: string;
  street?: string;
  village?: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
}

export interface ArtistLocation {
  type: string;
  coordinates: [number, number];
}

export interface ArtistAvailability {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  time?: string;
}

export interface Artist {
  id: string;
  fullName: string;
  callingName?: string;
  email: string;
  phone?: string;
  craftType: string;
  bio?: string;
  profilePicUrl?: string;
  address: ArtistAddress;
  location?: ArtistLocation;
  specialties?: string[];
  availability?: ArtistAvailability;
  rating?: number;
  reviewCount?: number;
  initials?: string;
  status?: string;
}

export interface ArtistRegisterData {
  fullName: string;
  callingName?: string;
  email: string;
  phone?: string;
  craftType: string;
  bio?: string;
  address: ArtistAddress;
  specialties?: string[];
  availability?: ArtistAvailability;
}

export interface ArtistLoginResponse {
  message: string;
  artist: Artist;
}

// ============================================
// Craft Types (Ecommerce)
// ============================================

export interface CraftDimensions {
  height?: number;
  width?: number;
  depth?: number;
  unit?: string;
}

export interface CraftWeight {
  value?: number;
  unit?: string;
}

export interface Craft {
  _id: string;
  artistId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  stock: number;
  isAvailable: boolean;
  dimensions?: CraftDimensions;
  weight?: CraftWeight;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  // Populated artist info
  artistName?: string;
  artistProfilePic?: string;
}

export interface CraftCreateData {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  category: string;
  images?: string[];
  stock?: number;
  isAvailable?: boolean;
  dimensions?: CraftDimensions;
  weight?: CraftWeight;
}

export interface CraftListResponse {
  crafts: Craft[];
  total: number;
  page: number;
  totalPages: number;
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  craftId: string;
  quantity: number;
  craft: Craft;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

// ============================================
// Payment Types
// ============================================

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  items?: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl: string;
  orderId: string;
}

// ============================================
// Tourist Types
// ============================================

export interface TouristTravelDates {
  arrival?: string;
  departure?: string;
}

export interface Tourist {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  nationality?: string;
  profilePicUrl?: string;
  preferredCraftTypes?: string[];
  travelDates?: TouristTravelDates;
}

export interface TouristRegisterData {
  fullName: string;
  email: string;
  phone?: string;
  nationality?: string;
  preferredCraftTypes?: string[];
  travelDates?: TouristTravelDates;
}

// ============================================
// Blog Types
// ============================================

export interface Blog {
  _id: string;
  authorId: string;
  authorName: string;
  authorProfilePic?: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  likes: string[];
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCreateData {
  title: string;
  content: string;
  tags?: string[];
  coverImage?: string;
}

// ============================================
// Booking Types
// ============================================

export interface WorkshopBooking {
  _id: string;
  workshopId: string;
  workshopName: string;
  artistId: string;
  artistName: string;
  touristId: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
}

export interface BookingCreateData {
  workshopId: string;
  date: string;
  participants: number;
  specialRequests?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Filter & Pagination Types
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ArtistFilters {
  craftType?: string;
  search?: string;
}

export interface CraftFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type SortOption = 'recent' | 'oldest' | 'popular' | 'price-low' | 'price-high';

// ============================================
// Constants
// ============================================

export const CRAFT_CATEGORIES = [
  'Batik',
  'Pottery',
  'Wood Carving',
  'Mask Making',
  'Jewelry',
  'Textiles',
  'Lacquer Work',
  'Coir Products',
  'Handloom',
  'Other',
] as const;

export type CraftCategory = typeof CRAFT_CATEGORIES[number];

export const PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
] as const;

export type Province = typeof PROVINCES[number];