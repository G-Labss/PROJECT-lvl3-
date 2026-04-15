import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="text-center p-4">
      <div className="spinner"></div>
      {message && (
        <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;