import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please complete all required fields.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setSubmitting(false);
    }
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
            Create Account.
          </h1>
          <p className="apple-subhead" style={{ fontSize: '0.95rem' }}>
            Join the campus recovery network.
          </p>
        </div>

        {error && (
          <div className="apple-banner apple-banner-error" style={{ marginBottom: '1.25rem' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="apple-form-group">
            <label className="apple-form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Jordan Lee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
              autoComplete="name"
              className="apple-text-field"
            />
          </div>

          <div className="apple-form-group">
            <label className="apple-form-label">Campus Email *</label>
            <input
              type="email"
              placeholder="e.g. jlee@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              autoComplete="email"
              className="apple-text-field"
            />
          </div>

          <div className="apple-form-group">
            <label className="apple-form-label">Password (min 6 characters) *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              autoComplete="new-password"
              className="apple-text-field"
            />
          </div>

          <div className="apple-form-group">
            <label className="apple-form-label">Confirm Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={submitting}
              autoComplete="new-password"
              className="apple-text-field"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-apple-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.92rem', marginTop: '0.75rem' }}
          >
            {submitting ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#86868b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ffffff', fontWeight: 500 }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
