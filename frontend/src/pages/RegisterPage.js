import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    },
    card: {
      width: '100%',
      maxWidth: '440px',
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
      marginBottom: '2rem',
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
    alert: (type) => ({
      background: type === 'error' ? 'rgba(102,42,42,0.3)' : 'rgba(42,102,69,0.3)',
      border: `1px solid ${type === 'error' ? '#662a2a' : '#2a6645'}`,
      borderRadius: '6px',
      padding: '0.75rem 1rem',
      color: type === 'error' ? '#f87171' : '#4ade80',
      fontSize: '0.85rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }),
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
    },
    footer: { textAlign: 'center', color: '#555', fontSize: '0.85rem' },
    link: { color: '#c9a96e', textDecoration: 'none' },
    divider: { border: 'none', borderTop: '1px solid #1a1a2a', margin: '1.5rem 0' },
    hint: { fontSize: '0.72rem', color: '#444', marginTop: '-1rem', marginBottom: '1.25rem' },
  };

  return (
    <div style={s.page}>
      <div style={s.bgGlow} />
      <div style={s.card}>
        <div style={s.topAccent} />

        <h1 style={s.heading}>Create account</h1>
        <p style={s.subheading}>Join the buyer portal — it's free</p>

        {error && <div style={s.alert('error')}><span>✕</span> {error}</div>}
        {success && <div style={s.alert('success')}><span>✓</span> {success}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full name</label>
          <input
            style={s.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            required
            onFocus={(e) => (e.target.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.target.style.borderColor = '#1e1e2e')}
          />

          <label style={s.label}>Email address</label>
          <input
            style={s.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
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
            placeholder="Min. 6 characters"
            required
            onFocus={(e) => (e.target.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.target.style.borderColor = '#1e1e2e')}
          />
          <p style={s.hint}>Must be at least 6 characters.</p>

          <label style={s.label}>Confirm password</label>
          <input
            style={s.input}
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Repeat your password"
            required
            onFocus={(e) => (e.target.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.target.style.borderColor = '#1e1e2e')}
          />

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <hr style={s.divider} />
        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
