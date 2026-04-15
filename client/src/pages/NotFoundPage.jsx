import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center'
    }}>
      <div>
        <AlertCircle 
          size={80} 
          color="#ef4444" 
          style={{ display: 'block', margin: '0 auto 1.5rem' }} 
        />
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '0.5rem',
          lineHeight: 1
        }}>
          404
        </h1>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#374151'
        }}>
          Page Not Found
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem', 
          fontSize: '1.125rem',
          maxWidth: '28rem',
          margin: '0 auto 2rem'
        }}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;