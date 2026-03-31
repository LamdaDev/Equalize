import { Equal } from 'lucide-react';
import { cn } from '../lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20", className)}>
    <Equal className="text-black w-2/3 h-2/3 stroke-[3]" />
  </div>
);
