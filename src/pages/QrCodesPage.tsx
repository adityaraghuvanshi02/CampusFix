import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode as QrIcon, MapPin, Loader2, Info } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '@/lib/types';

function buildUrl(location: string): string {
  const base = window.location.origin + window.location.pathname.replace(/index\.html$/, '');
  const url = new URL(base);
  url.hash = '#/report';
  url.searchParams.set('location', location);
  return url.toString();
}

export function QrCodesPage() {
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      setError('');
      const next: Record<string, boolean> = {};
      for (const loc of CAMPUS_LOCATIONS) {
        try {
          const canvas = canvasRefs.current[loc];
          if (canvas) {
            await QRCode.toCanvas(canvas, buildUrl(loc), {
              width: 220,
              margin: 2,
              color: { dark: '#15274f', light: '#ffffff' },
              errorCorrectionLevel: 'M',
            });
            next[loc] = true;
          }
        } catch {
          setError('Could not generate one or more QR codes.');
        }
      }
      if (!cancelled) setReady(next);
    }
    generate();
    return () => {
      cancelled = true;
    };
  }, []);

  function download(loc: string) {
    const canvas = canvasRefs.current[loc];
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `campusfix-qr-${loc.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  }

  function downloadAll() {
    CAMPUS_LOCATIONS.filter((l) => ready[l]).forEach((l, i) =>
      setTimeout(() => download(l), i * 250),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Campus QR Codes</h1>
          <p className="mt-2 max-w-xl text-gray-600">
            Each campus location has a QR code. Students scan it to open the report form with
            the location pre-filled. Print and place these near the relevant locations.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 text-sm">
          <button
            onClick={() => setMode('student')}
            className={`rounded-md px-3 py-1.5 font-medium ${mode === 'student' ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500'}`}
          >
            Student view
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`rounded-md px-3 py-1.5 font-medium ${mode === 'admin' ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500'}`}
          >
            Admin view
          </button>
        </div>
      </div>

      {mode === 'admin' && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-navy-50 px-4 py-3 text-sm text-navy-700">
          <span className="flex items-center gap-2"><Info size={16} /> Admin tools: download individual QR codes or all at once.</span>
          <button onClick={downloadAll} className="btn btn-primary">
            <Download size={16} /> Download All
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CAMPUS_LOCATIONS.map((loc) => (
          <div key={loc} className="card overflow-hidden p-5 text-center">
            <div className="mb-3 flex items-center justify-center gap-2 text-navy-800">
              <MapPin size={18} className="text-navy-500" />
              <h3 className="font-semibold">{loc}</h3>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-4">
              {!ready[loc] && (
                <div className="flex h-[220px] w-[220px] items-center justify-center text-gray-400">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              )}
              <canvas
                ref={(el) => { canvasRefs.current[loc] = el; }}
                className={ready[loc] ? 'block' : 'hidden'}
              />
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Scans open the report form with this location pre-selected.
            </p>
            {mode === 'admin' && (
              <button
                onClick={() => download(loc)}
                disabled={!ready[loc]}
                className="btn btn-secondary mt-4 w-full"
              >
                <Download size={16} /> Download PNG
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 card p-6">
        <h3 className="flex items-center gap-2 font-semibold text-navy-900">
          <QrIcon size={18} className="text-navy-500" /> How to use
        </h3>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-gray-600">
          <li>Switch to Admin view and download the QR codes (individually or all at once).</li>
          <li>Print each QR code and place it near the matching campus location.</li>
          <li>Students scan with their phone camera — the report form opens with the location filled in.</li>
          <li>Students submit and receive a complaint ID to track progress.</li>
        </ol>
      </div>
    </div>
  );
}
