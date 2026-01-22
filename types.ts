
export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: number;
  features: string[]; // List of enabled feature IDs (e.g., 'classes', 'blocks', 'timetable', 'marketplace')
}

export interface Class {
  id: string;
  facilityId: string;
  name: string;
  shortDescription: string;
  duration: string;
  requirements: string;
  level: string;
  imageUrl?: string;
  createdAt: number;
}

export interface Trainer {
  id: string;
  facilityIds: string[];
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  description: string;
  colorCode: string;
  createdAt: number;
}

export interface Location {
  id: string;
  facilityIds: string[];
  name: string;
  createdAt: number;
}

export interface ClassSlot {
  id: string;
  facilityId: string;
  classId: string;
  trainerId: string;
  locationId: string;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  startTime: string; // e.g. "10:00"
  duration: string; // e.g. "1 hour"
  status: 'available' | 'full' | 'waiting';
  currentBookings: number;
  maxBookings: number;
  startDate?: number; // Optional timestamp
  endDate?: number;   // Optional timestamp
}

export interface Product {
  id: string;
  facilityId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: number;
  description: string;
  images: string[];
  size?: string;
  color?: string;
}

export interface PaymentCard {
  id: string;
  holderName: string;
  cardNumber: string; // Stored as masked except last 4
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Other';
  expiryDate: string; // MM/YY
  isPrimary: boolean;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  paymentMethod: 'added' | 'skipped';
  status: 'active' | 'blocked';
  createdAt: number;
  paymentCards: PaymentCard[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  createdAt: number;
  isRead: boolean;
  target: 'admin' | string; // 'admin' or userId
}

export type AppView = 'landing' | 'app' | 'admin' | 'app-home' | 'admin-login';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export const FEATURE_MODULES = [
  { id: 'classes', name: 'Classes', icon: 'BookOpen' },
  { id: 'timetable', name: 'Timetable', icon: 'CalendarDays' },
  { id: 'blocks', name: 'Blocks', icon: 'Layers' },
  { id: 'passes', name: 'Passes', icon: 'Ticket' },
  { id: 'memberships', name: 'Memberships', icon: 'CreditCard' },
  { id: 'marketplace', name: 'Marketplace', icon: 'ShoppingBag' },
];

export const CLASS_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'All Levels'];

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const DEFAULT_FACILITIES: Facility[] = [
  {
    id: '1',
    name: '121 Fitness',
    description: '<b>Premier fitness</b> coaching and state-of-the-art equipment tailored for your personal growth.',
    icon: 'Dumbbell',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 100000,
    features: ['classes', 'timetable', 'memberships', 'marketplace']
  },
  {
    id: '2',
    name: '121 Zen',
    description: 'A sanctuary for <i>meditation and yoga</i>, focusing on mindfulness and inner peace.',
    icon: 'Flower2',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 50000,
    features: ['classes', 'timetable', 'marketplace']
  }
];

export const DEFAULT_CLASSES: Class[] = [
  { id: 'c1', facilityId: '1', name: 'Boxing', shortDescription: 'High-intensity boxing training for all levels.', duration: '1 hour', requirements: 'Gloves, hand wraps', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now() },
  { id: 'c2', facilityId: '1', name: 'Get HIIT', shortDescription: 'Quick bursts of intense exercise followed by rest.', duration: '45 mins', requirements: 'Towel, Water', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now() },
  { id: 'z1', facilityId: '2', name: 'Zen Yoga', shortDescription: 'Gentle flow focusing on alignment and peace.', duration: '1 hour', requirements: 'Yoga mat', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now() }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  { id: 't1', facilityIds: ['1', '2'], name: 'Eross Stonkus', email: 'eross@121.com', phone: '+1 555-0101', profilePicture: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop', description: 'Expert trainer with focus on strength and form.', colorCode: '#2563eb', createdAt: Date.now() }
];

export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'l1', facilityIds: ['1'], name: 'Main Strength Floor', createdAt: Date.now() },
  { id: 'l3', facilityIds: ['2'], name: 'Zen Garden', createdAt: Date.now() }
];

export const DEFAULT_CLASS_SLOTS: ClassSlot[] = [
  { id: 's1', facilityId: '1', classId: 'c1', trainerId: 't1', locationId: 'l1', dayOfWeek: 4, startTime: '10:00', duration: '1 hour', status: 'available', currentBookings: 8, maxBookings: 12 },
  { id: 's8', facilityId: '2', classId: 'z1', trainerId: 't1', locationId: 'l3', dayOfWeek: 1, startTime: '08:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 10 }
];

export const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    phone: '+1 555-1234',
    gender: 'Female',
    paymentMethod: 'added',
    status: 'active',
    createdAt: Date.now() - 500000,
    paymentCards: []
  },
  {
    id: 'u2',
    email: 'mike@example.com',
    fullName: 'Mike Ross',
    phone: '+1 555-4321',
    gender: 'Male',
    paymentMethod: 'skipped',
    status: 'active',
    createdAt: Date.now() - 1000000,
    paymentCards: []
  }
];
