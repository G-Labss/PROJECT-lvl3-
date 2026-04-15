import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#fef2f2',
      borderRadius: '0.5rem',
      border: '1px solid #fecaca',
      textAlign: 'center'
    }}>
      <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
      <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>
        Oops! Something went wrong
      </h3>
      <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-danger">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;