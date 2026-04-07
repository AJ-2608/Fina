import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  ChevronRight,
  Plus,
  X,
  DollarSign,
  Tag
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { Transaction, FinancialMetric } from '@/src/types';

interface FinancialViewProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export function FinancialView({ transactions, setTransactions }: FinancialViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTx, setNewTx] = useState({
    title: '',
    amount: '',
    category: 'General',
    type: 'expense' as 'income' | 'expense'
  });

  const handleAddTransaction = () => {
    if (!newTx.title || !newTx.amount) return;
    
    const tx: Transaction = {
      id: Date.now().toString(),
      title: newTx.title,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: newTx.type
    };

    setTransactions([tx, ...transactions]);
    setIsAdding(false);
    setNewTx({ title: '', amount: '', category: 'General', type: 'expense' });
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const metrics: FinancialMetric[] = [
    { label: 'Total Balance', value: balance, trend: 0, icon: 'wallet' },
    { label: 'Monthly Income', value: totalIncome, trend: 0, icon: 'trending-up' },
    { label: 'Monthly Expenses', value: totalExpenses, trend: 0, icon: 'credit-card' },
  ];

  // Prepare chart data (last 7 days or similar)
  const chartData = transactions.slice(0, 10).reverse().map(t => ({
    name: t.date,
    value: t.amount
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-brand-primary">Financials</h2>
          <p className="text-brand-primary/40 font-medium">Track your wealth and spending habits.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" /> Add Transaction
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 bg-white/60"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center">
                {metric.icon === 'wallet' && <Wallet className="w-6 h-6 text-brand-primary/40" />}
                {metric.icon === 'trending-up' && <TrendingUp className="w-6 h-6 text-emerald-500" />}
                {metric.icon === 'credit-card' && <CreditCard className="w-6 h-6 text-rose-500" />}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest mb-1">{metric.label}</p>
              <h3 className="text-3xl font-serif font-bold text-brand-primary">
                ${metric.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Transactions */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-2 glass-card p-8 bg-white/60"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-brand-primary">Spending Flow</h3>
              <p className="text-xs text-brand-primary/40 font-medium">Visualization of your recent transactions.</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'None', value: 0 }]}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1A1A1A" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 bg-white/60 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-brand-primary">Activity</h3>
            <button className="text-[10px] font-bold text-brand-primary/40 hover:text-brand-primary transition-colors uppercase tracking-widest">
              View All
            </button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {transactions.length > 0 ? transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    tx.type === 'income' ? "bg-emerald-50 text-emerald-500" : "bg-brand-primary/5 text-brand-primary/40 group-hover:bg-brand-primary/10"
                  )}>
                    {tx.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">{tx.title}</p>
                    <p className="text-[10px] text-brand-primary/30 font-bold uppercase tracking-widest">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <p className={cn(
                  "text-sm font-bold",
                  tx.type === 'income' ? "text-emerald-500" : "text-brand-primary"
                )}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
              </div>
            )) : (
              <p className="text-center py-12 text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">No transactions yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Transaction Modal */}
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
              
              <h3 className="text-2xl font-serif font-bold text-brand-primary mb-8">New Transaction</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Title</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/20" />
                    <input 
                      type="text" 
                      value={newTx.title}
                      onChange={e => setNewTx({...newTx, title: e.target.value})}
                      placeholder="What was this for?"
                      className="w-full pl-12 pr-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/20" />
                      <input 
                        type="number" 
                        value={newTx.amount}
                        onChange={e => setNewTx({...newTx, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Type</label>
                    <select 
                      value={newTx.type}
                      onChange={e => setNewTx({...newTx, type: e.target.value as 'income' | 'expense'})}
                      className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium appearance-none"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 block">Category</label>
                  <input 
                    type="text" 
                    value={newTx.category}
                    onChange={e => setNewTx({...newTx, category: e.target.value})}
                    placeholder="e.g. Food, Rent, Work"
                    className="w-full px-6 py-4 bg-brand-primary/5 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary/10 text-brand-primary font-medium"
                  />
                </div>

                <button 
                  onClick={handleAddTransaction}
                  className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                  Record Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
