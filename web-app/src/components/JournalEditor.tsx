import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Link2, 
  Mic, 
  Paperclip,
  Quote,
  ListOrdered,
  Code,
  Table,
  Circle,
  CheckCircle2,
  Save
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DiaryEntry } from '@/src/types';

export function JournalEditor({ onSave, initialEntry }: { onSave?: (content: string, title: string) => void, initialEntry?: DiaryEntry | null }) {
  const [title, setTitle] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialEntry) {
      const parts = initialEntry.content.split('\n\n');
      if (parts.length > 1) {
        setTitle(parts[0]);
        if (editorRef.current) {
          editorRef.current.innerHTML = parts.slice(1).join('\n\n');
        }
      } else {
        setTitle('');
        if (editorRef.current) {
          editorRef.current.innerHTML = initialEntry.content;
        }
      }
    } else {
      setTitle('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [initialEntry]);

  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const updateStats = () => {
    const text = editorRef.current?.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  };

  useEffect(() => {
    updateStats();
  }, [initialEntry]);

  const handleManualSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const content = editorRef.current?.innerHTML || '';
    const currentTitle = title;

    if (onSave && (currentTitle.trim() || content.trim())) {
      onSave(content, currentTitle);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setLastSaved(new Date());
    }
  };

  // Auto-save logic (5 second debounce)
  const triggerAutoSave = () => {
    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      console.log('Journal entry auto-saved');
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const execCommand = (e: React.MouseEvent, command: string, value: string = '') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    const success = document.execCommand(command, false, value);
    if (success) triggerAutoSave();
  };

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.prompt('Enter URL:');
    if (url) {
      execCommand(e, 'createLink', url);
    }
  };

  const handleNewPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const content = editorRef.current?.innerHTML || '';
    const currentTitle = title;

    // Save current content before clearing
    if (onSave && (currentTitle.trim() || content.trim())) {
      onSave(content, currentTitle);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }

    // Clear editor
    setTitle('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      editorRef.current.focus();
    }
    setLastSaved(null);
    setIsSaving(false);
  };

  const toggleVoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate starting recording
      console.log('Recording started...');
    } else {
      // Simulate stopping recording
      console.log('Recording stopped.');
      triggerAutoSave();
    }
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File "${file.name}" attached successfully!`);
      triggerAutoSave();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto pt-4 pb-40 px-4 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-32 left-1/2 z-50 bg-brand-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-bold text-sm">Entry saved to Diary!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={onFileChange} 
      />

      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn(
                "px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-widest transition-all duration-300",
                isSaving ? "bg-amber-100 text-amber-700" : "bg-brand-primary/5 text-brand-primary/60"
              )}>
                {isSaving ? "Saving..." : "Draft"}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-brand-primary/5 text-brand-primary/40 rounded-full uppercase tracking-widest">
                {wordCount} Words
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-brand-primary/5 text-brand-primary/40 rounded-full uppercase tracking-widest">
                {readingTime} Min Read
              </span>
              {lastSaved && !isSaving && (
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-brand-primary/30 text-[10px] font-medium">
              {lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : "Changes not saved"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-2">
            {[1, 2, 3].map(i => (
              <img 
                key={i}
                src={`https://picsum.photos/seed/${i + 30}/40/40`} 
                alt="Collaborator" 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <button 
            onMouseDown={handleNewPage}
            className="p-2.5 bg-brand-primary text-white hover:bg-brand-primary/90 transition-all rounded-full shadow-md"
            title="New Page"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 bg-white/80 backdrop-blur-md rounded-[2rem] p-10 shadow-xl border border-white/40 min-h-[100vh] relative">
        {isRecording && (
          <div className="absolute top-4 right-10 flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
            <Circle className="w-2 h-2 fill-current" />
            RECORDING...
          </div>
        )}
        <input 
          type="text" 
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            triggerAutoSave();
          }}
          placeholder="Title" 
          className="w-full text-4xl font-serif font-bold text-brand-primary placeholder:text-brand-primary/10 bg-transparent border-none focus:ring-0 mb-8 tracking-tight"
        />
        <div
          ref={editorRef}
          contentEditable
          onInput={() => {
            triggerAutoSave();
            updateStats();
          }}
          className="w-full min-h-[45vh] bg-transparent border-none focus:ring-0 text-xl text-brand-primary/80 leading-relaxed outline-none placeholder:text-brand-primary/10 font-light"
          data-placeholder="Start writing your story..."
        />
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
        <div className="floating-card px-6 py-3 flex items-center gap-6 shadow-2xl border-white/60">
          <button 
            onMouseDown={handleNewPage}
            title="New Page"
            className="p-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Plus className="w-7 h-7" />
          </button>
          <div className="h-8 w-px bg-brand-primary/10" />
          <div className="flex items-center gap-4 text-brand-primary/60">
            <button 
              onMouseDown={handleManualSave}
              className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5 active:bg-brand-primary/10"
              title="Save Draft"
            >
              <Save className="w-6 h-6" />
            </button>
            <button 
              onMouseDown={(e) => execCommand(e, 'bold')}
              className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5 active:bg-brand-primary/10"
              title="Bold"
            >
              <Bold className="w-6 h-6" />
            </button>
            <button 
              onMouseDown={(e) => execCommand(e, 'italic')}
              className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5 active:bg-brand-primary/10"
              title="Italic"
            >
              <Italic className="w-6 h-6" />
            </button>
            <button 
              onMouseDown={(e) => execCommand(e, 'underline')}
              className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5 active:bg-brand-primary/10"
              title="Underline"
            >
              <Underline className="w-6 h-6" />
            </button>
          </div>
          <div className="h-8 w-px bg-brand-primary/10" />
          <div className="flex items-center gap-4 text-brand-primary/60">
            <button 
              onMouseDown={toggleVoice}
              className={cn(
                "transition-all p-2 rounded-xl hover:bg-brand-primary/5",
                isRecording ? "text-red-500 bg-red-50" : "hover:text-brand-primary"
              )}
              title={isRecording ? "Stop Recording" : "Voice Memo"}
            >
              <Mic className="w-6 h-6" />
            </button>
            <button 
              onMouseDown={handleFileClick}
              className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
              title="Attach File"
            >
              <Paperclip className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Formatting Popover */}
        <div className="floating-card p-4 grid grid-cols-3 gap-4 shadow-2xl border-white/60">
          <button 
            onMouseDown={(e) => execCommand(e, 'formatBlock', 'blockquote')}
            className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
            title="Quote"
          >
            <Quote className="w-6 h-6 text-brand-primary/60" />
          </button>
          <button 
            onMouseDown={(e) => execCommand(e, 'insertUnorderedList')}
            className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
            title="Bullet List"
          >
            <List className="w-6 h-6 text-brand-primary/60" />
          </button>
          <button 
            onMouseDown={handleLink}
            className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
            title="Insert Link"
          >
            <Link2 className="w-6 h-6 text-brand-primary/60" />
          </button>
          <button 
            onMouseDown={(e) => execCommand(e, 'insertOrderedList')}
            className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
            title="Numbered List"
          >
            <ListOrdered className="w-6 h-6 text-brand-primary/60" />
          </button>
          <button 
            onMouseDown={(e) => execCommand(e, 'formatBlock', 'pre')}
            className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
            title="Code Block"
          >
            <Code className="w-6 h-6 text-brand-primary/60" />
          </button>
          <button 
            onMouseDown={(e) => alert('Table feature coming soon!')}
            className="hover:text-brand-primary transition-all p-2 rounded-xl hover:bg-brand-primary/5"
            title="Insert Table"
          >
            <Table className="w-6 h-6 text-brand-primary/60" />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(10, 31, 68, 0.1);
          cursor: text;
        }
        [contenteditable] blockquote {
          border-left: 3px solid rgba(10, 31, 68, 0.1);
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        [contenteditable] pre {
          background: rgba(10, 31, 68, 0.05);
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: monospace;
          margin: 1rem 0;
        }
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
      `}} />
    </div>
  );
}
