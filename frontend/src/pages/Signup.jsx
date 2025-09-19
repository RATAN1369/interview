import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../api';
import { authStore } from '../auth';

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState('Aman');
  const [email, setEmail] = useState('aman@example.com');
  const [password, setPassword] = useState('password123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ By default: signup -> auto login -> go to dashboard/admin
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      // 1) create account
      await api('/api/auth/signup', {
        method: 'POST',
        auth: false,
        body: { name, email, password }
      });

      // 2) immediately login
      const { token, user, redirect } = await api('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password }
      });

      setToken(token);
      authStore.setUser(user);
      nav(redirect || (user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (ex) {
      setErr(ex.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow p-8 grid gap-3">
        <h1 className="text-2xl font-bold">Create account</h1>
        <input className="border rounded-xl p-3" placeholder="Full name"
               value={name} onChange={e=>setName(e.target.value)} required />
        <input className="border rounded-xl p-3" placeholder="Email"
               type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="border rounded-xl p-3" placeholder="Password"
               type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button disabled={loading} className="rounded-xl bg-black text-white py-3">
          {loading ? 'Please wait…' : 'Sign up'}
        </button>
        <div className="text-sm text-gray-600">
          Already have an account? <Link to="/login" className="underline">Log in</Link>
        </div>
      </form>
    </div>
  );
}
