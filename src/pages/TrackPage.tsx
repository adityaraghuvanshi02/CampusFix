import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Loader2,
  AlertCircle,
  User,
  Mail,
  MapPin,
  Tag,
  Flag,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { getComplaintById } from '@/lib/dataService';
import type { Complaint } from '@/lib/types';
import { formatDate, statusColors, priorityColors, timeAgo } from '@/lib/format';
import { Link } from 'react-router-dom';

export function TrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState(searchParams.get('id') ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function doSearch(searchId: string) {
    if (!searchId.trim()) {
      setError('Please enter a complaint ID.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSearched(true);
    try {
      const found = await getComplaintById(searchId);
      if (found) {
        setResult(found);
      } else {
        setError('No complaint found with that ID. Check and try again.');
      }
    } catch {
      setError('Something went wrong while searching. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get('id');
    if (q) {
      setId(q);
      doSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams(id ? { id } : {});
    doSearch(id);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-navy-900">Track a Complaint</h1>
        <p className="mt-2 text-gray-600">
          Enter the complaint ID you received to see its current status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="e.g. CF-AB12CD or CF-DEMO1"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          Track
        </button>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
          <Loader2 size={20} className="animate-spin" /> Searching…
        </div>
      )}

      {result && <ComplaintDetail complaint={result} />}

      {searched && !result && !loading && !error && (
        <div className="mt-6 text-center text-gray-500">No complaint found.</div>
      )}

      {!searched && !loading && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Enter the complaint ID you received after submitting a report.
        </div>
      )}
    </div>
  );
}

function ComplaintDetail({ complaint }: { complaint: Complaint }) {
  const rows = [
    { icon: User, label: 'Student Name', value: complaint.studentName },
    { icon: Mail, label: 'Email', value: complaint.studentEmail },
    { icon: MapPin, label: 'Location', value: complaint.location },
    { icon: Tag, label: 'Category', value: complaint.category },
    { icon: Flag, label: 'Priority', value: complaint.priority },
  ];

  return (
    <div className="card mt-6 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Complaint ID</p>
          <p className="text-xl font-bold tracking-wider text-navy-900">{complaint.id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
          <span className={`badge mt-1 ${statusColors[complaint.status]}`}>{complaint.status}</span>
        </div>
      </div>

      <div className="space-y-4 px-6 py-6">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
              <r.icon size={16} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{r.label}</p>
              <p className="text-sm text-navy-900">
                {r.value}
                {r.label === 'Priority' && (
                  <span className={`badge ml-2 ${priorityColors[complaint.priority]}`}>{complaint.priority}</span>
                )}
              </p>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
            <FileText size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</p>
            <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-navy-900">{complaint.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <Clock size={14} /> Submitted {formatDate(complaint.createdAt)} · {timeAgo(complaint.createdAt)}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-navy-50 px-6 py-3 text-center text-xs text-navy-600">
        {complaint.isDemo ? 'Sample demo record' : 'Real submission'}
        <Link to="/report" className="ml-2 inline-flex items-center gap-1 font-medium text-navy-700 hover:underline">
          Report a new issue <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
