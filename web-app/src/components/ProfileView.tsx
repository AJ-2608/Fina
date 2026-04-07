import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Camera, 
  Shield, 
  Bell, 
  CreditCard,
  ChevronRight,
  Edit3,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

import { UserProfile } from '@/src/types';

interface ProfileViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
}

export function ProfileView({ profile, setProfile, onLogout }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'billing'>('details');

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to a backend
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUrlPrompt = () => {
    const newAvatar = window.prompt('Enter new image URL:');
    if (newAvatar) {
      setProfile({ ...profile, avatar: newAvatar });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Profile Card */}
      <div className="glass-card p-10 bg-white/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-brand-primary/5" />
        
        <div className="relative flex flex-col items-center text-center">
          <div className="relative group mb-6">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105">
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <label className="absolute bottom-0 right-0 p-3 bg-brand-primary text-white rounded-2xl shadow-xl hover:bg-brand-primary/90 transition-all cursor-pointer">
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
            <button 
              onClick={handleAvatarUrlPrompt}
              className="absolute -top-2 -right-2 p-2 bg-white text-brand-primary/40 rounded-xl shadow-lg hover:text-brand-primary transition-all opacity-0 group-hover:opacity-100"
              title="Change via URL"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4 w-full max-w-sm">
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full text-center text-3xl font-serif font-bold text-brand-primary bg-transparent border-b-2 border-brand-primary/10 focus:border-brand-primary focus:outline-none px-2 py-1"
              />
              <textarea 
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full text-center text-sm text-brand-primary/60 bg-transparent border-none focus:ring-0 resize-none h-20"
              />
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-serif font-bold text-brand-primary mb-2">{profile.name}</h2>
              <p className="text-brand-primary/40 font-medium text-sm mb-6">{profile.email}</p>
              
              <p className="max-w-md text-brand-primary/60 leading-relaxed text-sm italic">
                "{profile.bio}"
              </p>
            </>
          )}
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center gap-4 p-1.5 bg-brand-primary/5 rounded-[2rem] w-fit mx-auto">
        {(['details', 'security', 'billing'] as const).map((tab) => (
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
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="glass-card p-8 bg-white/60 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-brand-primary">Personal Details</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-brand-primary/5 rounded-xl transition-colors text-brand-primary/40 hover:text-brand-primary"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-brand-primary/5 rounded-2xl">
                    <Mail className="w-5 h-5 text-brand-primary/40" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Email</p>
                      {isEditing ? (
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={e => setProfile({...profile, email: e.target.value})}
                          className="w-full text-sm font-medium text-brand-primary bg-transparent border-none focus:ring-0 p-0"
                        />
                      ) : (
                        <p className="text-sm font-medium text-brand-primary">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-brand-primary/5 rounded-2xl">
                    <Phone className="w-5 h-5 text-brand-primary/40" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Phone</p>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={e => setProfile({...profile, phone: e.target.value})}
                          className="w-full text-sm font-medium text-brand-primary bg-transparent border-none focus:ring-0 p-0"
                        />
                      ) : (
                        <p className="text-sm font-medium text-brand-primary">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-brand-primary/5 rounded-2xl">
                    <MapPin className="w-5 h-5 text-brand-primary/40" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Location</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={profile.location}
                          onChange={e => setProfile({...profile, location: e.target.value})}
                          className="w-full text-sm font-medium text-brand-primary bg-transparent border-none focus:ring-0 p-0"
                        />
                      ) : (
                        <p className="text-sm font-medium text-brand-primary">{profile.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Logout */}
              <div className="space-y-6">
                <div className="glass-card p-8 bg-white/60 space-y-4">
                  <h3 className="font-bold text-brand-primary mb-4">Account Actions</h3>
                  
                  <button 
                    onClick={() => setActiveTab('security')}
                    className="w-full flex items-center justify-between p-4 hover:bg-brand-primary/5 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Shield className="w-5 h-5 text-brand-primary/40" />
                      <span className="text-sm font-bold text-brand-primary/60 group-hover:text-brand-primary">Security & Privacy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-primary/20" />
                  </button>
                  
                  <button 
                    onClick={() => alert('Notification settings coming soon!')}
                    className="w-full flex items-center justify-between p-4 hover:bg-brand-primary/5 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Bell className="w-5 h-5 text-brand-primary/40" />
                      <span className="text-sm font-bold text-brand-primary/60 group-hover:text-brand-primary">Notifications</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-primary/20" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className="w-full flex items-center justify-between p-4 hover:bg-brand-primary/5 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-5 h-5 text-brand-primary/40" />
                      <span className="text-sm font-bold text-brand-primary/60 group-hover:text-brand-primary">Subscription</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-primary/20" />
                  </button>
                </div>

                <button 
                  onClick={onLogout}
                  className="w-full py-5 bg-red-50 text-red-500 rounded-[2rem] font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-3 border border-red-100"
                >
                  <LogOut className="w-5 h-5" /> Logout from Fina
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card p-10 bg-white/60 text-center space-y-6">
              <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-brand-primary/20" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-primary">Security & Privacy</h3>
              <p className="text-brand-primary/40 max-w-md mx-auto">Manage your account security, two-factor authentication, and privacy preferences.</p>
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto pt-6">
                <button className="w-full py-4 bg-brand-primary/5 rounded-2xl font-bold text-brand-primary hover:bg-brand-primary/10 transition-all">Change Password</button>
                <button className="w-full py-4 bg-brand-primary/5 rounded-2xl font-bold text-brand-primary hover:bg-brand-primary/10 transition-all">Two-Factor Auth</button>
                <button className="w-full py-4 bg-brand-primary/5 rounded-2xl font-bold text-brand-primary hover:bg-brand-primary/10 transition-all">Login History</button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass-card p-10 bg-white/60 text-center space-y-6">
              <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-brand-primary/20" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-primary">Billing & Subscription</h3>
              <p className="text-brand-primary/40 max-w-md mx-auto">Manage your subscription plan, payment methods, and billing history.</p>
              <div className="max-w-md mx-auto p-6 bg-brand-primary rounded-[2rem] text-white text-left relative overflow-hidden mt-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="w-24 h-24" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Current Plan</p>
                <h4 className="text-2xl font-bold mb-6">Fina Premium Plus</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">$19.99 / month</span>
                  <button className="px-4 py-2 bg-white text-brand-primary rounded-xl font-bold text-xs">Manage</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
