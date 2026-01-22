
export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: number;
  features: string[]; // List of enabled feature IDs (e.g., 'classes', 'blocks', 'timetable')
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

export interface TimetableEntry {
  id: string;
  facilityId: string;
  classId: string;
  day: string;
  startTime: string;
  endTime: string;
  instructor: string;
  room?: string;
}

export type AppView = 'landing' | 'app' | 'admin' | 'app-home' | 'admin-login';

export const FEATURE_MODULES = [
  { id: 'classes', name: 'Classes', icon: 'BookOpen' },
  { id: 'timetable', name: 'Timetable', icon: 'Calendar' },
  { id: 'blocks', name: 'Blocks', icon: 'Layers' },
  { id: 'passes', name: 'Passes', icon: 'Ticket' },
  { id: 'memberships', name: 'Memberships', icon: 'CreditCard' },
  { id: 'marketplace', name: 'ShoppingBag' },
];

export const CLASS_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'All Levels'];
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DEFAULT_FACILITIES: Facility[] = [
  {
    id: '1',
    name: '121 Fitness',
    description: '<b>Premier fitness</b> coaching and state-of-the-art equipment tailored for your personal growth.',
    icon: 'Dumbbell',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 100000,
    features: ['classes', 'timetable', 'memberships']
  },
  {
    id: '2',
    name: '121 Zen',
    description: 'A sanctuary for <i>meditation and yoga</i>, focusing on mindfulness and inner peace.',
    icon: 'Flower2',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    isActive: true,
    createdAt: Date.now() - 50000,
    features: ['classes', 'timetable']
  }
];

export const DEFAULT_CLASSES: Class[] = [
  {
    id: 'c1',
    facilityId: '1',
    name: 'HIIT Intensive',
    shortDescription: 'Maximum intensity workout to burn calories.',
    duration: '45 mins',
    requirements: 'Water bottle, towel, indoor shoes',
    level: 'Expert',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
    createdAt: Date.now()
  }
];

export const DEFAULT_TIMETABLE: TimetableEntry[] = [
  {
    id: 't1',
    facilityId: '1',
    classId: 'c1',
    day: 'Monday',
    startTime: '09:00',
    endTime: '09:45',
    instructor: 'Alex Rivera',
    room: 'Studio A'
  }
];
