// ─── Product Types ───
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  material?: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

// ─── Course Types ───
export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  instructor: string;
  price: number;
  comparePrice?: number;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessonCount: number;
  studentCount: number;
  rating: number;
  reviewCount: number;
  modules: Module[];
  isFeatured?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
  isCompleted?: boolean;
}

// ─── Cart Types ───
export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// ─── Order Types ───
export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

// ─── User Types ───
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  enrolledCourses: string[];
  orders: string[];
}

// ─── Review Types ───
export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  productId?: string;
  courseId?: string;
  avatar?: string;
}

// ─── Enquiry Types ───
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId?: string;
  type: 'custom-order' | 'general' | 'course';
}

// ─── Enrollment Types ───
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedLessons: string[];
  lastLessonId?: string;
  lastPositionSec?: number;
  progress: number;
}

// ─── Lesson Progress ───
export interface LessonProgress {
  lessonId: string;
  completedAt?: string;
  lastPositionSec: number;
}
