import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Mail } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-700">
                <ShieldCheck size={20} />
              </div>
              <span className="text-lg font-bold">CampusFix</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-gray-400">
              A smart campus issue reporting system that lets students report and track
              facility problems while giving administrators real-time visibility.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              B.Tech CSE Mini Project
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/report" className="hover:text-white">Report Issue</Link></li>
              <li><Link to="/track" className="hover:text-white">Track Complaint</Link></li>
              <li><Link to="/qr-codes" className="hover:text-white">QR Codes</Link></li>
              <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Project</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Github size={14} /> React + Vite</li>
              <li className="flex items-center gap-2"><Mail size={14} /> Firebase + Firestore</li>
              <li>QR Code System</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CampusFix. Built for academic demonstration.
        </div>
      </div>
    </footer>
  );
}
