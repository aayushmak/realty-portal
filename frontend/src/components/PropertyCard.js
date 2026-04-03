import React from 'react';

const PropertyCard = ({ property, isFavourited, onToggleFavourite, loading }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(price);

  const typeColors = {
    penthouse: '#c9a96e',
    villa: '#9b8ec4',
    house: '#6ea8c9',
    apartment: '#6ec98a',
    studio: '#c96e6e',
  };

  const s = {
    card: {
      background: '#12121a',
      border: '1px solid #1e1e2e',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
      cursor: 'default',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      display: 'block',
      background: '#1a1a2e',
    },
    badge: {
      position: 'absolute',
      top: '0.75rem',
      left: '0.75rem',
      background: typeColors[property.type] || '#c9a96e',
      color: '#0a0a0f',
      fontSize: '0.7rem',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '0.25rem 0.6rem',
      borderRadius: '3px',
    },
    body: { padding: '1.25rem' },
    price: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#c9a96e',
      fontFamily: 'Georgia, serif',
      marginBottom: '0.4rem',
    },
    title: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#e8e8f0',
      marginBottom: '0.3rem',
    },
    address: {
      fontSize: '0.8rem',
      color: '#666',
      marginBottom: '1rem',
    },
    stats: {
      display: 'flex',
      gap: '1.25rem',
      marginBottom: '1.25rem',
      paddingBottom: '1.25rem',
      borderBottom: '1px solid #1e1e2e',
    },
    stat: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.2rem',
    },
    statValue: { fontSize: '0.95rem', fontWeight: '600', color: '#e8e8f0' },
    statLabel: { fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' },
    favBtn: {
      width: '100%',
      padding: '0.7rem',
      border: `1px solid ${isFavourited ? '#662a2a' : '#2a4a35'}`,
      borderRadius: '4px',
      background: isFavourited ? 'rgba(102,42,42,0.2)' : 'rgba(42,74,53,0.2)',
      color: isFavourited ? '#f87171' : '#4ade80',
      fontSize: '0.85rem',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      letterSpacing: '0.05em',
      opacity: loading ? 0.6 : 1,
    },
  };

  return (
    <div
      style={s.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#2e2e42';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#1e1e2e';
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={property.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
          alt={property.title}
          style={s.image}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'; }}
        />
        <span style={s.badge}>{property.type}</span>
      </div>

      <div style={s.body}>
        <div style={s.price}>{formatPrice(property.price)}</div>
        <div style={s.title}>{property.title}</div>
        <div style={s.address}>📍 {property.address}, {property.city}</div>

        <div style={s.stats}>
          <div style={s.stat}>
            <span style={s.statValue}>{property.bedrooms === 0 ? '—' : property.bedrooms}</span>
            <span style={s.statLabel}>Beds</span>
          </div>
          <div style={s.stat}>
            <span style={s.statValue}>{property.bathrooms}</span>
            <span style={s.statLabel}>Baths</span>
          </div>
          <div style={s.stat}>
            <span style={s.statValue}>{property.area.toLocaleString()}</span>
            <span style={s.statLabel}>Sq ft</span>
          </div>
        </div>

        <button
          style={s.favBtn}
          onClick={() => onToggleFavourite(property._id, isFavourited)}
          disabled={loading}
        >
          {loading ? '···' : isFavourited ? '♥ Remove from Favourites' : '♡ Add to Favourites'}
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
