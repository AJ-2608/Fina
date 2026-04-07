import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Flame, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  Star,
  ChevronRight,
  MoreVertical,
  Activity,
  Dumbbell,
  Book,
  Code,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Habit, Skill } from '@/src/types';

interface HabitsViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const HABIT_ICONS = [
  { name: 'Activity', icon: Activity },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Book', icon: Book },
  { name: 'Code', icon: Code },
  { name: 'Coffee', icon: Coffee },
  { name: 'Moon', icon: Moon },
  { name: 'Sun', icon: Sun },
];

const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
];

export function HabitsView({ habits, setHabits, skills, setSkills }: HabitsViewProps) {
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', frequency: 'daily' as const, color: COLORS[0], icon: 'Activity' });

  const today = new Date().toISOString().split('T')[0];

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isCompletedToday = h.completedDates.includes(today);
        let newCompletedDates = [...h.completedDates];
        let newStreak = h.streak;

        if (isCompletedToday) {
          newCompletedDates = newCompletedDates.filter(d => d !== today);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          newCompletedDates.push(today);
          newStreak += 1;
          
          // Award XP to related skill if any
          awardXP(h.title);
        }

        return { ...h, completedDates: newCompletedDates, streak: newStreak };
      }
      return h;
    }));
  };

  const awardXP = (habitTitle: string) => {
    // Simple logic to find a skill related to the habit
    setSkills(prev => prev.map(s => {
      if (habitTitle.toLowerCase().includes(s.name.toLowerCase()) || 
          (s.category === 'Health' && (habitTitle.toLowerCase().includes('gym') || habitTitle.toLowerCase().includes('run'))) ||
          (s.category === 'Mind' && (habitTitle.toLowerCase().includes('read') || habitTitle.toLowerCase().includes('meditate')))
      ) {
        let newExp = s.experience + 20;
        let newLevel = s.level;
        let newMaxExp = s.maxExperience;

        if (newExp >= s.maxExperience) {
          newExp -= s.maxExperience;
          newLevel += 1;
          newMaxExp = Math.floor(s.maxExperience * 1.2);
        }

        return { ...s, experience: newExp, level: newLevel, maxExperience: newMaxExp };
      }
      return s;
    }));
  };

  const addHabit = () => {
    if (!newHabit.title) return;
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit.title,
      frequency: newHabit.frequency,
      streak: 0,
      completedDates: [],
      color: newHabit.color,
      icon: newHabit.icon
    };
    setHabits([...habits, habit]);
    setIsAddingHabit(false);
    setNewHabit({ title: '', frequency: 'daily', color: COLORS[0], icon: 'Activity' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-serif font-bold text-brand-primary">Growth & Habits</h2>
          <p className="text-brand-primary/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Track your evolution</p>
        </div>
        <button 
          onClick={() => setIsAddingHabit(true)}
          className="px-6 py-3 bg-brand-primary text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Habits List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Daily Routine</h3>
            <span className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">{habits.length} Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map(habit => {
              const isCompletedToday = habit.completedDates.includes(today);
              const Icon = HABIT_ICONS.find(i => i.name === habit.icon)?.icon || Activity;

              return (
                <motion.div 
                  key={habit.id}
                  layout
                  className={cn(
                    "glass-card p-6 transition-all group relative overflow-hidden",
                    isCompletedToday ? "bg-brand-primary/5 border-brand-primary/10" : "bg-white/60"
                  )}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", habit.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className={cn("font-bold text-sm", isCompletedToday ? "text-brand-primary/40 line-through" : "text-brand-primary")}>
                          {habit.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">{habit.streak} Day Streak</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleHabit(habit.id)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isCompletedToday 
                          ? "bg-brand-primary text-white shadow-lg" 
                          : "bg-brand-primary/5 text-brand-primary/20 hover:bg-brand-primary/10 hover:text-brand-primary"
                      )}
                    >
                      {isCompletedToday ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Skill Progression */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em]">Skill Progression</h3>
            <Trophy className="w-4 h-4 text-brand-primary/20" />
          </div>

          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.id} className="glass-card p-6 bg-white/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/5 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-brand-primary/40" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-primary">{skill.name}</h4>
                      <p className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">Level {skill.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                      {skill.experience} / {skill.maxExperience} XP
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-brand-primary/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.experience / skill.maxExperience) * 100}%` }}
                    className="h-full bg-brand-primary/40"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="glass-card p-8 bg-brand-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
              <TrendingUp className="w-5 h-5 opacity-60" /> Weekly Growth
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="text-xs font-medium opacity-60">Total XP Gained</span>
                <span className="font-bold">+1,240</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="text-xs font-medium opacity-60">Habit Completion</span>
                <span className="font-bold">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isAddingHabit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-primary/20 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md glass-card p-10 bg-white shadow-2xl space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-brand-primary">New Habit</h3>
                <p className="text-brand-primary/40 text-sm mt-1">Consistency is the key to evolution.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-2 block px-2">Habit Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Morning Run, Reading..."
                    value={newHabit.title}
                    onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                    className="w-full p-5 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-2 block px-2">Frequency</label>
                    <select 
                      value={newHabit.frequency}
                      onChange={e => setNewHabit({...newHabit, frequency: e.target.value as 'daily' | 'weekly'})}
                      className="w-full p-5 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-2 block px-2">Icon</label>
                    <select 
                      value={newHabit.icon}
                      onChange={e => setNewHabit({...newHabit, icon: e.target.value})}
                      className="w-full p-5 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                    >
                      {HABIT_ICONS.map(i => (
                        <option key={i.name} value={i.name}>{i.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-2 block px-2">Color Theme</label>
                  <div className="flex gap-3 px-2">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewHabit({...newHabit, color})}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all",
                          color,
                          newHabit.color === color ? "ring-4 ring-brand-primary/10 scale-110" : "opacity-40 hover:opacity-100"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsAddingHabit(false)}
                  className="flex-1 py-5 bg-brand-primary/5 text-brand-primary/40 rounded-2xl font-bold hover:bg-brand-primary/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={addHabit}
                  className="flex-1 py-5 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all"
                >
                  Create Habit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
