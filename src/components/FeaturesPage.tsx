import { motion } from "motion/react";
import { CheckCircle2, BarChart3, FileText, Send } from "lucide-react";
import Header from "./Header";

interface FeaturesPageProps {
  onBack: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onNavigate?: (page: "landing" | "features" | "about" | "contact") => void;
  onLogin?: () => void;
  onSignUp?: () => void;
}

const features = [
  {
    icon: BarChart3,
    title: "Expense Tracking",
    description: "Log shared expenses in categories like groceries, utilities, and rent. Automatically organize and track who paid for what.",
  },
  {
    icon: FileText,
    title: "Fair Contribution Analysis",
    description: "View detailed breakdowns of who has contributed what percentage of total costs. Identify imbalances and fairness gaps.",
  },
  {
    icon: CheckCircle2,
    title: "Settlement Requests",
    description: "Send clean payment requests to roommates with custom messages. Track who owes whom at a glance.",
  },
  {
    icon: Send,
    title: "Payment History",
    description: "Keep a complete record of all payments and settlements. Review transaction history anytime.",
  },
];

export default function FeaturesPage({
  onBack,
  isDark = true,
  onToggleTheme = () => {},
  onNavigate = () => {},
  onLogin = () => {},
  onSignUp = () => {},
}: FeaturesPageProps) {
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
        currentPage="features"
      />
      <div className="px-6 py-10 sm:py-16 flex-1">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <h1 className={`mb-4 text-5xl font-bold tracking-tight sm:text-6xl`}>
              Features
            </h1>
            <p className={`max-w-2xl text-base ${textSecondaryClass} sm:text-lg`}>
              Everything you need to manage shared expenses seamlessly and fairly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className={`flex gap-4 rounded-2xl border ${borderClass} ${bgCardClass} p-6`}
                >
                  <div className="shrink-0">
                    <div className={`inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-400`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-1 text-lg font-bold tracking-tight`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${textSecondaryClass}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
