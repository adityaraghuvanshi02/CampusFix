import { ShieldCheck } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white">
        <ShieldCheck size={20} strokeWidth={2.2} />
      </div>
      <div className="leading-tight">
        <span className="block text-lg font-bold tracking-tight text-navy-900">
          Campus<span className="text-navy-500">Fix</span>
        </span>
      </div>
    </div>
  );
}
