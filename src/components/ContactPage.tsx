import { motion } from "motion/react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import Header from "./Header";

interface ContactPageProps {
  onBack: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onNavigate?: (page: "landing" | "features" | "about" | "contact") => void;
  onLogin?: () => void;
  onSignUp?: () => void;
}

export default function ContactPage({
  onBack,
  isDark = true,
  onToggleTheme = () => {},
  onNavigate = () => {},
  onLogin = () => {},
  onSignUp = () => {},
}: ContactPageProps) {
  const bgClass = isDark ? "bg-[#0A0A0A]" : "bg-white";
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white/10" : "border-black/10";
  const bgSecondaryClass = isDark ? "bg-white/5" : "bg-black/5";
  const textSecondaryClass = isDark ? "text-white/70" : "text-black/60";
  const bgCardClass = isDark ? "bg-[#151515]" : "bg-white/40";
  const inputBgClass = isDark ? "bg-white/5" : "bg-black/5";
  const inputBorderClass = isDark ? "border-white/10" : "border-black/10";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend endpoint
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-indigo-500/30 flex flex-col`}>
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNavigate={onNavigate}
        onLogin={onLogin}
        onSignUp={onSignUp}
        currentPage="contact"
      />
      <div className="px-6 py-10 sm:py-16 flex-1">
        <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <h1 className={`mb-4 text-5xl font-bold tracking-tight sm:text-6xl`}>
            Contact Us
          </h1>
          <p className={`max-w-2xl text-base ${textSecondaryClass} sm:text-lg`}>
            Have questions? We'd love to hear from you. Get in touch and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-6"
          >
            <div className={`rounded-2xl border ${borderClass} ${bgCardClass} p-6`}>
              <div className={`mb-3 inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-400`}>
                <Mail className="h-6 w-6" />
              </div>
              <h3 className={`mb-1 text-lg font-bold`}>Email</h3>
              <p className={textSecondaryClass}>support@equalize.app</p>
            </div>

            <div className={`rounded-2xl border ${borderClass} ${bgCardClass} p-6`}>
              <div className={`mb-3 inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-400`}>
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className={`mb-1 text-lg font-bold`}>Message</h3>
              <p className={textSecondaryClass}>Use the form to send us a message</p>
            </div>

            <div className={`rounded-2xl border ${borderClass} ${bgCardClass} p-6`}>
              <div className={`mb-3 inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-400`}>
                <Phone className="h-6 w-6" />
              </div>
              <h3 className={`mb-1 text-lg font-bold`}>Response Time</h3>
              <p className={textSecondaryClass}>We typically respond within 24 hours</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            onSubmit={handleSubmit}
            className={`space-y-4 rounded-2xl border ${borderClass} ${bgCardClass} p-8`}
          >
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className={`w-full rounded-xl border ${inputBorderClass} ${inputBgClass} px-4 py-3 ${textClass} placeholder:${isDark ? 'text-white/20' : 'text-black/20'} focus:border-indigo-500 focus:outline-none transition-all`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={`w-full rounded-xl border ${inputBorderClass} ${inputBgClass} px-4 py-3 ${textClass} placeholder:${isDark ? 'text-white/20' : 'text-black/20'} focus:border-indigo-500 focus:outline-none transition-all`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
                className={`w-full rounded-xl border ${inputBorderClass} ${inputBgClass} px-4 py-3 ${textClass} placeholder:${isDark ? 'text-white/20' : 'text-black/20'} focus:border-indigo-500 focus:outline-none transition-all`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more..."
                rows={4}
                className={`w-full rounded-xl border ${inputBorderClass} ${inputBgClass} px-4 py-3 ${textClass} placeholder:${isDark ? 'text-white/20' : 'text-black/20'} focus:border-indigo-500 focus:outline-none transition-all resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-400"
            >
              Send Message
            </button>
          </motion.form>
        </div>
        </div>
      </div>
    </div>
  );
}
