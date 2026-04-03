import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { useToast } from '../components/Toast';

const FavouritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const fetchFavourites = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/favourites');
      setFavourites(data.favourites);
    } catch (err) {
      showToast('Failed to load favourites.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFavourites(); }, [fetchFavourites]);

  const handleRemoveFavourite = async (propertyId) => {
    setTogglingId(propertyId);
    try {
      await api.delete(`/favourites/${propertyId}`);
      setFavourites((prev) => prev.filter((f) => f.property._id !== propertyId));
      showToast('Removed from favourites.', 'error');
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const totalValue = favourites.reduce((sum, f) => sum + (f.property?.price || 0), 0);
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(price);

  const s = {
    page: {
      minHeight: '100vh',
      background: '#0a0a0f',
      paddingTop: '80px',
      paddingBottom: '4rem',
    },
    header: {
      padding: '2.5rem 2rem 2rem',
      maxWidth: '1280px',
      margin: '0 auto',
    },
    topRow: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '2rem',
    },
    title: {
      fontFamily: 'Georgia, serif',
      fontSize: '2rem',
      color: '#e8e8f0',
      marginBottom: '0.3rem',
    },
    subtitle: { color: '#555', fontSize: '0.85rem' },
    browseBtn: {
      padding: '0.7rem 1.4rem',
      background: 'transparent',
      border: '1px solid #c9a96e',
      borderRadius: '6px',
      color: '#c9a96e',
      fontSize: '0.85rem',
      cursor: 'pointer',
      letterSpacing: '0.05em',
      transition: 'all 0.2s',
    },
    statsRow: {
      display: 'flex',
      gap: '1.5rem',
      flexWrap: 'wrap',
      marginBottom: '2.5rem',
    },
    statCard: {
      background: '#0e0e18',
      border: '1px solid #1e1e2e',
      borderRadius: '8px',
      padding: '1.25rem 1.75rem',
      minWidth: '160px',
    },
    statValue: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.6rem',
      color: '#c9a96e',
      marginBottom: '0.25rem',
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#555',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    sectionTitle: {
      fontSize: '0.8rem',
      color: '#555',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: '1.25rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '5rem 2rem',
      color: '#444',
    },
    emptyIcon: { fontSize: '4rem', marginBottom: '1.25rem', opacity: 0.4 },
    emptyTitle: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.4rem',
      color: '#666',
      marginBottom: '0.75rem',
    },
    emptyText: { fontSize: '0.9rem', color: '#444', marginBottom: '2rem' },
    emptyBtn: {
      padding: '0.85rem 2rem',
      background: 'linear-gradient(135deg, #c9a96e, #8b6914)',
      border: 'none',
      borderRadius: '6px',
      color: '#0a0a0f',
      fontWeight: '700',
      fontSize: '0.9rem',
      cursor: 'pointer',
      letterSpacing: '0.05em',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
      color: '#444',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={s.page}>
      <ToastContainer />

      <div style={s.header}>
        <div style={s.topRow}>
          <div>
            <h1 style={s.title}>My Favourites</h1>
            <p style={s.subtitle}>Properties saved by {user?.name}</p>
          </div>
          <button
            style={s.browseBtn}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(201,169,110,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            ← Browse all properties
          </button>
        </div>

        {!loading && (
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <div style={s.statValue}>{favourites.length}</div>
              <div style={s.statLabel}>Saved properties</div>
            </div>
            {favourites.length > 0 && (
              <>
                <div style={s.statCard}>
                  <div style={s.statValue}>{formatPrice(totalValue)}</div>
                  <div style={s.statLabel}>Total portfolio value</div>
                </div>
                <div style={s.statCard}>
                  <div style={s.statValue}>{formatPrice(Math.round(totalValue / favourites.length))}</div>
                  <div style={s.statLabel}>Average price</div>
                </div>
              </>
            )}
          </div>
        )}

        {loading ? (
          <div style={s.loading}>Loading your favourites…</div>
        ) : favourites.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>♡</div>
            <h2 style={s.emptyTitle}>No favourites yet</h2>
            <p style={s.emptyText}>
              Browse properties and click "Add to Favourites" to save ones you love.
            </p>
            <button style={s.emptyBtn} onClick={() => navigate('/dashboard')}>
              Browse Properties
            </button>
          </div>
        ) : (
          <>
            <div style={s.sectionTitle}>
              {favourites.length} saved {favourites.length === 1 ? 'property' : 'properties'}
            </div>
            <div style={s.grid}>
              {favourites.map((fav) => (
                <PropertyCard
                  key={fav._id}
                  property={fav.property}
                  isFavourited={true}
                  onToggleFavourite={handleRemoveFavourite}
                  loading={togglingId === fav.property._id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
