import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Search,
  Loader2,
  AlertCircle,
  ClipboardList,
  Clock,
  Loader,
  CheckCircle2,
  MapPin,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { onAdminAuthChange, adminLogout } from '@/lib/authService';
import { fetchComplaints, updateComplaintStatus } from '@/lib/dataService';
import type { Complaint, ComplaintStatus } from '@/lib/types';
import { STATUSES } from '@/lib/types';
import {
  formatDate,
  timeAgo,
  statusColors,
  priorityColors,
} from '@/lib/format';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAdminAuthChange((user) => {
      setAuthorized(!!user);
      setAuthChecked(true);
      if (!user) navigate('/admin');
    });
    return unsub;
  }, [navigate]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch {
      setError('Could not load complaints.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) load();
  }, [authorized]);

  async function handleLogout() {
    await adminLogout();
    navigate('/admin');
  }

  async function changeStatus(id: string, status: ComplaintStatus) {
    setUpdatingId(id);
    try {
      await updateComplaintStatus(id, status);
      setComplaints((cs) =>
        cs.map((c) => (c.id === id ? { ...c, status } : c)),
      );
    } catch {
      setError('Could not update status.');
    } finally {
      setUpdatingId(null);
    }
  }

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const locationStats = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach((c) => {
      map[c.location] = (map[c.location] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [complaints]);

  const maxLoc = Math.max(1, ...locationStats.map((l) => l[1]));

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (locationFilter !== 'All' && c.location !== locationFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.studentName.toLowerCase().includes(q) ||
          c.studentEmail.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, statusFilter, locationFilter, search]);

  const recent = useMemo(
    () => [...complaints].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [complaints],
  );

  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  const statCards = [
    { label: 'Total', value: stats.total, icon: ClipboardList, color: 'bg-navy-800', textColor: 'text-white' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500', textColor: 'text-white' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader, color: 'bg-blue-500', textColor: 'text-white' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'bg-emerald-500', textColor: 'text-white' },
  ];

  const locations = Array.from(new Set(complaints.map((c) => c.location)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900">Admin Dashboard</p>
              <p className="text-xs text-gray-500">CampusFix Management</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="card flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color} ${s.textColor}`}>
                <s.icon size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold text-navy-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="flex items-center gap-2"><AlertCircle size={16} /> {error}</span>
            <button onClick={() => setError('')} className="text-xs underline">Dismiss</button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Location stats */}
          <div className="card p-6 lg:col-span-1">
            <h3 className="font-semibold text-navy-900">Location-wise Complaints</h3>
            {locationStats.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No data yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {locationStats.map(([loc, count]) => (
                  <div key={loc}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-navy-800">
                        <MapPin size={14} className="text-navy-400" /> {loc}
                      </span>
                      <span className="font-semibold text-navy-900">{count}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-navy-600 transition-all duration-500"
                        style={{ width: `${(count / maxLoc) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent complaints */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="font-semibold text-navy-900">Recent Complaints</h3>
            {recent.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No complaints yet.</p>
            ) : (
              <div className="mt-4 divide-y divide-gray-100">
                {recent.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-navy-900">{c.id}</span>
                        {c.isDemo && (
                          <span className="badge bg-gray-100 text-gray-500">Demo</span>
                        )}
                      </div>
                      <p className="truncate text-xs text-gray-500">
                        {c.category} · {c.location} · {timeAgo(c.createdAt)}
                      </p>
                    </div>
                    <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters + table */}
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-navy-900">All Complaints</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input w-full py-2 pl-9 text-sm sm:w-56"
                  placeholder="Search ID, name, issue…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="input w-full py-2 text-sm sm:w-40"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'All')}
              >
                <option value="All">All status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="input w-full py-2 text-sm sm:w-44"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="All">All locations</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button onClick={load} className="btn btn-secondary py-2" title="Refresh">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-500">
              No complaints match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Location</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Category</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Date</th>
                    <th className="px-4 py-3 font-medium">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-navy-900">{c.id}</span>
                        {c.isDemo && (
                          <span className="ml-1 badge bg-gray-100 text-gray-500">Demo</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy-900">{c.studentName}</p>
                        <p className="text-xs text-gray-500">{c.studentEmail}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-navy-800 md:table-cell">{c.location}</td>
                      <td className="hidden px-4 py-3 text-navy-800 lg:table-cell">{c.category}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${priorityColors[c.priority]}`}>{c.priority}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusColors[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-gray-500 lg:table-cell">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          <select
                            disabled={updatingId === c.id}
                            value={c.status}
                            onChange={(e) => changeStatus(c.id, e.target.value as ComplaintStatus)}
                            className={`appearance-none rounded-lg border-0 px-2.5 py-1.5 pr-7 text-xs font-medium ${statusColors[c.status]} disabled:opacity-50`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-60" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
