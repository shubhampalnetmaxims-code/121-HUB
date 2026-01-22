
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

// Added Product interface to resolve "Cannot find name 'Product'" errors.
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

// Added User interface to resolve "Cannot find name 'User'" errors.
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  paymentMethod: 'added' | 'skipped';
  status: 'active' | 'blocked';
  createdAt: number;
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

export const DEFAULT_PRODUCTS: Product[] = [
  // 121 Fitness Products (Facility ID: 1)
  {
    id: 'f1', facilityId: '1', name: '121 Performance Tee', price: 35.00, quantity: 50, category: 'Apparel', status: 'active', createdAt: Date.now(),
    description: 'Moisture-wicking, breathable performance tee for elite training.',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'],
    size: 'S, M, L, XL', color: 'Black'
  },
  {
    id: 'f2', facilityId: '1', name: 'Elite Shaker Bottle', price: 15.00, quantity: 100, category: 'Accessories', status: 'active', createdAt: Date.now(),
    description: '700ml leak-proof shaker with high-quality mixing ball.',
    images: ['https://images.unsplash.com/photo-1593036418318-771f29399222?q=80&w=1000&auto=format&fit=crop'],
    color: 'Slate'
  },
  {
    id: 'f3', facilityId: '1', name: 'Heavy Duty Lifting Straps', price: 20.00, quantity: 30, category: 'Gear', status: 'active', createdAt: Date.now(),
    description: 'Cotton padded lifting straps for maximum grip during heavy pulls.',
    images: ['https://images.unsplash.com/photo-1583454155184-870a1f63aebc?q=80&w=1000&auto=format&fit=crop'],
    size: 'One Size'
  },
  {
    id: 'f4', facilityId: '1', name: 'Isolate Whey Protein', price: 55.00, quantity: 40, category: 'Supplements', status: 'active', createdAt: Date.now(),
    description: '2kg premium whey isolate. 25g protein per serving.',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop'],
    color: 'Vanilla'
  },
  {
    id: 'f5', facilityId: '1', name: 'Urban Gym Duffel', price: 65.00, quantity: 15, category: 'Accessories', status: 'active', createdAt: Date.now(),
    description: 'Multi-compartment gym bag with ventilated shoe pocket.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'],
    color: 'Dark Grey'
  },
  {
    id: 'f6', facilityId: '1', name: 'Pro Wrist Wraps', price: 18.00, quantity: 60, category: 'Gear', status: 'active', createdAt: Date.now(),
    description: 'Competitive grade wrist support for bench and shoulder press.',
    images: ['https://images.unsplash.com/photo-1517438476312-10d79c67750d?q=80&w=1000&auto=format&fit=crop'],
    size: 'One Size'
  },
  {
    id: 'f7', facilityId: '1', name: 'Compression Performance Shorts', price: 32.00, quantity: 45, category: 'Apparel', status: 'active', createdAt: Date.now(),
    description: 'Ergonomic fit with light compression for muscle support.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'],
    size: 'M, L, XL'
  },
  {
    id: 'f8', facilityId: '1', name: 'Deep Tissue Foam Roller', price: 28.00, quantity: 20, category: 'Recovery', status: 'active', createdAt: Date.now(),
    description: 'High-density foam roller for myofascial release.',
    images: ['https://images.unsplash.com/photo-1600881333168-2ed7d3d114ee?q=80&w=1000&auto=format&fit=crop'],
    color: 'Black'
  },
  {
    id: 'f9', facilityId: '1', name: 'Neoprene Knee Sleeves', price: 45.00, quantity: 25, category: 'Gear', status: 'active', createdAt: Date.now(),
    description: '7mm thick sleeves for warmth and knee stability.',
    images: ['https://images.unsplash.com/photo-1591258382457-d5ad29c79291?q=80&w=1000&auto=format&fit=crop'],
    size: 'S, M, L'
  },
  {
    id: 'f10', facilityId: '1', name: '121 Ignite Pre-workout', price: 38.00, quantity: 50, category: 'Supplements', status: 'active', createdAt: Date.now(),
    description: 'High stim pre-workout for focus and energy.',
    images: ['https://images.unsplash.com/photo-1579722820308-d74e57198c7b?q=80&w=1000&auto=format&fit=crop'],
    color: 'Fruit Punch'
  },
  {
    id: 'f11', facilityId: '1', name: 'Signature Sweat Towel', price: 12.00, quantity: 200, category: 'Accessories', status: 'active', createdAt: Date.now(),
    description: 'Microfiber quick-dry towel with 121 branding.',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'],
    color: 'White/Black'
  },

  // 121 Zen Products (Facility ID: 2)
  {
    id: 'z_p1', facilityId: '2', name: 'Eco-Grip Yoga Mat', price: 85.00, quantity: 20, category: 'Yoga', status: 'active', createdAt: Date.now(),
    description: 'Natural rubber mat with non-slip texture for hot yoga.',
    images: ['https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop'],
    color: 'Sage Green'
  },
  {
    id: 'z_p2', facilityId: '2', name: 'Zafu Meditation Cushion', price: 45.00, quantity: 15, category: 'Wellness', status: 'active', createdAt: Date.now(),
    description: 'Buckwheat hull filled cushion for perfect spinal alignment.',
    images: ['https://images.unsplash.com/photo-1545208393-2160291ba89e?q=80&w=1000&auto=format&fit=crop'],
    color: 'Indigo'
  },
  {
    id: 'z_p3', facilityId: '2', name: 'Zen Mist Oil Diffuser', price: 60.00, quantity: 10, category: 'Home', status: 'active', createdAt: Date.now(),
    description: 'Ultrasonic diffuser with 7 ambient light settings.',
    images: ['https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1000&auto=format&fit=crop'],
    color: 'Wood Grain'
  },
  {
    id: 'z_p4', facilityId: '2', name: 'Bamboo Insulated Bottle', price: 30.00, quantity: 40, category: 'Lifestyle', status: 'active', createdAt: Date.now(),
    description: 'Keeps tea hot for 12 hours. Stainless steel interior.',
    images: ['https://images.unsplash.com/photo-1556767667-0716d12ad24d?q=80&w=1000&auto=format&fit=crop'],
    size: '500ml'
  },
  {
    id: 'z_p5', facilityId: '2', name: 'Aria High-Waist Leggings', price: 75.00, quantity: 30, category: 'Apparel', status: 'active', createdAt: Date.now(),
    description: 'Butter-soft organic cotton blend for unrestricted movement.',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop'],
    size: 'XS, S, M, L'
  },
  {
    id: 'z_p6', facilityId: '2', name: 'Chakra Crystal Set', price: 40.00, quantity: 25, category: 'Wellness', status: 'active', createdAt: Date.now(),
    description: 'Set of 7 raw healing stones in a velvet carrying pouch.',
    images: ['https://images.unsplash.com/photo-1567332316531-90a6f477020a?q=80&w=1000&auto=format&fit=crop'],
    color: 'Multi'
  },
  {
    id: 'z_p7', facilityId: '2', name: 'Brass Incense Burner', price: 22.00, quantity: 50, category: 'Home', status: 'active', createdAt: Date.now(),
    description: 'Handcrafted burner for sticks or cones.',
    images: ['https://images.unsplash.com/photo-1602928321557-084770e5b721?q=80&w=1000&auto=format&fit=crop'],
    color: 'Antique Gold'
  },
  {
    id: 'z_p8', facilityId: '2', name: 'Sleep Tight Lavender Candle', price: 25.00, quantity: 60, category: 'Wellness', status: 'active', createdAt: Date.now(),
    description: 'Soy wax candle with therapeutic grade essential oils.',
    images: ['https://images.unsplash.com/photo-1603006375271-7f3b901b0d2d?q=80&w=1000&auto=format&fit=crop'],
    size: '8oz'
  },
  {
    id: 'z_p9', facilityId: '2', name: 'Cork Yoga Block Pair', price: 35.00, quantity: 40, category: 'Yoga', status: 'active', createdAt: Date.now(),
    description: 'Sustainably sourced cork for natural firm support.',
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop'],
    size: 'Standard'
  },
  {
    id: 'z_p10', facilityId: '2', name: 'Moonlight Herbal Tea', price: 18.00, quantity: 80, category: 'Wellness', status: 'active', createdAt: Date.now(),
    description: 'Caffeine-free chamomile and valerian root blend.',
    images: ['https://images.unsplash.com/photo-1594631252845-29fc4586d517?q=80&w=1000&auto=format&fit=crop'],
    size: '20 Bags'
  },
  {
    id: 'z_p11', facilityId: '2', name: 'Zen Eye Pillow', price: 20.00, quantity: 30, category: 'Recovery', status: 'active', createdAt: Date.now(),
    description: 'Silk pillow filled with flaxseed and dried lavender.',
    images: ['https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop'],
    color: 'Lotus Pink'
  }
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
    createdAt: Date.now() - 500000
  },
  {
    id: 'u2',
    email: 'mike@example.com',
    fullName: 'Mike Ross',
    phone: '+1 555-4321',
    gender: 'Male',
    paymentMethod: 'skipped',
    status: 'active',
    createdAt: Date.now() - 1000000
  }
];
