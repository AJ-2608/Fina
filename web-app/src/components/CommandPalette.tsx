import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Settings, 
  User, 
  Plus, 
  Sparkles, 
  Command,
  ArrowRight,
  Clock,
  Layout
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'overview', label: 'Go to Overview', icon: Layout, category: 'Navigation' },
    { id: 'journal', label: 'New Journal Entry', icon: BookOpen, category: 'Actions' },
    { id: 'diary', label: 'View Diary', icon: Sparkles, category: 'Navigation' },
    { id: 'financials', label: 'Financial Overview', icon: DollarSign, category: 'Navigation' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, category: 'Navigation' },
    { id: 'reminders', label: 'Reminders', icon: Clock, category: 'Navigation' },
    { id: 'profile', label: 'My Profile', icon: User, category: 'Settings' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'Settings' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          onAction(filteredActions[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onAction, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-primary/20 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden"
          >
            <div className="p-6 border-b border-brand-primary/5 flex items-center gap-4">
              <Search className="w-6 h-6 text-brand-primary/30" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for actions, pages, or settings..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-xl text-brand-primary placeholder:text-brand-primary/10 font-medium"
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-brand-primary/5 rounded-lg border border-brand-primary/10">
                <span className="text-[10px] font-bold text-brand-primary/40 uppercase">ESC</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {filteredActions.length > 0 ? (
                <div className="space-y-6">
                  {['Navigation', 'Actions', 'Settings'].map(category => {
                    const categoryActions = filteredActions.filter(a => a.category === category);
                    if (categoryActions.length === 0) return null;

                    return (
                      <div key={category} className="space-y-2">
                        <h3 className="px-4 text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">{category}</h3>
                        <div className="space-y-1">
                          {categoryActions.map((action) => {
                            const globalIndex = filteredActions.indexOf(action);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <button
                                key={action.id}
                                onClick={() => {
                                  onAction(action.id);
                                  onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={cn(
                                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                  isSelected ? "bg-brand-primary text-white shadow-lg scale-[1.02]" : "hover:bg-brand-primary/5 text-brand-primary/60"
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                    isSelected ? "bg-white/10" : "bg-brand-primary/5"
                                  )}>
                                    <action.icon className={cn("w-5 h-5", isSelected ? "text-white" : "text-brand-primary/40")} />
                                  </div>
                                  <span className="font-bold text-sm">{action.label}</span>
                                </div>
                                {isSelected && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold opacity-60 uppercase">Enter</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-brand-primary/20 font-bold uppercase text-xs">No results found for "{query}"</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-brand-primary/5 border-t border-brand-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-brand-primary/10 text-[10px] font-bold text-brand-primary/40">↑↓</kbd>
                  <span className="text-[10px] font-bold text-brand-primary/30 uppercase">Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-brand-primary/10 text-[10px] font-bold text-brand-primary/40">Enter</kbd>
                  <span className="text-[10px] font-bold text-brand-primary/30 uppercase">Select</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-brand-primary/20">
                <Command className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Fina Quick Actions</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
