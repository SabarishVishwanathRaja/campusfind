import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Navbar() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-navbar">
      <div className="nav-container">
        {/* Brand Group */}
        <div className="nav-brand-group">
          <Link to="/" className="brand-link">
            <div className="brand-icon-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16" y2="16" />
              </svg>
            </div>
            <span className="brand-name">CampusFind</span>
            <span className="brand-badge">RECOVERY NETWORK</span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="nav-links-list">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            Directory
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/my-items"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                My Reports
              </NavLink>
              <NavLink
                to="/my-claims"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                My Claims
              </NavLink>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              Administration
            </NavLink>
          )}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="nav-actions-group">
          {isAuthenticated ? (
            <>
              <Link to="/report" className="btn-apple-primary">
                <span>+</span> Report Belonging
              </Link>

              <div className="user-pill-wrap">
                <span className="user-name-label">{user?.name}</span>
                <span className={`user-tag ${isAdmin ? 'admin' : ''}`}>
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Sign Out"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-apple-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn-apple-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
