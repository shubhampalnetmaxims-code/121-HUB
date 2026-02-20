
export interface TicketMessage {
  id: string;
  senderId: string;
  senderType: 'user' | 'admin';
  message: string;
  createdAt: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'customer' | 'trainer';
  subject: string;
  status: 'open' | 'replied' | 'resolved';
  createdAt: number;
  updatedAt: number;
  messages: TicketMessage[];
}

export type AdminPermission = 
  | 'manage_facilities' 
  | 'manage_curriculum' 
  | 'manage_staff' 
  | 'manage_users' 
  | 'manage_timetable' 
  | 'manage_marketplace' 
  | 'manage_finance' 
  | 'manage_operations' 
  | 'manage_rewards' 
  | 'manage_support' 
  | 'manage_admin_staff'
  | 'super_admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  permissions: AdminPermission[];
  assignedFacilityId?: string; // If set, user is restricted to this hub only
  createdAt: number;
  status: 'active' | 'suspended';
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  galleryImages: string[];
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
  paymentType: 'full' | 'reserved';
  totalAmount: number;
  reservedAmount?: number;
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
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
  amount: number;
  cancelledAt?: number;
  createdAt: number;
  totalSessions?: number;
  sessionsUsed?: number;
  validityUntil?: number;
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
  status: 'active' | 'inactive';
  appAccess: 'allowed' | 'restricted';
  permissions: {
    canCancel: boolean;
    canReschedule: boolean;
    canTransfer: boolean;
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
  originalBookingDate?: number;
  startTime: string;
  persons: number;
  participantNames: string[];
  status: 'upcoming' | 'rescheduled' | 'cancelled' | 'delivered';
  attendanceStatus: 'pending' | 'present' | 'absent'; 
  cancelledBy?: 'trainer' | 'customer' | 'admin';
  cancelledAt?: number;
  feedbackFromTrainer?: string; 
  userFeedback?: string;
  userRating?: number;
  paymentStatus?: 'paid' | 'processing' | 'completed' | 'refunded';
  transactionId?: string;
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
  validityUntil?: number;
  status: 'active' | 'exhausted' | 'expired' | 'blocked';
  pricePaid?: number;
  paymentStatus?: 'paid' | 'pending' | 'failed';
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
  status: 'active' | 'expired' | 'cancelled' | 'blocked';
  purchasedAt: number;
  paymentStatus?: 'paid' | 'pending' | 'failed';
  autoRenew?: boolean;
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
  muscleMass?: number;
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
  paymentStatus?: 'paid' | 'processing' | 'completed' | 'refunded' | 'pending' | 'failed';
  createdAt: number;
  rewardPointsUsed?: number;
  rewardDiscount?: number;
  pickupNote?: string;
  cancelledAt?: number;
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
  dateOfBirth?: number;
  location?: string;
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
  refundPolicyClasses: "Full refund if cancelled 48 hours before session.",
  refundPolicyOrders: "Full refund if cancelled before pickup.",
  refundPolicyMemberships: "Partial refund based on remaining duration.",
  refundPolicyBlocks: "Refund only possible before program start date."
};

export const DEFAULT_FACILITIES: Facility[] = [
  { 
    id: '1', 
    name: '121 Gym', 
    description: 'Elite bodybuilding and heavy lifting hub.', 
    icon: 'Dumbbell', 
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop', 
    galleryImages: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true, 
    createdAt: Date.now(), 
    features: ['classes', 'timetable', 'passes', 'memberships', 'marketplace', 'blocks'], 
    settings: DEFAULT_SETTINGS 
  },
  { 
    id: '2', 
    name: '121 Fitness', 
    description: 'Dynamic group classes and cardio zones.', 
    icon: 'Activity', 
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000&auto=format&fit=crop', 
    galleryImages: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-2969c6a2c7a7?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true, 
    createdAt: Date.now(), 
    features: ['classes', 'timetable', 'passes', 'memberships', 'marketplace'], 
    settings: DEFAULT_SETTINGS 
  },
  { 
    id: '3', 
    name: '121 Zen', 
    description: 'Mindfulness, meditation, and yoga sanctuary.', 
    icon: 'Flower2', 
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop', 
    galleryImages: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true, 
    createdAt: Date.now(), 
    features: ['classes', 'timetable', 'passes', 'memberships', 'marketplace', 'blocks'], 
    settings: DEFAULT_SETTINGS 
  }
];

