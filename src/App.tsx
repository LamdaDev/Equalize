import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  LayoutDashboard,
  History,
  MessageSquare,
  User,
  ShoppingCart,
  Zap,
  Home,
  MoreHorizontal,
  X,
  ArrowUpRight,
  Send,
  CheckCircle2,
  DollarSign,
  Receipt,
  Wallet,
} from "lucide-react";
import { cn } from "./lib/utils";
import { ROOMMATES, EXPENSES, PAYMENTS } from "./data/mockData";
import { Roommate, Expense, Category, Payment } from "./types";
import { Logo } from "./components/Logo";
import LogInAuth from "./components/LogInAuth";
import SignUpAuth from "./components/SignUpAuth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "history" | "messages" | "profile"
  >("dashboard");
  const [showConditionB, setShowConditionB] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [roommates] = useState<Roommate[]>(ROOMMATES);
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);

  // Dynamic calculations
  const roommatesWithStats = roommates.map((r) => {
    let contributionTotal = 0;
    let bilateralBalance = 0; // How much this roommate owes "You" (positive) or "You" owe them (negative)

    expenses.forEach((e) => {
      const share = e.amount / e.splitWith.length;
      
      // Calculate contribution total for this roommate
      if (e.paidBy === r.id) {
        contributionTotal += e.amount;
      }

      // Calculate bilateral balance with "You" (id: "1")
      if (r.id !== "1") {
        // If "You" paid, and this roommate is in the split
        if (e.paidBy === "1" && e.splitWith.includes(r.id)) {
          bilateralBalance += share;
        }
        // If this roommate paid, and "You" are in the split
        if (e.paidBy === r.id && e.splitWith.includes("1")) {
          bilateralBalance -= share;
        }
      }
    });

    payments.forEach((p) => {
      if (r.id !== "1") {
        // If "You" paid this roommate
        if (p.from === "1" && p.to === r.id) {
          bilateralBalance += p.amount;
        }
        // If this roommate paid "You"
        if (p.from === r.id && p.to === "1") {
          bilateralBalance -= p.amount;
        }
      }
    });

    return { ...r, contributionTotal, balance: bilateralBalance };
  });

  const totalOwedToYou = roommatesWithStats.reduce((acc, r) => r.id !== "1" && r.balance > 0 ? acc + r.balance : acc, 0);
  const totalYouOwe = roommatesWithStats.reduce((acc, r) => r.id !== "1" && r.balance < 0 ? acc + Math.abs(r.balance) : acc, 0);
  const totalSpentMonth = expenses.reduce((acc, e) => acc + e.amount, 0);

  const contributionData = roommatesWithStats.map((r) => ({
    name: r.name === "You" ? "You" : r.name,
    initials: r.initials,
    value: r.contributionTotal,
    percentage: totalSpentMonth > 0 
      ? Math.round((r.contributionTotal / totalSpentMonth) * 100)
      : 0,
  }));

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "Groceries":
        return <ShoppingCart className="w-4 h-4" />;
      case "Utilities":
        return <Zap className="w-4 h-4" />;
      case "Household":
        return <Home className="w-4 h-4" />;
      case "Rent":
        return <DollarSign className="w-4 h-4"/>;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  if (!isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        {authMode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <LogInAuth 
              onLogin={() => setIsLoggedIn(true)} 
              onSignUp={() => setAuthMode("signup")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <SignUpAuth 
              onSignUpSuccess={() => setAuthMode("login")}
              onBackToLogin={() => setAuthMode("login")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-indigo-500/30 pb-32">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <Logo className="w-8 h-8 rounded-lg" /> */}
          <span className="text-xl font-bold tracking-tight">Equalize</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowConditionB(!showConditionB)}
            className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors px-3 py-1 border border-white/10 rounded-full"
          >
            {showConditionB ? "Baseline Mode" : "Fairness Mode"}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
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
                    {totalOwedToYou >= totalYouOwe ? "You are owed" : "You owe"}
                  </p>
                  <p className={cn(
                    "text-4xl font-bold tracking-tight",
                    totalOwedToYou >= totalYouOwe ? "text-emerald-400" : "text-rose-400"
                  )}>
                    ${Math.abs(totalOwedToYou - totalYouOwe).toFixed(2)}
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
                                  "h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]",
                                  idx === 0
                                    ? "bg-indigo-500"
                                    : "bg-white/20 shadow-none",
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-indigo-500" />
                          </div>
                          <p className="text-sm text-white/50 leading-relaxed">
                            <span className="text-indigo-400 font-bold italic mr-1 tracking-tight">
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
                    className="text-[14px] font-bold uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    log payment
                  </button>
                </div>
                <div className="space-y-3">
                  {roommatesWithStats
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
                              {r.balance > 0 ? "owes you" : "you owe them"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span
                            className={cn(
                              "text-xl font-bold tracking-tight",
                              r.balance > 0
                                ? "text-emerald-400"
                                : "text-rose-400",
                            )}
                          >
                            {r.balance > 0 ? "+" : "-"}$
                            {Math.abs(r.balance).toFixed(2)}
                          </span>
                          <button className="w-[100px] flex items-center justify-center bg-white/5 hover:bg-white/10 text-[12px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all active:scale-95">
                            {r.balance > 0 ? "request" : "pay"}
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
                    className="text-[14px] font-bold uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-400 transition-colors"
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
                        <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-white/40 border border-white/5 group-hover:text-white transition-colors">
                          {getCategoryIcon(e.category)}
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">
                            {e.description}
                          </p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-white/30">
                            Paid by{" "}
                            {roommatesWithStats.find((r) => r.id === e.paidBy)?.name} •{" "}
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
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Send className="w-5 h-5 text-indigo-500" />
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

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  Your Profile
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  Manage your account and preferences
                </p>
              </header>

              <div className="space-y-4">
                <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/20">
                    CC
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Chris C.</h3>
                    <p className="text-white/40 font-medium tracking-wide">rjmauricio3@gmail.com</p>
                  </div>
                </div>

                <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] space-y-4">
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/20 mb-4">Account Settings</h3>
                  <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/5 font-bold">
                    Notification Preferences
                  </button>
                  <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/5 font-bold">
                    Payment Methods
                  </button>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full text-left p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-all border border-transparent hover:border-rose-500/10 font-bold text-rose-400"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="relative">
          {/* Animated Options */}
          <AnimatePresence>
            {isPlusMenuOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 flex flex-col items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  onClick={() => {
                    setShowExpenseModal(true);
                    setIsPlusMenuOpen(false);
                  }}
                  className="flex items-center gap-3 bg-[#1A1A1A] border border-white/10 px-6 py-4 rounded-2xl shadow-2xl hover:bg-white/5 transition-colors whitespace-nowrap"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-base font-bold tracking-tight">Add Expense</span>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: 0.05 }}
                  onClick={() => {
                    setShowPaymentModal(true);
                    setIsPlusMenuOpen(false);
                  }}
                  className="flex items-center gap-3 bg-[#1A1A1A] border border-white/10 px-6 py-4 rounded-2xl shadow-2xl hover:bg-white/5 transition-colors whitespace-nowrap"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-base font-bold tracking-tight">Log Payment</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-[#1A1A1A]/90 backdrop-blur-2xl border border-white/10 px-4 py-3 rounded-[3rem] flex items-center gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 relative",
                  activeTab === "dashboard"
                    ? "text-indigo-400"
                    : "text-white/30 hover:text-white",
                )}
              >
                <LayoutDashboard className="w-6 h-6" />
                {activeTab === "dashboard" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-full bg-indigo-500/10 blur-sm -z-10"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 relative",
                  activeTab === "history"
                    ? "text-indigo-400"
                    : "text-white/30 hover:text-white",
                )}
              >
                <History className="w-6 h-6" />
                {activeTab === "history" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-full bg-indigo-500/10 blur-sm -z-10"
                  />
                )}
              </button>
            </div>
            
            {/* Center Plus Button - Larger and Prominent */}
            <div className="px-4">
              <button
                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                className={cn(
                  "w-16 h-16 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95",
                  isPlusMenuOpen 
                    ? "bg-white text-indigo-500 rotate-45" 
                    : "bg-indigo-500 text-white"
                )}
              >
                <Plus className="w-8 h-8" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("messages")}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 relative",
                  activeTab === "messages"
                    ? "text-indigo-400"
                    : "text-white/30 hover:text-white",
                )}
              >
                <MessageSquare className="w-6 h-6" />
                {activeTab === "messages" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-full bg-indigo-500/10 blur-sm -z-10"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 relative",
                  activeTab === "profile"
                    ? "text-indigo-400"
                    : "text-white/30 hover:text-white",
                )}
              >
                <User className="w-6 h-6" />
                {activeTab === "profile" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-full bg-indigo-500/10 blur-sm -z-10"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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
                    const formData = new FormData(e.currentTarget);
                    const description = formData.get("description") as string;
                    const amount = parseFloat(formData.get("amount") as string);
                    const category = formData.get("category") as Category;
                    
                    if (!description || isNaN(amount)) return;

                    const newExpense: Expense = {
                      id: `e${Date.now()}`,
                      description,
                      amount,
                      category,
                      paidBy: "1", // Default to "You" for demo
                      date: new Date().toISOString(),
                      splitWith: roommates.map(r => r.id), // Split with everyone by default
                    };

                    setExpenses([newExpense, ...expenses]);
                    setShowExpenseModal(false);
                  }}
                >
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                      Description*
                    </label>
                    <input
                      name="description"
                      type="text"
                      required
                      placeholder="e.g. Grocery run"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all text-lg font-medium placeholder:text-white/10"
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
                          name="amount"
                          type="number"
                          step="0.01"
                          required
                          placeholder="0.00"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all text-lg font-medium placeholder:text-white/10"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        Category
                      </label>
                      <select name="category" className="w-full bg-[#111] text-white border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-[#1A1A1A] transition-all text-lg font-medium appearance-none">
                        <option value="Groceries">Groceries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Household">Household</option>
                        <option value="Rent">Rent</option>
                        <option value="Other">Other</option>
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
                            className="w-6 h-6 rounded-lg border-white/10 bg-transparent text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
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
                      className="flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest bg-indigo-500 text-white hover:bg-indigo-400 transition-all shadow-[0_10px_20px_rgba(99,102,241,0.2)]"
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
                    const formData = new FormData(e.currentTarget);
                    const fromName = formData.get("from") as string;
                    const toName = formData.get("to") as string;
                    const amount = parseFloat(formData.get("amount") as string);
                    const note = formData.get("note") as string;

                    const fromId = roommates.find(r => r.name === fromName)?.id;
                    const toId = roommates.find(r => r.name === toName)?.id;

                    if (!fromId || !toId || isNaN(amount) || fromId === toId) return;

                    const newPayment: Payment = {
                      id: `p${Date.now()}`,
                      from: fromId,
                      to: toId,
                      amount,
                      date: new Date().toISOString(),
                      note,
                    };

                    setPayments([newPayment, ...payments]);
                    setShowPaymentModal(false);
                  }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        From*
                      </label>
                      <select name="from" className="w-full bg-[#111] text-white border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-[#1A1A1A] transition-all text-lg font-medium appearance-none">
                        {roommates.map((r) => (
                          <option key={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                        To*
                      </label>
                      <select name="to" className="w-full bg-[#111] text-white border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-[#1A1A1A] transition-all text-lg font-medium appearance-none">
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
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all text-lg font-medium placeholder:text-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                      Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      placeholder="Add a note..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all text-lg font-medium h-32 resize-none placeholder:text-white/10"
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
                      className="flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest bg-indigo-500 text-white hover:bg-indigo-400 transition-all shadow-[0_10px_20px_rgba(99,102,241,0.2)]"
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
