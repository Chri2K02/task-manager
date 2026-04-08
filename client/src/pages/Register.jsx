import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const { data } = await axios.post('/api/auth/register', form);
      login(data.token, data.user);
      toast('Account created');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            "A goal without a plan is just a wish."
          </blockquote>
          <cite>— Antoine de Saint-Exupéry</cite>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Create account</h1>
          <p className="auth-sub">Start organizing your work today</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input className="input" type="text" placeholder="Your name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="auth-divider">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
