import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { api } from '../api';
import { authStore } from '../auth';

export default function UserDashboard(){
  const u = authStore.user;
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState('browse'); // 'browse' | 'mine'
  const [qBrowse, setQBrowse] = useState('');
  const [qMine, setQMine] = useState('');
  const [browse, setBrowse] = useState([]);  // approved only
  const [mine, setMine] = useState([]);      // my submissions (any status)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get('tab');
    setTab(t === 'mine' ? 'mine' : 'browse');
  }, [searchParams]);

  useEffect(() => { loadBrowse(); loadMine(); }, []); // initial

  const loadBrowse = async () => {
    setLoading(true);
    try { setBrowse(await api(`/api/companies?search=${encodeURIComponent(qBrowse)}`)); }
    finally { setLoading(false); }
  };
  const loadMine = async () => {
    setLoading(true);
    try { setMine(await api(`/api/companies/mine?search=${encodeURIComponent(qMine)}`)); }
    finally { setLoading(false); }
  };

  const pill = (s) =>
    s==='approved' ? 'pill bg-green-100 text-green-700' :
    s==='pending'  ? 'pill bg-yellow-100 text-yellow-700' :
    s==='rejected' ? 'pill bg-red-100 text-red-700' : 'pill';

  const roundsPreview = (c) => Array.isArray(c.rounds) ? c.rounds.slice(0,2) : [];

  const CompanyCard = ({ c, showStatus=false }) => {
    const last = Array.isArray(c.rounds) && c.rounds.length ? c.rounds[c.rounds.length - 1] : null;
    const lastLabel = (last?.result || 'pending');

    return (
      <li className="group relative">
        <div className="relative card-toned card-toned-hover p-6 md:p-7 min-h-[140px] cursor-pointer">
          <Link to={`/company/${c._id}`} aria-label={`Open ${c.name}`} className="absolute inset-0 z-10 rounded-2xl" />

          <div className="flex items-start justify-between">
            <div className="font-semibold text-[17px] text-slate-900">{c.name}</div>
            <div className="flex items-center gap-2">
              <span className="pill">{c.roundsCount} rounds</span>
              {showStatus && <span className={pill(c.status)}>{c.status}</span>}
            </div>
          </div>

          {/* Year • College meta */}
          <div className="mt-2 text-xs text-slate-500">
            {(c.year ? `${c.year}` : '')}{c.year && c.college ? ' • ' : ''}{c.college || ''}
          </div>

          <div className="mt-4">
            <span className={`pill ${
              lastLabel==='selected' ? 'bg-emerald-100 text-emerald-700' :
              lastLabel==='pass'     ? 'bg-green-100 text-green-700'   :
              lastLabel==='fail'     ? 'bg-red-100 text-red-700'       :
                                       'bg-yellow-100 text-yellow-700'
            }`}>
              {lastLabel === 'selected' ? 'Selected' : lastLabel}
            </span>
          </div>
        </div>

        {/* Hover preview above card */}
        <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition pointer-events-none pop-panel-top">
          <div className="pop-card">
            <div className="text-sm text-slate-500 mb-2">Round preview</div>
            {(!c.rounds || c.rounds.length===0) ? (
              <div className="text-slate-500 text-sm">No details yet.</div>
            ) : (
              <ul className="space-y-2">
                {roundsPreview(c).map((r, i) => (
                  <li key={i} className="grid md:grid-cols-12 gap-2 items-start">
                    <div className="md:col-span-3 font-medium text-slate-900">
                      {r?.title?.trim() || `Round ${i+1}`}
                    </div>
                    <div className="md:col-span-8 text-slate-600">
                      {(r.notes || '').slice(0,140) || '—'}{r.notes && r.notes.length>140 ? '…' : ''}
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <span className={pill(r.result || 'pending')}>{r.result || 'pending'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar/>

      <main className="container max-w-7xl px-4 py-8 space-y-8">
        {/* ✨ New copy */}
        <header className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Interview Experiences</h1>
          <p className="text-slate-600">
            Welcome {u?.name || ''}. Explore verified interview experiences from students and alumni, or track your own submissions.
          </p>
        </header>

        {/* Explore (approved) */}
        {tab==='browse' && (
          <section className="space-y-4">
            <div className="card p-4">
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Search approved interview experiences (e.g., TCS, SDE-1, 2024)"
                  value={qBrowse}
                  onChange={e=>setQBrowse(e.target.value)}
                />
                <button onClick={loadBrowse} className="btn-outline">Search</button>
              </div>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {browse.length === 0 && !loading && (
                <li className="col-span-full card p-6 text-center text-slate-500">
                  No approved experiences yet. Try another search or check back soon.
                </li>
              )}
              {browse.map(c => <CompanyCard key={c._id} c={c} showStatus={false} />)}
            </ul>
          </section>
        )}

        {/* My Submissions */}
        {tab==='mine' && (
          <section className="space-y-4">
            <div className="card p-4">
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Search your submissions (company, role, year…)"
                  value={qMine}
                  onChange={e=>setQMine(e.target.value)}
                />
                <button onClick={loadMine} className="btn-outline">Filter</button>
              </div>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mine.length === 0 && !loading && (
                <li className="col-span-full card p-6 text-center text-slate-500">
                  You haven’t shared an experience yet. Use <b>Add Experience</b> to post yours — admins review before it goes live.
                </li>
              )}
              {mine.map(c => <CompanyCard key={c._id} c={c} showStatus={true} />)}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
