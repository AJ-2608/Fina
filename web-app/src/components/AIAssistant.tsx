import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, X, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';
import { ChatMessage } from '@/src/types';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello, world ito to enlend ai productivity assistant exact communimationd planes and informations." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are Fina, an AI-powered diary assistant and life coach. Your primary goal is to help users understand their feelings, organize their thoughts, and find balance in their lives. You are empathetic, insightful, and professional. You can also help with financial organization and budgeting as part of a holistic approach to life management. When users share diary entries or feelings, provide thoughtful reflections and actionable advice to help them grow.",
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text || "I'm sorry, I couldn't generate a response.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 text-white rounded-full shadow-2xl flex items-center justify-center z-50 cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity" />
        <Sparkles className="w-10 h-10 drop-shadow-lg" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-36 right-10 w-[420px] h-[650px] bg-white/90 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2.5rem] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-bold text-lg text-brand-primary">Fina Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-brand-primary" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-blue-50/20">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <p className="text-[10px] font-bold text-brand-secondary mb-1 px-2 uppercase tracking-widest">
                    {msg.role === 'user' ? 'You' : 'Fina Assistant'}
                  </p>
                  <div className={cn(
                    "p-5 rounded-[2rem] text-sm shadow-xl leading-relaxed relative group transition-all",
                    msg.role === 'user' 
                      ? "bg-brand-primary text-white rounded-tr-none" 
                      : "bg-white text-brand-primary rounded-tl-none border border-brand-primary/5"
                  )}>
                    {msg.text}
                    <div className={cn(
                      "absolute top-0 w-4 h-4",
                      msg.role === 'user' 
                        ? "-right-2 bg-brand-primary clip-path-bubble-right" 
                        : "-left-2 bg-white clip-path-bubble-left"
                    )} />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex flex-col mr-auto max-w-[85%] items-start">
                  <p className="text-[10px] font-bold text-brand-secondary mb-1 px-2 uppercase tracking-widest">Fina Assistant</p>
                  <div className="p-4 rounded-[1.5rem] bg-white border border-blue-100 rounded-tl-none shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-accent" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white/50 backdrop-blur-md">
              <div className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 pl-6 pr-14 py-4 bg-white border border-blue-100 rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-inner"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-3 bg-blue-100 text-brand-primary rounded-full disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
