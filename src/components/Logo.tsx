import { Equal } from 'lucide-react';
import { cn } from '../lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20", className)}>
    <Equal className="text-white w-2/3 h-2/3 stroke-[3]" />
  </div>
);
