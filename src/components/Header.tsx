import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: "landing" | "features" | "about" | "contact") => void;
  onLogin: () => void;
  onSignUp: () => void;
  currentPage?: "landing" | "features" | "about" | "contact";
}

export default function Header({
  isDark,
  onToggleTheme,
  onNavigate,
  onLogin,
  onSignUp,
  currentPage = "landing",
}: HeaderProps) {
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white/10" : "border-black/10";
  const bgSecondaryClass = isDark ? "bg-white/5" : "bg-black/5";
  const textSecondaryClass = isDark ? "text-white/70" : "text-black/60";
  const hoverClass = isDark ? "hover:text-white" : "hover:text-black";
  const activeClass = isDark ? "text-white" : "text-black";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`border-b ${borderClass} px-6 py-4`}
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate("landing")}
            className={`text-2xl font-bold tracking-tight ${textClass} transition-colors ${hoverClass}`}
          >
            Equalize
          </button>

          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => onNavigate("features")}
              className={`text-sm font-semibold transition-colors ${
                currentPage === "features" ? activeClass : textSecondaryClass
              } ${hoverClass}`}
            >
              Features
            </button>
            <button
              onClick={() => onNavigate("about")}
              className={`text-sm font-semibold transition-colors ${
                currentPage === "about" ? activeClass : textSecondaryClass
              } ${hoverClass}`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className={`text-sm font-semibold transition-colors ${
                currentPage === "contact" ? activeClass : textSecondaryClass
              } ${hoverClass}`}
            >
              Contact
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className={`rounded-lg border ${borderClass} ${bgSecondaryClass} p-2 transition-colors ${hoverClass}`}
            title="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={onLogin}
            className={`hidden sm:block rounded-xl border ${borderClass} ${bgSecondaryClass} px-5 py-2.5 text-sm font-semibold ${textSecondaryClass} transition-colors ${hoverClass}`}
          >
            Log in
          </button>
          <button
            onClick={onSignUp}
            className="hidden sm:block rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
}
