import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { useToast } from '../context/ToastContext';
import { GOLD } from '../constants';

const RegisterPage = () => {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (values.password !== values.confirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register({ name: values.name, email: values.email, password: values.password });
      toast('Account created! Welcome.', 'success');
      navigate('/my-progress');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', marginBottom: 0 };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: '#0a0a0a',
    }}>
      <div style={{
        maxWidth: '26rem',
        width: '100%',
        backgroundColor: '#111111',
        border: '1px solid #1e1e1e',
        borderRadius: '0.75rem',
        padding: '2.5rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Trophy size={40} color={GOLD} style={{ display: 'block', margin: '0 auto 1.25rem' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f0f0f0', fontFamily: "'Playfair Display', serif" }}>
            Create Account
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Track your tennis progress</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" value={values.name} onChange={handleChange} className="form-input" style={inputStyle} placeholder="Your name" required disabled={loading} />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" value={values.email} onChange={handleChange} className="form-input" style={inputStyle} placeholder="your@email.com" required disabled={loading} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={values.password} onChange={handleChange} className="form-input" style={inputStyle} placeholder="Min. 6 characters" required disabled={loading} />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirm" value={values.confirm} onChange={handleChange} className="form-input" style={inputStyle} placeholder="••••••••" required disabled={loading} />
          </div>

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#555' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: GOLD, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
