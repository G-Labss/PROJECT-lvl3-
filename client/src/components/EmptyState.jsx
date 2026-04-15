import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      {Icon && <Icon size={64} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '28rem', margin: '0 auto 1.5rem' }}>
        {message}
      </p>
      {action && action}
    </div>
  );
};

export default EmptyState;