export const DEFAULT_USERS: User[] = [
  { 
    id: 'u-shubham', 
    email: 'shubham@gmail.com', 
    fullName: 'Shubham Kumar', 
    phone: '+91 9876543210', 
    gender: 'Male', 
    paymentMethod: 'added', 
    status: 'active', 
    createdAt: Date.now() - 100000000, 
    paymentCards: [
      { id: 'card-1', holderName: 'SHUBHAM KUMAR', cardNumber: '•••• •••• •••• 4242', brand: 'Visa', expiryDate: '12/28', isPrimary: true, createdAt: Date.now() }
    ], 
    rewardPoints: 250,
    dateOfBirth: new Date('1998-05-15').getTime(),
    location: 'Mumbai, India'
  },
  { id: 'u-neil', email: 'neil@test.com', fullName: 'Neil Aldrin', phone: '+1 555-0101', gender: 'Male', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 100, location: 'New York, USA' },
  { id: 'u-sara', email: 'sara@test.com', fullName: 'Sara Connor', phone: '+1 555-0202', gender: 'Female', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 150, location: 'Los Angeles, USA' },
  { id: 'u-mike', email: 'mike@test.com', fullName: 'Mike Tyson', phone: '+1 555-0303', gender: 'Male', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 200, location: 'Las Vegas, USA' },
  { id: 'u-lara', email: 'lara@test.com', fullName: 'lara@test.com', phone: '+1 555-0404', gender: 'Female', paymentMethod: 'added', status: 'blocked', createdAt: Date.now(), paymentCards: [], rewardPoints: 300, location: 'London, UK' }
];

export const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Master Admin',
    email: 'admin@121fit.com',
    username: 'admin',
    password: 'admin',
    permissions: ['super_admin'],
    createdAt: Date.now(),
    status: 'active'
  },
  {
    id: 'adm-gym-mgr',
    name: 'Hub Manager (121 Gym)',
    email: 'gym.manager@121fit.com',
    username: 'hub_mgr',
    password: 'password',
    permissions: ['manage_curriculum', 'manage_timetable', 'manage_marketplace', 'manage_finance', 'manage_operations', 'manage_staff', 'manage_users'],
    assignedFacilityId: '1', // Restricted to 121 Gym
    createdAt: Date.now(),
    status: 'active'
  },
  {
    id: 'adm-fit-mgr',
    name: 'Hub Manager (121 Fitness)',
    email: 'fitness.mgr@121fit.com',
    username: 'fitness_mgr',
    password: 'password',
    permissions: ['manage_curriculum', 'manage_timetable', 'manage_marketplace', 'manage_finance', 'manage_operations', 'manage_staff', 'manage_users'],
    assignedFacilityId: '2', // Restricted to 121 Fitness
    createdAt: Date.now(),
    status: 'active'
  }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  { id: 't-rahul', name: 'Rahul Verma', email: 'rahul.verma@121fit.com', phone: '9876543210', facilityIds: ['1', '2', '3'], colorCode: '#FF6B6B', createdAt: Date.now(), isFirstLogin: false, description: 'Master of high intensity and heavy compound lifting.', speciality: 'HIIT, Strength Training', experience: '8 Years', status: 'active', appAccess: 'allowed', permissions: { canCancel: true, canReschedule: true, canTransfer: true } },
  { id: 't-ankit', name: 'Ankit Sharma', email: 'ankit.sharma@121fit.com', phone: '9876543221', facilityIds: ['2'], colorCode: '#4ECDC4', createdAt: Date.now(), isFirstLogin: false, description: 'Dance fitness expert and group cardio specialist.', speciality: 'Zumba, Cardio Blast', experience: '5 Years', status: 'active', appAccess: 'allowed', permissions: { canCancel: false, canReschedule: true, canTransfer: false } },
  { id: 't-sneha', name: 'Sneha Kapoor', email: 'sneha.kapoor@121fit.com', phone: '9876543232', facilityIds: ['3'], colorCode: '#6C5CE7', createdAt: Date.now(), isFirstLogin: false, description: 'Yoga and meditation guru focusing on mindfulness.', speciality: 'Yoga Flow, Meditation', experience: '10 Years', status: 'active', appAccess: 'allowed', permissions: { canCancel: true, canReschedule: false, canTransfer: true } },
  { id: 't-aman', name: 'Aman Singh', email: 'aman.singh@121fit.com', phone: '9876543243', facilityIds: ['1'], colorCode: '#F9CA24', createdAt: Date.now(), isFirstLogin: false, description: 'Functional training and cross-fit specialist.', speciality: 'Cross Training', experience: '4 Years', status: 'active', appAccess: 'allowed', permissions: { canCancel: true, canReschedule: true, canTransfer: true } },
  { id: 't-neha', name: 'Neha Joshi', email: 'neha.joshi@121fit.com', phone: '9876543254', facilityIds: ['2'], colorCode: '#1ABC9C', createdAt: Date.now(), isFirstLogin: false, description: 'Conditioning coach for fat loss and metabolic reset.', speciality: 'Functional Training', experience: '6 Years', status: 'active', appAccess: 'allowed', permissions: { canCancel: false, canReschedule: true, canTransfer: false } }
];

