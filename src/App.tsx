import { useState, useEffect, useLayoutEffect } from "react";
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
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "./lib/utils";
import { ROOMMATES, EXPENSES, PAYMENTS } from "./data/mockData";
import { Roommate, Expense, Category, Payment } from "./types";
import { Logo } from "./components/Logo";
import LogInAuth from "./components/LogInAuth";
import SignUpAuth from "./components/SignUpAuth";
import LandingPage from "./components/LandingPage";
import FeaturesPage from "./components/FeaturesPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("equalize_isLoggedIn");
    return saved ? JSON.parse(saved) : false;
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string }>(() => {
    const saved = localStorage.getItem("equalize_currentUser");
    return saved ? JSON.parse(saved) : {
      name: "Chris C.",
      email: "rjmauricio3@gmail.com",
    };
  });
  const [publicPage, setPublicPage] = useState<"landing" | "features" | "about" | "contact" | "login" | "signup">("landing");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "history" | "messages" | "profile"
  >("dashboard");
  const [showConditionB, setShowConditionB] = useState<boolean>(() => {
    const saved = localStorage.getItem("equalize_showConditionB");
    return saved ? JSON.parse(saved) : true;
  });
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem("equalize_isDarkTheme");
    return saved ? JSON.parse(saved) : true;
  });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [roommates, setRoommates] = useState<Roommate[]>(() => {
    const saved = localStorage.getItem("equalize_roommates");
    return saved ? JSON.parse(saved) : ROOMMATES;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("equalize_expenses");
    return saved ? JSON.parse(saved) : EXPENSES;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem("equalize_payments");
    return saved ? JSON.parse(saved) : PAYMENTS;
  });
  const [selectedSplitWith, setSelectedSplitWith] = useState<string[]>(ROOMMATES.map(r => r.id));
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRoommateForRequest, setSelectedRoommateForRequest] = useState<Roommate | null>(null);
  const [customRequestMessage, setCustomRequestMessage] = useState("");
  const [paymentFrom, setPaymentFrom] = useState("1");
  const [paymentTo, setPaymentTo] = useState("2");
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);
  const [recentActivities, setRecentActivities] = useState<{
    id: string;
    type: "request" | "settlement";
    from: string;
    to: string;
    message: string;
    date: string;
  }[]>(() => {
    const saved = localStorage.getItem("equalize_recentActivities");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        type: "settlement",
        from: "2",
        to: "1",
        message: "Thanks for the groceries!",
        date: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "2",
        type: "request",
        from: "1",
        to: "3",
        message: "Settling up utilities...",
        date: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem("equalize_isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("equalize_currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("equalize_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("equalize_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("equalize_recentActivities", JSON.stringify(recentActivities));
  }, [recentActivities]);

  useEffect(() => {
    localStorage.setItem("equalize_showConditionB", JSON.stringify(showConditionB));
  }, [showConditionB]);

  useEffect(() => {
    localStorage.setItem("equalize_isDarkTheme", JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  useLayoutEffect(() => {
    const pageBackground = isDarkTheme ? "#0A0A0A" : "#ffffff";

    document.documentElement.style.backgroundColor = pageBackground;
    document.body.style.backgroundColor = pageBackground;
  }, [isDarkTheme]);

  useEffect(() => {
    localStorage.setItem("equalize_roommates", JSON.stringify(roommates));
  }, [roommates]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPublicPage("landing");
    setActiveTab("dashboard");
    setIsPlusMenuOpen(false);
  };

  // Dynamic calculations
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
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
  const averageContribution = totalSpentMonth / roommates.length;

  const contributionData = roommatesWithStats.map((r) => ({
    name: r.name === "You" ? "You" : r.name,
    initials: r.initials,
    value: r.contributionTotal,
    percentage: totalSpentMonth > 0 
      ? Math.round((r.contributionTotal / totalSpentMonth) * 100)
      : 0,
    diffFromAvg: r.contributionTotal - averageContribution,
    percentDiff: averageContribution > 0 
      ? Math.round(((r.contributionTotal - averageContribution) / averageContribution) * 100)
      : 0,
  }));

  const getFairnessInsight = () => {
    if (totalSpentMonth === 0) return "No expenses logged yet this month.";

    const you = contributionData.find(d => d.name === "You");
    
    // Find who is most behind and most ahead
    const mostBehind = [...contributionData].sort((a, b) => a.percentDiff - b.percentDiff)[0];
    const mostAhead = [...contributionData].sort((a, b) => b.percentDiff - a.percentDiff)[0];

    if (you && you.percentDiff > 10) {
      return (
        <>
          You've contributed <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{you.percentage}%</span> of costs this month. 
          {mostBehind.name !== "You" ? (
            <> {mostBehind.name} is currently <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{Math.abs(mostBehind.percentDiff)}%</span> below the average contribution. Consider a settlement to rebalance.</>
          ) : (
            <> You are well ahead of the average!</>
          )}
        </>
      );
    }

    if (you && you.percentDiff < -10) {
      return (
        <>
          You're currently <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{Math.abs(you.percentDiff)}%</span> below the average contribution. 
          {mostAhead.name !== "You" ? (
            <> {mostAhead.name} has covered <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{mostAhead.percentage}%</span> of costs. A quick payment would help even things out.</>
          ) : (
            <> Time to pitch in for the next few household runs!</>
          )}
        </>
      );
    }

    // If "You" are balanced, check if others are not
    if (mostBehind.percentDiff < -15) {
      return (
        <>
          Your contributions are balanced, but <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{mostBehind.name}</span> is currently <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{Math.abs(mostBehind.percentDiff)}%</span> behind the average. A friendly reminder might help.
        </>
      );
    }

    if (mostAhead.percentDiff > 15) {
      return (
        <>
          Everything looks fair for you, but <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{mostAhead.name}</span> has contributed <span className={cn("font-bold", isDarkTheme ? "text-white" : "text-black")}>{mostAhead.percentage}%</span> of costs. They've been doing the heavy lifting lately!
        </>
      );
    }

    return "Contributions are looking balanced this month! Everyone is within a fair range of the average.";
  };

  const addNotification = (message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleSendRequest = (roommate: Roommate, template: string) => {
    const newActivity = {
      id: Date.now().toString(),
      type: "request" as const,
      from: "1",
      to: roommate.id,
      message: template,
      date: new Date().toISOString(),
    };
    setRecentActivities([newActivity, ...recentActivities]);
    addNotification(`Request sent to ${roommate.name}`);
    setShowRequestModal(false);
  };

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
        {publicPage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <LandingPage 
              onLogin={() => setPublicPage("login")}
              onSignUp={() => setPublicPage("signup")}
              onNavigate={(page) => setPublicPage(page as any)}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
            />
          </motion.div>
        )}
        {publicPage === "features" && (
          <motion.div
            key="features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <FeaturesPage 
              onBack={() => setPublicPage("landing")}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onNavigate={(page) => setPublicPage(page as any)}
              onLogin={() => setPublicPage("login")}
              onSignUp={() => setPublicPage("signup")}
            />
          </motion.div>
        )}
        {publicPage === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <AboutPage 
              onBack={() => setPublicPage("landing")}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onNavigate={(page) => setPublicPage(page as any)}
              onLogin={() => setPublicPage("login")}
              onSignUp={() => setPublicPage("signup")}
            />
          </motion.div>
        )}
        {publicPage === "contact" && (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <ContactPage 
              onBack={() => setPublicPage("landing")}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onNavigate={(page) => setPublicPage(page as any)}
              onLogin={() => setPublicPage("login")}
              onSignUp={() => setPublicPage("signup")}
            />
          </motion.div>
        )}
        {publicPage === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <LogInAuth 
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onBack={() => setPublicPage("landing")}
              onLogin={(email) => {
                setIsLoggedIn(true);
                setCurrentUser({
                  name: "Test User",
                  email: email || "test@email.com",
                });
              }} 
              onSignUp={() => setPublicPage("signup")}
            />
          </motion.div>
        )}
        {publicPage === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <SignUpAuth 
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onBack={() => setPublicPage("landing")}
              onSignUpSuccess={(name, email) => {
                setIsLoggedIn(true);
                setCurrentUser({ name, email });
              }}
              onBackToLogin={() => setPublicPage("login")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-indigo-500/30 pb-32 transition-colors duration-300",
      isDarkTheme ? "bg-[#0A0A0A] text-white" : "bg-white text-black"
    )}>
      {/* Top Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between transition-colors duration-300",
        isDarkTheme ? "bg-[#0A0A0A]/80 border-white/5" : "bg-white/80 border-black/5"
      )}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">Equalize</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={cn(
              "p-2 rounded-xl transition-all border",
              isDarkTheme 
                ? "bg-white/5 border-white/10 text-white/40 hover:text-white"
                : "bg-black/5 border-black/10 text-black/70 hover:text-black"
            )}
            title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowConditionB(!showConditionB)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all border flex items-center gap-2",
              showConditionB 
                ? (isDarkTheme 
                    ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                    : "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm")
                : (isDarkTheme 
                    ? "bg-white/5 border-white/10 text-white/40 hover:text-white" 
                    : "bg-black/5 border-black/10 text-black/60 hover:text-black")
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full transition-all",
              showConditionB 
                ? (isDarkTheme ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-indigo-600") 
                : (isDarkTheme ? "bg-white/20" : "bg-black/20")
            )} />
            {showConditionB ? "Fairness Mode" : "Baseline Mode"}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className={cn(
              "p-2 transition-all rounded-xl border group relative",
              isDarkTheme 
                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/10 bg-rose-500/5" 
                : "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 bg-rose-50/50"
            )}
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              LOGOUT
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-indigo-500/20">
            {currentUser.name === "Test User" 
              ? currentUser.email[0].toUpperCase() 
              : currentUser.name.split(" ")[0][0].toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Notifications */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 items-center pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
              <div className="relative w-5 h-5">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray="50.26"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 50.26 }}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isDarkTheme ? "text-white/40" : "text-black/70"
                )}>
                  April 2026 • Shared apartment
                </p>
              </header>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className={cn(
                  "border p-6 rounded-3xl relative overflow-hidden group transition-colors",
                  isDarkTheme ? "bg-[#151515] border-white/5" : "bg-gray-50 border-black/5"
                )}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowUpRight className="w-12 h-12" />
                  </div>
                  <p className={cn(
                    "text-[12px] font-bold uppercase tracking-[0.15em] mb-2 transition-colors",
                    isDarkTheme ? "text-white/40" : "text-black/70"
                  )}>
                    {totalOwedToYou >= totalYouOwe ? "You are owed" : "You owe"}
                  </p>
                  <p className={cn(
                    "text-4xl font-bold tracking-tight",
                    totalOwedToYou >= totalYouOwe ? "text-emerald-400" : "text-rose-400"
                  )}>
                    ${Math.abs(totalOwedToYou - totalYouOwe).toFixed(2)}
                  </p>
                </div>
                <div className={cn(
                  "border p-6 rounded-3xl relative overflow-hidden group transition-colors",
                  isDarkTheme ? "bg-[#151515] border-white/5" : "bg-gray-50 border-black/5"
                )}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                  <p className={cn(
                    "text-[12px] font-bold uppercase tracking-[0.15em] mb-2 transition-colors",
                    isDarkTheme ? "text-white/40" : "text-black/70"
                  )}>
                    Total this month
                  </p>
                  <p className={cn(
                    "text-4xl font-bold tracking-tight transition-colors",
                    isDarkTheme ? "text-white" : "text-black"
                  )}>
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
                      <h2 className={cn(
                        "text-[12px] font-bold uppercase tracking-[0.2em] transition-colors",
                        isDarkTheme ? "text-white/40" : "text-black/70"
                      )}>
                        Contribution Breakdown - April
                      </h2>
                    </div>
                    <div className={cn(
                      "border p-8 rounded-[2rem] transition-colors",
                      isDarkTheme ? "bg-[#151515] border-white/5" : "bg-gray-50 border-black/5"
                    )}>
                      <div className="space-y-8">
                        {contributionData.map((data, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-colors",
                                  isDarkTheme ? "bg-white/5 text-white/60 border-white/5" : "bg-black/5 text-black/60 border-black/5"
                                )}>
                                  {data.initials? data.initials:currentUser.email[0].toUpperCase() }
                                  
                                </div>
                                <div>
                                  <span className={cn(
                                    "block font-bold transition-colors",
                                    isDarkTheme ? "text-white/90" : "text-black/90"
                                  )}>
                                    {data.name}
                                  </span>
                                  <span className={cn(
                                    "text-[12px] font-medium tracking-wide transition-colors",
                                    isDarkTheme ? "text-white/40" : "text-black/70"
                                  )}>
                                    ${data.value.toFixed(2)} contributed
                                  </span>
                                </div>
                              </div>
                              <span className={cn(
                                "text-sm font-bold transition-colors",
                                isDarkTheme ? "text-white/60" : "text-black/80"
                              )}>
                                {data.percentage}%
                              </span>
                            </div>
                            <div className={cn(
                              "h-3 rounded-full overflow-hidden p-[2px] transition-colors",
                              isDarkTheme ? "bg-white/5" : "bg-black/5"
                            )}>
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
                                    : isDarkTheme ? "bg-white/20 shadow-none" : "bg-black/20 shadow-none",
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={cn(
                        "mt-10 pt-8 border-t transition-colors",
                        isDarkTheme ? "border-white/5" : "border-black/5"
                      )}>
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-indigo-500" />
                          </div>
                          <p className={cn(
                            "text-sm leading-relaxed transition-colors",
                            isDarkTheme ? "text-white/50" : "text-black/75"
                          )}>
                            <span className={cn(
                              "font-bold italic mr-1 tracking-tight",
                              isDarkTheme ? "text-indigo-400" : "text-indigo-600"
                            )}>
                              Fairness Insight:
                            </span>
                            {getFairnessInsight()}
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
                  <h2 className={cn(
                    "text-[12px] font-bold uppercase tracking-[0.2em] transition-colors",
                    isDarkTheme ? "text-white/40" : "text-black/70"
                  )}>
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
                        className={cn(
                          "border p-5 rounded-3xl flex items-center justify-between group transition-all hover:translate-x-1",
                          isDarkTheme ? "bg-[#151515] border-white/5 hover:border-white/10" : "bg-gray-50 border-black/5 hover:border-black/10"
                        )}
                      >
                        <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border transition-colors",
                            isDarkTheme ? "bg-white/5 text-white/60 border-white/5" : "bg-black/5 text-black/60 border-black/5"
                          )}>
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-bold text-lg tracking-tight">
                              {r.name}
                            </p>
                            <p className={cn(
                              "text-[12px] font-bold uppercase tracking-widest transition-colors",
                              isDarkTheme ? "text-white/30" : "text-black/60"
                            )}>
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
                          <button 
                            onClick={() => {
                              if (r.balance > 0) {
                                setSelectedRoommateForRequest(r);
                                setShowRequestModal(true);
                              } else {
                                setShowPaymentModal(true);
                              }
                            }}
                            className={cn(
                              "w-[100px] flex items-center justify-center text-[12px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all active:scale-95",
                              isDarkTheme ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                            )}
                          >
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
                  <h2 className={cn(
                    "text-[12px] font-bold uppercase tracking-[0.2em] transition-colors",
                    isDarkTheme ? "text-white/40" : "text-black/70"
                  )}>
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
                  {sortedExpenses.map((e) => (
                    <div
                      key={e.id}
                      className={cn(
                        "border p-5 rounded-3xl flex items-center justify-between group transition-all",
                        isDarkTheme ? "bg-[#151515] border-white/5 hover:border-white/10" : "bg-gray-50 border-black/5 hover:border-black/10"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                          isDarkTheme 
                            ? "bg-black/5 text-white/40 border-white/5 group-hover:text-white" 
                            : "bg-black/5 text-black/70 border-black/5 group-hover:text-black"
                        )}>
                          {getCategoryIcon(e.category)}
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">
                            {e.description}
                          </p>
                          <p className={cn(
                            "text-[12px] font-bold uppercase tracking-widest transition-colors",
                            isDarkTheme ? "text-white/30" : "text-black/60"
                          )}>
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
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-[0.2em] transition-colors",
                          isDarkTheme ? "text-white/20" : "text-black/50"
                        )}>
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
                  Activity History
                </h1>
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isDarkTheme ? "text-white/40" : "text-black/70"
                )}>
                  All shared costs and settlements
                </p>
              </header>

              <div className="space-y-6">
                {[
                  ...expenses.map(e => ({ ...e, activityType: 'expense' as const })),
                  ...payments.map(p => ({ ...p, activityType: 'payment' as const }))
                ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "border p-5 rounded-3xl flex items-center justify-between group transition-all",
                      isDarkTheme ? "bg-[#151515] border-white/5 hover:border-white/10" : "bg-gray-50 border-black/5 hover:border-black/10"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                        item.activityType === 'expense' 
                          ? (isDarkTheme ? "bg-white/5 text-white/40 border-white/5" : "bg-black/5 text-black/70 border-black/5")
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                      )}>
                        {item.activityType === 'expense' ? (
                          getCategoryIcon((item as Expense).category)
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold tracking-tight">
                          {item.activityType === 'expense' 
                            ? (item as Expense).description 
                            : `Payment from ${roommates.find(r => r.id === (item as Payment).from)?.name} to ${roommates.find(r => r.id === (item as Payment).to)?.name}`
                          }
                        </p>
                        <p className={cn(
                          "text-[12px] font-bold uppercase tracking-widest transition-colors",
                          isDarkTheme ? "text-white/30" : "text-black/60"
                        )}>
                          {new Date(item.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                          {item.activityType === 'payment' && (item as Payment).note && ` • ${(item as Payment).note}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold text-lg tracking-tight",
                        item.activityType === 'payment' && "text-emerald-400"
                      )}>
                        ${item.amount.toFixed(2)}
                      </p>
                      {item.activityType === 'expense' && (
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-[0.2em] transition-colors",
                          isDarkTheme ? "text-white/20" : "text-black/50"
                        )}>
                          split {(item as Expense).splitWith.length} ways
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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
                  Messages & Reminders
                </h1>
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isDarkTheme ? "text-white/40" : "text-black/70"
                )}>
                  View your recent activity and reminders
                </p>
              </header>

              <div className="space-y-4">
                <div className={cn(
                  "border p-8 rounded-[2rem] transition-colors",
                  isDarkTheme ? "bg-[#151515] border-white/5" : "bg-gray-50 border-black/5"
                )}>
                  <h3 className="text-lg font-bold mb-6 tracking-tight">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex gap-4 items-start">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          activity.type === "settlement" ? "bg-emerald-500/10" : "bg-indigo-500/10"
                        )}>
                          {activity.type === "settlement" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Send className="w-5 h-5 text-indigo-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold">
                            {activity.type === "settlement" 
                              ? `${roommates.find(r => r.id === activity.from)?.name} settled up`
                              : `You sent a reminder to ${roommates.find(r => r.id === activity.to)?.name}`
                            }
                          </p>
                          <p className={cn(
                            "text-xs mt-1 transition-colors",
                            isDarkTheme ? "text-white/40" : "text-black/70"
                          )}>
                            "{activity.message}" • {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
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
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isDarkTheme ? "text-white/40" : "text-black/70"
                )}>
                  Manage your account and preferences
                </p>
              </header>

              <div className="space-y-4">
                <div className={cn(
                  "border p-8 rounded-[2rem] flex items-center gap-6 transition-colors",
                  isDarkTheme ? "bg-[#151515] border-white/5" : "bg-gray-50 border-black/5"
                )}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/20 uppercase">
                    {currentUser.name === "Test User" 
                      ? currentUser.email[0].toUpperCase() 
                      : currentUser.name.split(" ")[0][0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{currentUser.name}</h3>
                    <p className={cn(
                      "font-medium tracking-wide transition-colors",
                      isDarkTheme ? "text-white/40" : "text-black/70"
                    )}>{currentUser.email}</p>
                  </div>
                </div>

                <div className={cn(
                  "border p-8 rounded-[2rem] space-y-4 transition-colors",
                  isDarkTheme ? "bg-[#151515] border-white/5" : "bg-gray-50 border-black/5"
                )}>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-all border border-rose-500/10 group font-bold text-rose-400"
                  >
                    <span>Log Out</span>
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                  className={cn(
                    "flex items-center gap-3 border px-6 py-4 rounded-2xl shadow-2xl transition-colors whitespace-nowrap",
                    isDarkTheme 
                      ? "bg-[#1A1A1A] border-white/10 hover:bg-white/5 text-white" 
                      : "bg-white border-black/10 hover:bg-black/5 text-black"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isDarkTheme ? "bg-indigo-500/20" : "bg-indigo-50"
                  )}>
                    <Receipt className={cn(
                      "w-5 h-5",
                      isDarkTheme ? "text-indigo-400" : "text-indigo-600"
                    )} />
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
                  className={cn(
                    "flex items-center gap-3 border px-6 py-4 rounded-2xl shadow-2xl transition-colors whitespace-nowrap",
                    isDarkTheme 
                      ? "bg-[#1A1A1A] border-white/10 hover:bg-white/5 text-white" 
                      : "bg-white border-black/10 hover:bg-black/5 text-black"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isDarkTheme ? "bg-emerald-500/20" : "bg-emerald-50"
                  )}>
                    <Wallet className={cn(
                      "w-5 h-5",
                      isDarkTheme ? "text-emerald-400" : "text-emerald-600"
                    )} />
                  </div>
                  <span className="text-base font-bold tracking-tight">Log Payment</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          <div className={cn(
            "backdrop-blur-2xl border px-4 py-3 rounded-[3rem] flex items-center gap-1 transition-all duration-300",
            isDarkTheme 
              ? "bg-[#1A1A1A]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
              : "bg-white/90 border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          )}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 relative",
                  activeTab === "dashboard"
                    ? "text-indigo-400"
                    : isDarkTheme ? "text-white/30 hover:text-white" : "text-black/60 hover:text-black",
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
                    : isDarkTheme ? "text-white/30 hover:text-white" : "text-black/60 hover:text-black",
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
                    ? (isDarkTheme ? "bg-white text-indigo-500 rotate-45" : "bg-black text-white rotate-45")
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
                    : isDarkTheme ? "text-white/30 hover:text-white" : "text-black/60 hover:text-black",
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
                    : isDarkTheme ? "text-white/30 hover:text-white" : "text-black/60 hover:text-black",
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
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
              className={cn(
                "relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] border rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-colors flex flex-col",
                isDarkTheme ? "bg-[#111] border-white/10" : "bg-white border-black/10"
              )}
            >
              <div className="p-4 sm:p-7 lg:p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Add an expense
                    </h2>
                    <p className={cn(
                      "text-sm font-medium mt-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Log a shared cost to be split
                    </p>
                  </div>
                  <button
                    onClick={() => setShowExpenseModal(false)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isDarkTheme ? "hover:bg-white/5" : "hover:bg-black/5"
                    )}
                  >
                    <X className={cn(
                      "w-6 h-6 transition-colors",
                      isDarkTheme ? "text-white/20" : "text-black/50"
                    )} />
                  </button>
                </div>

                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const description = formData.get("description") as string;
                    const amount = parseFloat(formData.get("amount") as string);
                    const category = formData.get("category") as Category;
                    const paidBy = formData.get("paidBy") as string;
                    
                    if (!description || isNaN(amount) || selectedSplitWith.length === 0) return;

                    const newExpense: Expense = {
                      id: `e${Date.now()}`,
                      description,
                      amount,
                      category,
                      paidBy,
                      date: new Date().toISOString(),
                      splitWith: selectedSplitWith,
                    };

                    setExpenses([newExpense, ...expenses]);
                    setShowExpenseModal(false);
                    setSelectedSplitWith(roommates.map(r => r.id)); // Reset for next time
                  }}
                >
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Description*
                    </label>
                    <input
                      name="description"
                      type="text"
                      required
                      placeholder="e.g. Grocery run"
                      className={cn(
                        "w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium",
                        isDarkTheme 
                          ? "bg-white/5 border-white/10 focus:bg-white/[0.08] text-white placeholder:text-white/10" 
                          : "bg-black/5 border-black/10 focus:bg-black/[0.02] text-black placeholder:text-black/50"
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className={cn(
                        "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                        isDarkTheme ? "text-white/30" : "text-black/60"
                      )}>
                        Amount*
                      </label>
                      <div className="relative">
                        <span className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 text-lg transition-colors",
                          isDarkTheme ? "text-white/20" : "text-black/50"
                        )}>
                          $
                        </span>
                        <input
                          name="amount"
                          type="number"
                          step="0.01"
                          required
                          placeholder="0.00"
                          className={cn(
                            "w-full border rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium",
                            isDarkTheme 
                              ? "bg-white/5 border-white/10 focus:bg-white/[0.08] text-white placeholder:text-white/10" 
                              : "bg-black/5 border-black/10 focus:bg-black/[0.02] text-black placeholder:text-black/50"
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={cn(
                        "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                        isDarkTheme ? "text-white/30" : "text-black/60"
                      )}>
                        Category
                      </label>
                      <select name="category" className={cn(
                        "w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium appearance-none",
                        isDarkTheme ? "bg-[#111] text-white border-white/10 focus:bg-[#1A1A1A]" : "bg-white text-black border-black/10 focus:bg-gray-50"
                      )}>
                        <option value="Groceries">Groceries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Household">Household</option>
                        <option value="Rent">Rent</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Paid by*
                    </label>
                    <select name="paidBy" className={cn(
                      "w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium appearance-none",
                      isDarkTheme ? "bg-[#111] text-white border-white/10 focus:bg-[#1A1A1A]" : "bg-white text-black border-black/10 focus:bg-gray-50"
                    )}>
                      {roommates.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className={cn(
                      "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Split with
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {roommates.map((r) => (
                        <label
                          key={r.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border border-transparent",
                            isDarkTheme ? "bg-white/5 hover:bg-white/10 hover:border-white/5" : "bg-black/5 hover:bg-black/10 hover:border-black/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors",
                              isDarkTheme ? "bg-white/5 text-white/40" : "bg-black/5 text-black/70"
                            )}>
                              {r.initials}
                            </div>
                            <span className="text-sm font-bold">{r.name}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedSplitWith.includes(r.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSplitWith([...selectedSplitWith, r.id]);
                              } else {
                                setSelectedSplitWith(selectedSplitWith.filter(id => id !== r.id));
                              }
                            }}
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
                      className={cn(
                        "flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all",
                        isDarkTheme ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                      )}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
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
              className={cn(
                "relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] border rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-colors flex flex-col",
                isDarkTheme ? "bg-[#111] border-white/10" : "bg-white border-black/10"
              )}
            >
              <div className="p-5 sm:p-8 lg:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Log payment
                    </h2>
                    <p className={cn(
                      "text-sm font-medium mt-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Record a settlement between roommates
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isDarkTheme ? "hover:bg-white/5" : "hover:bg-black/5"
                    )}
                  >
                    <X className={cn(
                      "w-6 h-6 transition-colors",
                      isDarkTheme ? "text-white/20" : "text-black/50"
                    )} />
                  </button>
                </div>

                <form
                  className="space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const fromId = formData.get("from") as string;
                    const toId = formData.get("to") as string;
                    const amount = parseFloat(formData.get("amount") as string);
                    const note = formData.get("note") as string;

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
                    
                    // Add to recent activity if it's a settlement involving "You"
                    if (toId === "1") {
                      setRecentActivities([{
                        id: Date.now().toString(),
                        type: "settlement",
                        from: fromId,
                        to: toId,
                        message: note || "Settled up!",
                        date: new Date().toISOString(),
                      }, ...recentActivities]);
                    }

                    setShowPaymentModal(false);
                    addNotification(`Payment logged from ${roommates.find(r => r.id === fromId)?.name}`);
                  }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className={cn(
                        "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                        isDarkTheme ? "text-white/30" : "text-black/60"
                      )}>
                        From*
                      </label>
                      <select 
                        name="from" 
                        value={paymentFrom}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPaymentFrom(val);
                          if (val === paymentTo) {
                            const other = roommates.find(r => r.id !== val);
                            if (other) setPaymentTo(other.id);
                          }
                        }}
                        className={cn(
                          "w-full border rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-base font-medium appearance-none",
                          isDarkTheme ? "bg-[#111] text-white border-white/10 focus:bg-[#1A1A1A]" : "bg-white text-black border-black/10 focus:bg-gray-50"
                        )}
                      >
                        {roommates.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className={cn(
                        "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                        isDarkTheme ? "text-white/30" : "text-black/60"
                      )}>
                        To*
                      </label>
                      <select 
                        name="to" 
                        value={paymentTo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPaymentTo(val);
                          if (val === paymentFrom) {
                            const other = roommates.find(r => r.id !== val);
                            if (other) setPaymentFrom(other.id);
                          }
                        }}
                        className={cn(
                          "w-full border rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-base font-medium appearance-none",
                          isDarkTheme ? "bg-[#111] text-white border-white/10 focus:bg-[#1A1A1A]" : "bg-white text-black border-black/10 focus:bg-gray-50"
                        )}
                      >
                        {roommates.map((r) => (
                          <option key={r.id} value={r.id} disabled={r.id === paymentFrom}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Amount*
                    </label>
                    <div className="relative">
                      <span className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors",
                        isDarkTheme ? "text-white/20" : "text-black/50"
                      )}>
                        $
                      </span>
                      <input
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className={cn(
                          "w-full border rounded-2xl pl-9 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-base font-medium",
                          isDarkTheme 
                            ? "bg-white/5 border-white/10 focus:bg-white/[0.08] text-white placeholder:text-white/10" 
                            : "bg-black/5 border-black/10 focus:bg-black/[0.02] text-black placeholder:text-black/50"
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[12px] font-bold uppercase tracking-[0.2em] ml-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      placeholder="Add a note..."
                      className={cn(
                        "w-full border rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-base font-medium h-24 resize-none",
                        isDarkTheme 
                          ? "bg-white/5 border-white/10 focus:bg-white/[0.08] text-white placeholder:text-white/10" 
                          : "bg-black/5 border-black/10 focus:bg-black/[0.02] text-black placeholder:text-black/50"
                      )}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className={cn(
                        "flex-1 px-6 py-4 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all",
                        isDarkTheme ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 rounded-3xl font-bold text-sm uppercase tracking-widest bg-indigo-500 text-white hover:bg-indigo-400 transition-all shadow-[0_10px_20px_rgba(99,102,241,0.2)]"
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
      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedRoommateForRequest && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className={cn(
                "relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] border rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-colors flex flex-col",
                isDarkTheme ? "bg-[#111] border-white/10" : "bg-white border-black/10"
              )}
            >
              <div className="p-5 sm:p-8 lg:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Request Payment
                    </h2>
                    <p className={cn(
                      "text-sm font-medium mt-1 transition-colors",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Send a friendly reminder to {selectedRoommateForRequest.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isDarkTheme ? "hover:bg-white/5" : "hover:bg-black/5"
                    )}
                  >
                    <X className={cn(
                      "w-6 h-6 transition-colors",
                      isDarkTheme ? "text-white/20" : "text-black/50"
                    )} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className={cn(
                      "text-[12px] font-bold uppercase tracking-[0.2em] ml-1",
                      isDarkTheme ? "text-white/30" : "text-black/60"
                    )}>
                      Select a template
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "Hey! Just a friendly reminder for the groceries split. No rush! 😊",
                        "Settling up the utilities for this month. Whenever you have a sec! ⚡️",
                        "Shared household supplies update. Thanks for keeping the place stocked! 🏠",
                        "Hey, we're a bit unbalanced on expenses lately. Let's settle up soon! 🤝",
                      ].map((template, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            handleSendRequest(selectedRoommateForRequest, template);
                            setCustomRequestMessage("");
                          }}
                          className={cn(
                            "text-left p-5 rounded-2xl transition-all border border-transparent group",
                            isDarkTheme
                              ? "bg-white/5 hover:bg-white/10 hover:border-white/5"
                              : "bg-black/5 hover:bg-black/10 hover:border-black/10"
                          )}
                        >
                          <p className={cn(
                            "text-sm transition-colors",
                            isDarkTheme ? "text-white/70 group-hover:text-white" : "text-black/70 group-hover:text-black"
                          )}>
                            {template}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={cn(
                        "w-full border-t",
                        isDarkTheme ? "border-white/5" : "border-black/10"
                      )}></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                      <span className={cn(
                        "px-4 font-bold",
                        isDarkTheme ? "bg-[#111] text-white/20" : "bg-white text-black/40"
                      )}>Or write your own</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      value={customRequestMessage}
                      onChange={(e) => setCustomRequestMessage(e.target.value)}
                      placeholder="Type a custom message..."
                      className={cn(
                        "w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium h-24 resize-none",
                        isDarkTheme
                          ? "bg-white/5 border-white/10 focus:bg-white/[0.08] text-white placeholder:text-white/10"
                          : "bg-black/5 border-black/10 focus:bg-black/[0.02] text-black placeholder:text-black/40"
                      )}
                    />
                    <button
                      disabled={!customRequestMessage.trim()}
                      onClick={() => {
                        handleSendRequest(selectedRoommateForRequest, customRequestMessage);
                        setCustomRequestMessage("");
                      }}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest disabled:opacity-50 transition-all flex items-center justify-center gap-2",
                        isDarkTheme
                          ? "bg-white/10 hover:bg-indigo-500 text-white disabled:hover:bg-white/10"
                          : "bg-black/10 hover:bg-indigo-500 text-black hover:text-white disabled:hover:bg-black/10"
                      )}
                    >
                      <Send className="w-4 h-4" />
                      Send Custom Message
                    </button>
                  </div>
                </div>

                <div className={cn(
                  "mt-8 pt-8 border-t",
                  isDarkTheme ? "border-white/5" : "border-black/10"
                )}>
                   <button
                    onClick={() => setShowRequestModal(false)}
                    className={cn(
                      "w-full py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all",
                      isDarkTheme ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
