import { Link } from 'react-router-dom';
import {
  Zap,
  Wrench,
  Wifi,
  Sparkles,
  Sofa,
  Droplets,
  QrCode,
  Search,
  BarChart3,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/types';

const categoryIcons: Record<string, typeof Zap> = {
  Electricity: Zap,
  Plumbing: Droplets,
  Furniture: Sofa,
  Cleanliness: Sparkles,
  Internet: Wifi,
  Other: Wrench,
};

const features = [
  {
    icon: QrCode,
    title: 'QR Code Reporting',
    desc: 'Each campus location has a unique QR code. Students scan and report instantly — no login required.',
  },
  {
    icon: Search,
    title: 'Real-time Tracking',
    desc: 'Every complaint gets a unique ID. Students track status from submission to resolution.',
  },
  {
    icon: BarChart3,
    title: 'Admin Dashboard',
    desc: 'Administrators see live statistics, filter by status or location, and update progress instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Authenticated',
    desc: 'Admin access is protected by Firebase Authentication. Firestore rules keep data safe.',
  },
  {
    icon: Clock,
    title: 'Fast Response',
    desc: 'Priority levels help maintenance teams address critical issues like power or internet first.',
  },
  {
    icon: CheckCircle2,
    title: 'Full Lifecycle',
    desc: 'From Pending to In Progress to Resolved — complete visibility into every issue.',
  },
];

const steps = [
  { n: '01', title: 'Scan or Open', desc: 'Scan a location QR code or click "Report an Issue" to open the form.' },
  { n: '02', title: 'Submit Details', desc: 'Fill in your name, the issue category, priority and a short description.' },
  { n: '03', title: 'Get Complaint ID', desc: 'Receive a unique complaint ID you can use to track progress anytime.' },
  { n: '04', title: 'Admin Acts', desc: 'Admins review, prioritise and update the status until it is resolved.' },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-navy-100/60 blur-3xl" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="badge bg-navy-100 text-navy-700">
              <Sparkles size={13} /> Smart Campus Issue Reporting
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              Report campus issues. <br />
              <span className="text-navy-500">Track them to resolution.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-gray-600">
              CampusFix lets students report facility problems — from broken fans to Wi-Fi
              outages — in seconds using QR codes, and gives administrators a live dashboard
              to manage everything.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/report" className="btn btn-primary text-base px-6 py-3">
                Report an Issue <ArrowRight size={18} />
              </Link>
              <Link to="/track" className="btn btn-secondary text-base px-6 py-3">
                Track a Complaint
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> No login for students</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> QR-based reporting</span>
            </div>
          </div>

          <div className="relative">
            <div className="card overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy-900">Live Preview</h3>
                <span className="badge bg-navy-100 text-navy-700">Preview</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {CATEGORIES.slice(0, 4).map((cat) => {
                  const Icon = categoryIcons[cat] ?? Wrench;
                  return (
                    <div key={cat} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <Icon size={18} className="text-navy-600" />
                      <p className="mt-2 text-sm font-medium text-navy-800">{cat}</p>
                      <p className="text-xs text-gray-500">Tap to report</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-xs">
                  <span>CF-AB12CD · Classroom 204</span>
                  <span className="badge bg-amber-100 text-amber-700">Pending</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-xs">
                  <span>CF-EF34GH · Computer Lab</span>
                  <span className="badge bg-blue-100 text-blue-700">In Progress</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs">
                  <span>CF-IJ56KL · Library</span>
                  <span className="badge bg-emerald-100 text-emerald-700">Resolved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
            Issue Categories
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat] ?? Wrench;
              return (
                <div key={cat} className="card flex flex-col items-center p-4 text-center transition-shadow hover:shadow-card-hover">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50">
                    <Icon size={20} className="text-navy-600" />
                  </div>
                  <span className="mt-2 text-sm font-medium text-navy-800">{cat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Everything a smart campus needs
            </h2>
            <p className="mt-4 text-gray-600">
              From the moment a student scans a QR code to the moment an issue is resolved,
              CampusFix keeps everyone in the loop.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6 transition-shadow hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-gray-400">Four simple steps from problem to resolution.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-navy-800 bg-navy-900/50 p-6">
                <span className="text-3xl font-bold text-navy-500">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="card overflow-hidden p-10 text-center sm:p-14">
            <h2 className="text-3xl font-bold text-navy-900">Spotted a campus issue?</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Report it in under a minute. You will get a tracking ID to follow it until it is fixed.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/report" className="btn btn-primary text-base px-6 py-3">
                Report an Issue <ArrowRight size={18} />
              </Link>
              <Link to="/qr-codes" className="btn btn-secondary text-base px-6 py-3">
                View QR Codes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
