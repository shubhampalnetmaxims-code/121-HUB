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
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
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
    rewardPoints: 250 
  },
  { id: 'u-neil', email: 'neil@test.com', fullName: 'Neil Aldrin', phone: '+1 555-0101', gender: 'Male', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 100 },
  { id: 'u-sara', email: 'sara@test.com', fullName: 'Sara Connor', phone: '+1 555-0202', gender: 'Female', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 150 },
  { id: 'u-mike', email: 'mike@test.com', fullName: 'Mike Tyson', phone: '+1 555-0303', gender: 'Male', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 200 },
  { id: 'u-lara', email: 'lara@test.com', fullName: 'Lara Croft', phone: '+1 555-0404', gender: 'Female', paymentMethod: 'added', status: 'active', createdAt: Date.now(), paymentCards: [], rewardPoints: 300 }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  { id: 't-rahul', name: 'Rahul Verma', email: 'rahul.verma@121fit.com', phone: '9876543210', facilityIds: ['1', '2', '3'], colorCode: '#FF6B6B', createdAt: Date.now(), isFirstLogin: false, description: 'Master of high intensity and heavy compound lifting.', speciality: 'HIIT, Strength Training', experience: '8 Years', permissions: { canCancel: true, canReschedule: true, canTransfer: true } },
  { id: 't-ankit', name: 'Ankit Sharma', email: 'ankit.sharma@121fit.com', phone: '9876543221', facilityIds: ['2'], colorCode: '#4ECDC4', createdAt: Date.now(), isFirstLogin: false, description: 'Dance fitness expert and group cardio specialist.', speciality: 'Zumba, Cardio Blast', experience: '5 Years', permissions: { canCancel: false, canReschedule: true, canTransfer: false } },
  { id: 't-sneha', name: 'Sneha Kapoor', email: 'sneha.kapoor@121fit.com', phone: '9876543232', facilityIds: ['3'], colorCode: '#6C5CE7', createdAt: Date.now(), isFirstLogin: false, description: 'Yoga and meditation guru focusing on mindfulness.', speciality: 'Yoga Flow, Meditation', experience: '10 Years', permissions: { canCancel: true, canReschedule: false, canTransfer: true } },
  { id: 't-aman', name: 'Aman Singh', email: 'aman.singh@121fit.com', phone: '9876543243', facilityIds: ['1'], colorCode: '#F9CA24', createdAt: Date.now(), isFirstLogin: false, description: 'Functional training and cross-fit specialist.', speciality: 'Cross Training', experience: '4 Years', permissions: { canCancel: true, canReschedule: true, canTransfer: true } },
  { id: 't-neha', name: 'Neha Joshi', email: 'neha.joshi@121fit.com', phone: '9876543254', facilityIds: ['2'], colorCode: '#1ABC9C', createdAt: Date.now(), isFirstLogin: false, description: 'Conditioning coach for fat loss and metabolic reset.', speciality: 'Functional Training', experience: '6 Years', permissions: { canCancel: false, canReschedule: true, canTransfer: false } }
];

