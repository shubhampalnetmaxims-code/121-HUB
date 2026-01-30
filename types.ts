export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: number;
  features: string[]; // List of enabled feature IDs (e.g., 'classes', 'blocks', 'timetable', 'marketplace')
  settings?: {
    canCancelBooking: boolean;
    canRescheduleBooking: boolean;
    canCancelOrder: boolean;
  };
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
  pricePerSession: number;
  status: 'active' | 'inactive';
}

export interface Block {
  id: string;
  facilityId: string;
  trainerId: string;
  name: string;
  about: string;
  expect: string;
  numWeeks: number;
  daysOfWeek: number[]; // 0 for Sunday, 1 for Monday, etc.
  startDate: number;
  startTime: string;
  duration: string;
  maxPersons: number;
  maxPersonsPerBooking: number;
  bookingAmount: number;
  weeklyAmount: number;
  totalAmount: number;
  status: 'active' | 'inactive';
  createdAt: number;
}

export interface BlockBooking {
  id: string;
  blockId: string;
  userId: string;
  userName: string;
  userEmail: string;
  facilityId: string;
  trainerId: string;
  startDate: number;
  participantNames: string[];
  bookingAmountPaid: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface BlockWeeklyPayment {
  id: string;
  blockBookingId: string;
  userId: string;
  weekNumber: number;
  amount: number;
  dueDate: number;
  status: 'paid' | 'pending';
  paidAt?: number;
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

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  facilityId: string;
  classId: string;
  slotId: string;
  trainerId: string;
  locationId: string;
  bookingDate: number; // timestamp
  startTime: string;
  persons: number;
  participantNames: string[];
  status: 'upcoming' | 'rescheduled' | 'cancelled' | 'delivered';
  type: 'class' | 'block' | 'pass';
  amount: number;
  createdAt: number;
  usedPassId?: string;
}

export interface Pass {
  id: string;
  facilityId: string;
  name: string;
  price: number;
  credits: number;
  personsPerBooking: number;
  allowedClassIds: string[]; // empty array means "All Classes"
  isAllClasses: boolean;
  description: string;
  quantity: number;
  status: 'active' | 'inactive';
  createdAt: number;
}

export interface UserPass {
  id: string;
  userId: string;
  passId: string;
  facilityId: string;
  name: string;
  remainingCredits: number;
  totalCredits: number;
  personsPerBooking: number;
  isAllClasses: boolean;
  allowedClassIds: string[];
  purchasedAt: number;
  status: 'active' | 'exhausted' | 'expired';
}

export interface ProductSizeStock {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  facilityId: string;
  name: string;
  price: number; // Original Price
  discountPercent?: number;
  discountedPrice?: number;
  quantity: number; // Computed Total quantity
  sizeStocks: ProductSizeStock[];
  category: string;
  status: 'active' | 'inactive';
  createdAt: number;
  description: string;
  images: string[];
  color?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  facilityId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  facilityId: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  serviceCharge: number;
  total: number;
  status: 'placed' | 'picked-up';
  createdAt: number;
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
  profilePicture?: string;
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
  { id: 'passes', name: 'Passes', icon: 'Ticket' },
  { id: 'blocks', name: 'Blocks', icon: 'Layers' },
  { id: 'memberships', name: 'Memberships', icon: 'CreditCard' },
  { id: 'marketplace', name: 'Marketplace', icon: 'ShoppingBag' },
];

export const CLASS_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'All Levels'];

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DEFAULT_SETTINGS = {
  canCancelBooking: true,
  canRescheduleBooking: true,
  canCancelOrder: true
};

export const DEFAULT_FACILITIES: Facility[] = [
  {
    id: '1',
    name: '121 Fitness',
    description: '<b>Premier fitness</b> coaching and state-of-the-art equipment tailored for your personal growth.',
    icon: 'Dumbbell',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 100000,
    features: ['classes', 'timetable', 'memberships', 'marketplace', 'passes', 'blocks'],
    settings: { ...DEFAULT_SETTINGS }
  },
  {
    id: '2',
    name: '121 Zen',
    description: 'A sanctuary for <i>meditation and yoga</i>, focusing on mindfulness and inner peace.',
    icon: 'Flower2',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 50000,
    features: ['classes', 'timetable', 'marketplace', 'passes', 'blocks'],
    settings: { ...DEFAULT_SETTINGS }
  },
  {
    id: '3',
    name: '121 Gym',
    description: 'Focused on <b>raw performance</b> and elite recovery protocols for serious athletes.',
    icon: 'Activity',
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 25000,
    features: ['classes', 'timetable', 'marketplace', 'passes', 'blocks'],
    settings: { ...DEFAULT_SETTINGS }
  }
];

