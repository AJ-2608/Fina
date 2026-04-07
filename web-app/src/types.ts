export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface FinancialMetric {
  label: string;
  value: number;
  trend: number;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  aiAnalysis?: string;
}

export interface MoodMetric {
  date: string;
  score: number; // 1-5
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location?: string;
  color: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDates: string[]; // ISO dates
  color: string;
  icon: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  category: string;
  icon: string;
}
