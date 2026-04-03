import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { useToast } from '../components/Toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast, ToastContainer } = useToast();

  const [properties, setProperties] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // Fetch all properties
  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProps(true);
      const params = {};
      if (search) params.search = search;
      if (filterType) params.type = filterType;
      if (filterCity) params.city = filterCity;
      const { data } = await api.get('/properties', { params });
      setProperties(data.properties);
    } catch (err) {
      showToast('Failed to load properties.', 'error');
    } finally {
      setLoadingProps(false);
    }
  }, [search, filterType, filterCity]);

  // Fetch user's favourites
  const fetchFavourites = useCallback(async () => {
    try {
      setLoadingFavs(true);
      const { data } = await api.get('/favourites');
      const ids = new Set(data.favourites.map((f) => f.property._id));
      setFavouriteIds(ids);
    } catch (err) {
    } finally {
      setLoadingFavs(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);
  useEffect(() => { fetchFavourites(); }, [fetchFavourites]);

  const handleToggleFavourite = async (propertyId, isFavourited) => {
    setTogglingId(propertyId);
    try {
      if (isFavourited) {
        await api.delete(`/favourites/${propertyId}`);
        setFavouriteIds((prev) => { const next = new Set(prev); next.delete(propertyId); return next; });
        showToast('Removed from favourites.', 'error');
      } else {
        await api.post(`/favourites/${propertyId}`);
        setFavouriteIds((prev) => new Set([...prev, propertyId]));
        showToast('Added to favourites!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const propertyTypes = ['apartment', 'house', 'villa', 'studio', 'penthouse'];
  const cities = [...new Set(properties.map((p) => p.city))].sort();

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
    greeting: {
      fontFamily: 'Georgia, serif',
      fontSize: '2rem',
      color: '#e8e8f0',
      marginBottom: '0.3rem',
    },
    greetingGold: { color: '#c9a96e' },
    subtitle: { color: '#555', fontSize: '0.9rem', marginBottom: '2rem' },
    userCard: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1rem',
      background: '#0e0e18',
      border: '1px solid #1e1e2e',
      borderRadius: '8px',
      padding: '1rem 1.5rem',
      marginBottom: '2.5rem',
    },
    avatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #c9a96e, #8b6914)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#0a0a0f',
      flexShrink: 0,
    },
    userInfo: {},
    userName: { fontWeight: '600', color: '#e8e8f0', fontSize: '0.95rem' },
    userMeta: { color: '#555', fontSize: '0.8rem', marginTop: '0.15rem' },
    rolePill: {
      display: 'inline-block',
      background: '#1a1a2e',
      color: '#c9a96e',
      fontSize: '0.65rem',
      padding: '0.15rem 0.5rem',
      borderRadius: '10px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginLeft: '0.5rem',
    },
    filterBar: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    searchInput: {
      flex: '1',
      minWidth: '200px',
      padding: '0.7rem 1rem',
      background: '#0e0e18',
      border: '1px solid #1e1e2e',
      borderRadius: '6px',
      color: '#e8e8f0',
      fontSize: '0.9rem',
      outline: 'none',
    },
    select: {
      padding: '0.7rem 1rem',
      background: '#0e0e18',
      border: '1px solid #1e1e2e',
      borderRadius: '6px',
      color: '#888',
      fontSize: '0.85rem',
      outline: 'none',
      cursor: 'pointer',
    },
    clearBtn: {
      padding: '0.7rem 1rem',
      background: 'transparent',
      border: '1px solid #1e1e2e',
      borderRadius: '6px',
      color: '#555',
      fontSize: '0.8rem',
      cursor: 'pointer',
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
    empty: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#444',
    },
    emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
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
        <h1 style={s.greeting}>
          Good day, <span style={s.greetingGold}>{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={s.subtitle}>Browse available properties and save your favourites.</p>

        <div style={s.userCard}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div style={s.userInfo}>
            <div style={s.userName}>
              {user?.name}
              <span style={s.rolePill}>{user?.role}</span>
            </div>
            <div style={s.userMeta}>{user?.email}</div>
          </div>
        </div>

        <div style={s.filterBar}>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search by title, address, or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.target.style.borderColor = '#1e1e2e')}
          />
          <select style={s.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select style={s.select} value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
            <option value="">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || filterType || filterCity) && (
            <button style={s.clearBtn} onClick={() => { setSearch(''); setFilterType(''); setFilterCity(''); }}>
              Clear filters
            </button>
          )}
        </div>

        {!loadingProps && (
          <div style={s.sectionTitle}>
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
            {!loadingFavs && ` · ${favouriteIds.size} favourited`}
          </div>
        )}

        {loadingProps ? (
          <div style={s.loading}>Loading properties…</div>
        ) : properties.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>🏚</div>
            <div>No properties found matching your criteria.</div>
          </div>
        ) : (
          <div style={s.grid}>
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavourited={favouriteIds.has(property._id)}
                onToggleFavourite={handleToggleFavourite}
                loading={togglingId === property._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
