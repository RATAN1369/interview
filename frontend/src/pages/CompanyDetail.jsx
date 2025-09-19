// src/pages/CompanyDetail.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { api } from '../api';

export default function CompanyDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setC(await api(`/api/companies/${id}`)); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const total = c?.rounds?.length || 0;
  const last = total ? c.rounds[total - 1] : null;
  const finalLabel = (last?.result || 'pending');

  const finalPill = useMemo(() => {
    const base = 'pill';
    if (finalLabel === 'selected') return `${base} bg-emerald-100 text-emerald-700`;
    if (finalLabel === 'pass')     return `${base} bg-green-100 text-green-700`;
    if (finalLabel === 'fail')     return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  }, [finalLabel]);

  const pill = (s) =>
    s==='pass'     ? 'pill bg-green-100 text-green-700' :
    s==='selected' ? 'pill bg-emerald-100 text-emerald-700' :
    s==='fail'     ? 'pill bg-red-100 text-red-700' :
                     'pill bg-yellow-100 text-yellow-700';

  // URLs → clickable
  const linkify = (txt='') =>
    txt.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      /^https?:\/\//.test(part)
        ? <a key={i} href={part} target="_blank" rel="noreferrer" className="underline text-brand-600 break-words">{part}</a>
        : <span key={i}>{part}</span>
    );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="section">
          <div className="card p-6">Loading…</div>
        </main>
      </div>
    );
  }
  if (!c) {
    return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="section">
          <div className="card p-6">Not found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar/>
      <main className="container max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{c.name}</h1>

            {/* NEW: pills row with year & college */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-slate-600">
              <span className="pill">{total} total rounds</span>
              {c.year && <span className="pill">Year: {c.year}</span>}
              {c.college && <span className="pill">College: {c.college}</span>}
              <span className={finalPill}>
                {finalLabel === 'selected' ? 'Final: Selected' : `Final: ${finalLabel}`}
              </span>
              {c.status !== 'approved' && <span className="pill bg-yellow-100 text-yellow-700">{c.status}</span>}
            </div>
          </div>
          <button onClick={() => nav(-1)} className="btn-outline whitespace-nowrap">← Back</button>
        </div>

        {/* Quick jump */}
        {total > 1 && (
          <div className="card p-4">
            <div className="text-sm text-slate-600 mb-2">Jump to round</div>
            <div className="flex flex-wrap gap-2">
              {c.rounds.map((_, i) => (
                <a key={i} href={`#round-${i+1}`} className="pill hover:bg-slate-200">#{i+1}</a>
              ))}
            </div>
          </div>
        )}

        {/* Rounds timeline */}
        <section className="card-toned p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Rounds</h2>

          <ul className="mt-6">
            {c.rounds?.map((r, i) => {
              const total = c.rounds.length;
              const isLast = i === total - 1;
              const titleText = (r?.title && r.title.trim()) || `Round ${i+1}`;

              return (
                <li key={i} id={`round-${i+1}`} className="relative pl-8">
                  {/* timeline rail & dot */}
                  {!isLast && <span className="absolute left-3 top-6 bottom-0 w-px bg-slate-200" />}
                  <span className="absolute left-1.5 top-4 h-4 w-4 rounded-full bg-brand-500 ring-4 ring-white shadow" />

                  <div className="grid md:grid-cols-12 gap-6 items-start pt-4">
                    {/* Title & index */}
                    <div className="md:col-span-4">
                      <div className="text-slate-900 font-semibold">{titleText}</div>
                      <div className="text-xs text-slate-500 mt-1">#{i+1}</div>
                    </div>

                    {/* Notes & status */}
                    <div className="md:col-span-8">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[15px] leading-7 text-slate-700 whitespace-pre-line break-words">
                          {r?.notes ? linkify(r.notes) : '—'}
                        </div>
                        <span className={pill(r?.result || 'pending')}>{r?.result || 'pending'}</span>
                      </div>
                    </div>
                  </div>

                  {/* divider between rounds */}
                  {!isLast && <div className="ml-8 mt-8 border-t border-slate-200/70" />}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
