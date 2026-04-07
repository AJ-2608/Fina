import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Plus,
  BookOpen,
  DollarSign,
  Heart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DiaryEntry, UserProfile, Transaction, CalendarEvent, Habit, Skill } from '@/src/types';
import { Reminder } from './RemindersView';

interface DashboardViewProps {
  profile: UserProfile;
  entries: DiaryEntry[];
  reminders: Reminder[];
  transactions: Transaction[];
  events: CalendarEvent[];
  habits: Habit[];
  skills: Skill[];
  onNavigate: (tab: string) => void;
  onNewEntry: () => void;
}

export function DashboardView({ 
  profile, 
  entries, 
  reminders, 
  transactions, 
  events, 
  habits,
  skills,
  onNavigate, 
  onNewEntry 
}: DashboardViewProps) {
  const recentEntries = entries.slice(0, 3);
  const upcomingReminders = reminders.filter(r => !r.completed).slice(0, 3);
  
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const todayEntry = entries.find(e => e.date.includes(today));

  const totalSpend = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const remaining = totalIncome - totalSpend;
  const spendPercent = totalIncome > 0 ? (totalSpend / totalIncome) * 100 : 0;

  const activeHabits = habits.slice(0, 3);
  const topSkill = [...skills].sort((a, b) => (b.level * 1000 + b.experience) - (a.level * 1000 + a.experience))[0];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 pb-32">
      {/* Welcome Header */}
      <header className="flex items-end justify-between border-b border-brand-primary/5 pb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-bold text-brand-primary mb-2"
          >
            Welcome back, {profile.name.split(' ')[0]}
          </motion.h1>
          <p className="text-brand-primary/30 font-bold uppercase tracking-[0.3em] text-[10px]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewEntry}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-brand-primary/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </motion.button>
      </header>

      {/* AI Daily Insight - Minimalist Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 bg-white/40 border-brand-primary/5 relative overflow-hidden"
      >
        <div className="flex items-start gap-8 relative z-10">
          <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-brand-primary/40" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-brand-primary leading-tight">
              {todayEntry 
                ? "Your reflection today shows a focus on growth. What's the next small step?"
                : "A moment of reflection can change your entire day. Ready to check in?"}
            </h2>
            <p className="text-brand-primary/40 text-sm max-w-2xl leading-relaxed">
              Fina has analyzed your recent patterns. You're showing high emotional resilience this week. 
              Consider documenting your current wins to reinforce this positive trend.
            </p>
            <button 
              onClick={() => onNavigate('journal')}
              className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              View Full Insights →
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-12">
        {/* Recent Reflections - Clean List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Recent Reflections</h3>
            <button onClick={() => onNavigate('diary')} className="text-[10px] font-bold text-brand-primary/40 hover:text-brand-primary transition-colors uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-4">
            {recentEntries.length > 0 ? recentEntries.map((entry, i) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onNavigate('diary')}
                className="group cursor-pointer p-6 rounded-[2rem] bg-white/40 hover:bg-white transition-all border border-transparent hover:border-brand-primary/5 shadow-sm hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">{entry.date}</span>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    entry.sentiment === 'positive' ? "bg-emerald-400" : entry.sentiment === 'negative' ? "bg-rose-400" : "bg-sky-400"
                  )} />
                </div>
                <p className="text-sm text-brand-primary/60 font-medium line-clamp-2 leading-relaxed">
                  {entry.content.split('\n\n')[1] || entry.content}
                </p>
              </motion.div>
            )) : (
              <div className="p-12 text-center border-2 border-dashed border-brand-primary/5 rounded-[2rem]">
                <p className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">No entries yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Reminders & Financials */}
        <div className="space-y-12">
          {/* Reminders - Minimalist */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Upcoming</h3>
              <button onClick={() => onNavigate('reminders')} className="text-[10px] font-bold text-brand-primary/40 hover:text-brand-primary transition-colors uppercase tracking-widest">Manage</button>
            </div>
            <div className="glass-card p-8 bg-white/40 space-y-4">
              {upcomingReminders.length > 0 ? upcomingReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary transition-colors" />
                    <div>
                      <p className="text-sm font-bold text-brand-primary">{reminder.title}</p>
                      <p className="text-[10px] font-medium text-brand-primary/30">{reminder.time}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-primary/10 group-hover:text-brand-primary/40 transition-all" />
                </div>
              )) : (
                <p className="text-center py-4 text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">All caught up</p>
              )}
            </div>
          </section>

          {/* Financials - Minimalist */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Financials</h3>
              <button onClick={() => onNavigate('financials')} className="text-[10px] font-bold text-brand-primary/40 hover:text-brand-primary transition-colors uppercase tracking-widest">Details</button>
            </div>
            <div className="glass-card p-8 bg-white/40 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest mb-1">Monthly Spend</p>
                  <p className="text-3xl font-serif font-bold text-brand-primary">${totalSpend.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Balance</p>
                  <p className="text-lg font-bold text-emerald-500">${remaining.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-brand-primary/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(spendPercent, 100)}%` }}
                  className="h-full bg-brand-primary/40"
                />
              </div>
            </div>
          </section>

          {/* Habits & Growth - Minimalist */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Habits & Growth</h3>
              <button onClick={() => onNavigate('habits')} className="text-[10px] font-bold text-brand-primary/40 hover:text-brand-primary transition-colors uppercase tracking-widest">Tracker</button>
            </div>
            <div className="glass-card p-8 bg-white/40 space-y-6">
              {activeHabits.length > 0 ? (
                <div className="space-y-4">
                  {activeHabits.map(habit => (
                    <div key={habit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-1.5 h-1.5 rounded-full", habit.color)} />
                        <span className="text-xs font-bold text-brand-primary/60">{habit.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">{habit.streak}d streak</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">No active habits</p>
              )}
              
              {topSkill && (
                <div className="pt-4 border-t border-brand-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">Top Skill: {topSkill.name}</span>
                    <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Lvl {topSkill.level}</span>
                  </div>
                  <div className="w-full h-1 bg-brand-primary/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(topSkill.experience / topSkill.maxExperience) * 100}%` }}
                      className="h-full bg-brand-primary/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
