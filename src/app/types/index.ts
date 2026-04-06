export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface AdditionalDetail {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  categoryName?: string;
  description: string;
  image: string;
  packagingSize?: string;
  brand?: string;
  form?: string;
  countryOfOrigin?: string;
  composition?: string;
  dosage?: string;
  storage?: string;
  sideEffects?: string;
  additionalDetails?: AdditionalDetail[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string | { _id: string; name: string; image: string };
  name: string;
  email: string;
  rating: number;
  message?: string;
  isVisible: boolean;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  text: string;
  name: string;
  designation?: string;
  image?: string;
  rating: number;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export interface HomeCard {
  _id: string;
  section: 'features' | 'why_us' | 'highlights';
  icon: string;
  title: string;
  description: string;
  color: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  quantity?: string;
  message: string;
  productId?: string;
  productName?: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface Admin {
  _id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalInquiries: number;
  pendingInquiries: number;
  contactedInquiries: number;
  resolvedInquiries: number;
  productsByCategory: { name: string; count: number }[];
  inquiriesByStatus: { status: string; count: number; fill: string }[];
}

export interface SiteContent {
  [key: string]: string;
}

export interface AllContent {
  home: SiteContent;
  about: SiteContent;
  contact: SiteContent;
}
