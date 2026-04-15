import React from 'react';
import { Trophy } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { useAppContext } from '../context/useAppContext';
import { useToast } from '../context/ToastContext';
import { GOLD } from '../constants';

const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const toast = useToast();

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (data) => {
      const res = await login(data);
      toast('Welcome back! Logged in successfully.', 'success');
      navigate(res.role === 'admin' || res.role === 'coach' ? '/admin' : '/my-progress');
    }
  );

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
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: '#f0f0f0',
            fontFamily: "'Playfair Display', serif",
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1.5rem',
          }}>
            <a href="#" style={{ color: GOLD, fontSize: '0.8125rem', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          {errors.general && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#555' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: GOLD, textDecoration: 'none' }}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
