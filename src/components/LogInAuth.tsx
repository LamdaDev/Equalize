import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface LogInAuthProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LogInAuth({ onLogin, onSignUp }: LogInAuthProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col items-center justify-center px-6 selection:bg-indigo-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12 text-center"
      >
        <div className="flex flex-col items-center space-y-6">
          <Logo className="w-20 h-20 rounded-2xl" />
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter">Equalize</h1>
            <p className="text-white/40 font-medium">Fair expense sharing for roommates</p>
          </div>
        </div>

        <form 
          className="space-y-4 text-left" 
          onSubmit={(e) => { e.preventDefault(); onLogin(); }}
        >
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="email" 
                placeholder="name@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all font-medium placeholder:text-white/10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all font-medium placeholder:text-white/10"
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
              className="w-full bg-white/5 text-white/60 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
            >
              Create an account
            </button>
          </div>
        </form>

        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
          SOEN 357 • Final Project Prototype
        </p>
      </motion.div>
    </div>
  );
}
