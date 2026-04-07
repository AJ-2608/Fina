import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Layout, 
  Settings, 
  HelpCircle, 
  Search, 
  LogOut, 
  Menu, 
  Bell, 
  User,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  Command,
  Plus,
  Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AIAssistant } from '@/src/components/AIAssistant';
import { JournalEditor } from '@/src/components/JournalEditor';
import { DiaryView } from '@/src/components/DiaryView';
import { FinancialView } from '@/src/components/FinancialView';
import { CalendarView } from '@/src/components/CalendarView';
import { ProfileView } from '@/src/components/ProfileView';
import { SettingsView } from '@/src/components/SettingsView';
import { RemindersView, Reminder } from '@/src/components/RemindersView';
import { DashboardView } from '@/src/components/DashboardView';
import { HabitsView } from '@/src/components/HabitsView';
import { CommandPalette } from '@/src/components/CommandPalette';
import { QuickActionMenu } from '@/src/components/QuickActionMenu';
import { DiaryEntry, UserProfile, Transaction, CalendarEvent, Habit, Skill } from '@/src/types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Persistence: Load from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fina_profile');
    return saved ? JSON.parse(saved) : {
      name: 'User',
      email: 'user@example.com',
      phone: '',
      location: '',
      bio: 'Welcome to Fina. Start your journey here.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop'
    };
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('fina_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('fina_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fina_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('fina_events');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
    } catch (e) {
      return [];
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('fina_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('fina_skills');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Health', level: 1, experience: 0, maxExperience: 100, category: 'Health', icon: 'Activity' },
      { id: '2', name: 'Mind', level: 1, experience: 0, maxExperience: 100, category: 'Mind', icon: 'Book' },
      { id: '3', name: 'Coding', level: 1, experience: 0, maxExperience: 100, category: 'Tech', icon: 'Code' },
    ];
  });

  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('fina_settings');
    return saved ? JSON.parse(saved) : {
      notifications: true,
      darkMode: false,
      aiPersonalization: true,
      dataSync: true,
      language: 'English'
    };
  });

  const handleResetApp = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Persistence: Save to localStorage
  useEffect(() => {
    localStorage.setItem('fina_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fina_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('fina_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('fina_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fina_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('fina_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('fina_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('fina_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Browser Notifications Support
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Background check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM
      const currentDate = now.toISOString().split('T')[0];

      reminders.forEach(reminder => {
        if (!reminder.completed && reminder.date === currentDate && reminder.time === currentTime) {
          // Trigger Notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Fina Reminder", {
              body: `${reminder.title}: ${reminder.description}`,
              icon: profile.avatar
            });
            
            // Mark as completed to avoid duplicate notifications in the same minute
            setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, completed: true } : r));
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, profile.avatar]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveEntry = (content: string, title: string) => {
    if (!content.trim() && !title.trim()) return;
    
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? {
        ...e,
        content: `${title}\n\n${content}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } : e));
      setEditingEntry(null);
    } else {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        content: `${title}\n\n${content}`,
        mood: 'Neutral', // Default, can be updated by AI later
        sentiment: 'neutral',
        tags: ['journal'],
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setActiveTab('diary');
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setActiveTab('journal');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      window.location.reload();
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-brand-bg relative overflow-hidden selection:bg-brand-primary/10 selection:text-brand-primary",
      settings.darkMode && "dark"
    )}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[200] bg-brand-primary flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-white/10 border-t-white rounded-full"
                />
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-serif font-bold text-white mb-2">Fina</h1>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Personal Intelligence</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-10 z-40 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-white/40 backdrop-blur-md rounded-2xl hover:bg-white/60 transition-all text-brand-primary shadow-sm border border-white/20"
          >
            <Menu className="w-8 h-8" />
          </button>
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary/40" />
            <input 
              type="text" 
              placeholder="Search or press ⌘K..." 
              onFocus={(e) => {
                e.target.blur();
                setIsCommandPaletteOpen(true);
              }}
              className="w-full pl-14 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-full border border-white/20 focus:bg-white/60 focus:outline-none transition-all text-lg text-brand-primary shadow-sm cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center gap-6 pointer-events-auto">
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-2xl hover:bg-white/60 transition-all text-brand-primary/40 shadow-sm border border-white/20 group"
          >
            <Command className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-brand-primary transition-colors">K</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "p-3 bg-white/40 backdrop-blur-md rounded-2xl hover:bg-white/60 transition-all text-brand-primary shadow-sm border border-white/20 relative",
                isNotificationsOpen && "bg-white/80"
              )}
            >
              <Bell className="w-8 h-8" />
              {reminders.filter(r => !r.completed).length > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-white/90 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2rem] p-6 z-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-brand-primary">Notifications</h4>
                    <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                      {reminders.filter(r => !r.completed).length} New
                    </span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {reminders.filter(r => !r.completed).length === 0 ? (
                      <p className="text-center py-8 text-sm text-brand-primary/40 font-medium">All caught up!</p>
                    ) : (
                      reminders.filter(r => !r.completed).map(r => (
                        <div key={r.id} className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                              <Bell className="w-4 h-4 text-brand-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-brand-primary">{r.title}</p>
                              <p className="text-[10px] text-brand-primary/60 mt-1">{r.time} • {r.date}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('reminders');
                      setIsNotificationsOpen(false);
                    }}
                    className="w-full mt-4 py-3 text-xs font-bold text-brand-primary/40 hover:text-brand-primary transition-colors border-t border-brand-primary/5"
                  >
                    View All Reminders
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="p-1 bg-white/40 backdrop-blur-md rounded-full hover:bg-white/60 transition-all text-brand-primary shadow-sm border border-white/20"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Floating Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            className="fixed top-24 left-10 w-96 bg-white/90 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8 z-50 flex flex-col gap-8"
          >
            {/* Profile Section */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-primary/5 group-hover:border-brand-primary/20 transition-all shadow-lg">
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-primary">{profile.name}</h3>
                  <p className="text-sm text-brand-secondary">Premium Member</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-brand-secondary group-hover:text-brand-primary transition-colors" />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <SidebarItem 
                icon={<Layout className="w-6 h-6" />} 
                label="Overview" 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              />
              <SidebarItem 
                icon={<BookOpen className="w-6 h-6" />} 
                label="Journal" 
                active={activeTab === 'journal'} 
                onClick={() => {
                  setEditingEntry(null);
                  setActiveTab('journal');
                }}
              />
              <SidebarItem 
                icon={<BrainCircuit className="w-6 h-6" />} 
                label="Diary" 
                active={activeTab === 'diary'} 
                onClick={() => setActiveTab('diary')}
              />
              <SidebarItem 
                icon={<Layout className="w-6 h-6" />} 
                label="Financials" 
                active={activeTab === 'financials'} 
                onClick={() => setActiveTab('financials')}
              />
              <SidebarItem 
                icon={<Bell className="w-6 h-6" />} 
                label="Reminders" 
                active={activeTab === 'reminders'} 
                onClick={() => setActiveTab('reminders')}
              />
              <SidebarItem 
                icon={<Zap className="w-6 h-6" />} 
                label="Habits" 
                active={activeTab === 'habits'} 
                onClick={() => setActiveTab('habits')}
              />
              <div className="h-px bg-brand-primary/5 my-2" />
              <SidebarItem 
                icon={<Calendar className="w-6 h-6" />} 
                label="Calendar" 
                active={activeTab === 'calendar'} 
                onClick={() => setActiveTab('calendar')}
              />
              <SidebarItem 
                icon={<Settings className="w-6 h-6" />} 
                label="Settings" 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
              />
            </nav>
            {/* Footer Status */}
            <div className="mt-auto pt-8 border-t border-brand-primary/5">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Cloud Sync Active</span>
                </div>
                <span className="text-[10px] font-bold text-brand-primary/20">v2.4.0</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="h-screen overflow-y-auto pt-24 px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'overview' && (
              <DashboardView 
                profile={profile} 
                entries={entries} 
                reminders={reminders}
                transactions={transactions}
                events={events}
                habits={habits}
                skills={skills}
                onNavigate={setActiveTab}
                onNewEntry={() => {
                  setEditingEntry(null);
                  setActiveTab('journal');
                }}
              />
            )}
            {activeTab === 'journal' && (
              <JournalEditor 
                onSave={handleSaveEntry} 
                initialEntry={editingEntry} 
              />
            )}
            {activeTab === 'diary' && (
              <div className="max-w-6xl mx-auto">
                <DiaryView 
                  entries={entries} 
                  setEntries={setEntries} 
                  onEdit={handleEditEntry}
                />
              </div>
            )}
            {activeTab === 'financials' && (
              <div className="max-w-6xl mx-auto">
                <FinancialView 
                  transactions={transactions} 
                  setTransactions={setTransactions} 
                />
              </div>
            )}
            {activeTab === 'calendar' && (
              <CalendarView 
                events={events} 
                setEvents={setEvents} 
              />
            )}
            {activeTab === 'habits' && (
              <HabitsView 
                habits={habits} 
                setHabits={setHabits} 
                skills={skills} 
                setSkills={setSkills} 
              />
            )}
            {activeTab === 'profile' && <ProfileView profile={profile} setProfile={setProfile} onLogout={handleLogout} />}
            {activeTab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} onReset={handleResetApp} />}
            {activeTab === 'reminders' && <RemindersView reminders={reminders} setReminders={setReminders} />}

            {/* Content Footer */}
            <footer className="mt-32 pb-20 border-t border-brand-primary/5 pt-10 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">© 2026 Fina Intelligence</span>
                <div className="flex items-center gap-4">
                  <button className="text-[10px] font-bold text-brand-primary/20 hover:text-brand-primary/40 uppercase tracking-widest transition-colors">Privacy</button>
                  <button className="text-[10px] font-bold text-brand-primary/20 hover:text-brand-primary/40 uppercase tracking-widest transition-colors">Terms</button>
                  <button className="text-[10px] font-bold text-brand-primary/20 hover:text-brand-primary/40 uppercase tracking-widest transition-colors">Support</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest">All Systems Operational</span>
              </div>
            </footer>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI Assistant */}
      <AIAssistant />
      <QuickActionMenu onAction={(action) => {
        if (action === 'journal') setEditingEntry(null);
        setActiveTab(action);
      }} />
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onAction={(action) => {
          if (action === 'journal') setEditingEntry(null);
          setActiveTab(action);
        }}
      />
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group relative overflow-hidden",
        active ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-[1.02]" : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary"
      )}
    >
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-primary/80 z-0"
        />
      )}
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          active ? "bg-white/10" : "bg-brand-primary/5 group-hover:bg-brand-primary/10"
        )}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      
      {!active && (
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      )}
      {active && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
        />
      )}
    </button>
  );
}
