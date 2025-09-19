import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { api } from '../api';

export default function AddExperience(){
  const nav = useNavigate();

  const thisYear = new Date().getFullYear();
  const years = Array.from({length: 12}, (_,i)=> thisYear + 1 - i); // next year to -10

  const [name,setName]=useState('');
  const [college,setCollege]=useState('');
  const [year,setYear]=useState('');
  const [rounds,setRounds]=useState([{ title:'Round 1', notes:'', result:'pending' }]);
  const [msg,setMsg]=useState('');

  const updateRound = (i, f, v)=> setRounds(r => r.map((x,idx)=> idx===i?{...x,[f]:v}:x));
  const removeRound = (i)=> setRounds(r => r.filter((_,idx)=> idx!==i));
  const addRound = ()=> setRounds(r => [...r, { title:`Round ${r.length+1}`, notes:'', result:'pending' }]);

  const submit = async (e)=>{ 
    e.preventDefault(); setMsg('');
    await api('/api/companies',{ method:'POST', body:{ name, college, year, rounds }});
    setMsg('✅ Submitted for approval');
    setTimeout(()=> nav('/dashboard?tab=mine', { replace:true }), 700);
  };

  return (
    <div className="min-h-screen">
      <Navbar/>
      <main className="container max-w-4xl px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Add Company Experience</h1>
          <p className="text-slate-600">Fill details and submit for admin approval.</p>
        </header>

        <section className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            <input className="input h-12" placeholder="Company name" value={name} onChange={e=>setName(e.target.value)} required />

            {/* NEW: college + year */}
            <div className="grid md:grid-cols-3 gap-3">
              <input className="input" placeholder="College name (e.g., IIT Delhi)" value={college} onChange={e=>setCollege(e.target.value)} />
              <select className="input" value={year} onChange={e=>setYear(e.target.value)}>
                <option value="">Year of interview (optional)</option>
                {years.map(y=> <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              {rounds.map((r,i)=>(
                <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{r.title?.trim() || `Round ${i+1}`}</div>
                    {rounds.length>1 && (
                      <button type="button" onClick={()=>removeRound(i)} className="text-xs text-red-600 hover:underline">Remove</button>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3">
                    <input className="input" placeholder="Round title (e.g., Aptitude / Technical / HR)" value={r.title} onChange={e=>updateRound(i,'title',e.target.value)} />
                    <textarea className="input min-h-[200px]" placeholder="Notes (questions, difficulty, tips, etc.)" value={r.notes} onChange={e=>updateRound(i,'notes',e.target.value)} />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Status</span>
                        <select className="input w-44" value={r.result} onChange={e=>updateRound(i,'result',e.target.value)}>
                          <option>pending</option><option>pass</option><option>fail</option><option>selected</option>
                        </select>
                      </div>
                      <span className="text-xs text-slate-500">#{i+1}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn-outline" onClick={addRound}>+ Add Round</button>
            </div>

            {msg && <div className="text-sm text-green-600">{msg}</div>}
            <div className="flex justify-end">
              <button className="btn-primary">Submit for approval</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
