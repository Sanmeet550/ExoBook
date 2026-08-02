import React from 'react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizePx = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;
  return (
    <div className="loader-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '0.75rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        width: sizePx,
        height: sizePx,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRightColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      {text && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{text}</span>}
    </div>
  );
};

export default Loader;
