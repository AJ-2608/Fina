import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Database, 
  HelpCircle, 
  ChevronRight, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SettingsViewProps {
  settings: {
    notifications: boolean;
    darkMode: boolean;
    aiPersonalization: boolean;
    dataSync: boolean;
    language: string;
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    notifications: boolean;
    darkMode: boolean;
    aiPersonalization: boolean;
    dataSync: boolean;
    language: string;
  }>>;
  onReset?: () => void;
}

export function SettingsView({ settings, setSettings, onReset }: SettingsViewProps) {
  const [hasApiKey, setHasApiKey] = useState(false);

  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'privacy'>('general');

  React.useEffect(() => {
    const checkKey = async () => {
      try {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } catch (e) {
        console.error("Error checking API key:", e);
      }
    };
    checkKey();
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-brand-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-4xl font-serif font-bold text-brand-primary">Settings</h2>
          <p className="text-brand-primary/40 font-medium">Customize your Fina experience.</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex items-center gap-4 p-1.5 bg-brand-primary/5 rounded-[2rem] w-fit mx-auto mb-10">
        {(['general', 'ai', 'privacy'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-3 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === tab 
                ? "bg-white text-brand-primary shadow-lg" 
                : "text-brand-primary/40 hover:text-brand-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'general' && (
            <div className="grid grid-cols-2 gap-10">
              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest px-4">Appearance</h3>
                <div className="glass-card p-6 bg-white/60 space-y-2">
                  <div className="flex items-center justify-between p-4 hover:bg-brand-primary/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                      {settings.darkMode ? <Moon className="w-5 h-5 text-brand-primary/40" /> : <Sun className="w-5 h-5 text-brand-primary/40" />}
                      <span className="text-sm font-bold text-brand-primary/60 group-hover:text-brand-primary">Dark Mode</span>
                    </div>
                    <button onClick={() => toggleSetting('darkMode')} className="text-brand-primary/40 hover:text-brand-primary transition-colors">
                      {settings.darkMode ? <ToggleRight className="w-8 h-8 text-brand-primary" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                  <div 
                    onClick={() => alert('Language selection coming soon!')}
                    className="flex items-center justify-between p-4 hover:bg-brand-primary/5 rounded-2xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Globe className="w-5 h-5 text-brand-primary/40" />
                      <span className="text-sm font-bold text-brand-primary/60 group-hover:text-brand-primary">Language</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-primary/40">{settings.language}</span>
                      <ChevronRight className="w-4 h-4 text-brand-primary/20" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest px-4">Notifications</h3>
                <div className="glass-card p-6 bg-white/60 space-y-2">
                  <div className="flex items-center justify-between p-4 hover:bg-brand-primary/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                      <Bell className="w-5 h-5 text-brand-primary/40" />
                      <span className="text-sm font-bold text-brand-primary/60 group-hover:text-brand-primary">Push Notifications</span>
                    </div>
                    <button onClick={() => toggleSetting('notifications')} className="text-brand-primary/40 hover:text-brand-primary transition-colors">
                      {settings.notifications ? <ToggleRight className="w-8 h-8 text-brand-primary" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="glass-card p-10 bg-brand-primary text-white space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">AI Personalization</h3>
                    <p className="text-white/60 text-sm">Tailor Fina's intelligence to your life.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10">
                    <div className="space-y-1">
                      <p className="font-bold">Adaptive Learning</p>
                      <p className="text-xs opacity-60">Learn from your journaling patterns.</p>
                    </div>
                    <button onClick={() => toggleSetting('aiPersonalization')} className="text-white/40 hover:text-white transition-colors">
                      {settings.aiPersonalization ? <ToggleRight className="w-10 h-10 text-white" /> : <ToggleLeft className="w-10 h-10" />}
                    </button>
                  </div>

                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Custom API Configuration</p>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        hasApiKey ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"
                      )}>
                        {hasApiKey ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">
                      Use your own Google Cloud API key for higher limits and faster response times.
                    </p>
                    <button 
                      onClick={async () => {
                        try {
                          await (window as any).aistudio.openSelectKey();
                          const has = await (window as any).aistudio.hasSelectedApiKey();
                          setHasApiKey(has);
                        } catch (e) {
                          console.error("Failed to open key selection:", e);
                          alert("Could not open API key selection. Please try again.");
                        }
                      }}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border",
                        hasApiKey 
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-lg" 
                          : "bg-white text-brand-primary border-white shadow-lg hover:scale-[1.02]"
                      )}
                    >
                      <Settings className="w-4 h-4" />
                      {hasApiKey ? "Update API Key" : "Connect API Key"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="glass-card p-8 bg-white/60 space-y-6">
                <h3 className="font-bold text-brand-primary">Data Management</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => alert('Data Export coming soon!')}
                    className="w-full flex items-center justify-between p-5 bg-brand-primary/5 rounded-2xl hover:bg-brand-primary/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Database className="w-5 h-5 text-brand-primary/40" />
                      <span className="font-bold text-brand-primary/60 group-hover:text-brand-primary">Export My Data</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-primary/20" />
                  </button>
                  <button 
                    onClick={onReset}
                    className="w-full flex items-center justify-between p-5 bg-red-50 rounded-2xl hover:bg-red-100 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Trash2 className="w-5 h-5 text-red-400" />
                      <span className="font-bold text-red-500">Reset All Account Data</span>
                    </div>
                    <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest">Irreversible</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
