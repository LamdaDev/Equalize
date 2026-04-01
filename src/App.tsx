import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  LayoutDashboard,
  History,
  MessageSquare,
  ShoppingCart,
  Zap,
  Home,
  MoreHorizontal,
  X,
  ArrowUpRight,
  Send,
  CheckCircle2,
} from "lucide-react";
import { cn } from "./lib/utils";
import { ROOMMATES, EXPENSES } from "./data/mockData";
import { Roommate, Expense, Category } from "./types";
import { Logo } from "./components/Logo";
import LogInAuth from "./components/LogInAuth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "history" | "messages"
  >("dashboard");
  const [showConditionB, setShowConditionB] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [roommates] = useState<Roommate[]>(ROOMMATES);
  const [expenses] = useState<Expense[]>(EXPENSES);

  const totalOwed = roommates.reduce(
    (acc, r) => (r.id !== "1" && r.balance > 0 ? acc + r.balance : acc),
    0,
  );
  const totalSpentMonth = expenses.reduce((acc, e) => acc + e.amount, 0);

  const contributionData = roommates.map((r) => ({
    name: r.name === "You" ? "You" : r.name,
    initials: r.initials,
    value: r.contributionTotal,
    percentage: Math.round(
      (r.contributionTotal /
        roommates.reduce((acc, curr) => acc + curr.contributionTotal, 0)) *
        100,
    ),
  }));

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "Groceries":
        return <ShoppingCart className="w-4 h-4" />;
      case "Utilities":
        return <Zap className="w-4 h-4" />;
      case "Household":
        return <Home className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  if (!isLoggedIn) {
    return <LogInAuth onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500/30 pb-32">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 rounded-lg" />
          <span className="text-xl font-bold tracking-tight">Equalize</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowConditionB(!showConditionB)}
            className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors px-3 py-1 border border-white/10 rounded-full"
          >
            {showConditionB ? "Baseline Mode" : "Fairness Mode"}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-black">
            CC
          </div>
        </div>
      </nav>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  Household Dashboard
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  April 2026 • Shared apartment
                </p>
              </header>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-[#151515] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowUpRight className="w-12 h-12" />
                  </div>
                  <p className="text-white/40 text-[12px] font-bold uppercase tracking-[0.15em] mb-2">
                    You are owed
                  </p>
                  <p className="text-4xl font-bold text-emerald-400 tracking-tight">
                    ${totalOwed.toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#151515] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                  <p className="text-white/40 text-[12px] font-bold uppercase tracking-[0.15em] mb-2">
                    Total this month
                  </p>
                  <p className="text-4xl font-bold text-white tracking-tight">
                    ${totalSpentMonth.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Condition B: Contribution Visualization */}
              <AnimatePresence mode="wait">
                {showConditionB && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-12"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40">
                        Contribution Breakdown - April
                      </h2>
                    </div>
                    <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem]">
                      <div className="space-y-8">
                        {contributionData.map((data, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/60 border border-white/5">
                                  {data.initials}
                                </div>
                                <div>
                                  <span className="block font-bold text-white/90">
                                    {data.name}
                                  </span>
                                  <span className="text-[12px] text-white/40 font-medium tracking-wide">
                                    ${data.value.toFixed(2)} contributed
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-white/60">
                                {data.percentage}%
                              </span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden p-[2px]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.percentage}%` }}
                                transition={{
                                  duration: 1.2,
                                  ease: [0.22, 1, 0.36, 1],
                                  delay: idx * 0.1,
                                }}
                                className={cn(
                                  "h-full rounded-full shadow-[0_0_15px_rgba(249,115,22,0.3)]",
                                  idx === 0
                                    ? "bg-orange-500"
                                    : "bg-white/20 shadow-none",
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-orange-500" />
                          </div>
                          <p className="text-sm text-white/50 leading-relaxed">
                            <span className="text-orange-400 font-bold italic mr-1 tracking-tight">
                              Fairness Insight:
                            </span>
                            You've contributed{" "}
                            <span className="text-white font-bold">53%</span> of
                            costs this month. Sofia is currently{" "}
                            <span className="text-white font-bold">27%</span>{" "}
                            below the average contribution. Consider a
                            settlement to rebalance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Roommate Balances */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Roommate Balances
                  </h2>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="text-[12px] font-bold uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    log payment
                  </button>
                </div>
                <div className="space-y-3">
                  {roommates
                    .filter((r) => r.id !== "1")
                    .map((r) => (
                      <div
                        key={r.id}
                        className="bg-[#151515] border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all hover:translate-x-1"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-white/60 border border-white/5">
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-bold text-lg tracking-tight">
                              {r.name}
                            </p>
                            <p className="text-[12px] font-bold uppercase tracking-widest text-white/30">
                              {r.balance >= 0 ? "owes you" : "you owe"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span
                            className={cn(
                              "text-xl font-bold tracking-tight",
                              r.balance >= 0
                                ? "text-emerald-400"
                                : "text-rose-400",
                            )}
                          >
                            {r.balance >= 0 ? "+" : "-"}$
                            {Math.abs(r.balance).toFixed(2)}
                          </span>
                          <button className="w-[100px] flex items-center justify-center bg-white/5 hover:bg-white/10 text-[12px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all active:scale-95">
                            {r.balance >= 0 ? "request" : "pay"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* Recent Expenses */}
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Recent Expenses
                  </h2>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="text-[12px] font-bold uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    add expense
                  </button>
                </div>
                <div className="space-y-3">
                  {expenses.map((e) => (
                    <div
                      key={e.id}
                      className="bg-[#151515] border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5 group-hover:text-white transition-colors">
                          {getCategoryIcon(e.category)}
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">
                            {e.description}
                          </p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-white/30">
                            Paid by{" "}
                            {roommates.find((r) => r.id === e.paidBy)?.name} •{" "}
                            {new Date(e.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg tracking-tight">
                          ${e.amount.toFixed(2)}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                          split {e.splitWith.length} ways
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  Expense History
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  All shared costs and settlements
                </p>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 px-1">
                    This Week
                  </h3>
                  {expenses.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className="bg-[#151515] border border-white/5 p-5 rounded-3xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                          {getCategoryIcon(e.category)}
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">
                            {e.description}
                          </p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-white/30">
                            {new Date(e.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-lg tracking-tight">
                        ${e.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 px-1">
                    Last Week
                  </h3>
                  {expenses.slice(2).map((e) => (
                    <div
                      key={e.id}
                      className="bg-[#151515] border border-white/5 p-5 rounded-3xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                          {getCategoryIcon(e.category)}
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">
                            {e.description}
                          </p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-white/30">
                            {new Date(e.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-lg tracking-tight">
                        ${e.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  Low-Friction Requests
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  Send friendly, templated reminders
                </p>
              </header>

              <div className="space-y-4">
                <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem]">
                  <h3 className="text-lg font-bold mb-6 tracking-tight">
                    Quick Templates
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Hey! Just a friendly reminder for the groceries split. No rush! 😊",
                      "Settling up the utilities for this month. Whenever you have a sec! ⚡️",
                      "Shared household supplies update. Thanks for keeping the place stocked! 🏠",
                      "Anonymous: Hey, we're a bit unbalanced on expenses lately. Let's settle up soon! 🤝",
                    ].map((template, i) => (
                      <button
                        key={i}
                        className="text-left p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/5 group"
                      >
                        <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {template}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem]">
                  <h3 className="text-lg font-bold mb-6 tracking-tight">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Sofia C. settled up</p>
                        <p className="text-xs text-white/40 mt-1">
                          "Thanks for the groceries!" • 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <Send className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          You sent a reminder to Lauren S.
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          "Settling up utilities..." • Yesterday
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#1A1A1A]/90 backdrop-blur-2xl border border-white/10 px-3 py-3 rounded-[2.5rem] flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "p-4 rounded-full transition-all duration-500 relative",
              activeTab === "dashboard"
                ? "bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                : "text-white/30 hover:text-white",
            )}
          >
            <LayoutDashboard className="w-6 h-6" />
            {activeTab === "dashboard" && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-20 -z-10"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "p-4 rounded-full transition-all duration-500 relative",
              activeTab === "history"
                ? "bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                : "text-white/30 hover:text-white",
            )}
          >
            <History className="w-6 h-6" />
            {activeTab === "history" && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-20 -z-10"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "p-4 rounded-full transition-all duration-500 relative",
              activeTab === "messages"
                ? "bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                : "text-white/30 hover:text-white",
            )}
          >
            <MessageSquare className="w-6 h-6" />
            {activeTab === "messages" && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-20 -z-10"
              />
            )}
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowExpenseModal(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-orange-500 rounded-[2rem] flex items-center justify-center shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Plus className="w-9 h-9 text-black group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Expense Modal */}
      <AnimatePresence>
        {showExpenseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExpenseModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Add an expense
                    </h2>
                    <p className="text-white/30 text-sm font-medium mt-1">
                      Log a shared cost to be split
                    </p>
                  </div>
                  <button
                    onClick={() => setShowExpenseModal(false)}
                    className="p-3 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white/20" />
                  </button>
                </div>

                <form
                  className="space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowExpenseModal(false);
                  }}
                >
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                      Description*
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grocery run"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium placeholder:text-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        Amount*
                      </label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 text-lg">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium placeholder:text-white/10"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        Category
                      </label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium appearance-none">
                        <option>Groceries</option>
                        <option>Utilities</option>
                        <option>Household</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                      Split with
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {roommates.map((r) => (
                        <label
                          key={r.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-bold text-white/40">
                              {r.initials}
                            </div>
                            <span className="text-sm font-bold">{r.name}</span>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-6 h-6 rounded-lg border-white/10 bg-transparent text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowExpenseModal(false)}
                      className="flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest bg-orange-500 text-black hover:bg-orange-400 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
                    >
                      Add expense
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Log payment
                    </h2>
                    <p className="text-white/30 text-sm font-medium mt-1">
                      Record a settlement between roommates
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-3 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white/20" />
                  </button>
                </div>

                <form
                  className="space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowPaymentModal(false);
                  }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        From*
                      </label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium appearance-none">
                        {roommates.map((r) => (
                          <option key={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        To*
                      </label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium appearance-none">
                        {roommates.map((r) => (
                          <option key={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                      Amount*
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium placeholder:text-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                      Note (Optional)
                    </label>
                    <textarea
                      placeholder="Add a note..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-lg font-medium h-32 resize-none placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest bg-orange-500 text-black hover:bg-orange-400 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
