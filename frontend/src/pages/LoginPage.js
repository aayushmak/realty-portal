import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    },
    bgGlow: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: '#0e0e18',
      border: '1px solid #1e1e2e',
      borderRadius: '12px',
      padding: '3rem 2.5rem',
      position: 'relative',
      zIndex: 1,
    },
    topAccent: {
      position: 'absolute',
      top: 0,
      left: '2rem',
      right: '2rem',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)',
    },
    heading: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.8rem',
      color: '#e8e8f0',
      marginBottom: '0.4rem',
      textAlign: 'center',
    },
    subheading: {
      color: '#555',
      fontSize: '0.85rem',
      textAlign: 'center',
      marginBottom: '2.5rem',
      letterSpacing: '0.05em',
    },
    label: {
      display: 'block',
      fontSize: '0.75rem',
      color: '#888',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.85rem 1rem',
      background: '#12121a',
      border: '1px solid #1e1e2e',
      borderRadius: '6px',
      color: '#e8e8f0',
      fontSize: '0.95rem',
      outline: 'none',
      marginBottom: '1.25rem',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    },
    error: {
      background: 'rgba(102,42,42,0.3)',
      border: '1px solid #662a2a',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
      color: '#f87171',
      fontSize: '0.85rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    btn: {
      width: '100%',
      padding: '0.9rem',
      background: loading ? '#5a3d10' : 'linear-gradient(135deg, #c9a96e, #8b6914)',
      border: 'none',
      borderRadius: '6px',
      color: '#0a0a0f',
      fontSize: '0.95rem',
      fontWeight: '700',
      cursor: loading ? 'not-allowed' : 'pointer',
      letterSpacing: '0.08em',
      marginBottom: '1.5rem',
      transition: 'opacity 0.2s',
    },
    footer: {
      textAlign: 'center',
      color: '#555',
      fontSize: '0.85rem',
    },
    link: {
      color: '#c9a96e',
      textDecoration: 'none',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #1a1a2a',
      margin: '1.5rem 0',
    },
    demoBox: {
      background: '#0a0a0f',
      border: '1px solid #1a1a2a',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
      fontSize: '0.78rem',
      color: '#555',
      marginBottom: '1.5rem',
    },
    demoLabel: { color: '#c9a96e', marginRight: '0.4rem' },
  };

  return (
    <div style={s.page}>
      <div style={s.bgGlow} />
      <div style={s.card}>
        <div style={s.topAccent} />

        <h1 style={s.heading}>Welcome back</h1>
        <p style={s.subheading}>Sign in to your buyer portal</p>

        <div style={s.demoBox}>
          <div><span style={s.demoLabel}>Demo:</span> Register a new account below, or use your own credentials.</div>
        </div>

        {error && (
          <div style={s.error}>
            <span>✕</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email address</label>
          <input
            style={s.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
            onFocus={(e) => (e.target.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.target.style.borderColor = '#1e1e2e')}
          />

          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            onFocus={(e) => (e.target.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.target.style.borderColor = '#1e1e2e')}
          />

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <hr style={s.divider} />
        <p style={s.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={s.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
