import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  CheckCircle2,
  Copy,
  QrCode,
  AlertCircle,
  Loader2,
  MapPin,
} from 'lucide-react';
import { createComplaint } from '@/lib/dataService';
import {
  CATEGORIES,
  CAMPUS_LOCATIONS,
  PRIORITIES,
  type IssueCategory,
  type Priority,
} from '@/lib/types';

interface FormState {
  studentName: string;
  studentEmail: string;
  location: string;
  category: IssueCategory | '';
  priority: Priority;
  description: string;
}

const initialForm: FormState = {
  studentName: '',
  studentEmail: '',
  location: '',
  category: '',
  priority: 'Medium',
  description: '',
};

export function ReportPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loc = searchParams.get('location');
    if (loc) {
      setForm((f) => ({ ...f, location: loc }));
    }
  }, [searchParams]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.studentName.trim()) e.studentName = 'Please enter your name.';
    if (!form.studentEmail.trim()) e.studentEmail = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.studentEmail))
      e.studentEmail = 'Enter a valid email address.';
    if (!form.location) e.location = 'Select a campus location.';
    if (!form.category) e.category = 'Choose an issue category.';
    if (!form.description.trim()) e.description = 'Describe the issue.';
    else if (form.description.trim().length < 10)
      e.description = 'Description must be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const complaint = await createComplaint({
        studentName: form.studentName.trim(),
        studentEmail: form.studentEmail.trim(),
        location: form.location,
        category: form.category as IssueCategory,
        priority: form.priority,
        description: form.description.trim(),
      });
      setSuccess({ id: complaint.id });
      setForm(initialForm);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not submit. Please try again.';
      setErrors({ description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function copyId() {
    if (!success) return;
    navigator.clipboard.writeText(success.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-navy-900">Complaint Submitted!</h2>
          <p className="mt-2 text-gray-600">
            Your issue has been recorded. Save your complaint ID to track its status.
          </p>
          <div className="mt-6 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-navy-500">
              Your Complaint ID
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-3xl font-bold tracking-wider text-navy-900">
                {success.id}
              </span>
              <button
                onClick={copyId}
                className="rounded-lg p-2 text-navy-600 hover:bg-navy-100"
                title="Copy"
              >
                <Copy size={18} />
              </button>
            </div>
            {copied && <p className="mt-1 text-xs text-emerald-600">Copied to clipboard!</p>}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to={`/track?id=${success.id}`} className="btn btn-primary">
              Track this Complaint
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => setSuccess(null)}
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prefillLocation = searchParams.get('location');

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy-900">Report an Issue</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below. You will receive a unique complaint ID after submission.
        </p>
        {prefillLocation && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2 text-sm text-navy-700">
            <MapPin size={16} /> Location pre-filled from QR code: <strong>{prefillLocation}</strong>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Student Name</label>
            <input
              id="name"
              className={`input ${errors.studentName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
              value={form.studentName}
              onChange={(e) => update('studentName', e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
            {errors.studentName && <FieldError msg={errors.studentName} />}
          </div>
          <div>
            <label className="label" htmlFor="email">Student Email</label>
            <input
              id="email"
              type="email"
              className={`input ${errors.studentEmail ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
              value={form.studentEmail}
              onChange={(e) => update('studentEmail', e.target.value)}
              placeholder="e.g. aarav.s@college.edu"
            />
            {errors.studentEmail && <FieldError msg={errors.studentEmail} />}
          </div>
        </div>

        <div>
          <label className="label">Campus Location</label>
          <select
            className={`input ${errors.location ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          >
            <option value="">Select a location</option>
            {CAMPUS_LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {errors.location && <FieldError msg={errors.location} />}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Issue Category</label>
            <select
              className={`input ${errors.category ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
              value={form.category}
              onChange={(e) => update('category', e.target.value as IssueCategory)}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <FieldError msg={errors.category} />}
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update('priority', p)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    form.priority === p
                      ? p === 'High'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : p === 'Medium'
                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                        : 'border-gray-300 bg-gray-100 text-gray-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="desc">Issue Description</label>
          <textarea
            id="desc"
            rows={4}
            className={`input resize-none ${errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe the problem in detail (e.g. 'Ceiling fan not working since morning...')"
          />
          {errors.description && <FieldError msg={errors.description} />}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3">
          {submitting ? (
            <><Loader2 size={18} className="animate-spin" /> Submitting…</>
          ) : (
            <><Send size={18} /> Submit Complaint</>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
          <QrCode size={13} /> Tip: scan a location QR code to auto-fill the location.
        </p>
      </form>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
      <AlertCircle size={13} /> {msg}
    </p>
  );
}
