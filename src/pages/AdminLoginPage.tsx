import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { adminLogin } from '@/lib/authService';
import { isFirebaseConfigured } from '@/lib/firebase';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-700">
        <ArrowLeft size={16} /> Back to home
      </Link>

      <div className="card p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
            <Lock size={22} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy-900">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to access the admin dashboard.</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <p className="flex items-center gap-1.5 font-semibold"><Info size={14} /> Firebase not configured</p>
            <p className="mt-1">Add your Firebase web config in <code className="rounded bg-amber-100 px-1">src/lib/firebase.ts</code> and enable Email/Password auth to sign in.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                className="input pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@campusfix.edu"
                required
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                className="input pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
