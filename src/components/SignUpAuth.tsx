import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

interface SignUpAuthProps {
  onSignUpSuccess: (name: string, email: string) => void;
  onBackToLogin: () => void;
}

export default function SignUpAuth({ onSignUpSuccess, onBackToLogin }: SignUpAuthProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate account creation
    setIsSuccess(true);
    setTimeout(() => {
      onSignUpSuccess(name || "New User", email || "new@user.com");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col items-center justify-center px-6 selection:bg-indigo-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            key="signup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm space-y-12 text-center"
          >
            <div className="flex flex-col items-center space-y-6">
              {/* <Logo className="w-20 h-20 rounded-2xl" /> */}
              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-tighter">Join Equalize</h1>
                <p className="text-white/40 font-medium">Start sharing expenses fairly today</p>
              </div>
            </div>

            <form 
              className="space-y-4 text-left" 
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] transition-all font-medium placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full bg-white/5 text-white/60 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                >
                  Already have an account? Login
                </button>
              </div>
            </form>

            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
              SOEN 357 • Final Project Prototype
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="success-message"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)]"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-indigo-500 rounded-full -z-10"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tighter">Welcome to Equalize</h2>
              <p className="text-xl text-white/60 font-medium max-w-xs mx-auto">
                Your account has been successfully created.
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-3 text-indigo-500/60 font-bold text-xs uppercase tracking-widest">
                <span className="w-8 h-[1px] bg-indigo-500/20" />
                Redirecting to Login
                <span className="w-8 h-[1px] bg-indigo-500/20" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
