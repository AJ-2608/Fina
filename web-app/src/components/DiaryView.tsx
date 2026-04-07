import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  Smile, 
  Meh, 
  Frown, 
  Sparkles, 
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit2,
  Loader2,
  BrainCircuit
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { DiaryEntry, MoodMetric } from '@/src/types';
import { GoogleGenAI, Type } from "@google/genai";

const MOOD_DATA: MoodMetric[] = [
  { date: 'Mar 10', score: 4 },
  { date: 'Mar 11', score: 3 },
  { date: 'Mar 12', score: 5 },
  { date: 'Mar 13', score: 2 },
  { date: 'Mar 14', score: 3 },
  { date: 'Mar 15', score: 4 },
];

export function DiaryView({ entries, setEntries, onEdit }: { 
  entries: DiaryEntry[], 
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>,
  onEdit?: (entry: DiaryEntry) => void
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAddEntry = async () => {
    if (!newContent.trim()) return;
    setIsAnalyzing(true);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this diary entry for sentiment, mood, and provide a short empathetic reflection (max 2 sentences). Also suggest 2-3 tags.
        Entry: "${newContent}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
              mood: { type: Type.STRING },
              reflection: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['sentiment', 'mood', 'reflection', 'tags']
          }
        }
      });

      const analysis = JSON.parse(response.text);
      
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        content: newContent,
        mood: analysis.mood,
        sentiment: analysis.sentiment,
        tags: analysis.tags,
        aiAnalysis: analysis.reflection
      };

      setEntries([newEntry, ...entries]);
      setNewContent('');
      setIsAdding(false);
    } catch (error) {
      console.error("Analysis Error:", error);
      // Fallback
      const fallbackEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        content: newContent,
        mood: 'Neutral',
        sentiment: 'neutral',
        tags: ['general'],
      };
      setEntries([fallbackEntry, ...entries]);
      setNewContent('');
      setIsAdding(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Emotional Trend</h3>
              <p className="text-sm text-brand-secondary">How you've been feeling lately.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-success bg-brand-success/10 px-2 py-1 rounded-lg">
                <Smile className="w-3 h-3" /> Positive
              </span>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOOD_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                />
                <YAxis 
                  hide
                  domain={[0, 6]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between bg-brand-primary text-white">
          <div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">AI Insight</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              "Your mood has been consistently rising over the last 3 days. Engaging in outdoor activities seems to be a key driver for your happiness."
            </p>
          </div>
          <button className="mt-4 w-full py-2 bg-white text-brand-primary font-bold text-sm rounded-xl hover:bg-white/90 transition-all">
            Deep Dive Analysis
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary" />
          <input 
            type="text" 
            placeholder="Search your memories, feelings, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/10 transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent text-white rounded-xl font-bold text-sm hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>

      {/* New Entry Modal/Area */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-card p-6 border-2 border-brand-accent/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm font-medium text-brand-secondary">Today, {new Date().toLocaleDateString()}</span>
              </div>
              <button onClick={() => setIsAdding(false)} className="text-brand-secondary hover:text-brand-primary">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <textarea 
              autoFocus
              placeholder="How are you feeling today? What's on your mind?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-32 bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-gray-300"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-lg text-brand-secondary"><Tag className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-gray-50 rounded-lg text-brand-secondary"><Smile className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-bold text-brand-secondary hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddEntry}
                  disabled={!newContent.trim() || isAnalyzing}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-accent text-white rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Save Entry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-6">
        {filteredEntries.map((entry, i) => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group glass-card p-6 hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-brand-accent"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  entry.sentiment === 'positive' ? "bg-brand-success/10 text-brand-success" : 
                  entry.sentiment === 'negative' ? "bg-brand-danger/10 text-brand-danger" : "bg-gray-50 text-brand-secondary"
                )}>
                  {entry.sentiment === 'positive' ? <Smile className="w-6 h-6" /> : 
                   entry.sentiment === 'negative' ? <Frown className="w-6 h-6" /> : <Meh className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-brand-primary">{entry.mood}</h4>
                  <p className="text-[11px] text-brand-secondary font-medium uppercase tracking-wider">{entry.date}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit?.(entry)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-brand-secondary"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-brand-danger/10 text-brand-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-brand-primary leading-relaxed mb-4">
              {entry.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-50 text-brand-secondary text-[10px] font-bold rounded-md border border-gray-100">
                  #{tag}
                </span>
              ))}
            </div>

            {entry.aiAnalysis && (
              <div className="bg-brand-accent/5 rounded-xl p-4 flex gap-3 border border-brand-accent/10">
                <BrainCircuit className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <p className="text-xs text-brand-accent font-medium italic leading-relaxed">
                  {entry.aiAnalysis}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
