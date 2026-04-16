import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Users, Wallet } from "lucide-react";
import Header from "./Header";

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
  onNavigate: (page: "features" | "about" | "contact") => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const highlights = [
  {
    icon: Wallet,
    title: "Track Shared Costs",
    description: "Capture rent, groceries, and utilities in one transparent feed.",
  },
  {
    icon: Users,
    title: "Split Fairly",
    description: "Automatically divide expenses so every roommate stays in sync.",
  },
  {
    icon: ShieldCheck,
    title: "Settle Confidently",
    description: "Send clean payment requests and resolve balances without friction.",
  },
];

export default function LandingPage({ 
  onLogin, 
  onSignUp, 
  onNavigate,
  isDark,
  onToggleTheme 
}: LandingPageProps) {
  const bgClass = isDark ? "bg-[#0A0A0A]" : "bg-white";
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white/10" : "border-black/10";
  const bgSecondaryClass = isDark ? "bg-white/5" : "bg-black/5";
  const textSecondaryClass = isDark ? "text-white/80" : "text-black/70";
  const hoverClass = isDark ? "hover:text-white" : "hover:text-black";

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-indigo-500/30`}>
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNavigate={onNavigate}
        onLogin={onLogin}
        onSignUp={onSignUp}
        currentPage="landing"
      />
      <div className={`px-6 py-10 sm:py-16`}>
        <div className="mx-auto max-w-5xl">

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mb-14"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-indigo-400/80">
            Fair Expense Sharing
          </p>
          <h1 className={`max-w-3xl text-5xl font-bold tracking-tight ${textClass} sm:text-6xl`}>
            Keep your household spending clear, calm, and balanced.
          </h1>
          <p className={`mt-6 max-w-2xl text-base ${isDark ? 'text-white/60' : 'text-black/60'} sm:text-lg`}>
            Equalize helps roommates log expenses, understand contribution gaps,
            and settle up with less awkwardness.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onSignUp}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-7 py-4 text-base font-bold text-white transition-all hover:bg-indigo-400"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onLogin}
              className={`rounded-2xl border ${borderClass} ${bgSecondaryClass} px-7 py-4 text-base font-bold ${isDark ? 'text-white/80' : 'text-black/80'} transition-colors ${hoverClass}`}
            >
              I Already Have an Account
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-3xl border ${borderClass} ${isDark ? 'bg-[#151515]' : 'bg-white/30'} p-6`}
              >
                <div className={`mb-4 inline-flex rounded-xl border border-white/10 ${isDark ? 'bg-white/5' : 'bg-white/20'} p-2.5 text-indigo-400`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className={`mb-2 text-lg font-bold tracking-tight ${textClass}`}>
                  {item.title}
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-14"
        >
          <h2 className={`mb-4 text-2xl font-bold tracking-tight ${textClass} sm:text-3xl`}>
            Figma Mockups
          </h2>
          <div className={`overflow-hidden rounded-2xl border ${borderClass}`}>
            <iframe
              style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
              width="800"
              height="450"
              src="https://embed.figma.com/design/mkwGQOdChOagBikKZplHgK/SOEN-357---Project?node-id=0-1&embed-host=share"
              allowFullScreen
              title="SOEN 357 Project Figma Mockups"
              className="h-[450px] w-full"
            />
          </div>
        </motion.section>
        </div>
      </div>
    </div>
  );
}
