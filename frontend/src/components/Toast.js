import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    wrapper: {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 9999,
      animation: 'slideUp 0.3s ease',
    },
    toast: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderRadius: '4px',
      background: type === 'success' ? '#0d1f17' : '#1f0d0d',
      border: `1px solid ${type === 'success' ? '#2a6645' : '#662a2a'}`,
      color: type === 'success' ? '#4ade80' : '#f87171',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.9rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      maxWidth: '360px',
    },
    icon: { fontSize: '1.1rem' },
    close: {
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      opacity: 0.6,
      fontSize: '1rem',
      padding: '0 0.25rem',
    }
  };

  return (
    <>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(1rem); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={styles.wrapper}>
        <div style={styles.toast}>
          <span style={styles.icon}>{type === 'success' ? '✓' : '✕'}</span>
          <span>{message}</span>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>
      </div>
    </>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const ToastContainer = () =>
    toast ? (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    ) : null;

  return { showToast, ToastContainer };
};

export default Toast;
