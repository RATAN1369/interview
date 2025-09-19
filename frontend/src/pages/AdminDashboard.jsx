import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { api } from '../api';

export default function AdminDashboard() {
  const [tab, setTab] = useState('pending'); // 'pending' | 'all'
  const [q, setQ] = useState('');
  const [pending, setPending] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const toast = (t) => { setMsg(t); setTimeout(() => setMsg(''), 1400); };
  const fail = (e) => { setErr(e.message || 'Something went wrong'); setTimeout(() => setErr(''), 1800); };

  async function loadPending() {
    setLoading(true);
    try { setPending(await api(`/api/companies/pending?search=${encodeURIComponent(q)}`)); }
    catch (e) { fail(e); }
    finally { setLoading(false); }
  }
  async function loadAll() {
    setLoading(true);
    try { setAll(await api(`/api/companies?search=${encodeURIComponent(q)}`)); }
    catch (e) { fail(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { tab === 'pending' ? loadPending() : loadAll(); /* eslint-disable-next-line */ }, [tab]);
  const onSearch = () => (tab === 'pending' ? loadPending() : loadAll());

  async function approve(id) {
    if (!confirm('Approve this submission?')) return;
    try {
      await api(`/api/companies/${id}/approve`, { method: 'PATCH' });
      setPending(p => p.filter(x => x._id !== id));
      setAll(a => a.map(x => x._id===id ? {...x, status:'approved'} : x));
      toast('✅ Approved');
    } catch (e) { fail(e); }
  }
  async function reject(id) {
    const reason = window.prompt('Reason for rejection? (optional)') ?? '';
    try {
      await api(`/api/companies/${id}/reject`, { method: 'PATCH', body: { reason } });
      setPending(p => p.filter(x => x._id !== id));
      setAll(a => a.map(x => x._id===id ? {...x, status:'rejected', rejectionReason:reason} : x));
      toast('❌ Rejected');
    } catch (e) { fail(e); }
  }
  async function remove(id) {
    if (!confirm('Delete permanently?')) return;
    try {
      await api(`/api/companies/${id}`, { method: 'DELETE' });
      setAll(a => a.filter(x => x._id !== id));
      setPending(p => p.filter(x => x._id !== id));
      toast('🗑️ Deleted');
    } catch (e) { fail(e); }
  }

  const pill = (s) =>
    s==='approved' ? 'pill bg-green-100 text-green-700' :
    s==='pending'  ? 'pill bg-yellow-100 text-yellow-700' :
    s==='rejected' ? 'pill bg-red-100 text-red-700' : 'pill';

  const SegTabs = (
    <div className="bg-slate-100 p-1 rounded-2xl inline-flex">
      <button className={`px-4 py-2 rounded-xl transition ${tab==='pending'?'bg-white shadow font-medium':'text-slate-600 hover:text-slate-900'}`} onClick={()=>setTab('pending')}>
        Pending {pending.length ? `(${pending.length})` : ''}
      </button>
      <button className={`px-4 py-2 rounded-xl transition ${tab==='all'?'bg-white shadow font-medium':'text-slate-600 hover:text-slate-900'}`} onClick={()=>setTab('all')}>
        All
      </button>
    </div>
  );

  const SearchBar = (
    <div className="card p-4">
      <div className="flex gap-2">
        <input className="input" placeholder={tab==='pending' ? 'Search pending…' : 'Search all companies…'} value={q} onChange={e => setQ(e.target.value)} />
        <button onClick={onSearch} className="btn-outline">Search</button>
      </div>
      {(msg || err) && <div className="mt-3 text-sm">
        {msg && <span className="text-green-600">{msg}</span>}{' '}
        {err && <span className="text-red-600">{err}</span>}
      </div>}
    </div>
  );

  const Card = ({ c, showModeration }) => (
    <li className="card p-4 hover:shadow-soft transition">
      <div className="flex items-start justify-between">
        <Link to={`/company/${c._id}`} className="font-semibold text-slate-900 hover:underline">{c.name}</Link>
        <div className="flex items-center gap-2">
          <span className="pill">{c.roundsCount} rounds</span>
          <span className={pill(c.status)}>{c.status}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to={`/company/${c._id}`} className="btn-outline">Open</Link>
        {/* moderation buttons */}
        {showModeration && (
          <>
            <button onClick={()=>approve(c._id)} className="btn-primary">Approve</button>
            <button onClick={()=>reject(c._id)} className="btn-outline">Reject</button>
          </>
        )}
        {/* destructive always available to admin */}
        <button onClick={()=>remove(c._id)} className="btn-outline">Delete</button>
      </div>
    </li>
  );

  return (
    <div className="min-h-screen">
      <Navbar/>
      <main className="container max-w-7xl px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin</h1>
            <p className="text-slate-600">Approve or reject user submissions.</p>
          </div>
          {SegTabs}
        </header>

        {SearchBar}

        {tab==='pending' ? (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pending.map(c => <Card key={c._id} c={c} showModeration={true} />)}
            {pending.length === 0 && !loading && (
              <li className="col-span-full card p-6 text-center text-slate-500">No pending submissions.</li>
            )}
          </ul>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {all.map(c => <Card key={c._id} c={c} showModeration={c.status==='pending'} />)}
            {all.length === 0 && !loading && (
              <li className="col-span-full card p-6 text-center text-slate-500">Nothing here.</li>
            )}
          </ul>
        )}
      </main>
    </div>
  );
}