export const DEFAULT_CLASSES: Class[] = [
  // 121 Fitness Classes
  { id: 'c1', facilityId: '1', name: 'Boxing', shortDescription: 'High-intensity boxing training for all levels.', duration: '1 hour', requirements: 'Gloves, wraps', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 15, status: 'active' },
  { id: 'c2', facilityId: '1', name: 'Get HIIT', shortDescription: 'Quick bursts of intense exercise followed by rest.', duration: '45 mins', requirements: 'Towel, Water', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 12, status: 'active' },
  { id: 'c3', facilityId: '1', name: 'Power Lifting', shortDescription: 'Master the big three: Squat, Bench, and Deadlift.', duration: '1.5 hours', requirements: 'Lifting shoes', level: 'Expert', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 20, status: 'active' },
  { id: 'c4', facilityId: '1', name: 'Spin Cycle', shortDescription: 'Cardio-heavy cycling session with dynamic music.', duration: '50 mins', requirements: 'Cycle shoes', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 18, status: 'active' },
  
  // 121 Zen Classes
  { id: 'z1', facilityId: '2', name: 'Zen Flow', shortDescription: 'Gentle flow focusing on alignment and peace.', duration: '1 hour', requirements: 'Yoga mat', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 20, status: 'active' },
  { id: 'z2', facilityId: '2', name: 'Vinyasa Flow', shortDescription: 'Stringing postures together so that you move from one to another.', duration: '1 hour', requirements: 'Yoga mat', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 22, status: 'active' },
  
  // 121 Gym Classes
  { id: 'g1', facilityId: '3', name: 'Recovery Room', shortDescription: 'Guided physical recovery using foam rollers and dynamic stretching.', duration: '45 mins', requirements: 'Comfortable gym wear', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 10, status: 'active' }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  { id: 't1', facilityIds: ['1', '3'], name: 'Eross Stonkus', email: 'eross@121.com', phone: '+1 555-0101', profilePicture: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop', description: 'Expert trainer with focus on strength and form.', colorCode: '#2563eb', createdAt: Date.now() },
  { id: 't2', facilityIds: ['1'], name: 'Sarah Strong', email: 'sarah@121.com', phone: '+1 555-0102', profilePicture: 'https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=400&auto=format&fit=crop', description: 'HIIT and functional training expert.', colorCode: '#dc2626', createdAt: Date.now() },
  { id: 't3', facilityIds: ['2'], name: 'Maya Zen', email: 'maya@121.com', phone: '+1 555-0103', profilePicture: 'https://images.unsplash.com/photo-1552196564-97c36739f72e?q=80&w=400&auto=format&fit=crop', description: 'Yoga and mindfulness practitioner with 10 years experience.', colorCode: '#10b981', createdAt: Date.now() },
  { id: 't4', facilityIds: ['1', '2'], name: 'James Flex', email: 'james@121.com', phone: '+1 555-0104', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop', description: 'Mobility specialist and calisthenics expert.', colorCode: '#f59e0b', createdAt: Date.now() },
  { id: 't5', facilityIds: ['3'], name: 'Viktor Steel', email: 'viktor@121.com', phone: '+1 555-0105', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', description: 'Heavy lifting and conditioning coach.', colorCode: '#6366f1', createdAt: Date.now() }
];

export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'l1', facilityIds: ['1'], name: 'Main Strength Floor', createdAt: Date.now() },
  { id: 'l2', facilityIds: ['1'], name: 'Boxing Arena', createdAt: Date.now() },
  { id: 'l3', facilityIds: ['2'], name: 'The Sanctuary (Zen)', createdAt: Date.now() },
  { id: 'l4', facilityIds: ['2'], name: 'Open Air Deck', createdAt: Date.now() },
  { id: 'l5', facilityIds: ['3'], name: 'Power Pit', createdAt: Date.now() },
  { id: 'l6', facilityIds: ['3'], name: 'Recovery Zone', createdAt: Date.now() }
];

export const DEFAULT_CLASS_SLOTS: ClassSlot[] = [
  // Monday
  { id: 's1', facilityId: '1', classId: 'c1', trainerId: 't1', locationId: 'l2', dayOfWeek: 1, startTime: '08:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 12 },
  { id: 's2', facilityId: '1', classId: 'c2', trainerId: 't2', locationId: 'l1', dayOfWeek: 1, startTime: '10:00', duration: '45 mins', status: 'available', currentBookings: 8, maxBookings: 15 },
  { id: 's3', facilityId: '2', classId: 'z1', trainerId: 't3', locationId: 'l3', dayOfWeek: 1, startTime: '09:00', duration: '1 hour', status: 'full', currentBookings: 10, maxBookings: 10 },
  // Tuesday
  { id: 's4', facilityId: '1', classId: 'c4', trainerId: 't1', locationId: 'l1', dayOfWeek: 2, startTime: '17:00', duration: '50 mins', status: 'available', currentBookings: 4, maxBookings: 12 },
  { id: 's5', facilityId: '3', classId: 'g1', trainerId: 't5', locationId: 'l6', dayOfWeek: 2, startTime: '18:00', duration: '45 mins', status: 'available', currentBookings: 2, maxBookings: 8 },
  // Wednesday
  { id: 's6', facilityId: '2', classId: 'z2', trainerId: 't3', locationId: 'l3', dayOfWeek: 3, startTime: '12:00', duration: '1 hour', status: 'available', currentBookings: 3, maxBookings: 12 },
  { id: 's7', facilityId: '1', classId: 'c3', trainerId: 't1', locationId: 'l1', dayOfWeek: 3, startTime: '19:00', duration: '1.5 hours', status: 'available', currentBookings: 6, maxBookings: 10 },
  // Thursday
  { id: 's8', facilityId: '1', classId: 'c1', trainerId: 't4', locationId: 'l2', dayOfWeek: 4, startTime: '07:00', duration: '1 hour', status: 'available', currentBookings: 2, maxBookings: 10 },
  // Friday
  { id: 's9', facilityId: '1', classId: 'c2', trainerId: 't2', locationId: 'l1', dayOfWeek: 5, startTime: '16:00', duration: '45 mins', status: 'available', currentBookings: 12, maxBookings: 15 },
  { id: 's10', facilityId: '2', classId: 'z1', trainerId: 't3', locationId: 'l4', dayOfWeek: 5, startTime: '18:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 20 }
];

export const DEFAULT_USERS: User[] = [
  { id: 'u1', email: 'sarah@example.com', fullName: 'Sarah Johnson', phone: '+1 555-1234', gender: 'Female', paymentMethod: 'added', status: 'active', createdAt: Date.now() - 5000000, paymentCards: [] },
  { id: 'u2', email: 'mike@example.com', fullName: 'Mike Ross', phone: '+1 555-4321', gender: 'Male', paymentMethod: 'skipped', status: 'blocked', createdAt: Date.now() - 8000000, paymentCards: [] },
  { id: 'u3', email: 'shubham@gmail.com', fullName: 'Shubham Kumar', phone: '+91 9876543210', gender: 'Male', paymentMethod: 'added', status: 'active', createdAt: Date.now() - 10000000, paymentCards: [
    { id: 'card1', holderName: 'SHUBHAM KUMAR', cardNumber: '•••• •••• •••• 4242', brand: 'Visa', expiryDate: '12/28', isPrimary: true, createdAt: Date.now() }
  ] }
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', facilityId: '1', name: 'Ultra Whey Isolate', price: 69.99, discountPercent: 20, discountedPrice: 54.99, quantity: 25, sizeStocks: [{size: '2kg', quantity: 25}], category: 'Supplements', status: 'active', createdAt: Date.now(), description: 'Premium grass-fed whey isolate. High protein content with minimal carbs.', images: ['https://images.unsplash.com/photo-1593094855729-19c062c97482?q=80&w=400&auto=format&fit=crop'], color: 'Vanilla' },
  { id: 'p2', facilityId: '1', name: 'Performance Tee', price: 35.00, quantity: 50, sizeStocks: [{size: 'M', quantity: 20}, {size: 'L', quantity: 30}], category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Sweat-wicking technical tee for high intensity sessions.', images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop'], color: 'Charcoal' },
  { id: 'p3', facilityId: '2', name: 'Natural Cork Yoga Mat', price: 85.00, quantity: 15, sizeStocks: [{size: 'Standard', quantity: 15}], category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Eco-friendly cork mat with superior grip even when wet.', images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop'], color: 'Natural' }
];

export const DEFAULT_PASSES: Pass[] = [
  { id: 'pass1', facilityId: '1', name: 'Fitness 10-Session Pass', price: 120, credits: 10, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Access to any standard class at 121 Fitness. Save 20% over individual bookings.', quantity: 100, status: 'active', createdAt: Date.now() },
  { id: 'pass2', facilityId: '2', name: 'Zen 5-Pack', price: 90, credits: 5, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Relax and unwind with 5 sessions of your choice.', quantity: 50, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_BLOCKS: Block[] = [
  { id: 'blk1', facilityId: '1', trainerId: 't1', name: 'Pro Boxing Foundation', about: 'Master the fundamentals of professional boxing over 8 weeks.', expect: 'Intense footwork drills, heavy bag work, and defensive mechanics.', numWeeks: 8, daysOfWeek: [1, 3, 5], startDate: Date.now() + 604800000, startTime: '18:00', duration: '1.5 hours', maxPersons: 12, maxPersonsPerBooking: 1, bookingAmount: 100, weeklyAmount: 40, totalAmount: 420, status: 'active', createdAt: Date.now() },
  { id: 'blk2', facilityId: '2', trainerId: 't3', name: 'Yoga Flow Intensive', about: 'A transformative 6-week journey into advanced Vinyasa flow and meditation.', expect: 'Expect to deepen your practice, increase flexibility and focus.', numWeeks: 6, daysOfWeek: [2, 4], startDate: Date.now() + 864000000, startTime: '07:00', duration: '1 hour', maxPersons: 20, maxPersonsPerBooking: 2, bookingAmount: 50, weeklyAmount: 25, totalAmount: 200, status: 'active', createdAt: Date.now() },
  { id: 'blk3', facilityId: '3', trainerId: 't5', name: 'Strength Peak Protocol', about: 'Max out your potential with this 12-week heavy lifting transformation.', expect: 'Structured periodization, form analysis, and strength testing.', numWeeks: 12, daysOfWeek: [1, 3, 5, 6], startDate: Date.now() + 1209600000, startTime: '19:30', duration: '2 hours', maxPersons: 8, maxPersonsPerBooking: 1, bookingAmount: 150, weeklyAmount: 60, totalAmount: 870, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_BOOKINGS: Booking[] = [
  { id: 'b1', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', classId: 'c1', slotId: 's1', trainerId: 't1', locationId: 'l2', bookingDate: Date.now() - 864000000, startTime: '08:00', persons: 1, participantNames: ['Shubham Kumar'], status: 'delivered', type: 'class', amount: 15, createdAt: Date.now() - 900000000 },
  { id: 'b2', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', classId: 'c2', slotId: 's2', trainerId: 't2', locationId: 'l1', bookingDate: Date.now() - 604800000, startTime: '10:00', persons: 1, participantNames: ['Shubham Kumar'], status: 'delivered', type: 'class', amount: 12, createdAt: Date.now() - 700000000 },
  { id: 'b3', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', classId: 'c3', slotId: 's7', trainerId: 't1', locationId: 'l1', bookingDate: Date.now() + 172800000, startTime: '19:00', persons: 1, participantNames: ['Shubham Kumar'], status: 'upcoming', type: 'class', amount: 20, createdAt: Date.now() - 500000 }
];

export const DEFAULT_ORDERS: Order[] = [
  { id: 'o1', orderNumber: 'ORD-A9F2-3B10', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', items: [{ id: 'ci1', productId: 'p1', name: 'Ultra Whey Isolate', price: 54.99, size: '2kg', quantity: 1, image: 'https://images.unsplash.com/photo-1593094855729-19c062c97482?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 54.99, vat: 2.75, serviceCharge: 2.5, total: 60.24, status: 'picked-up', createdAt: Date.now() - 1209600000 },
  { id: 'o2', orderNumber: 'ORD-7K4L-9P0Q', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', items: [{ id: 'ci2', productId: 'p2', name: 'Performance Tee', price: 35.00, size: 'M', quantity: 1, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 35.00, vat: 1.75, serviceCharge: 2.5, total: 39.25, status: 'placed', createdAt: Date.now() - 86400000 }
];

// Demo Block Bookings for User u3 (Shubham)
export const DEFAULT_BLOCK_BOOKINGS: BlockBooking[] = [
  {
    id: 'bb1',
    blockId: 'blk1',
    userId: 'u3',
    userName: 'Shubham Kumar',
    userEmail: 'shubham@gmail.com',
    facilityId: '1',
    trainerId: 't1',
    startDate: Date.now() - 604800000,
    participantNames: ['Shubham Kumar'],
    bookingAmountPaid: true,
    status: 'ongoing',
    createdAt: Date.now() - 604800000
  }
];

export const DEFAULT_BLOCK_PAYMENTS: BlockWeeklyPayment[] = [
  { id: 'bp1', blockBookingId: 'bb1', userId: 'u3', weekNumber: 1, amount: 40, dueDate: Date.now() - 604800000, status: 'paid', paidAt: Date.now() - 604800000 },
  { id: 'bp2', blockBookingId: 'bb1', userId: 'u3', weekNumber: 2, amount: 40, dueDate: Date.now() + 0, status: 'pending' },
  { id: 'bp3', blockBookingId: 'bb1', userId: 'u3', weekNumber: 3, amount: 40, dueDate: Date.now() + 604800000, status: 'pending' },
  { id: 'bp4', blockBookingId: 'bb1', userId: 'u3', weekNumber: 4, amount: 40, dueDate: Date.now() + 1209600000, status: 'pending' }
];
