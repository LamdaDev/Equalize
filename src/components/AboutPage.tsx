import { motion } from "motion/react";
import Header from "./Header";

interface AboutPageProps {
  onBack: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onNavigate?: (page: "landing" | "features" | "about" | "contact") => void;
  onLogin?: () => void;
  onSignUp?: () => void;
}

export default function AboutPage({
  onBack,
  isDark = true,
  onToggleTheme = () => {},
  onNavigate = () => {},
  onLogin = () => {},
  onSignUp = () => {},
}: AboutPageProps) {
  const bgClass = isDark ? "bg-[#0A0A0A]" : "bg-white";
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white/10" : "border-black/10";
  const bgSecondaryClass = isDark ? "bg-white/5" : "bg-black/5";
  const textSecondaryClass = isDark ? "text-white/70" : "text-black/60";
  const bgCardClass = isDark ? "bg-[#151515]" : "bg-white/40";

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-indigo-500/30 flex flex-col`}>
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNavigate={onNavigate}
        onLogin={onLogin}
        onSignUp={onSignUp}
        currentPage="about"
      />
      <div className="px-6 py-10 sm:py-16 flex-1">
        <div className="mx-auto max-w-3xl">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-8"
        >
          <div>
            <h1 className={`mb-4 text-5xl font-bold tracking-tight sm:text-6xl`}>
              About Equalize
            </h1>
            <p className={`max-w-2xl text-base ${textSecondaryClass} sm:text-lg`}>
              Making shared living fair, transparent, and friction-free.
            </p>
          </div>

          <div className="space-y-6">
            <div className={`rounded-2xl border ${borderClass} ${bgCardClass} p-8`}>
              <h2 className={`mb-3 text-2xl font-bold`}>Our Mission</h2>
              <p className={`leading-relaxed ${textSecondaryClass}`}>
                We built Equalize to solve a universal roommate problem: unclear finances
                and awkward conversations about who owes whom. Our platform transforms
                expense sharing from a source of tension into a simple, transparent process.
              </p>
            </div>

            <div className={`rounded-2xl border ${borderClass} ${bgCardClass} p-8`}>
              <h2 className={`mb-3 text-2xl font-bold`}>How It Works</h2>
              <div className="space-y-3">
                <p className={`leading-relaxed ${textSecondaryClass}`}>
                  <span className="font-semibold">1. Log Expenses:</span> Every
                  expense gets captured with who paid and who benefits.
                </p>
                <p className={`leading-relaxed ${textSecondaryClass}`}>
                  <span className="font-semibold">2. Automatic Calculations:</span>{" "}
                  We instantly calculate who owes whom and by how much.
                </p>
                <p className={`leading-relaxed ${textSecondaryClass}`}>
                  <span className="font-semibold">3. Clear Settlements:</span> Send
                  and track payment requests with total transparency.
                </p>
              </div>
            </div>

            <div className={`rounded-2xl border ${borderClass} ${bgCardClass} p-8`}>
              <h2 className={`mb-3 text-2xl font-bold`}>Why Equalize?</h2>
              <ul className={`space-y-2 ${textSecondaryClass}`}>
                <li className="flex gap-3">
                  <span className="text-indigo-400">✓</span>
                  <span>Clear, real-time visibility of all shared expenses</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400">✓</span>
                  <span>Removes guesswork from who owes what</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400">✓</span>
                  <span>Built for roommates, by people who lived this problem</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400">✓</span>
                  <span>Simple UI designed for quick, daily use</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
