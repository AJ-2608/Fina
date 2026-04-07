import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Clock, 
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface QuickActionMenuProps {
  onAction: (action: string) => void;
}

export function QuickActionMenu({ onAction }: QuickActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'journal', label: 'New Journal', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'financials', label: 'Add Expense', icon: DollarSign, color: 'bg-emerald-500' },
    { id: 'calendar', label: 'New Event', icon: Calendar, color: 'bg-purple-500' },
    { id: 'reminders', label: 'Add Reminder', icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="fixed bottom-10 right-36 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-24 right-0 flex flex-col items-end gap-4">
            {actions.map((action, i) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  onAction(action.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-4 group"
              >
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-brand-primary shadow-lg border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95",
                  action.color
                )}>
                  <action.icon className="w-6 h-6" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all z-50",
          isOpen ? "bg-brand-primary text-white rotate-45" : "bg-white text-brand-primary hover:bg-brand-primary/5 border border-white/40 backdrop-blur-md"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <Plus className="w-10 h-10" />}
      </motion.button>
    </div>
  );
}
