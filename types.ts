export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: number;
  features: string[];
  settings?: {
    canCancelBooking: boolean;
    canRescheduleBooking: boolean;
    canCancelOrder: boolean;
    canCancelMembership: boolean;
    canCancelBlock: boolean;
    refundPolicyClasses?: string;
    refundPolicyOrders?: string;
    refundPolicyMemberships?: string;
    refundPolicyBlocks?: string;
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
  daysOfWeek: number[];
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
  status: 'pending' | 'paid';
}

export interface Trainer {
  id: string;
  facilityIds: string[];
  name: string;
  email: string;
  phone: string;
  password?: string;
  isFirstLogin: boolean;
  profilePicture?: string;
  description: string;
  speciality?: string;
  experience?: string;
  colorCode: string;
  createdAt: number;
  permissions: {
    canCancel: boolean;
    canReschedule: boolean;
  };
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
  dayOfWeek: number;
  startTime: string;
  duration: string;
  status: 'available' | 'full' | 'waiting';
  trainerStatus: 'pending' | 'accepted' | 'not-available'; 
  isDelivered: boolean; 
  commonFeedback?: string; 
  currentBookings: number;
  maxBookings: number;
  startDate?: number; 
  endDate?: number;   
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
  bookingDate: number;
  startTime: string;
  persons: number;
  participantNames: string[];
  status: 'upcoming' | 'rescheduled' | 'cancelled' | 'delivered';
  attendanceStatus: 'pending' | 'present' | 'absent'; 
  feedbackFromTrainer?: string; 
  paymentStatus?: 'paid' | 'processing' | 'completed' | 'refunded';
  type: 'class' | 'block' | 'pass';
  amount: number;
  createdAt: number;
  usedPassId?: string;
  rewardPointsEarned?: number;
  rewardPointsUsed?: number;
  rewardDiscount?: number;
}

