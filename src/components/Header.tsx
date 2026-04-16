import { useState } from "react";
import { motion } from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white/10" : "border-black/10";
  const bgSecondaryClass = isDark ? "bg-white/5" : "bg-black/5";
  const textSecondaryClass = isDark ? "text-white/70" : "text-black/60";
  const hoverClass = isDark ? "hover:text-white" : "hover:text-black";
  const activeClass = isDark ? "text-white" : "text-black";

  const handleMobileNavigate = (page: "features" | "about" | "contact") => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

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
            onClick={() => {
              onNavigate("landing");
              setIsMobileMenuOpen(false);
            }}
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

        <div className="flex items-center gap-2 sm:gap-3">
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
            className={`rounded-xl border ${borderClass} ${bgSecondaryClass} px-3 py-2 text-xs font-semibold ${textSecondaryClass} transition-colors ${hoverClass} sm:px-5 sm:py-2.5 sm:text-sm`}
          >
            Log in
          </button>
          <button
            onClick={onSignUp}
            className="rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-400 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Sign up
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-lg border ${borderClass} ${bgSecondaryClass} p-2 transition-colors ${hoverClass} sm:hidden`}
            title={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`mx-auto mt-3 max-w-5xl border-t ${borderClass} pt-3 sm:hidden`}>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => handleMobileNavigate("features")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                currentPage === "features" ? activeClass : textSecondaryClass
              } ${hoverClass}`}
            >
              Features
            </button>
            <button
              onClick={() => handleMobileNavigate("about")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                currentPage === "about" ? activeClass : textSecondaryClass
              } ${hoverClass}`}
            >
              About
            </button>
            <button
              onClick={() => handleMobileNavigate("contact")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                currentPage === "contact" ? activeClass : textSecondaryClass
              } ${hoverClass}`}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
}
