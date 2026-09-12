import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your university email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Apple Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ffffff', color: '#000000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16" y2="16" />
            </svg>
          </div>
          <h1 className="apple-headline" style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Sign in to CampusFind.
          </h1>
          <p className="apple-subhead" style={{ fontSize: '0.95rem' }}>
            Enter your university credentials to continue.
          </p>
        </div>

        {error && (
          <div className="apple-banner apple-banner-error" style={{ marginBottom: '1.25rem' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="apple-form-group">
            <label className="apple-form-label">Campus Email</label>
            <input
              type="email"
              placeholder="e.g. arjun@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              autoComplete="email"
              className="apple-text-field"
            />
          </div>

          <div className="apple-form-group">
            <label className="apple-form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              autoComplete="current-password"
              className="apple-text-field"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-apple-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.92rem', marginTop: '0.75rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--apple-divider)' }}>
          <div style={{ fontSize: '0.75rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center', marginBottom: '0.75rem' }}>
            Instant Demo Access:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleFillCredentials('admin@campusfind.edu', 'Admin@123')}
              className="btn-apple-secondary"
              style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem' }}
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('arjun@student.edu', 'Student@123')}
              className="btn-apple-secondary"
              style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem' }}
            >
              🎓 Student Demo
            </button>
          </div>
        </div>

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#86868b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#ffffff', fontWeight: 500 }}>
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
