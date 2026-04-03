import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const s = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '64px',
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1a1a2a',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      justifyContent: 'space-between',
    },
    logo: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.3rem',
      color: '#c9a96e',
      letterSpacing: '0.05em',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    logoSpan: { color: '#666', fontSize: '0.9rem', marginLeft: '0.4rem', fontStyle: 'italic' },
    right: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    navLink: (active) => ({
      color: active ? '#c9a96e' : '#888',
      textDecoration: 'none',
      fontSize: '0.85rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'color 0.2s',
      background: 'none',
      border: 'none',
      padding: 0,
    }),
    userBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.4rem 1rem',
      background: '#12121a',
      border: '1px solid #1e1e2e',
      borderRadius: '20px',
    },
    avatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #c9a96e, #8b6914)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: '700',
      color: '#0a0a0f',
    },
    userName: { fontSize: '0.8rem', color: '#ccc' },
    rolePill: {
      fontSize: '0.65rem',
      background: '#1e1e2e',
      color: '#c9a96e',
      padding: '0.1rem 0.5rem',
      borderRadius: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    logoutBtn: {
      background: 'none',
      border: '1px solid #2a2a3a',
      color: '#666',
      padding: '0.4rem 0.9rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      letterSpacing: '0.05em',
    },
  };

  return (
    <nav style={s.nav}>
      <div style={s.logo} onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
        Realty<span style={s.logoSpan}>portal</span>
      </div>

      {isAuthenticated ? (
        <div style={s.right}>
          <button
            style={s.navLink(location.pathname === '/dashboard')}
            onClick={() => navigate('/dashboard')}
          >
            Browse
          </button>
          <button
            style={s.navLink(location.pathname === '/favourites')}
            onClick={() => navigate('/favourites')}
          >
            Favourites
          </button>

          <div style={s.userBadge}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <span style={s.userName}>{user?.name}</span>
            <span style={s.rolePill}>{user?.role}</span>
          </div>

          <button
            style={s.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => { e.target.style.borderColor = '#662a2a'; e.target.style.color = '#f87171'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = '#2a2a3a'; e.target.style.color = '#666'; }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div style={s.right}>
          <button style={s.navLink(false)} onClick={() => navigate('/login')}>Sign in</button>
          <button
            style={{ ...s.logoutBtn, borderColor: '#c9a96e', color: '#c9a96e' }}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
