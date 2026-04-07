import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Plus, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  Calendar
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  completed: boolean;
}

interface RemindersViewProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

export function RemindersView({ reminders, setReminders }: RemindersViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.time) return;
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      completed: false
    };
    
    setReminders([reminder, ...reminders]);
    setIsAdding(false);
    setNewReminder({
      title: '',
      description: '',
      time: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-brand-primary">Reminders</h2>
          <p className="text-brand-primary/40 font-medium">Never miss a moment of reflection.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" /> Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {reminders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center space-y-4 bg-white/40"
            >
              <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8 text-brand-primary/20" />
              </div>
              <p className="text-brand-primary/40 font-bold">No reminders set yet.</p>
            </motion.div>
          ) : (
            reminders.map(reminder => (
              <motion.div 
                key={reminder.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "glass-card p-6 flex items-center justify-between group transition-all",
                  reminder.completed ? "bg-white/20 opacity-60" : "bg-white/60 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleComplete(reminder.id)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                      reminder.completed ? "bg-green-500 border-green-500 text-white" : "border-brand-primary/10 hover:border-brand-primary/30 text-transparent"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  
                  <div>
                    <h4 className={cn("font-bold text-brand-primary", reminder.completed && "line-through")}>
                      {reminder.title}
                    </h4>
                    <p className="text-xs text-brand-primary/40 font-medium mb-2">{reminder.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {reminder.time}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {reminder.date}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-3 text-red-400 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-brand-primary/40" />
              </button>
              
              <h3 className="text-2xl font-serif font-bold text-brand-primary mb-8">New Reminder</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Title</label>
                  <input 
                    type="text" 
                    value={newReminder.title}
                    onChange={e => setNewReminder({...newReminder, title: e.target.value})}
                    placeholder="What should we remind you?"
                    className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Description</label>
                  <textarea 
                    value={newReminder.description}
                    onChange={e => setNewReminder({...newReminder, description: e.target.value})}
                    placeholder="Add some details..."
                    className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium h-24 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Time</label>
                    <input 
                      type="time" 
                      value={newReminder.time}
                      onChange={e => setNewReminder({...newReminder, time: e.target.value})}
                      className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Date</label>
                    <input 
                      type="date" 
                      value={newReminder.date}
                      onChange={e => setNewReminder({...newReminder, date: e.target.value})}
                      className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddReminder}
                  className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                  Set Reminder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
