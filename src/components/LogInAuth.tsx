import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useState } from 'react';

interface LogInAuthProps {
  onLogin: (email?: string) => void;
  onSignUp: () => void;
  onGoToLanding: () => void;
  isDark: boolean;
}

export default function LogInAuth({ onLogin, onSignUp, onGoToLanding, isDark }: LogInAuthProps) {
  const [email, setEmail] = useState("");
  const pageClass = isDark ? "bg-[#0A0A0A] text-white" : "bg-white text-black";
  const borderClass = isDark ? "border-white/10" : "border-black/10";
  const bgSecondaryClass = isDark ? "bg-white/5" : "bg-black/5";
  const textSecondaryClass = isDark ? "text-white/40" : "text-black/60";
  const textMutedClass = isDark ? "text-white/30" : "text-black/40";
  const inputClass = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:bg-white/[0.08]"
    : "bg-black/5 border-black/10 text-black placeholder:text-black/30 focus:bg-black/[0.08]";

  return (
    <div className={`min-h-screen ${pageClass} font-sans flex flex-col items-center justify-center px-6 selection:bg-indigo-500/30 relative`}>
      <motion.nav
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className={`absolute top-6 left-6 inline-flex items-center gap-2 rounded-lg border ${borderClass} ${bgSecondaryClass} px-4 py-2 text-sm font-semibold ${textSecondaryClass}`}
        aria-label="Breadcrumb"
      >
        <button onClick={onGoToLanding} className={isDark ? "hover:text-white" : "hover:text-black"}>
          Home
        </button>
        <span>/</span>
        <span className={isDark ? "text-white" : "text-black"}>Login</span>
      </motion.nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12 text-center"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* <Logo className="w-20 h-20 rounded-2xl" /> */}
          <div className="space-y-2">
            <button onClick={onGoToLanding} className="text-5xl font-bold tracking-tighter">
              Equalize
            </button>
            <p className="text-white/40 font-medium">Fair expense sharing for roommates</p>
          </div>
        </div>

        <form 
          className="space-y-4 text-left" 
          onSubmit={(e) => { e.preventDefault(); onLogin(email); }}
        >
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${textMutedClass} ml-1`}>Email Address</label>
            <div className="relative group">
              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/20 group-focus-within:text-indigo-500" : "text-black/20 group-focus-within:text-indigo-600"} transition-colors`} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className={`w-full border rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-medium ${inputClass}`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${textMutedClass} ml-1`}>Password</label>
            <div className="relative group">
              <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/20 group-focus-within:text-indigo-500" : "text-black/20 group-focus-within:text-indigo-600"} transition-colors`} />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className={`w-full border rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-medium ${inputClass}`}
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              className="w-full bg-indigo-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-400 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.2)] group"
            >
              Login to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              type="button"
              onClick={onSignUp}
              className={`w-full font-bold py-5 rounded-2xl transition-all border ${isDark ? "bg-white/5 text-white/60 border-white/5 hover:bg-white/10" : "bg-black/5 text-black/60 border-black/10 hover:bg-black/10"}`}
            >
              Create an account
            </button>
          </div>
        </form>

        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-white/20" : "text-black/20"}`}>
          SOEN 357 • Final Project Prototype
        </p>
      </motion.div>
    </div>
  );
}