export const DEFAULT_CLASSES: Class[] = [
  { id: 'c-strength', facilityId: '1', name: 'Strength Training', shortDescription: 'Heavy compound movements for maximum hypertrophy.', duration: '1 hour', requirements: 'Lifting shoes', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop', pricePerSession: 25, status: 'active', createdAt: Date.now() },
  { id: 'c-hiit', facilityId: '1', name: 'HIIT Workout', shortDescription: 'Explosive interval training for rapid fat burn.', duration: '45 mins', requirements: 'Towel', level: 'Expert', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', pricePerSession: 20, status: 'active', createdAt: Date.now() },
  { id: 'c-boxing', facilityId: '1', name: 'Pro Boxing', shortDescription: 'Heavy bag drills and tactical footwork for combat.', duration: '1 hour', requirements: 'Gloves', level: 'Intermediate', imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop', pricePerSession: 30, status: 'active', createdAt: Date.now() },
  { id: 'c-zumba', facilityId: '2', name: 'Zumba', shortDescription: 'High energy dance fitness to popular rhythms.', duration: '1 hour', requirements: 'Comfortable footwear', level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=600&auto=format&fit=crop', pricePerSession: 15, status: 'active', createdAt: Date.now() },
  { id: 'c-pilates', facilityId: '2', name: 'Power Pilates', shortDescription: 'Core stabilization and flexibility sequences.', duration: '45 mins', requirements: 'Grip socks', level: 'All Levels', imageUrl: 'https://images.unsplash.com/photo-1518611012118-2969c6a2c7a7?q=80&w=600&auto=format&fit=crop', pricePerSession: 22, status: 'active', createdAt: Date.now() },
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
  // Rahul's Slots
  { id: 'slot-1', facilityId: '1', classId: 'c-strength', trainerId: 't-rahul', locationId: 'loc-andheri', dayOfWeek: 1, startTime: '07:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 8, maxBookings: 12 },
  { id: 'slot-rahul-2', facilityId: '1', classId: 'c-hiit', trainerId: 't-rahul', locationId: 'loc-bandra', dayOfWeek: 1, startTime: '18:00', duration: '45 mins', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 10, maxBookings: 15 },
  { id: 'slot-rahul-3', facilityId: '2', classId: 'c-zumba', trainerId: 't-rahul', locationId: 'loc-parel', dayOfWeek: 2, startTime: '09:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 12, maxBookings: 20 },
  { id: 'slot-pt-1', facilityId: '2', classId: 'c-pt-121', trainerId: 't-rahul', locationId: 'loc-malad', dayOfWeek: 1, startTime: '10:00', duration: '1 hour', status: 'full', trainerStatus: 'accepted', isDelivered: false, currentBookings: 1, maxBookings: 1 },
  { id: 'slot-pt-2', facilityId: '2', classId: 'c-pt-121', trainerId: 't-rahul', locationId: 'loc-malad', dayOfWeek: 3, startTime: '11:00', duration: '1 hour', status: 'full', trainerStatus: 'accepted', isDelivered: false, currentBookings: 1, maxBookings: 1 },
  { id: 'slot-pt-3', facilityId: '2', classId: 'c-pt-121', trainerId: 't-rahul', locationId: 'loc-malad', dayOfWeek: 5, startTime: '12:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 0, maxBookings: 1 },
  { id: 'slot-rahul-4', facilityId: '3', classId: 'c-meditation', trainerId: 't-rahul', locationId: 'loc-juhu', dayOfWeek: 3, startTime: '17:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 5, maxBookings: 10 },
  { id: 'slot-rahul-5', facilityId: '1', classId: 'c-boxing', trainerId: 't-rahul', locationId: 'loc-powai', dayOfWeek: 4, startTime: '19:30', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 6, maxBookings: 8 },
  
  // Others
  { id: 'slot-2', facilityId: '3', classId: 'c-yoga', trainerId: 't-sneha', locationId: 'loc-juhu', dayOfWeek: 2, startTime: '18:30', duration: '1.5 hours', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 5, maxBookings: 15 },
  { id: 'slot-ankit-1', facilityId: '2', classId: 'c-zumba', trainerId: 't-ankit', locationId: 'loc-malad', dayOfWeek: 5, startTime: '08:00', duration: '1 hour', status: 'available', trainerStatus: 'accepted', isDelivered: false, currentBookings: 15, maxBookings: 20 }
];

// Re-generating DEFAULT_BOOKINGS with a capacity-aware loop to prevent over-booking Personal Training slots.
export const DEFAULT_BOOKINGS: Booking[] = (() => {
  const bookingsArr: Booking[] = [];
  const occupancyMap: Record<string, number> = {};

  // Initialize occupancy from currentBookings in slots (if needed)
  DEFAULT_CLASS_SLOTS.forEach(s => occupancyMap[s.id] = 0);

  // Attempt to generate 100 random-ish bookings but strictly respect maxBookings
  for (let i = 0; i < 100; i++) {
    const slotIdx = i % DEFAULT_CLASS_SLOTS.length;
    const slot = DEFAULT_CLASS_SLOTS[slotIdx];
    const userIdx = i % DEFAULT_USERS.length;
    const user = DEFAULT_USERS[userIdx];
    const cls = DEFAULT_CLASSES.find(c => c.id === slot.classId);

    if (occupancyMap[slot.id] < slot.maxBookings) {
      bookingsArr.push({
        id: `bk-bulk-${i}`,
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        facilityId: slot.facilityId,
        classId: slot.classId,
        slotId: slot.id,
        trainerId: slot.trainerId,
        locationId: slot.locationId,
        bookingDate: Date.now() + (Math.floor(Math.random() * 5) * 86400000),
        startTime: slot.startTime,
        persons: 1,
        participantNames: [user.fullName],
        status: 'upcoming',
        attendanceStatus: 'pending',
        type: 'class',
        amount: cls?.pricePerSession || 25,
        createdAt: Date.now() - (i * 3600000)
      });
      occupancyMap[slot.id]++;
    }
  }

  // Add the specific old booking for audit testing
  bookingsArr.push({ 
    id: 'b-old-1', 
    userId: 'u-shubham', 
    userName: 'Shubham Kumar', 
    userEmail: 'shubham@gmail.com', 
    facilityId: '1', 
    classId: 'c-strength', 
    slotId: 'slot-1', 
    trainerId: 't-rahul', 
    locationId: 'loc-andheri', 
    bookingDate: Date.now() - 86400000, 
    startTime: '07:00', 
    persons: 1, 
    participantNames: ['Shubham Kumar'], 
    status: 'delivered', 
    attendanceStatus: 'present', 
    paymentStatus: 'paid', 
    type: 'class', 
    amount: 25, 
    createdAt: Date.now() - 172800000 
  });

  return bookingsArr;
})();

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p-gloves', facilityId: '1', name: 'Gym Gloves', price: 15, quantity: 50, sizeStocks: [{size: 'M', quantity: 30}, {size: 'L', quantity: 20}], category: 'Gear', status: 'active', createdAt: Date.now(), description: 'High grip weightlifting gloves.', images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p-tshirt', facilityId: '1', name: 'Gym T-Shirt', price: 20, quantity: 40, sizeStocks: [{size: 'S', quantity: 10}, {size: 'M', quantity: 10}, {size: 'L', quantity: 10}, {size: 'XL', quantity: 10}], category: 'Apparel', status: 'active', createdAt: Date.now(), description: 'Moisture-wicking standard fit.', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p-mat', facilityId: '3', name: 'Yoga Mat', price: 25, quantity: 15, sizeStocks: [{size: 'Standard', quantity: 15}], category: 'Equipment', status: 'active', createdAt: Date.now(), description: 'Eco-friendly non-slip mat.', images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop'] },
  { id: 'p-bottle', facilityId: '2', name: 'Water Bottle', price: 12, quantity: 30, sizeStocks: [{size: '750ml', quantity: 30}], category: 'Accessories', status: 'active', createdAt: Date.now(), description: 'Insulated steel bottle.', images: ['https://images.unsplash.com/photo-1602143307185-84447545512d?q=80&w=400&auto=format&fit=crop'] }
];

export const DEFAULT_PASSES: Pass[] = [
  { id: 'pass-gym', facilityId: '1', name: 'Gym Strength Pass', price: 120, credits: 10, personsPerBooking: 1, allowedClassIds: ['c-strength'], isAllClasses: false, description: 'Bulk sessions for strength floor access.', quantity: 100, status: 'active', createdAt: Date.now() },
  { id: 'pass-zen', facilityId: '3', name: 'Zen Yoga Pass', price: 100, credits: 12, personsPerBooking: 1, allowedClassIds: ['c-yoga', 'c-meditation'], isAllClasses: false, description: 'Holistic wellness bundle for Zen classes.', quantity: 50, status: 'active', createdAt: Date.now() },
  { id: 'pass-fit', facilityId: '2', name: 'Fitness Combo Pass', price: 90, credits: 8, personsPerBooking: 1, allowedClassIds: [], isAllClasses: true, description: 'Flexible entry for all Fitness hub classes.', quantity: 50, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_MEMBERSHIPS: Membership[] = [
  { id: 'm-gym-monthly', facilityId: '1', title: '121 Gym Monthly', description: 'Unlimited premium gym floor access with 24/7 keycard.', price: 60, durationDays: 30, allow24Hour: true, daysOfWeek: [0,1,2,3,4,5,6], status: 'active', createdAt: Date.now() }
];

export const DEFAULT_BLOCKS: Block[] = [
  { id: 'b-hiit-4wk', facilityId: '1', trainerId: 't-rahul', name: 'HIIT 4 Week Block', about: 'Intense metabolic conditioning cycle.', expect: 'Fat loss and endurance improvements.', numWeeks: 4, daysOfWeek: [1,3,5], startDate: Date.now() - 604800000, startTime: '07:00', duration: '1 hour', maxPersons: 10, maxPersonsPerBooking: 1, bookingAmount: 50, weeklyAmount: 25, totalAmount: 150, status: 'active', createdAt: Date.now() },
  { id: 'b-yoga-beg', facilityId: '3', trainerId: 't-sneha', name: 'Yoga Beginner Block', about: 'Foundational yoga for alignment and peace.', expect: 'Master basic asanas and breathing.', numWeeks: 3, daysOfWeek: [2,4], startDate: Date.now() + 86400000, startTime: '18:30', duration: '1 hour', maxPersons: 12, maxPersonsPerBooking: 1, bookingAmount: 40, weeklyAmount: 20, totalAmount: 100, status: 'active', createdAt: Date.now() }
];

export const DEFAULT_ORDERS: Order[] = [
  { id: 'o-old-1', orderNumber: 'ORD-G123', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', items: [{ id: 'it-1', productId: 'p-gloves', name: 'Gym Gloves', price: 15, size: 'M', quantity: 1, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=400&auto=format&fit=crop', facilityId: '1' }], subtotal: 15, vat: 0.75, serviceCharge: 2.5, total: 18.25, status: 'picked-up', paymentStatus: 'paid', createdAt: Date.now() - 864000000 }
];

export const DEFAULT_BLOCK_BOOKINGS: BlockBooking[] = [
  { id: 'bb-hiit-shubham', blockId: 'b-hiit-4wk', userId: 'u-shubham', userName: 'Shubham Kumar', userEmail: 'shubham@gmail.com', facilityId: '1', trainerId: 't-rahul', startDate: Date.now() - 604800000, participantNames: ['Shubham Kumar'], bookingAmountPaid: true, status: 'ongoing', createdAt: Date.now() - 604800000 }
];

export const DEFAULT_BLOCK_PAYMENTS: BlockWeeklyPayment[] = [
  { id: 'py-wk1', blockBookingId: 'bb-hiit-shubham', userId: 'u-shubham', weekNumber: 1, amount: 25, dueDate: Date.now() - 604800000, status: 'paid' },
  { id: 'py-wk2', blockBookingId: 'bb-hiit-shubham', userId: 'u-shubham', weekNumber: 2, amount: 25, dueDate: Date.now(), status: 'paid' },
  { id: 'py-wk3', blockBookingId: 'bb-hiit-shubham', userId: 'u-shubham', weekNumber: 3, amount: 25, dueDate: Date.now() + 604800000, status: 'pending' }
];

export const DEFAULT_REWARD_TRANSACTIONS: RewardTransaction[] = [
  { id: 'tx-1', userId: 'u-shubham', date: Date.now() - 1000000, type: 'earned', source: 'booking', referenceId: 'b-old-1', points: 400, remainingBalance: 400, facilityId: '1' },
  { id: 'tx-2', userId: 'u-shubham', date: Date.now() - 900000, type: 'earned', source: 'block', referenceId: 'bb-hiit-shubham', points: 300, remainingBalance: 700, facilityId: '1' },
  { id: 'tx-3', userId: 'u-shubham', date: Date.now() - 800000, type: 'earned', source: 'pass', referenceId: 'pass-gym-ref', points: 200, remainingBalance: 900, facilityId: '1' },
  { id: 'tx-4', userId: 'u-shubham', date: Date.now() - 700000, type: 'earned', source: 'order', referenceId: 'o-old-1', points: 150, remainingBalance: 1050, facilityId: '1' },
  { id: 'tx-5', userId: 'u-shubham', date: Date.now() - 600000, type: 'earned', source: 'membership', referenceId: 'm-gym-ref', points: 200, remainingBalance: 1250, facilityId: '1' },
  { id: 'tx-6', userId: 'u-shubham', date: Date.now() - 500000, type: 'used', source: 'manual', referenceId: 'discount-ref', points: 1000, remainingBalance: 250, facilityId: '1' }
];

export const DEFAULT_REWARD_SETTINGS: RewardSettings = {
  classes: { enabled: true, points: 50, facilityIds: [] },
  passes: { enabled: true, points: 100, facilityIds: [] },
  blocks: { enabled: true, points: 150, facilityIds: [] },
  orders: { enabled: true, points: 20, facilityIds: [] },
  memberships: { enabled: true, points: 200, facilityIds: [] },
  redemption: { enabled: true, pointsToValue: 1000, monetaryValue: 10, minPointsRequired: 1000, enabledModules: ['booking', 'block', 'pass', 'order'] }
};