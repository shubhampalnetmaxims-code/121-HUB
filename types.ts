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
  type: 'class' | 'block';
  amount: number;
  createdAt: number;
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
    features: ['classes', 'timetable', 'memberships', 'marketplace'],
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
    features: ['classes', 'timetable', 'marketplace'],
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
    features: ['classes', 'timetable', 'marketplace'],
    settings: { ...DEFAULT_SETTINGS }
  }
];

export const DEFAULT_CLASSES: Class[] = [
  // 121 Fitness Classes
  { id: 'c1', facilityId: '1', name: 'Boxing', shortDescription: 'High-intensity boxing training for all levels.', duration: '1 hour', requirements: 'Gloves, wraps', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 15, status: 'active' },
  { id: 'c2', facilityId: '1', name: 'Get HIIT', shortDescription: 'Quick bursts of intense exercise followed by rest.', duration: '45 mins', requirements: 'Towel, Water', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 12, status: 'active' },
  { id: 'c3', facilityId: '1', name: 'Power Lifting', shortDescription: 'Master the big three: Squat, Bench, and Deadlift.', duration: '1.5 hours', requirements: 'Lifting shoes', level: 'Expert', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 20, status: 'active' },
  { id: 'c4', facilityId: '1', name: 'Spin Cycle', shortDescription: 'Cardio-heavy cycling session with dynamic music.', duration: '50 mins', requirements: 'Cycle shoes', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 18, status: 'active' },
  { id: 'c5', facilityId: '1', name: 'CrossFit Basics', shortDescription: 'Introduction to varied high-intensity movements.', duration: '1 hour', requirements: 'Towel, Water', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 25, status: 'active' },
  
  // 121 Zen Classes
  { id: 'z1', facilityId: '2', name: 'Zen Flow', shortDescription: 'Gentle flow focusing on alignment and peace.', duration: '1 hour', requirements: 'Yoga mat', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 20, status: 'active' },
  { id: 'z2', facilityId: '2', name: 'Vinyasa Flow', shortDescription: 'Stringing postures together so that you move from one to another.', duration: '1 hour', requirements: 'Yoga mat', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 22, status: 'active' },
  { id: 'z3', facilityId: '2', name: 'Pilates Core', shortDescription: 'Focus on core strength and full body toning.', duration: '45 mins', requirements: 'Pilates ball', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 18, status: 'active' },
  { id: 'z4', facilityId: '2', name: 'Sound Bath', shortDescription: 'Deep relaxation through acoustic sound healing.', duration: '1 hour', requirements: 'Comfortable wear', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1593810450967-f9c42742e326?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 30, status: 'active' },
  { id: 'z5', facilityId: '2', name: 'Tai Chi', shortDescription: 'Internal Chinese martial art practiced for health benefits.', duration: '1 hour', requirements: 'Loose clothing', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 15, status: 'active' },

  // 121 Gym Classes
  { id: 'g1', facilityId: '3', name: 'Recovery Room', shortDescription: 'Guided physical recovery using foam rollers and dynamic stretching.', duration: '45 mins', requirements: 'Comfortable gym wear', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop', createdAt: Date.now(), pricePerSession: 10, status: 'active' }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  // 121 Fitness Trainers
  { id: 't1', facilityIds: ['1'], name: 'Eross Stonkus', email: 'eross@121.com', phone: '+1 555-0101', profilePicture: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop', description: 'Expert trainer with focus on strength and form.', colorCode: '#2563eb', createdAt: Date.now() },
  { id: 't2', facilityIds: ['1'], name: 'Sarah Strong', email: 'sarah@121.com', phone: '+1 555-0102', profilePicture: 'https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=400&auto=format&fit=crop', description: 'HIIT and functional training expert.', colorCode: '#dc2626', createdAt: Date.now() },
  { id: 't3', facilityIds: ['1'], name: 'Dave Iron', email: 'dave@121.com', phone: '+1 555-0103', profilePicture: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=400&auto=format&fit=crop', description: 'Weightlifting specialist and competition coach.', colorCode: '#000000', createdAt: Date.now() },
  { id: 't4', facilityIds: ['1'], name: 'Jess Sprint', email: 'jess@121.com', phone: '+1 555-0104', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop', description: 'Professional track athlete and endurance specialist.', colorCode: '#f59e0b', createdAt: Date.now() },
  { id: 't5', facilityIds: ['1'], name: 'Alex Lift', email: 'alex@121.com', phone: '+1 555-0105', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', description: 'Bodybuilding and aesthetics coach.', colorCode: '#4f46e5', createdAt: Date.now() },
  { id: 't6', facilityIds: ['1'], name: 'Sam Power', email: 'sam@121.com', phone: '+1 555-0106', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop', description: 'Certified CrossFit Level 3 coach.', colorCode: '#10b981', createdAt: Date.now() },
  { id: 't7', facilityIds: ['1'], name: 'Chris Heavy', email: 'chris@121.com', phone: '+1 555-0107', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', description: 'Focus on heavy compound movements.', colorCode: '#7c3aed', createdAt: Date.now() },
  { id: 't8', facilityIds: ['1'], name: 'Pat Form', email: 'pat@121.com', phone: '+1 555-0108', profilePicture: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop', description: 'Mobility and corrective exercise expert.', colorCode: '#db2777', createdAt: Date.now() },
  { id: 't9', facilityIds: ['1'], name: 'Mel Cardio', email: 'mel@121.com', phone: '+1 555-0109', profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', description: 'Cycling and marathon trainer.', colorCode: '#ea580c', createdAt: Date.now() },
  { id: 't10', facilityIds: ['1'], name: 'Ben Bench', email: 'ben@121.com', phone: '+1 555-0110', profilePicture: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&auto=format&fit=crop', description: 'Strength conditioning for beginners.', colorCode: '#1e293b', createdAt: Date.now() },

  // 121 Zen Trainers
  { id: 'z-t1', facilityIds: ['2'], name: 'Luna Peace', email: 'luna@121.com', phone: '+1 555-0201', profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', description: 'Master Yoga instructor with 15 years experience.', colorCode: '#06b6d4', createdAt: Date.now() },
  { id: 'z-t2', facilityIds: ['2'], name: 'Sol Calm', email: 'sol@121.com', phone: '+1 555-0202', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', description: 'Meditation and mindfulness coach.', colorCode: '#8b5cf6', createdAt: Date.now() },
  { id: 'z-t3', facilityIds: ['2'], name: 'Ari Breath', email: 'ari@121.com', phone: '+1 555-0203', profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop', description: 'Breathwork and sound healing specialist.', colorCode: '#f43f5e', createdAt: Date.now() },
  { id: 'z-t4', facilityIds: ['2'], name: 'Kai Flow', email: 'kai@121.com', phone: '+1 555-0204', profilePicture: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&auto=format&fit=crop', description: 'Vinyasa flow and Pilates instructor.', colorCode: '#10b981', createdAt: Date.now() },
  { id: 'z-t5', facilityIds: ['2'], name: 'Noa Still', email: 'noa@121.com', phone: '+1 555-0205', profilePicture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400&auto=format&fit=crop', description: 'Yin Yoga and deep stretch specialist.', colorCode: '#3b82f6', createdAt: Date.now() },
  { id: 'z-t6', facilityIds: ['2'], name: 'Zen Master', email: 'zen@121.com', phone: '+1 555-0206', profilePicture: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop', description: 'Traditional Tai Chi practitioner.', colorCode: '#64748b', createdAt: Date.now() },
  { id: 'z-t7', facilityIds: ['2'], name: 'Gaia Earth', email: 'gaia@121.com', phone: '+1 555-0207', profilePicture: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop', description: 'Nature-focused meditation therapy.', colorCode: '#166534', createdAt: Date.now() },
  { id: 'z-t8', facilityIds: ['2'], name: 'Sky Blue', email: 'sky@121.com', phone: '+1 555-0208', profilePicture: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop', description: 'Aerial Yoga and flexibility expert.', colorCode: '#0ea5e9', createdAt: Date.now() },
  { id: 'z-t9', facilityIds: ['2'], name: 'Rain Wash', email: 'rain@121.com', phone: '+1 555-0209', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', description: 'Reiki master and energy healer.', colorCode: '#4338ca', createdAt: Date.now() },
  { id: 'z-t10', facilityIds: ['2'], name: 'Ohm Sound', email: 'ohm@121.com', phone: '+1 555-0210', profilePicture: 'https://images.unsplash.com/photo-1564564321837-a57b60844e17?q=80&w=400&auto=format&fit=crop', description: 'Tibetan singing bowl expert.', colorCode: '#f97316', createdAt: Date.now() },

  // 121 Gym Trainers
  { id: 'g-t1', facilityIds: ['3'], name: 'Marcus Roll', email: 'marcus@121.com', phone: '+1 555-0301', profilePicture: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop', description: 'Physiotherapist and recovery specialist.', colorCode: '#10b981', createdAt: Date.now() }
];

export const DEFAULT_LOCATIONS: Location[] = [
  // 121 Fitness Locations
  { id: 'l1', facilityIds: ['1'], name: 'Main Strength Floor', createdAt: Date.now() },
  { id: 'l2', facilityIds: ['1'], name: 'Cardio Deck', createdAt: Date.now() },
  { id: 'l3', facilityIds: ['1'], name: 'Boxing Arena', createdAt: Date.now() },
  { id: 'l4', facilityIds: ['1'], name: 'HIIT Studio', createdAt: Date.now() },
  { id: 'l5', facilityIds: ['1'], name: 'Recovery Suite', createdAt: Date.now() },
  { id: 'l6', facilityIds: ['1'], name: 'Rooftop Gym', createdAt: Date.now() },
  { id: 'l7', facilityIds: ['1'], name: 'Spin Studio', createdAt: Date.now() },
  { id: 'l8', facilityIds: ['1'], name: 'CrossFit Box', createdAt: Date.now() },
  { id: 'l9', facilityIds: ['1'], name: 'Weightlifting Zone', createdAt: Date.now() },
  { id: 'l10', facilityIds: ['1'], name: 'Personal Training Pod', createdAt: Date.now() },

  // 121 Zen Locations
  { id: 'z-l1', facilityIds: ['2'], name: 'Zen Garden', createdAt: Date.now() },
  { id: 'z-l2', facilityIds: ['2'], name: 'Lotus Studio', createdAt: Date.now() },
  { id: 'z-l3', facilityIds: ['2'], name: 'Moon Room', createdAt: Date.now() },
  { id: 'z-l4', facilityIds: ['2'], name: 'Sun Studio', createdAt: Date.now() },
  { id: 'z-l5', facilityIds: ['2'], name: 'Silent Corridor', createdAt: Date.now() },
  { id: 'z-l6', facilityIds: ['2'], name: 'Meditation Pod 1', createdAt: Date.now() },
  { id: 'z-l7', facilityIds: ['2'], name: 'Meditation Pod 2', createdAt: Date.now() },
  { id: 'z-l8', facilityIds: ['2'], name: 'Tea Lounge', createdAt: Date.now() },
  { id: 'z-l9', facilityIds: ['2'], name: 'Arrival Court', createdAt: Date.now() },
  { id: 'z-l10', facilityIds: ['2'], name: 'Changing Suite', createdAt: Date.now() },

  // 121 Gym Locations
  { id: 'g-l1', facilityIds: ['3'], name: 'Therapy Zone', createdAt: Date.now() },
  { id: 'g-l2', facilityIds: ['3'], name: 'Recovery Lounge', createdAt: Date.now() }
];

const TWO_MONTHS_FROM_NOW = Date.now() + (60 * 24 * 60 * 60 * 1000);

export const DEFAULT_CLASS_SLOTS: ClassSlot[] = [
  // 121 Fitness Schedule (Next 2 Months Repeating)
  { id: 's1', facilityId: '1', classId: 'c1', trainerId: 't1', locationId: 'l3', dayOfWeek: 1, startTime: '09:00', duration: '1 hour', status: 'available', currentBookings: 8, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's2', facilityId: '1', classId: 'c1', trainerId: 't2', locationId: 'l3', dayOfWeek: 3, startTime: '17:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's3', facilityId: '1', classId: 'c1', trainerId: 't3', locationId: 'l3', dayOfWeek: 5, startTime: '10:00', duration: '1 hour', status: 'available', currentBookings: 12, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's4', facilityId: '1', classId: 'c2', trainerId: 't4', locationId: 'l4', dayOfWeek: 2, startTime: '08:00', duration: '45 mins', status: 'available', currentBookings: 15, maxBookings: 20, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's5', facilityId: '1', classId: 'c2', trainerId: 't5', locationId: 'l4', dayOfWeek: 4, startTime: '18:00', duration: '45 mins', status: 'available', currentBookings: 10, maxBookings: 20, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's6', facilityId: '1', classId: 'c2', trainerId: 't6', locationId: 'l4', dayOfWeek: 6, startTime: '09:00', duration: '45 mins', status: 'available', currentBookings: 4, maxBookings: 20, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's7', facilityId: '1', classId: 'c3', trainerId: 't7', locationId: 'l9', dayOfWeek: 1, startTime: '18:00', duration: '1.5 hours', status: 'available', currentBookings: 2, maxBookings: 6, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's8', facilityId: '1', classId: 'c3', trainerId: 't8', locationId: 'l9', dayOfWeek: 4, startTime: '10:00', duration: '1.5 hours', status: 'available', currentBookings: 1, maxBookings: 6, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's9', facilityId: '1', classId: 'c4', trainerId: 't9', locationId: 'l7', dayOfWeek: 2, startTime: '17:00', duration: '50 mins', status: 'available', currentBookings: 25, maxBookings: 30, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's10', facilityId: '1', classId: 'c4', trainerId: 't10', locationId: 'l7', dayOfWeek: 5, startTime: '07:00', duration: '50 mins', status: 'available', currentBookings: 18, maxBookings: 30, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's11', facilityId: '1', classId: 'c4', trainerId: 't1', locationId: 'l7', dayOfWeek: 0, startTime: '10:00', duration: '50 mins', status: 'available', currentBookings: 20, maxBookings: 30, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's12', facilityId: '1', classId: 'c5', trainerId: 't2', locationId: 'l8', dayOfWeek: 3, startTime: '10:00', duration: '1 hour', status: 'available', currentBookings: 8, maxBookings: 15, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 's13', facilityId: '1', classId: 'c5', trainerId: 't3', locationId: 'l8', dayOfWeek: 6, startTime: '11:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 15, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },

  // 121 Zen Schedule (Next 2 Months Repeating)
  { id: 'z-s1', facilityId: '2', classId: 'z1', trainerId: 'z-t1', locationId: 'z-l1', dayOfWeek: 1, startTime: '08:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 10, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s2', facilityId: '2', classId: 'z1', trainerId: 'z-t2', locationId: 'z-l1', dayOfWeek: 3, startTime: '08:00', duration: '1 hour', status: 'available', currentBookings: 3, maxBookings: 10, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s3', facilityId: '2', classId: 'z1', trainerId: 'z-t3', locationId: 'z-l1', dayOfWeek: 5, startTime: '08:00', duration: '1 hour', status: 'available', currentBookings: 9, maxBookings: 10, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s4', facilityId: '2', classId: 'z2', trainerId: 'z-t4', locationId: 'z-l2', dayOfWeek: 2, startTime: '10:00', duration: '1 hour', status: 'available', currentBookings: 12, maxBookings: 15, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s5', facilityId: '2', classId: 'z2', trainerId: 'z-t5', locationId: 'z-l2', dayOfWeek: 4, startTime: '17:00', duration: '1 hour', status: 'available', currentBookings: 8, maxBookings: 15, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s6', facilityId: '2', classId: 'z2', trainerId: 'z-t6', locationId: 'z-l2', dayOfWeek: 6, startTime: '10:00', duration: '1 hour', status: 'available', currentBookings: 15, maxBookings: 15, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s7', facilityId: '2', classId: 'z3', trainerId: 'z-t7', locationId: 'z-l4', dayOfWeek: 1, startTime: '17:00', duration: '45 mins', status: 'available', currentBookings: 10, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s8', facilityId: '2', classId: 'z3', trainerId: 'z-t8', locationId: 'z-l4', dayOfWeek: 4, startTime: '08:00', duration: '45 mins', status: 'available', currentBookings: 4, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s9', facilityId: '2', classId: 'z4', trainerId: 'z-t9', locationId: 'z-l3', dayOfWeek: 3, startTime: '19:00', duration: '1 hour', status: 'available', currentBookings: 15, maxBookings: 20, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s10', facilityId: '2', classId: 'z4', trainerId: 'z-t10', locationId: 'z-l3', dayOfWeek: 0, startTime: '18:00', duration: '1 hour', status: 'available', currentBookings: 18, maxBookings: 20, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s11', facilityId: '2', classId: 'z5', trainerId: 'z-t1', locationId: 'z-l2', dayOfWeek: 6, startTime: '08:00', duration: '1 hour', status: 'available', currentBookings: 2, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'z-s12', facilityId: '2', classId: 'z5', trainerId: 'z-t2', locationId: 'z-l2', dayOfWeek: 0, startTime: '09:00', duration: '1 hour', status: 'available', currentBookings: 5, maxBookings: 12, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },

  // 121 Gym Schedule
  { id: 'g-s1', facilityId: '3', classId: 'g1', trainerId: 'g-t1', locationId: 'g-l1', dayOfWeek: 1, startTime: '14:00', duration: '45 mins', status: 'available', currentBookings: 4, maxBookings: 10, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW },
  { id: 'g-s2', facilityId: '3', classId: 'g1', trainerId: 'g-t1', locationId: 'g-l1', dayOfWeek: 4, startTime: '16:00', duration: '45 mins', status: 'available', currentBookings: 2, maxBookings: 10, startDate: Date.now(), endDate: TWO_MONTHS_FROM_NOW }
];

export const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    facilityId: '1',
    classId: 'c1',
    slotId: 's1',
    trainerId: 't1',
    locationId: 'l3',
    bookingDate: Date.now() + 86400000,
    startTime: '09:00',
    persons: 2,
    participantNames: ['Sarah Johnson', 'Amy Smith'],
    status: 'upcoming',
    type: 'class',
    amount: 30,
    createdAt: Date.now()
  },
  {
    id: 'b2',
    userId: 'u2',
    userName: 'Mike Ross',
    userEmail: 'mike@example.com',
    facilityId: '1',
    classId: 'c2',
    slotId: 's4',
    trainerId: 't4',
    locationId: 'l4',
    bookingDate: Date.now() + 172800000,
    startTime: '08:00',
    persons: 1,
    participantNames: ['Mike Ross'],
    status: 'rescheduled',
    type: 'class',
    amount: 12,
    createdAt: Date.now()
  },
  {
    id: 'b3',
    userId: 'u1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    facilityId: '2',
    classId: 'z1',
    slotId: 'z-s1',
    trainerId: 'z-t1',
    locationId: 'z-l1',
    bookingDate: Date.now() - 86400000,
    startTime: '08:00',
    persons: 1,
    participantNames: ['Sarah Johnson'],
    status: 'delivered',
    type: 'class',
    amount: 20,
    createdAt: Date.now() - 172800000
  },
  {
    id: 'b4',
    userId: 'u2',
    userName: 'Mike Ross',
    userEmail: 'mike@example.com',
    facilityId: '1',
    classId: 'c3',
    slotId: 's7',
    trainerId: 't7',
    locationId: 'l9',
    bookingDate: Date.now() + 259200000,
    startTime: '18:00',
    persons: 1,
    participantNames: ['Mike Ross'],
    status: 'cancelled',
    type: 'class',
    amount: 20,
    createdAt: Date.now()
  },
  {
    id: 'b5',
    userId: 'u1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    facilityId: '2',
    classId: 'z2',
    slotId: 'z-s4',
    trainerId: 'z-t4',
    locationId: 'z-l2',
    bookingDate: Date.now() + 345600000,
    startTime: '10:00',
    persons: 3,
    participantNames: ['Sarah Johnson', 'Guest 1', 'Guest 2'],
    status: 'upcoming',
    type: 'class',
    amount: 66,
    createdAt: Date.now()
  },
  {
    id: 'b6',
    userId: 'u2',
    userName: 'Mike Ross',
    userEmail: 'mike@example.com',
    facilityId: '1',
    classId: 'c4',
    slotId: 's9',
    trainerId: 't9',
    locationId: 'l7',
    bookingDate: Date.now() + 432000000,
    startTime: '17:00',
    persons: 1,
    participantNames: ['Mike Ross'],
    status: 'upcoming',
    type: 'class',
    amount: 18,
    createdAt: Date.now()
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  // 121 Fitness Products (20+)
  { id: 'p1', facilityId: '1', name: 'Ultra Whey Isolate', price: 54.99, quantity: 25, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Premium grass-fed whey isolate.', images: ['https://images.unsplash.com/photo-1593094855729-19c062c97482?q=80&w=400&auto=format&fit=crop'], size: '2kg', color: 'Vanilla' },
  { id: 'p2', facilityId: '1', name: 'Performance Tech Tee', price: 29.99, quantity: 50, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Moisture-wicking fabric.', images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400&auto=format&fit=crop'], size: 'S, M, L, XL', color: 'Midnight Black' },
  { id: 'p3', facilityId: '1', name: 'Leather Lift Straps', price: 15.00, quantity: 30, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Heavy-duty lifting straps.', images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'], color: 'Tan Brown' },
  { id: 'p4', facilityId: '1', name: 'Insulated Shaker Bottle', price: 22.50, quantity: 40, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Double-walled shaker.', images: ['https://images.unsplash.com/photo-1603504313271-9f9390236a99?q=80&w=400&auto=format&fit=crop'], color: 'Slate Grey' },
  { id: 'p5', facilityId: '1', name: 'Ignite Pre-Workout', price: 39.99, quantity: 20, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Explosive energy formula.', images: ['https://images.unsplash.com/photo-1579722820308-d74e5719d54e?q=80&w=400&auto=format&fit=crop'], size: '30 Servings', color: 'Fruit Punch' },
  { id: 'p6', facilityId: '1', name: 'High-Density Foam Roller', price: 34.00, quantity: 15, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Extra firm roller.', images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=400&auto=format&fit=crop'], color: 'Deep Blue' },
  { id: 'p7', facilityId: '1', name: 'Training Shorts 7"', price: 35.00, quantity: 35, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Unrestricted movement.', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400&auto=format&fit=crop'], size: 'M, L, XL', color: 'Charcoal' },
  { id: 'p8', facilityId: '1', name: 'Raw Energy Bar', price: 3.50, quantity: 100, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Quick energy bite.', images: ['https://images.unsplash.com/photo-1622467820321-4245646194b6?q=80&w=400&auto=format&fit=crop'], size: '60g' },
  { id: 'p9', facilityId: '1', name: 'Anti-Slip Gym Towel', price: 18.00, quantity: 60, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Compact microfiber towel.', images: ['https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=400&auto=format&fit=crop'], color: 'Neon Lime' },
  { id: 'p10', facilityId: '1', name: 'Speed Jump Rope', price: 12.00, quantity: 45, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Adjustable steel wire rope.', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917a63e?q=80&w=400&auto=format&fit=crop'], color: 'Black' },
  { id: 'p11', facilityId: '1', name: 'Creatine Monohydrate', price: 24.99, quantity: 30, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Pure performance boost.', images: ['https://images.unsplash.com/photo-1593094855729-19c062c97482?q=80&w=400&auto=format&fit=crop'], size: '500g' },
  { id: 'p12', facilityId: '1', name: 'Wrist Wraps', price: 18.50, quantity: 25, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Maximum wrist support.', images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'], color: 'Camo' },
  { id: 'p13', facilityId: '1', name: 'Compression Socks', price: 14.00, quantity: 40, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Improve circulation.', images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=400&auto=format&fit=crop'], size: 'L' },
  { id: 'p14', facilityId: '1', name: 'Gym Duffel Bag', price: 55.00, quantity: 15, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Durable and spacious.', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop'], color: 'Black' },
  { id: 'p15', facilityId: '1', name: 'Lifting Belt', price: 45.00, quantity: 10, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Genuine leather support.', images: ['https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=400&auto=format&fit=crop'], size: 'M' },
  { id: 'p16', facilityId: '1', name: 'Training Tank', price: 22.00, quantity: 30, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Maximum breathability.', images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400&auto=format&fit=crop'], color: 'Grey' },
  { id: 'p17', facilityId: '1', name: 'BCAA Recovery Mix', price: 32.00, quantity: 25, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Optimized hydration mix.', images: ['https://images.unsplash.com/photo-1579722820308-d74e5719d54e?q=80&w=400&auto=format&fit=crop'], color: 'Blue Raz' },
  { id: 'p18', facilityId: '1', name: 'Resistance Band Set', price: 28.00, quantity: 20, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Set of 5 tension levels.', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917a63e?q=80&w=400&auto=format&fit=crop'], color: 'Multicolor' },
  { id: 'p19', facilityId: '1', name: 'Performance Headband', price: 8.50, quantity: 50, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Keep sweat away.', images: ['https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=400&auto=format&fit=crop'], color: 'White' },
  { id: 'p20', facilityId: '1', name: 'Massage Ball', price: 12.50, quantity: 35, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Targeted trigger point relief.', images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=400&auto=format&fit=crop'], color: 'Black' },

  // 121 Zen Products (20+)
  { id: 'z-p1', facilityId: '2', name: 'Natural Cork Yoga Mat', price: 85.00, quantity: 15, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Sustainable cork surface.', images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop'], size: '6mm Thick', color: 'Natural' },
  { id: 'z-p2', facilityId: '2', name: 'Bamboo Insulated Flask', price: 28.00, quantity: 20, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Eco-friendly bamboo.', images: ['https://images.unsplash.com/photo-1523362628744-0c1df961903f?q=80&w=400&auto=format&fit=crop'], color: 'Bamboo' },
  { id: 'z-p3', facilityId: '2', name: 'Silk Lavender Eye Pillow', price: 18.00, quantity: 30, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Organic lavender scent.', images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'], color: 'Lilac' },
  { id: 'z-p4', facilityId: '2', name: 'Seamless Flow Leggings', price: 55.00, quantity: 40, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'High-waisted compression.', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=400&auto=format&fit=crop'], size: 'XS, S, M, L', color: 'Sage Green' },
  { id: 'z-p5', facilityId: '2', name: 'Organic Sleep Tea Mix', price: 14.50, quantity: 50, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'A calming herbal blend.', images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop'], size: '20 Bags' },
  { id: 'z-p6', facilityId: '2', name: 'Buckwheat Zafu Cushion', price: 42.00, quantity: 12, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Ergonomic alignment.', images: ['https://images.unsplash.com/photo-1593810450967-f9c42742e326?q=80&w=400&auto=format&fit=crop'], color: 'Earthy Grey' },
  { id: 'z-p7', facilityId: '2', name: 'D-Ring Yoga Strap', price: 12.00, quantity: 25, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Extra-long 8ft strap.', images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'], color: 'Off-White' },
  { id: 'z-p8', facilityId: '2', name: 'Mindfulness Soy Candle', price: 24.00, quantity: 20, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Handpoured soy wax.', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&auto=format&fit=crop'], color: 'Glass White' },
  { id: 'z-p9', facilityId: '2', name: 'Zen Oversized Hoodie', price: 65.00, quantity: 25, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Organic cotton comfort.', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop'], size: 'One Size', color: 'Sand' },
  { id: 'z-p10', facilityId: '2', name: 'Yoga Grip Socks', price: 15.00, quantity: 45, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Toe-less stability design.', images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=400&auto=format&fit=crop'], size: 'S/M', color: 'Slate' },
  { id: 'z-p11', facilityId: '2', name: 'Essential Oil Set', price: 35.00, quantity: 15, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Lavender, Mint, Citrus.', images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop'], size: '3 x 10ml' },
  { id: 'z-p12', facilityId: '2', name: 'Meditation Journal', price: 18.00, quantity: 30, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Lined pages for reflection.', images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop'], color: 'Earth Brown' },
  { id: 'z-p13', facilityId: '2', name: 'Incense Burner', price: 22.00, quantity: 10, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Handcrafted ceramic.', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&auto=format&fit=crop'], color: 'Black' },
  { id: 'z-p14', facilityId: '2', name: 'Silk Sleep Mask', price: 14.00, quantity: 40, category: 'Accessories', status: 'active', createdAt: Date.now(), description: '100% pure mulberry silk.', images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'], color: 'Peach' },
  { id: 'z-p15', facilityId: '2', name: 'Cork Yoga Block', price: 16.00, quantity: 50, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Firm eco-friendly support.', images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop'], color: 'Tan' },
  { id: 'z-p16', facilityId: '2', name: 'Bamboo Tote Bag', price: 12.00, quantity: 60, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Sustainable carry-all.', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop'], color: 'Off-White' },
  { id: 'z-p17', facilityId: '2', name: 'Tibetan Singing Bowl', price: 120.00, quantity: 5, category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Authentic resonance bowl.', images: ['https://images.unsplash.com/photo-1593810450967-f9c42742e326?q=80&w=400&auto=format&fit=crop'], color: 'Brass' },
  { id: 'z-p18', facilityId: '2', name: 'Relaxation Spray', price: 12.50, quantity: 40, category: 'Consumables', status: 'active', createdAt: Date.now(), description: 'Lavender and chamomile mist.', images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop'], size: '100ml' },
  { id: 'z-p19', facilityId: '2', name: 'Linen Robe', price: 45.00, quantity: 20, category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Lightweight and breathable.', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop'], color: 'Cloud Grey' },
  { id: 'z-p20', facilityId: '2', name: 'Yoga Mat Bag', price: 25.00, quantity: 25, category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Fits any standard mat.', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop'], color: 'Forest Green' }
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