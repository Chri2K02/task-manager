import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.token, data.user);
      toast('Signed in');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-logo">
          <Layers size={16} strokeWidth={1.5} /> TaskFlow
        </div>
        <div className="auth-left-quote">
          <blockquote>
            "The secret of getting ahead is getting started."
          </blockquote>
          <cite>— Mark Twain</cite>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Sign in</h1>
          <p className="auth-sub">Enter your details to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <p className="auth-divider">
            No account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
