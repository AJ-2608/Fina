import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location?: string;
  color: string;
}

const COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-emerald-500',
];

import { CalendarEvent } from '@/src/types';

interface CalendarViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export function CalendarView({ events, setEvents }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', location: '', color: COLORS[0] });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time || 'All Day',
      location: newEvent.location,
      color: newEvent.color
    };
    setEvents([...events, event]);
    setIsAdding(false);
    setNewEvent({ title: '', time: '', location: '', color: COLORS[0] });
  };

  const getEventsForDate = (day: number) => {
    return events.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === currentDate.getMonth() && 
      e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-8">
        {/* Calendar Grid */}
        <div className="flex-1 glass-card p-10 bg-white/60">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-brand-primary">
                {currentDate.toLocaleString('default', { month: 'long' })}
              </h2>
              <p className="text-brand-primary/30 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">{currentDate.getFullYear()}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={prevMonth} className="p-3 hover:bg-brand-primary/5 rounded-2xl transition-all">
                <ChevronLeft className="w-6 h-6 text-brand-primary/40" />
              </button>
              <button onClick={nextMonth} className="p-3 hover:bg-brand-primary/5 rounded-2xl transition-all">
                <ChevronRight className="w-6 h-6 text-brand-primary/40" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-brand-primary/20 uppercase tracking-[0.2em] py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-brand-primary/5 rounded-[2.5rem] overflow-hidden border border-brand-primary/5">
            {prevMonthDays.map(i => (
              <div key={`prev-${i}`} className="aspect-square bg-white/10" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDate(day);
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div 
                  key={day} 
                  onClick={() => {
                    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                    setIsAdding(true);
                  }}
                  className="aspect-square bg-white/40 p-3 hover:bg-white transition-all cursor-pointer group relative"
                >
                  <span className={cn(
                    "text-xs font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                    isToday ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-brand-primary/40 group-hover:text-brand-primary"
                  )}>
                    {day}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayEvents.slice(0, 3).map(e => (
                      <div key={e.id} className={cn("w-1.5 h-1.5 rounded-full", e.color)} />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[8px] font-bold text-brand-primary/20">+{dayEvents.length - 3}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Events */}
        <div className="w-96 space-y-8">
          <div className="glass-card p-8 bg-brand-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
              <CalendarIcon className="w-5 h-5 opacity-60" /> Upcoming
            </h3>
            <div className="space-y-4 relative z-10">
              {sortedEvents.length > 0 ? sortedEvents.slice(0, 4).map(e => (
                <div key={e.id} className="bg-white/10 p-4 rounded-2xl border border-white/5 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full", e.color)} />
                    <h4 className="font-bold text-sm truncate">{e.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] opacity-40 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                    <span>{e.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              )) : (
                <p className="text-center py-8 text-[10px] font-bold opacity-40 uppercase tracking-widest">No upcoming events</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => {
              setSelectedDate(new Date());
              setIsAdding(true);
            }}
            className="w-full py-6 bg-white/40 border-2 border-dashed border-brand-primary/5 rounded-[2.5rem] text-brand-primary/20 font-bold hover:border-brand-primary/20 hover:text-brand-primary/40 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 bg-brand-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary/10 transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest">Add Event</span>
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
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
              
              <h3 className="text-2xl font-serif font-bold text-brand-primary mb-8">New Event</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Title</label>
                  <input 
                    type="text" 
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Event name"
                    className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Time</label>
                    <input 
                      type="text" 
                      value={newEvent.time}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                      placeholder="10:00 AM"
                      className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Color</label>
                    <div className="flex gap-2 py-2">
                      {COLORS.map(c => (
                        <button 
                          key={c}
                          onClick={() => setNewEvent({...newEvent, color: c})}
                          className={cn(
                            "w-6 h-6 rounded-full transition-transform",
                            c,
                            newEvent.color === c ? "scale-125 ring-2 ring-offset-2 ring-brand-primary/20" : "hover:scale-110"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAddEvent}
                  className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                  Create Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