export const DEFAULT_CLASSES: Class[] = [
  { id: 'c-strength', facilityId: '1', name: 'Strength Training', shortDescription: 'Heavy compound movements for maximum hypertrophy.', duration: '1 hour', requirements: 'Lifting shoes', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop', pricePerSession: 25, status: 'active', createdAt: Date.now() },
  { id: 'c-hiit', facilityId: '1', name: 'HIIT Workout', shortDescription: 'Explosive interval training for rapid fat burn.', duration: '45 mins', requirements: 'Towel', level: 'Expert', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', pricePerSession: 20, status: 'active', createdAt: Date.now() },
  { id: 'c-boxing', facilityId: '1', name: 'Pro Boxing', shortDescription: 'Heavy bag drills and tactical footwork for combat.', duration: '1 hour', requirements: 'Gloves', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop', pricePerSession: 30, status: 'active', createdAt: Date.now() },
  { id: 'c-zumba', facilityId: '2', name: 'Zumba', shortDescription: 'High energy dance fitness to popular rhythms.', duration: '1 hour', requirements: 'Comfortable footwear', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=600&auto=format&fit=crop', pricePerSession: 15, status: 'active', createdAt: Date.now() },
  { id: 'c-pilates', facilityId: '2', name: 'Power Pilates', shortDescription: 'Core stabilization and flexibility sequences.', duration: '45 mins', requirements: 'Grip socks', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1518611012118-2969c6a2c7a7?q=80&w=1000&auto=format&fit=crop', pricePerSession: 22, status: 'active', createdAt: Date.now() },
  { id: 'c-pt-121', facilityId: '2', name: 'Personal Training', shortDescription: 'One-on-one tailored fitness coaching.', duration: '1 hour', requirements: 'Comfortable clothing', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', pricePerSession: 50, status: 'active', createdAt: Date.now() },
  { id: 'c-yoga', facilityId: '3', name: 'Yoga Flow', shortDescription: 'Vinyasa sequences to unite mind and body.', duration: '1.5 hours', requirements: 'Yoga Mat', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=1000&auto=format&fit=crop', pricePerSession: 35, status: 'active', createdAt: Date.now() },
  { id: 'c-meditation', facilityId: '3', name: 'Meditation', shortDescription: 'Guided sessions for stress reduction and focus.', duration: '1 hour', requirements: 'Silent mode phone', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop', pricePerSession: 25, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'loc-andheri', facilityIds: ['1'], name: 'Andheri West', createdAt: Date.now() },
  { id: 'loc-bandra', facilityIds: ['1'], name: 'Bandra East', createdAt: Date.now() },
  { id: 'loc-powai', facilityIds: ['1'], name: 'Powai', createdAt: Date.now() },
  { id: 'loc-parel', facilityIds: ['2'], name: 'Lower Parel', createdAt: Date.now() },
  { id: 'loc-malad', facilityIds: ['2'], name: 'Malad West', createdAt: Date.now() },
  { id: 'loc-juhu', facilityIds: ['3'], name: 'Juhu', createdAt: Date.now() },
  { id: 'loc-thane', facilityIds: ['3'], name: 'Thane', createdAt: Date.now() }
];

export const DEFAULT_CLASS_SLOTS: ClassSlot[] = [
  { id: 'slot-1', facilityId: '1', classId: 'c-strength', trainerId: 't-rahul', locationId: 'loc-andheri', dayOfWeek: 1, startTime: '07:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 8, maxBookings: 12 },
  { id: 'slot-rahul-2', facilityId: '1', classId: 'c-hiit', trainerId: 't-rahul', locationId: 'loc-bandra', dayOfWeek: 1, startTime: '18:00', duration: '45 mins', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 10, maxBookings: 15 },
  { id: 'slot-rahul-3', facilityId: '2', classId: 'c-zumba', trainerId: 't-rahul', locationId: 'loc-parel', dayOfWeek: 2, startTime: '09:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 12, maxBookings: 20 },
  { id: 'slot-pt-1', facilityId: '2', classId: 'c-pt-121', trainerId: 't-rahul', locationId: 'loc-malad', dayOfWeek: 1, startTime: '10:00', duration: '1 hour', status: 'full', trainerStatus: 'accepted', isDelivered: false, currentBookings: 1, maxBookings: 1 },
  { id: 'slot-pt-2', facilityId: '2', classId: 'c-pt-121', trainerId: 't-rahul', locationId: 'loc-malad', dayOfWeek: 3, startTime: '11:00', duration: '1 hour', status: 'full', trainerStatus: 'accepted', isDelivered: false, currentBookings: 1, maxBookings: 1 },
  { id: 'slot-pt-3', facilityId: '2', classId: 'c-pt-121', trainerId: 't-rahul', locationId: 'loc-malad', dayOfWeek: 5, startTime: '12:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 0, maxBookings: 1 },
  { id: 'slot-rahul-4', facilityId: '3', classId: 'c-meditation', trainerId: 't-rahul', locationId: 'loc-juhu', dayOfWeek: 3, startTime: '17:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 5, maxBookings: 10 },
  { id: 'slot-rahul-5', facilityId: '1', classId: 'c-boxing', trainerId: 't-rahul', locationId: 'loc-powai', dayOfWeek: 4, startTime: '19:30', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 6, maxBookings: 8 },
  { id: 'slot-2', facilityId: '3', classId: 'c-yoga', trainerId: 't-sneha', locationId: 'loc-juhu', dayOfWeek: 2, startTime: '18:30', duration: '1.5 hours', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 5, maxBookings: 15 },
  { id: 'slot-ankit-1', facilityId: '2', classId: 'c-zumba', trainerId: 't-ankit', locationId: 'loc-malad', dayOfWeek: 5, startTime: '08:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 15, maxBookings: 20 }
];

export const DEFAULT_BOOKINGS: Booking[] = (() => {
  const b: Booking[] = [];
  const now = Date.now();
  const dayInMs = 86400000;

  // Upcoming (10)
  for(let i=0; i<10; i++) {
    b.push({
      id: `bk-up-${i}`, userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com',
      facilityId: '1', classId: 'c-strength', slotId: 'slot-1', trainerId: 't-rahul', locationId: 'loc-andheri',
      bookingDate: now + (i + 1) * dayInMs, startTime: '07:00', persons: 1, participantNames: ['Shubham Kumar'],
      status: 'upcoming', attendanceStatus: 'pending', amount: 25, type: 'class', transactionId: `TXN-UP-${1000 + i}`,
      createdAt: now - dayInMs, paymentStatus: i % 3 === 0 ? 'processing' : 'paid',
      usedPassId: i < 5 ? 'up-1' : undefined
    });
  }

  // Rescheduled (10)
  for(let i=0; i<10; i++) {
    b.push({
      id: `bk-rs-${i}`, userId: 'u-neil', userName: 'Neil Aldrin', userEmail: 'neil@test.com',
      facilityId: '2', classId: 'c-zumba', slotId: 'slot-rahul-3', trainerId: 't-rahul', locationId: 'loc-parel',
      bookingDate: now + (i + 5) * dayInMs, originalBookingDate: now + (i + 1) * dayInMs,
      startTime: '09:00', persons: 1, participantNames: ['Neil Aldrin'],
      status: 'rescheduled', attendanceStatus: 'pending', amount: 15, type: 'class', transactionId: `TXN-RS-${2000 + i}`,
      createdAt: now - dayInMs * 2, paymentStatus: 'paid'
    });
  }

  // Cancelled (10)
  for(let i=0; i<10; i++) {
    const isTrainer = i % 2 === 0;
    const isEarly = i < 5; 
    b.push({
      id: `bk-ca-${i}`, userId: 'u-sara', userName: 'Sara Connor', userEmail: 'sara@test.com',
      facilityId: '1', classId: 'c-hiit', slotId: 'slot-rahul-2', trainerId: 't-rahul', locationId: 'loc-bandra',
      bookingDate: now + (i + 1) * dayInMs, startTime: '18:00', persons: 1, participantNames: ['Sara Connor'],
      status: 'cancelled', attendanceStatus: 'pending', amount: 20, type: 'class', transactionId: `TXN-CA-${3000 + i}`,
      createdAt: now - dayInMs * 3, paymentStatus: i < 3 ? 'refunded' : 'paid',
      cancelledBy: isTrainer ? 'trainer' : 'customer',
      cancelledAt: now - (isEarly ? 3 * dayInMs : 0.5 * dayInMs)
    });
  }

  // Delivered (10)
  for(let i=0; i<10; i++) {
    b.push({
      id: `bk-de-${i}`, userId: 'u-mike', userName: 'Mike Tyson', userEmail: 'mike@test.com',
      facilityId: '3', classId: 'c-yoga', slotId: 'slot-2', trainerId: 't-sneha', locationId: 'loc-juhu',
      bookingDate: now - (i + 1) * dayInMs, startTime: '18:30', persons: 1, participantNames: ['Mike Tyson'],
      status: 'delivered', attendanceStatus: 'present', amount: 35, type: 'class', transactionId: `TXN-DE-${4000 + i}`,
      createdAt: now - dayInMs * 10, paymentStatus: 'completed',
      userRating: i % 2 === 0 ? 5 : undefined,
      userFeedback: i % 2 === 0 ? "Fantastic flow, really feeling the stretch." : undefined,
      feedbackFromTrainer: i % 3 === 0 ? "Excellent balance today, Mike. Keep it up!" : undefined,
      usedPassId: i < 3 ? 'up-mike-1' : undefined
    });
  }

  // Extra pass bookings to satisfy Sold Pass history requirement
  b.push({
    id: 'bk-pass-1', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com',
    facilityId: '1', classId: 'c-strength', slotId: 'slot-1', trainerId: 't-rahul', locationId: 'loc-andheri',
    bookingDate: now - 86400000, startTime: '07:00', persons: 1, participantNames: ['Shubham Kumar'],
    status: 'delivered', attendanceStatus: 'present', amount: 0, type: 'pass', usedPassId: 'up-1', createdAt: now - 86400000, paymentStatus: 'paid'
  });
  b.push({
    id: 'bk-pass-2', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com',
    facilityId: '1', classId: 'c-strength', slotId: 'slot-1', trainerId: 't-rahul', locationId: 'loc-andheri',
    bookingDate: now - (86400000 * 2), startTime: '07:00', persons: 1, participantNames: ['Shubham Kumar'],
    status: 'delivered', attendanceStatus: 'present', amount: 0, type: 'pass', usedPassId: 'up-1', createdAt: now - (86400000 * 2), paymentStatus: 'paid'
  });

  return b;
})();

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p-gloves', facilityId: '1', name: 'Gym Gloves', price: 15, quantity: 50, sizeStocks: [{size: 'M', quantity: 30}, {size: 'L', quantity: 20}], category: 'Gear', status: 'active', createdAt: Date.now(), description: 'High grip weightlifting gloves.', images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p-tshirt', facilityId: '1', name: 'Gym T-Shirt', price: 20, quantity: 40, sizeStocks: [{size: 'S', quantity: 10}, {size: 'M', quantity: 10}, {size: 'L', quantity: 10}, {size: 'XL', quantity: 10}], category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Moisture-wicking standard fit.', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p-mat', facilityId: '3', name: 'Yoga Mat', price: 25, quantity: 15, sizeStocks: [{size: 'Standard', quantity: 15}], category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Eco-friendly non-slip mat.', images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p-bottle', facilityId: '2', name: 'Water Bottle', price: 12, quantity: 30, sizeStocks: [{size: '750ml', quantity: 30}], category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Insulated steel bottle.', images: ['https://images.unsplash.com/photo-1602143307185-84447545512d?q=80&w=400&auto=format&fit=crop'] }
];

export const DEFAULT_PASSES: Pass[] = [
  { id: 'pass-gym', facilityId: '1', name: 'Gym Strength Pass', price: 120, credits: 10, personsPerBooking: 1, allowedClassIds: ['c-strength'], isAllClasses: false, description: 'Bulk sessions for strength floor access.', quantity: 100, status: 'active', createdAt: Date.now() },
  { id: 'pass-fit', facilityId: '2', name: 'Fitness Combo Pass', price: 90, credits: 8, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Flexible entry for all Fitness hub classes.', quantity: 50, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_BLOCKS: Block[] = [
  { id: 'b-hiit-4wk', facilityId: '1', trainerId: 't-rahul', name: 'HIIT 4 Week Block', about: 'Intense metabolic conditioning cycle.', expect: 'Fat loss and endurance improvements.', numWeeks: 4, daysOfWeek: [1,3,5], startDate: Date.now() + (86400000 * 2), startTime: '18:00', duration: '1 hour', maxPersons: 10, maxPersonsPerBooking: 1, paymentType: 'full', totalAmount: 150, status: 'active', createdAt: Date.now() },
  { id: 'b-boxing-101', facilityId: '1', trainerId: 't-aman', name: 'Boxing 101 Fundamentals', about: 'Core mechanics of professional boxing.', expect: 'Improved footwork and strike accuracy.', numWeeks: 8, daysOfWeek: [2,4], startDate: Date.now() - (86400000 * 10), startTime: '18:00', duration: '1.5 hours', maxPersons: 15, maxPersonsPerBooking: 2, paymentType: 'reserved', totalAmount: 240, reservedAmount: 50, status: 'active', createdAt: Date.now() },
  { id: 'b-yoga-zen', facilityId: '3', trainerId: 't-sneha', name: 'Yoga Zen Masterclass', about: 'Deep spiritual and physical alignment.', expect: 'Flexibility and mindfulness growth.', numWeeks: 6, daysOfWeek: [0], startDate: Date.now() - (86400000 * 60), startTime: '10:00', duration: '2 hours', maxPersons: 20, maxPersonsPerBooking: 1, paymentType: 'full', totalAmount: 120, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_BLOCK_BOOKINGS: BlockBooking[] = (() => {
  const bb: BlockBooking[] = [];
  const now = Date.now();
  const day = 86400000;

  // Upcoming Block (HIIT 4 Week)
  bb.push({
    id: 'bb-1', blockId: 'b-hiit-4wk', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com',
    facilityId: '1', trainerId: 't-rahul', startDate: now + (day * 2), participantNames: ['Shubham Kumar'],
    bookingAmountPaid: true, status: 'upcoming', paymentStatus: 'paid', amount: 150, createdAt: now - day
  });
  bb.push({
    id: 'bb-2', blockId: 'b-hiit-4wk', userId: 'u-neil', userName: 'Neil Aldrin', userEmail: 'neil@test.com',
    facilityId: '1', trainerId: 't-rahul', startDate: now + (day * 2), participantNames: ['Neil Aldrin'],
    bookingAmountPaid: true, status: 'upcoming', paymentStatus: 'pending', amount: 150, createdAt: now - day
  });

  // Ongoing Block (Boxing 101)
  bb.push({
    id: 'bb-3', blockId: 'b-boxing-101', userId: 'u-sara', userName: 'Sara Connor', userEmail: 'sara@test.com',
    facilityId: '1', trainerId: 't-aman', startDate: now - (day * 10), participantNames: ['Sara Connor', 'John Connor'],
    bookingAmountPaid: true, status: 'ongoing', paymentStatus: 'paid', amount: 240, createdAt: now - (day * 12)
  });

  // Completed Block (Yoga Zen)
  bb.push({
    id: 'bb-4', blockId: 'b-yoga-zen', userId: 'u-mike', userName: 'Mike Tyson', userEmail: 'mike@test.com',
    facilityId: '3', trainerId: 't-sneha', startDate: now - (day * 60), participantNames: ['Mike Tyson'],
    bookingAmountPaid: true, status: 'completed', paymentStatus: 'paid', amount: 120, createdAt: now - (day * 65)
  });

  // Cancelled Bookings
  bb.push({
    id: 'bb-5', blockId: 'b-hiit-4wk', userId: 'u-lara', userName: 'Lara Croft', userEmail: 'lara@test.com',
    facilityId: '1', trainerId: 't-rahul', startDate: now + (day * 2), participantNames: ['Lara Croft'],
    bookingAmountPaid: true, status: 'cancelled', paymentStatus: 'paid', amount: 150, createdAt: now - day, cancelledAt: now - 5000 
  });
  // Non-eligible for refund (cancelled less than 48h before start - this one is at now+2days, so cancel at now+1day would be ineligible)
  bb.push({
    id: 'bb-6', blockId: 'b-hiit-4wk', userId: 'u-mike', userName: 'Mike Tyson', userEmail: 'mike@test.com',
    facilityId: '1', trainerId: 't-rahul', startDate: now + (day * 0.5), participantNames: ['Mike Tyson'],
    bookingAmountPaid: true, status: 'cancelled', paymentStatus: 'paid', amount: 150, createdAt: now - day, cancelledAt: now
  });

  return bb;
})();

export const DEFAULT_ORDERS: Order[] = [
  { id: 'o-1', orderNumber: 'ORD-A101', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', items: [{ id: 'it-1', productId: 'p-gloves', name: 'Gym Gloves', price: 15, size: 'M', quantity: 1, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 15, vat: 0.75, serviceCharge: 2.5, total: 18.25, status: 'placed', paymentStatus: 'paid', createdAt: Date.now() - 3600000 },
  { id: 'o-2', orderNumber: 'ORD-B202', userId: 'u-neil', userName: 'Neil Aldrin', userEmail: 'neil@test.com', facilityId: '2', items: [{ id: 'it-2', productId: 'p-bottle', name: 'Water Bottle', price: 12, size: '750ml', quantity: 1, image: 'https://images.unsplash.com/photo-1602143307185-84447545512d?q=80&w=400&auto=format&fit=crop', facilityId: '2' }], subtotal: 12, vat: 0.6, serviceCharge: 2.5, total: 15.1, status: 'placed', paymentStatus: 'pending', createdAt: Date.now() - 7200000 },
  { id: 'o-3', orderNumber: 'ORD-C303', userId: 'u-sara', userName: 'Sara Connor', userEmail: 'sara@test.com', facilityId: '1', items: [{ id: 'it-3', productId: 'p-tshirt', name: 'Gym T-Shirt', price: 20, size: 'L', quantity: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 20, vat: 1, serviceCharge: 2.5, total: 23.5, status: 'picked-up', paymentStatus: 'paid', createdAt: Date.now() - 172800000, pickupNote: 'Member picked up in person at front desk.' },
  { id: 'o-4', orderNumber: 'ORD-D404', userId: 'u-mike', userName: 'Mike Tyson', userEmail: 'mike@test.com', facilityId: '3', items: [{ id: 'it-4', productId: 'p-mat', name: 'Yoga Mat', price: 25, size: 'NA', quantity: 1, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop', facilityId: '3' }], subtotal: 25, vat: 1.25, serviceCharge: 2.5, total: 28.75, status: 'placed', paymentStatus: 'failed', createdAt: Date.now() - 259200000 },
  { id: 'o-5', orderNumber: 'ORD-E505', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', items: [{ id: 'it-5', productId: 'p-gloves', name: 'Gym Gloves', price: 15, size: 'M', quantity: 2, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 30, vat: 1.5, serviceCharge: 2.5, total: 34.0, status: 'cancelled', paymentStatus: 'paid', createdAt: Date.now() - 1000000, cancelledAt: Date.now() - 10000 },
  { id: 'o-6', orderNumber: 'ORD-F606', userId: 'u-lara', userName: 'Lara Croft', userEmail: 'lara@test.com', facilityId: '1', items: [{ id: 'it-6', productId: 'p-tshirt', name: 'Gym T-Shirt', price: 20, size: 'S', quantity: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 20, vat: 1, serviceCharge: 2.5, total: 23.5, status: 'cancelled', paymentStatus: 'refunded', createdAt: Date.now() - (86400000 * 5), cancelledAt: Date.now() - (86400000 * 3) }
];

export const DEFAULT_REWARD_TRANSACTIONS: RewardTransaction[] = [
  { id: 'tx-1', userId: 'u-shubham', date: Date.now() - 1000000, type: 'earned', source: 'booking', referenceId: 'b-old-1', points: 400, remainingBalance: 400, facilityId: '1' }
];

export const DEFAULT_REWARD_SETTINGS: RewardSettings = {
  classes: { enabled: true, points: 50, facilityIds: [] },
  passes: { enabled: true, points: 100, facilityIds: [] },
  blocks: { enabled: true, points: 150, facilityIds: [] },
  orders: { enabled: true, points: 20, facilityIds: [] },
  memberships: { enabled: true, points: 200, facilityIds: [] },
  redemption: { enabled: true, pointsToValue: 1000, monetaryValue: 10, minPointsRequired: 1000, enabledModules: ['booking', 'block', 'pass', 'order'] }
};

export const DEFAULT_USER_PASSES: UserPass[] = [
  { id: 'up-1', userId: 'u-shubham', passId: 'pass-gym', facilityId: '1', name: 'Gym Strength Pass', totalCredits: 10, remainingCredits: 6, personsPerBooking: 1, isAllClasses: false, allowedClassIds: ['c-strength'], purchasedAt: Date.now() - 86400000 * 5, status: 'active', validityUntil: Date.now() + 86400000 * 30, pricePaid: 120, paymentStatus: 'paid' },
  { id: 'up-neil-1', userId: 'u-neil', passId: 'pass-fit', facilityId: '2', name: 'Fitness Combo Pass', totalCredits: 8, remainingCredits: 0, personsPerBooking: 1, isAllClasses: true, allowedClassIds: [], purchasedAt: Date.now() - 86400000 * 20, status: 'exhausted', pricePaid: 90, paymentStatus: 'paid' },
  { id: 'up-sara-1', userId: 'u-sara', passId: 'pass-gym', facilityId: '1', name: 'Gym Strength Pass', totalCredits: 10, remainingCredits: 10, personsPerBooking: 1, isAllClasses: false, allowedClassIds: ['c-strength'], purchasedAt: Date.now() - 86400000, status: 'blocked', pricePaid: 120, paymentStatus: 'paid' },
  { id: 'up-mike-1', userId: 'u-mike', passId: 'pass-fit', facilityId: '2', name: 'Fitness Combo Pass', totalCredits: 8, remainingCredits: 4, personsPerBooking: 1, isAllClasses: true, allowedClassIds: [], purchasedAt: Date.now() - 86400000 * 45, status: 'expired', pricePaid: 90, paymentStatus: 'paid', validityUntil: Date.now() - 86400000 * 15 },
  { id: 'up-lara-1', userId: 'u-lara', passId: 'pass-gym', facilityId: '1', name: 'Gym Strength Pass', totalCredits: 10, remainingCredits: 10, personsPerBooking: 1, isAllClasses: false, allowedClassIds: ['c-strength'], purchasedAt: Date.now(), status: 'active', pricePaid: 120, paymentStatus: 'pending' },
  // Additional scenarios for Sold Pass audit testing
  { id: 'up-shubham-failed', userId: 'u-shubham', passId: 'pass-fit', facilityId: '2', name: 'Failed Fitness Pass', totalCredits: 8, remainingCredits: 8, personsPerBooking: 1, isAllClasses: true, allowedClassIds: [], purchasedAt: Date.now(), status: 'active', pricePaid: 90, paymentStatus: 'failed' },
  { id: 'up-lara-blocked', userId: 'u-lara', passId: 'pass-gym', facilityId: '1', name: 'Archived Gym Pass', totalCredits: 10, remainingCredits: 2, personsPerBooking: 1, isAllClasses: false, allowedClassIds: ['c-strength'], purchasedAt: Date.now() - (86400000 * 10), status: 'blocked', pricePaid: 120, paymentStatus: 'paid' }
];

// Fix: Added missing DEFAULT_MEMBERSHIPS export to resolve import error in App.tsx.
export const DEFAULT_MEMBERSHIPS: Membership[] = [
  { 
    id: 'm-gym-monthly', 
    facilityId: '1', 
    title: '121 Gym Monthly', 
    description: 'Full access to gym floor and basic weights.', 
    price: 60, 
    durationDays: 30, 
    allow24Hour: true, 
    daysOfWeek: [0,1,2,3,4,5,6], 
    status: 'active', 
    createdAt: Date.now() 
  },
  { 
    id: 'm-fit-pro', 
    facilityId: '2', 
    title: 'Fitness Pro', 
    description: 'Unlimited classes and cardio zone access.', 
    price: 45, 
    durationDays: 30, 
    allow24Hour: false, 
    startTime: '06:00', 
    endTime: '22:00', 
    daysOfWeek: [1,2,3,4,5], 
    status: 'active', 
    createdAt: Date.now() 
  }
];

export const DEFAULT_USER_MEMBERSHIPS: UserMembership[] = [
  { id: 'um-1', userId: 'u-shubham', membershipId: 'm-gym-monthly', facilityId: '1', title: '121 Gym Monthly', startDate: Date.now() - 86400000 * 15, endDate: Date.now() + 86400000 * 15, price: 60, allow24Hour: true, daysOfWeek: [0,1,2,3,4,5,6], status: 'active', purchasedAt: Date.now() - 86400000 * 15, paymentStatus: 'paid', autoRenew: true }
];

export const DEFAULT_MEASUREMENTS: Measurement[] = [
  { id: 'm-1', userId: 'u-shubham', date: Date.now() - 86400000 * 60, weight: 82, height: 175, age: 25, bmi: 26.8, bodyFatPercentage: 22, chest: 102, waist: 92, muscleMass: 42.5 }
];

// Fix: Added missing DEFAULT_PHOTO_LOGS export.
export const DEFAULT_PHOTO_LOGS: PhotoLog[] = [];

export const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'tk-101',
    userId: 'u-shubham',
    userName: 'Shubham Kumar',
    userEmail: 'shubham@gmail.com',
    userType: 'customer',
    subject: 'Booking Reschedule Issue',
    status: 'replied',
    createdAt: Date.now() - (86400000 * 2),
    updatedAt: Date.now() - 3600000,
    messages: [
      { id: 'm1', senderId: 'u-shubham', senderType: 'user', message: 'I am unable to reschedule my session for tomorrow in the 121 Gym hub.', createdAt: Date.now() - (86400000 * 2) },
      { id: 'm2', senderId: 'admin', senderType: 'admin', message: 'Hello Shubham, looking into this for you. Could you specify which session it is?', createdAt: Date.now() - (86400000 * 1.5) },
      { id: 'm2b', senderId: 'u-shubham', senderType: 'user', message: 'It is the Strength Training session at 7 AM.', createdAt: Date.now() - 3600000 }
    ]
  }
];
