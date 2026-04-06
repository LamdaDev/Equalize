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
  LogOut,
  Moon,
  Sun,
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string }>({
    name: "Chris C.",
    email: "rjmauricio3@gmail.com",
  });
  const [authMode, setAuthMode] = useState<"landing" | "login" | "signup" | "features" | "about" | "contact">("landing");
  const [isDarkTheme, setIsDarkTheme] = useState(true);
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
  }[]>([
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
  ]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthMode("landing");
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
          You've contributed <span className="text-white font-bold">{you.percentage}%</span> of costs this month. 
          {mostBehind.name !== "You" ? (
            <> {mostBehind.name} is currently <span className="text-white font-bold">{Math.abs(mostBehind.percentDiff)}%</span> below the average contribution. Consider a settlement to rebalance.</>
          ) : (
            <> You are well ahead of the average!</>
          )}
        </>
      );
    }

    if (you && you.percentDiff < -10) {
      return (
        <>
          You're currently <span className="text-white font-bold">{Math.abs(you.percentDiff)}%</span> below the average contribution. 
          {mostAhead.name !== "You" ? (
            <> {mostAhead.name} has covered <span className="text-white font-bold">{mostAhead.percentage}%</span> of costs. A quick payment would help even things out.</>
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
          Your contributions are balanced, but <span className="text-white font-bold">{mostBehind.name}</span> is currently <span className="text-white font-bold">{Math.abs(mostBehind.percentDiff)}%</span> behind the average. A friendly reminder might help.
        </>
      );
    }

    if (mostAhead.percentDiff > 15) {
      return (
        <>
          Everything looks fair for you, but <span className="text-white font-bold">{mostAhead.name}</span> has contributed <span className="text-white font-bold">{mostAhead.percentage}%</span> of costs. They've been doing the heavy lifting lately!
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

  const signedInPageClass = cn(
    "min-h-screen font-sans selection:bg-indigo-500/30 pb-32",
    isDarkTheme ? "bg-[#0A0A0A] text-white" : "bg-white text-black"
  );
  const signedInNavClass = cn(
    "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between",
    isDarkTheme ? "bg-[#0A0A0A]/80 border-white/5" : "bg-white/80 border-black/5"
  );
  const signedInSurfaceClass = isDarkTheme
    ? "bg-[#151515] border border-white/5"
    : "bg-white border border-black/10 shadow-sm";
  const signedInSurfaceHoverClass = isDarkTheme
    ? "hover:border-white/10"
    : "hover:border-black/20";
  const signedInMutedTextClass = isDarkTheme ? "text-white/40" : "text-black/50";
  const signedInSubtleTextClass = isDarkTheme ? "text-white/30" : "text-black/40";
  const signedInIconSurfaceClass = isDarkTheme
    ? "bg-white/5 border-white/5 text-white/40"
    : "bg-black/5 border-black/10 text-black/50";
  const signedInSoftSurfaceClass = isDarkTheme ? "bg-white/5" : "bg-black/5";
  const signedInSoftSurfaceHoverClass = isDarkTheme ? "hover:bg-white/10" : "hover:bg-black/10";
  const signedInButtonTextClass = isDarkTheme ? "text-white" : "text-black";
  const signedInFloatingBarClass = isDarkTheme
    ? "bg-[#1A1A1A]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    : "bg-white/90 border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12)]";
  const signedInFloatingButtonClass = isDarkTheme
    ? "bg-[#1A1A1A] border border-white/10 hover:bg-white/5"
    : "bg-white border border-black/10 hover:bg-black/5";
  const signedInFloatingIconClass = isDarkTheme ? "text-white/30 hover:text-white" : "text-black/30 hover:text-black";
  const signedInFloatingIconActiveClass = isDarkTheme ? "text-indigo-400" : "text-indigo-600";
  const signedInFloatingPlusClass = isDarkTheme ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white";
  const signedInFloatingPlusActiveClass = isDarkTheme ? "bg-white text-indigo-500 rotate-45" : "bg-black text-white rotate-45";
  const signedInModalClass = isDarkTheme
    ? "bg-[#111] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
    : "bg-white border border-black/10 shadow-[0_50px_100px_rgba(0,0,0,0.18)]";
  const signedInModalMutedClass = isDarkTheme ? "text-white/30" : "text-black/50";
  const signedInModalTextClass = isDarkTheme ? "text-white/20" : "text-black/30";
  const signedInModalInputClass = isDarkTheme
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:bg-white/[0.08]"
    : "bg-black/5 border-black/10 text-black placeholder:text-black/25 focus:bg-black/[0.08]";
  const signedInModalSelectClass = isDarkTheme
    ? "bg-[#111] text-white border-white/10 focus:bg-[#1A1A1A]"
    : "bg-white text-black border-black/10 focus:bg-black/[0.04]";
  const signedInModalOptionClass = isDarkTheme
    ? "bg-[#111] text-white"
    : "bg-white text-black";
  const signedInModalTemplateButtonClass = isDarkTheme
    ? "bg-white/5 hover:bg-white/10 border-transparent hover:border-white/5"
    : "bg-black/5 hover:bg-black/10 border-transparent hover:border-black/10";
  const signedInRecentActivityCardClass = isDarkTheme ? "bg-[#151515] border border-white/5" : "bg-white border border-black/10 shadow-sm";
  const signedInRecentActivityMutedClass = isDarkTheme ? "text-white/40" : "text-black/50";
  const signedInRecentActivityTemplateClass = isDarkTheme ? "bg-white/5 hover:bg-white/10 border-transparent hover:border-white/5" : "bg-black/5 hover:bg-black/10 border-transparent hover:border-black/10";
  const signedInRecentActivityDividerClass = isDarkTheme ? "border-white/5" : "border-black/10";
  const signedInModalDividerClass = isDarkTheme ? "border-white/5" : "border-black/10";

  if (!isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        {authMode === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <LandingPage
              onLogin={() => setAuthMode("login")}
              onSignUp={() => setAuthMode("signup")}
              onNavigate={(page) => setAuthMode(page)}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
            />
          </motion.div>
        ) : authMode === "features" ? (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <FeaturesPage
              onBack={() => setAuthMode("landing")}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onNavigate={(page) => setAuthMode(page)}
              onLogin={() => setAuthMode("login")}
              onSignUp={() => setAuthMode("signup")}
            />
          </motion.div>
        ) : authMode === "about" ? (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <AboutPage
              onBack={() => setAuthMode("landing")}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onNavigate={(page) => setAuthMode(page)}
              onLogin={() => setAuthMode("login")}
              onSignUp={() => setAuthMode("signup")}
            />
          </motion.div>
        ) : authMode === "contact" ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <ContactPage
              onBack={() => setAuthMode("landing")}
              isDark={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              onNavigate={(page) => setAuthMode(page)}
              onLogin={() => setAuthMode("login")}
              onSignUp={() => setAuthMode("signup")}
            />
          </motion.div>
        ) : authMode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <LogInAuth 
              onLogin={(email) => {
                setIsLoggedIn(true);
                // If it's the test account or any login, set to test info as requested
                // unless we want to be smarter, but the user said "otherwise if they login... info is test"
                setCurrentUser({
                  name: "Test User",
                  email: email || "test@email.com",
                });
              }} 
              onSignUp={() => setAuthMode("signup")}
              onGoToLanding={() => setAuthMode("landing")}
              isDark={isDarkTheme}
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
              onSignUpSuccess={(name, email) => {
                setIsLoggedIn(true);
                setCurrentUser({ name, email });
              }}
              onBackToLogin={() => setAuthMode("login")}
              onGoToLanding={() => setAuthMode("landing")}
              isDark={isDarkTheme}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={signedInPageClass}>
      {/* Top Navigation */}
      <nav className={signedInNavClass}>
        <div className="flex items-center gap-3">
          {/* <Logo className="w-8 h-8 rounded-lg" /> */}
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setAuthMode("landing");
              setActiveTab("dashboard");
            }}
            className="text-xl font-bold tracking-tight"
          >
            Equalize
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowConditionB(!showConditionB)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all border flex items-center gap-2",
              showConditionB 
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                : isDarkTheme
                  ? "bg-white/5 border-white/10 text-white/40 hover:text-white"
                  : "bg-black/5 border-black/10 text-black/50 hover:text-black"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full transition-all",
              showConditionB ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-white/20"
            )} />
            {showConditionB ? "Fairness Mode" : "Baseline Mode"}
          </button>
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            title="Toggle theme"
            className={cn(
              "p-2 rounded-xl border transition-all",
              isDarkTheme
                ? "text-white/80 border-white/10 bg-white/5 hover:text-white hover:bg-white/10"
                : "text-black/70 border-black/10 bg-black/5 hover:text-black hover:bg-black/10"
            )}
          >
            {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all rounded-xl border border-rose-500/10 bg-rose-500/5 group relative"
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              LOGOUT
            </span>
          </button>
          {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-indigo-500/20">
            {currentUser.name.split(" ").map(n => n[0]).join("")}
          </div> */}
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
                <p className={signedInMutedTextClass + " text-sm font-medium"}>
                  April 2026 • Shared apartment
                </p>
              </header>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className={cn(signedInSurfaceClass, "p-6 rounded-3xl relative overflow-hidden group") }>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowUpRight className="w-12 h-12" />
                  </div>
                  <p className={signedInMutedTextClass + " text-[12px] font-bold uppercase tracking-[0.15em] mb-2"}>
                    {totalOwedToYou >= totalYouOwe ? "You are owed" : "You owe"}
                  </p>
                  <p className={cn(
                    "text-4xl font-bold tracking-tight",
                    totalOwedToYou >= totalYouOwe ? "text-emerald-400" : "text-rose-400"
                  )}>
                    ${Math.abs(totalOwedToYou - totalYouOwe).toFixed(2)}
                  </p>
                </div>
                <div className={cn(signedInSurfaceClass, "p-6 rounded-3xl relative overflow-hidden group") }>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                  <p className={signedInMutedTextClass + " text-[12px] font-bold uppercase tracking-[0.15em] mb-2"}>
                    Total this month
                  </p>
                  <p className="text-4xl font-bold tracking-tight">
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
                      <h2 className={signedInMutedTextClass + " text-[12px] font-bold uppercase tracking-[0.2em]"}>
                        Contribution Breakdown - April
                      </h2>
                    </div>
                    <div className={cn(signedInSurfaceClass, "p-8 rounded-[2rem]") }>
                      <div className="space-y-8">
                        {contributionData.map((data, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border", signedInSoftSurfaceClass, isDarkTheme ? "text-white/60 border-white/5" : "text-black/60 border-black/10") }>
                                  {data.initials}
                                </div>
                                <div>
                                  <span className="block font-bold">
                                    {data.name}
                                  </span>
                                  <span className={signedInMutedTextClass + " text-[12px] font-medium tracking-wide"}>
                                    ${data.value.toFixed(2)} contributed
                                  </span>
                                </div>
                              </div>
                              <span className={signedInMutedTextClass + " text-sm font-bold"}>
                                {data.percentage}%
                              </span>
                            </div>
                            <div className={cn("h-3 rounded-full overflow-hidden p-[2px]", signedInSoftSurfaceClass)}>
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
                      <div className={cn("mt-10 pt-8 border-t", isDarkTheme ? "border-white/5" : "border-black/10")}>
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-indigo-500" />
                          </div>
                          <p className={signedInMutedTextClass + " text-sm leading-relaxed"}>
                            <span className="text-indigo-400 font-bold italic mr-1 tracking-tight">
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
                  <h2 className={signedInMutedTextClass + " text-[12px] font-bold uppercase tracking-[0.2em]"}>
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
                        className={cn(signedInSurfaceClass, "p-5 rounded-3xl flex items-center justify-between group transition-all hover:translate-x-1", signedInSurfaceHoverClass)}
                      >
                        <div className="flex items-center gap-5">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border", signedInSoftSurfaceClass, isDarkTheme ? "text-white/60 border-white/5" : "text-black/60 border-black/10") }>
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-bold text-lg tracking-tight">
                              {r.name}
                            </p>
                            <p className={signedInSubtleTextClass + " text-[12px] font-bold uppercase tracking-widest"}>
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
                            className={cn("w-[100px] flex items-center justify-center text-[12px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all active:scale-95", signedInSoftSurfaceClass, signedInSoftSurfaceHoverClass)}
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
                  <h2 className={signedInMutedTextClass + " text-[12px] font-bold uppercase tracking-[0.2em]"}>
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
                      className={cn(signedInSurfaceClass, "p-5 rounded-3xl flex items-center justify-between group transition-all", signedInSurfaceHoverClass)}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors", signedInIconSurfaceClass)}>
                          {getCategoryIcon(e.category)}
                        </div>
                        <div>
                          <p className="font-bold tracking-tight">
                            {e.description}
                          </p>
                          <p className={signedInSubtleTextClass + " text-[12px] font-bold uppercase tracking-widest"}>
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
                        <p className={signedInSubtleTextClass + " text-[9px] font-bold uppercase tracking-[0.2em]"}>
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
                <p className={signedInMutedTextClass + " text-sm font-medium"}>
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
                    className={cn(signedInSurfaceClass, "p-5 rounded-3xl flex items-center justify-between group transition-all", signedInSurfaceHoverClass)}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                        item.activityType === 'expense'
                          ? cn(signedInSoftSurfaceClass, isDarkTheme ? "text-white/40 border-white/5" : "text-black/50 border-black/10")
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
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
                        <p className={signedInSubtleTextClass + " text-[12px] font-bold uppercase tracking-widest"}>
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
                        <p className={signedInSubtleTextClass + " text-[9px] font-bold uppercase tracking-[0.2em]"}>
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
                  Recent Activity
                </h1>
                <p className={signedInMutedTextClass + " text-sm font-medium"}>
                  List of requests and payment found here
                </p>
              </header>

              <div className="space-y-4">
                {/* <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem]">
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
                </div> */}

                <div className={cn(signedInRecentActivityCardClass, "p-8 rounded-[2rem]")}>
                  {/* <h3 className="text-lg font-bold mb-6 tracking-tight">
                    Recent Activity
                  </h3> */}
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
                          <p className={signedInRecentActivityMutedClass + " text-xs mt-1"}>
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
                <p className={signedInMutedTextClass + " text-sm font-medium"}>
                  Manage your account and preferences
                </p>
              </header>

              <div className="space-y-4">
                <div className={cn(signedInSurfaceClass, "p-8 rounded-[2rem] flex items-center gap-6") }>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/20 uppercase">
                    {currentUser.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{currentUser.name}</h3>
                    <p className={signedInMutedTextClass + " font-medium tracking-wide"}>{currentUser.email}</p>
                  </div>
                </div>

                <div className={cn(signedInSurfaceClass, "p-8 rounded-[2rem] space-y-4") }>
                  <h3 className={signedInSubtleTextClass + " text-[12px] font-bold uppercase tracking-[0.2em] mb-4"}>Account Settings</h3>
                  
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
                  className={cn("flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-colors whitespace-nowrap", signedInFloatingButtonClass)}
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
                  className={cn("flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-colors whitespace-nowrap", signedInFloatingButtonClass)}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-base font-bold tracking-tight">Log Payment</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          <div className={cn("backdrop-blur-2xl px-4 py-3 rounded-[3rem] flex items-center gap-1", signedInFloatingBarClass)}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 relative",
                  activeTab === "dashboard"
                    ? signedInFloatingIconActiveClass
                    : signedInFloatingIconClass,
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
                    ? signedInFloatingIconActiveClass
                    : signedInFloatingIconClass,
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
                    ? signedInFloatingPlusActiveClass
                    : signedInFloatingPlusClass
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
                    ? signedInFloatingIconActiveClass
                    : signedInFloatingIconClass,
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
                    ? signedInFloatingIconActiveClass
                    : signedInFloatingIconClass,
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
          <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
              className={cn("relative my-4 sm:my-0 w-full max-w-md max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] rounded-[3rem] overflow-hidden", signedInModalClass)}
            >
              <div className="p-6 sm:p-10 overflow-y-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Add an expense
                    </h2>
                    <p className={signedInModalMutedClass + " text-sm font-medium mt-1"}>
                      Log a shared cost to be split
                    </p>
                  </div>
                  <button
                    onClick={() => setShowExpenseModal(false)}
                    className={cn("p-3 rounded-full transition-colors", signedInSoftSurfaceHoverClass)}
                  >
                    <X className={cn("w-6 h-6", signedInModalTextClass)} />
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
                    <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                      Description*
                    </label>
                    <input
                      name="description"
                      type="text"
                      required
                      placeholder="e.g. Grocery run"
                      className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium", signedInModalInputClass)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                        Amount*
                      </label>
                      <div className="relative">
                        <span className={cn("absolute left-6 top-1/2 -translate-y-1/2 text-lg", signedInModalTextClass)}>
                          $
                        </span>
                        <input
                          name="amount"
                          type="number"
                          step="0.01"
                          required
                          placeholder="0.00"
                          className={cn("w-full rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium", signedInModalInputClass)}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                        Category
                      </label>
                      <select name="category" className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium appearance-none", signedInModalSelectClass)}>
                        <option value="Groceries">Groceries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Household">Household</option>
                        <option value="Rent">Rent</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                      Paid by*
                    </label>
                    <select name="paidBy" className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium appearance-none", signedInModalSelectClass)}>
                      {roommates.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                      <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                      Split with
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {roommates.map((r) => (
                        <label
                          key={r.id}
                            className={cn("flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border border-transparent", signedInModalTemplateButtonClass)}
                        >
                          <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold", signedInSoftSurfaceClass, signedInModalMutedClass)}>
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
                            className={cn("w-6 h-6 rounded-lg bg-transparent text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0", isDarkTheme ? "border-white/10" : "border-black/20")}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowExpenseModal(false)}
                      className={cn("flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all", signedInSoftSurfaceClass, signedInSoftSurfaceHoverClass)}
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
              className={cn("relative w-full max-w-md rounded-[3rem] overflow-hidden", signedInModalClass)}
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Log payment
                    </h2>
                    <p className={signedInModalMutedClass + " text-sm font-medium mt-1"}>
                      Record a settlement between roommates
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={cn("p-3 rounded-full transition-colors", signedInSoftSurfaceHoverClass)}
                  >
                    <X className={cn("w-6 h-6", signedInModalTextClass)} />
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
                      method: "manual",
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
                      <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
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
                        className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium appearance-none", signedInModalSelectClass)}
                      >
                        {roommates.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
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
                        className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium appearance-none", signedInModalSelectClass)}
                      >
                        {roommates.map((r) => (
                          <option key={r.id} value={r.id} disabled={r.id === paymentFrom}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                      Amount*
                    </label>
                    <div className="relative">
                      <span className={cn("absolute left-6 top-1/2 -translate-y-1/2 text-lg", signedInModalTextClass)}>
                        $
                      </span>
                      <input
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className={cn("w-full rounded-2xl pl-10 pr-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium", signedInModalInputClass)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
                      Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      placeholder="Add a note..."
                      className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg font-medium h-32 resize-none", signedInModalInputClass)}
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className={cn("flex-1 px-8 py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all", signedInSoftSurfaceClass, signedInSoftSurfaceHoverClass)}
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
      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedRoommateForRequest && (
          <div className="fixed inset-0 z-[150] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
              className={cn("relative my-4 sm:my-0 w-full max-w-md max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] rounded-[3rem] overflow-hidden", signedInModalClass)}
            >
              <div className="p-6 sm:p-10 overflow-y-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      Request Payment
                    </h2>
                    <p className={signedInModalMutedClass + " text-sm font-medium mt-1"}>
                      Send a friendly reminder to {selectedRoommateForRequest.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className={cn("p-3 rounded-full transition-colors", signedInSoftSurfaceHoverClass)}
                  >
                    <X className={cn("w-6 h-6", signedInModalTextClass)} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className={signedInModalMutedClass + " text-[12px] font-bold uppercase tracking-[0.2em] ml-1"}>
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
                          className={cn("text-left p-5 rounded-2xl transition-all border border-transparent group", signedInModalTemplateButtonClass)}
                        >
                          <p className={cn("text-sm transition-colors", isDarkTheme ? "text-white/70 group-hover:text-white" : "text-black/70 group-hover:text-black")}>
                            {template}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={cn("w-full border-t", signedInModalDividerClass)}></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                      <span className={cn("px-4 font-bold", isDarkTheme ? "bg-[#111] text-white/20" : "bg-white text-black/30")}>
                        Or write your own
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      value={customRequestMessage}
                      onChange={(e) => setCustomRequestMessage(e.target.value)}
                      placeholder="Type a custom message..."
                      className={cn("w-full rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium h-24 resize-none", signedInModalInputClass)}
                    />
                    <button
                      disabled={!customRequestMessage.trim()}
                      onClick={() => {
                        handleSendRequest(selectedRoommateForRequest, customRequestMessage);
                        setCustomRequestMessage("");
                      }}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest text-white disabled:opacity-50 transition-all flex items-center justify-center gap-2",
                        isDarkTheme
                          ? "bg-white/10 hover:bg-indigo-500 disabled:hover:bg-white/10"
                          : "bg-black/10 hover:bg-indigo-500 disabled:hover:bg-black/10"
                      )}
                    >
                      <Send className="w-4 h-4" />
                      Send Custom Message
                    </button>
                  </div>
                </div>

                <div className={cn("mt-8 pt-8 border-t", signedInModalDividerClass)}>
                   <button
                    onClick={() => setShowRequestModal(false)}
                    className={cn("w-full py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all", signedInSoftSurfaceClass, signedInSoftSurfaceHoverClass)}
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
