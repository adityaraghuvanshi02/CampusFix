import { Info } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';

export function DemoBanner() {
  if (isFirebaseConfigured) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs sm:text-sm sm:px-6">
        <Info size={16} className="shrink-0" />
        <span>
          <strong>Firebase not configured.</strong> Add your web config in{' '}
          <code className="rounded bg-amber-100 px-1">src/lib/firebase.ts</code> to enable live
          complaint storage, admin login, and tracking. See the README.
        </span>
      </div>
    </div>
  );
}