export interface Pass {
  id: string;
  facilityId: string;
  name: string;
  price: number;
  credits: number;
  personsPerBooking: number;
  allowedClassIds: string[];
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

export interface Membership {
  id: string;
  facilityId: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
  allow24Hour: boolean;
  startTime?: string;
  endTime?: string;
  daysOfWeek: number[];
  status: 'active' | 'inactive';
  createdAt: number;
  directDiscountEnabled?: boolean;
  directDiscountValue?: number;
  directDiscountType?: 'flat' | 'percent';
  rewardPointsEnabled?: boolean;
  rewardPointsValue?: number;
}

export interface UserMembership {
  id: string;
  userId: string;
  membershipId: string;
  facilityId: string;
  title: string;
  startDate: number;
  endDate: number;
  price: number;
  allow24Hour: boolean;
  startTime?: string;
  endTime?: string;
  daysOfWeek: number[];
  status: 'active' | 'expired' | 'cancelled';
  purchasedAt: number;
}

export interface Measurement {
  id: string;
  userId: string;
  date: number;
  weight: number;
  height: number;
  age: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  triceps?: number;
  thighs?: number;
  bmi: number;
  bodyFatPercentage?: number;
  leanBodyMass?: number;
}

export interface PhotoLog {
  id: string;
  userId: string;
  date: number;
  imageUrl: string;
  note?: string;
}

export interface ProductSizeStock {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  facilityId: string;
  name: string;
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  quantity: number;
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
  status: 'placed' | 'picked-up' | 'cancelled';
  paymentStatus?: 'paid' | 'processing' | 'completed' | 'refunded';
  createdAt: number;
  rewardPointsUsed?: number;
  rewardDiscount?: number;
}

export interface PaymentCard {
  id: string;
  holderName: string;
  cardNumber: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Other';
  expiryDate: string;
  isPrimary: boolean;
  createdAt: number;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  date: number;
  type: 'earned' | 'used';
  source: 'booking' | 'block' | 'order' | 'pass' | 'membership' | 'manual';
  referenceId: string;
  points: number;
  remainingBalance: number;
  facilityId?: string;
}

export interface RewardEarningConfig {
  enabled: boolean;
  points: number;
  facilityIds: string[];
}

export interface RewardSettings {
  classes: RewardEarningConfig;
  passes: RewardEarningConfig;
  blocks: RewardEarningConfig;
  orders: RewardEarningConfig;
  memberships: RewardEarningConfig;
  redemption: {
    enabled: boolean;
    pointsToValue: number;
    monetaryValue: number;
    minPointsRequired: number;
    enabledModules: string[];
  };
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
  rewardPoints: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  createdAt: number;
  isRead: boolean;
  target: 'admin' | string;
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
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_SETTINGS = {
  canCancelBooking: true,
  canRescheduleBooking: true,
  canCancelOrder: true,
  canCancelMembership: true,
  canCancelBlock: true,
  refundPolicyClasses: "Full refund if cancelled 24 hours before session.",
  refundPolicyOrders: "Full refund if cancelled before pickup.",
  refundPolicyMemberships: "Partial refund based on remaining duration.",
  refundPolicyBlocks: "Refund only possible before program start date."
};

export const DEFAULT_FACILITIES: Facility[] = [
  { id: '1', name: '121 Gym', description: 'Elite bodybuilding and heavy lifting hub.', icon: 'Dumbbell', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop', isActive: true, createdAt: Date.now(), features: ['classes', 'timetable', 'passes', 'memberships', 'marketplace'], settings: DEFAULT_SETTINGS },
  { id: '2', name: '121 Fitness', description: 'Dynamic group classes and cardio zones.', icon: 'Activity', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000&auto=format&fit=crop', isActive: true, createdAt: Date.now(), features: ['classes', 'timetable', 'passes', 'memberships', 'marketplace'], settings: DEFAULT_SETTINGS },
  { id: '3', name: '121 Zen', description: 'Mindfulness, meditation, and yoga sanctuary.', icon: 'Flower2', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop', isActive: true, createdAt: Date.now(), features: ['classes', 'timetable', 'passes', 'memberships', 'marketplace'], settings: DEFAULT_SETTINGS }
];

export const DEFAULT_USERS: User[] = [
  { id: 'u3', email: 'shubham@gmail.com', fullName: 'Shubham Kumar', phone: '+91 9876543210', gender: 'Male', paymentMethod: 'added', status: 'active', createdAt: Date.now() - 10000000, paymentCards: [{ id: 'card1', holderName: 'SHUBHAM KUMAR', cardNumber: '•••• •••• •••• 4242', brand: 'Visa', expiryDate: '12/28', isPrimary: true, createdAt: Date.now() }], rewardPoints: 1350 }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  { id: 't1', name: 'Rahul Sharma', email: 'rahul@121.com', phone: '+91 9000000001', facilityIds: ['1'], profilePicture: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop', colorCode: '#2563eb', createdAt: Date.now(), isFirstLogin: false, description: 'Master of Strength', permissions: { canCancel: true, canReschedule: true } },
  { id: 't2', name: 'Amit Verma', email: 'amit@121.com', phone: '+91 9000000002', facilityIds: ['1'], profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop', colorCode: '#dc2626', createdAt: Date.now(), isFirstLogin: false, description: 'Conditioning Specialist', permissions: { canCancel: true, canReschedule: true } },
  { id: 't3', name: 'Neha Singh', email: 'neha@121.com', phone: '+91 9000000003', facilityIds: ['1'], profilePicture: 'https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=400&auto=format&fit=crop', colorCode: '#16a34a', createdAt: Date.now(), isFirstLogin: false, description: 'Hypertrophy Coach', permissions: { canCancel: true, canReschedule: true } },
  { id: 't4', name: 'Pooja Mehta', email: 'pooja@121.com', phone: '+91 9000000004', facilityIds: ['2'], profilePicture: 'https://images.unsplash.com/photo-1552196564-97c36739f72e?q=80&w=400&auto=format&fit=crop', colorCode: '#9333ea', createdAt: Date.now(), isFirstLogin: false, description: 'Zumba & Aerobics', permissions: { canCancel: false, canReschedule: true } },
  { id: 't5', name: 'Karan Malhotra', email: 'karan@121.com', phone: '+91 9000000005', facilityIds: ['2'], profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', colorCode: '#ea580c', createdAt: Date.now(), isFirstLogin: false, description: 'Cardio Blast Master', permissions: { canCancel: false, canReschedule: true } },
  { id: 't6', name: 'Anjali Desai', email: 'anjali@121.com', phone: '+91 9000000006', facilityIds: ['3'], profilePicture: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop', colorCode: '#0891b2', createdAt: Date.now(), isFirstLogin: false, description: 'Yoga Guru', permissions: { canCancel: true, canReschedule: false } },
  { id: 't7', name: 'Ritu Kapoor', email: 'ritu@121.com', phone: '+91 9000000007', facilityIds: ['3'], profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', colorCode: '#db2777', createdAt: Date.now(), isFirstLogin: false, description: 'Meditation & Breathwork', permissions: { canCancel: true, canReschedule: false } }
];

export const DEFAULT_CLASSES: Class[] = [
  { id: 'c1', facilityId: '1', name: 'Strength Training', shortDescription: 'Heavy compound lifts.', duration: '1 hour', requirements: 'Lifting shoes', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop', pricePerSession: 25, status: 'active', createdAt: Date.now() },
  { id: 'c2', facilityId: '1', name: 'HIIT Workout', shortDescription: 'High intensity intervals.', duration: '45 mins', requirements: 'Towel', level: 'Expert', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', pricePerSession: 20, status: 'active', createdAt: Date.now() },
  { id: 'c3', facilityId: '1', name: 'Weight Loss Program', shortDescription: 'Fat burning circuit.', duration: '1 hour', requirements: 'Sweat towel', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop', pricePerSession: 30, status: 'active', createdAt: Date.now() },
  { id: 'c4', facilityId: '2', name: 'Zumba', shortDescription: 'Dance fitness party.', duration: '1 hour', requirements: 'Active wear', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=600&auto=format&fit=crop', pricePerSession: 15, status: 'active', createdAt: Date.now() },
  { id: 'c5', facilityId: '2', name: 'Cardio Blast', shortDescription: 'Pure cardio burn.', duration: '45 mins', requirements: 'Running shoes', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=600&auto=format&fit=crop', pricePerSession: 20, status: 'active', createdAt: Date.now() },
  { id: 'c6', facilityId: '3', name: 'Yoga Flow', shortDescription: 'Vinyasa sequences.', duration: '1.5 hours', requirements: 'Mat', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=1000&auto=format&fit=crop', pricePerSession: 35, status: 'active', createdAt: Date.now() },
  { id: 'c7', facilityId: '3', name: 'Meditation', shortDescription: 'Deep mindfulness.', duration: '1 hour', requirements: 'Comfortable clothing', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop', pricePerSession: 25, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'l1', facilityIds: ['1'], name: 'Main Power Floor', createdAt: Date.now() },
  { id: 'l2', facilityIds: ['2'], name: 'Dance Studio A', createdAt: Date.now() },
  { id: 'l3', facilityIds: ['3'], name: 'Zen Garden', createdAt: Date.now() }
];

export const DEFAULT_CLASS_SLOTS: ClassSlot[] = [
  { id: 's1', facilityId: '1', classId: 'c1', trainerId: 't1', locationId: 'l1', dayOfWeek: 1, startTime: '07:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 5, maxBookings: 12 },
  { id: 's2', facilityId: '1', classId: 'c2', trainerId: 't1', locationId: 'l1', dayOfWeek: 2, startTime: '06:00', duration: '45 mins', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 8, maxBookings: 15 },
  { id: 's3', facilityId: '2', classId: 'c4', trainerId: 't4', locationId: 'l2', dayOfWeek: 1, startTime: '06:30', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 10, maxBookings: 20 },
  { id: 's4', facilityId: '3', classId: 'c6', trainerId: 't6', locationId: 'l3', dayOfWeek: 1, startTime: '07:00', duration: '1.5 hours', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 4, maxBookings: 10 }
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', facilityId: '1', name: 'Protein Powder', price: 40, discountedPrice: 36, discountPercent: 10, quantity: 50, sizeStocks: [{size: '2kg', quantity: 50}], category: 'Supplements', status: 'active', createdAt: Date.now(), description: 'Ultra filtered whey.', images: ['https://images.unsplash.com/photo-1593094855729-19c062c97482?q=80&w=400&auto=format&fit=crop'], color: 'Vanilla' },
  { id: 'p2', facilityId: '1', name: 'Gym Gloves', price: 15, quantity: 20, sizeStocks: [{size: 'M', quantity: 20}], category: 'Gear', status: 'active', createdAt: Date.now(), description: 'Superior grip.', images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p3', facilityId: '3', name: 'Yoga Mat', price: 30, discountedPrice: 25.5, discountPercent: 15, quantity: 15, sizeStocks: [{size: 'Standard', quantity: 15}], category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Eco-friendly grip.', images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop'] }
];

export const DEFAULT_PASSES: Pass[] = [
  { id: 'pass1', facilityId: '1', name: '10 Class Pass', price: 180, credits: 10, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Bulk sessions for Gym.', quantity: 100, status: 'active', createdAt: Date.now() },
  { id: 'pass2', facilityId: '2', name: 'Unlimited Fitness Pass', price: 150, credits: 99, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Monthly fitness burn.', quantity: 50, status: 'active', createdAt: Date.now() },
  { id: 'pass3', facilityId: '3', name: 'Zen 5 Session Pass', price: 150, credits: 5, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Deep meditation pack.', quantity: 50, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_MEMBERSHIPS: Membership[] = [
  { id: 'm1', facilityId: '1', title: 'Monthly Gym Access', description: '24/7 weight floor access.', price: 99, durationDays: 30, allow24Hour: true, daysOfWeek: [0,1,2,3,4,5,6], status: 'active', createdAt: Date.now() },
  { id: 'm2', facilityId: '2', title: 'Fitness Monthly', description: 'All group classes included.', price: 89, durationDays: 30, allow24Hour: false, startTime: '06:00', endTime: '22:00', daysOfWeek: [0,1,2,3,4,5,6], status: 'active', createdAt: Date.now() },
  { id: 'm3', facilityId: '3', title: 'Zen Monthly', description: 'Peace and mindfulness.', price: 129, durationDays: 30, allow24Hour: false, startTime: '06:00', endTime: '21:00', daysOfWeek: [0,1,2,3,4,5,6], status: 'active', createdAt: Date.now() }
];

export const DEFAULT_BOOKINGS: Booking[] = [
  { id: 'b1', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', classId: 'c2', slotId: 's2', trainerId: 't1', locationId: 'l1', bookingDate: Date.now() - 86400000, startTime: '06:00', persons: 1, participantNames: ['Shubham Kumar'], status: 'delivered', attendanceStatus: 'present', paymentStatus: 'paid', type: 'class', amount: 25, createdAt: Date.now() - 900000000 }
];

export const DEFAULT_ORDERS: Order[] = [
  { id: 'o1', orderNumber: 'GYM-001', userId: 'u3', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', items: [{ id: 'ci1', productId: 'p1', name: 'Protein Powder', price: 36, size: '2kg', quantity: 1, image: 'https://images.unsplash.com/photo-1593094855729-19c062c97482?q=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 36, vat: 1.8, serviceCharge: 2.5, total: 40.3, status: 'picked-up', paymentStatus: 'paid', createdAt: Date.now() - 1209600000 }
];

export const DEFAULT_BLOCKS: Block[] = [];
export const DEFAULT_BLOCK_BOOKINGS: BlockBooking[] = [];
export const DEFAULT_BLOCK_PAYMENTS: BlockWeeklyPayment[] = [];
export const DEFAULT_REWARD_TRANSACTIONS: RewardTransaction[] = [];
export const DEFAULT_REWARD_SETTINGS: RewardSettings = {
  classes: { enabled: true, points: 10, facilityIds: [] },
  passes: { enabled: true, points: 50, facilityIds: [] },
  blocks: { enabled: true, points: 100, facilityIds: [] },
  orders: { enabled: true, points: 20, facilityIds: [] },
  memberships: { enabled: true, points: 100, facilityIds: [] },
  redemption: { enabled: true, pointsToValue: 100, monetaryValue: 5, minPointsRequired: 100, enabledModules: ['booking', 'block', 'pass', 'order'] }
};