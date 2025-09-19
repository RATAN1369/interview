import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../api';
import { authStore } from '../auth';
import { Eye, EyeOff } from 'lucide-react'; // 👈 import icons

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState('Aman');
  const [email, setEmail] = useState('aman@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await api('/api/auth/signup', {
        method: 'POST',
        auth: false,
        body: { name, email, password }
      });

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

        <input
          className="border rounded-xl p-3"
          placeholder="Full name"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
        />

        <input
          className="border rounded-xl p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />

        {/* 👇 Password field with eye toggle */}
        <div className="relative">
          <input
            className="border rounded-xl p-3 w-full pr-10"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

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
