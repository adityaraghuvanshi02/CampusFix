import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Logo } from './Logo';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Report Issue', to: '/report' },
  { label: 'Track Complaint', to: '/track' },
  { label: 'QR Codes', to: '/qr-codes' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled ? 'bg-white/90 backdrop-blur shadow-sm border-b border-gray-100' : 'bg-white/70 backdrop-blur'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? 'bg-navy-50 text-navy-800'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-navy-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => navigate('/admin')}
            className="btn btn-primary ml-2"
          >
            <LayoutDashboard size={16} />
            Admin
          </button>
        </div>

        <button
          className="rounded-lg p-2 text-navy-800 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                  location.pathname === l.to
                    ? 'bg-navy-50 text-navy-800'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/admin" className="btn btn-primary w-full">
              <LayoutDashboard size={16} />
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
