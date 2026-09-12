import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPatch } from '../api';
import { useAuth } from '../auth';
import StatusBadge from '../components/StatusBadge';
import Item3DViewer from '../components/Item3DViewer';

export default function ItemDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Claim form state
  const [claimMessage, setClaimMessage] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [userClaim, setUserClaim] = useState(null);

  // Admin claims review state
  const [adminClaims, setAdminClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchItem = useCallback(async () => {
    try {
      const data = await apiGet(`/api/items/${id}`);
      setItem(data);
    } catch (err) {
      setError(err.message || 'Failed to load case file.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkUserClaim = useCallback(async () => {
    if (!user) return;
    try {
      const myClaims = await apiGet('/api/claims/mine/list');
      const found = myClaims.find((c) => c.item_id === parseInt(id, 10));
      setUserClaim(found || null);
    } catch (err) {
      console.warn('Failed to check user claim:', err.message);
    }
  }, [id, user]);

  const fetchAdminClaims = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingClaims(true);
    try {
      const allClaims = await apiGet('/api/claims');
      const filtered = allClaims.filter((c) => c.item_id === parseInt(id, 10));
      setAdminClaims(filtered);
    } catch (err) {
      console.warn('Failed to load admin claims:', err.message);
    } finally {
      setLoadingClaims(false);
    }
  }, [id, isAdmin]);

  useEffect(() => {
    fetchItem();
    checkUserClaim();
    fetchAdminClaims();
  }, [fetchItem, checkUserClaim, fetchAdminClaims]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');
    setSuccessMessage('');

    if (!claimMessage.trim()) {
      setClaimError('Please provide specific identifying proof of ownership.');
      return;
    }

    setSubmittingClaim(true);
    try {
      const created = await apiPost('/api/claims', {
        item_id: parseInt(id, 10),
        message: claimMessage.trim()
      });
      setUserClaim(created);
      setClaimMessage('');
      setSuccessMessage('Your ownership verification claim has been submitted for review.');
      fetchAdminClaims();
    } catch (err) {
      setClaimError(err.message || 'Failed to submit claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleClaimStatusChange = async (claimId, newStatus) => {
    setActionError('');
    try {
      await apiPatch(`/api/claims/${claimId}/status`, { status: newStatus });
      setSuccessMessage(`Claim updated to ${newStatus}.`);
      fetchItem();
      fetchAdminClaims();
      checkUserClaim();
    } catch (err) {
      setActionError(err.message || `Failed to update claim to ${newStatus}.`);
    }
  };

  const handleItemStatusChange = async (newStatus) => {
    setActionError('');
    try {
      await apiPatch(`/api/items/${id}/status`, { status: newStatus });
      setSuccessMessage(`Item status updated to ${newStatus}.`);
      fetchItem();
    } catch (err) {
      setActionError(err.message || 'Failed to update item status.');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '6rem 0', textAlign: 'center', color: '#86868b' }}>
        <span>Loading case file specifications...</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container" style={{ padding: '4rem 0' }}>
        <div className="apple-banner apple-banner-error" style={{ marginBottom: '1.5rem' }}>
          <span>{error || 'The requested item was not found.'}</span>
        </div>
        <Link to="/" style={{ color: '#ffffff', fontWeight: 500 }}>
          ← Return to Directory
        </Link>
      </div>
    );
  }

  const isOwner = user && item.user_id === user.id;
  const itemCode = `CF·${String(item.id).padStart(4, '0')}`;
  const formattedDate = item.item_date
    ? new Date(item.item_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown Date';

  return (
    <div className="page-container space-y-6">
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#86868b', paddingTop: '1rem' }}>
        <Link to="/" style={{ color: '#86868b' }}>Directory</Link>
        <span>/</span>
        <span>{item.category_name}</span>
        <span>/</span>
        <span style={{ color: '#f5f5f7' }}>{itemCode}</span>
      </div>

      {successMessage && (
        <div className="apple-banner apple-banner-success">
          <span>✓ {successMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="apple-banner apple-banner-error">
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Product Showcase Layout */}
      <div className="product-showcase-grid">
        {/* Left Column: 3D Studio Turntable & Admin Controls */}
        <div>
          <Item3DViewer
            categoryName={item.category_name}
            itemTitle={item.title}
            imageUrl={item.image_url}
          />

          {isAdmin && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--apple-divider)' }}>
              <span style={{ fontSize: '0.75rem', color: '#86868b', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Admin Status Override
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={item.status === 'OPEN'}
                  onClick={() => handleItemStatusChange('OPEN')}
                  className="btn-apple-secondary"
                  style={{ fontSize: '0.75rem', opacity: item.status === 'OPEN' ? 0.4 : 1 }}
                >
                  Set Open
                </button>
                <button
                  type="button"
                  disabled={item.status === 'CLAIMED'}
                  onClick={() => handleItemStatusChange('CLAIMED')}
                  className="btn-apple-secondary"
                  style={{ fontSize: '0.75rem', opacity: item.status === 'CLAIMED' ? 0.4 : 1 }}
                >
                  Set Claimed
                </button>
                <button
                  type="button"
                  disabled={item.status === 'RETURNED'}
                  onClick={() => handleItemStatusChange('RETURNED')}
                  className="btn-apple-secondary"
                  style={{ fontSize: '0.75rem', opacity: item.status === 'RETURNED' ? 0.4 : 1 }}
                >
                  Set Returned
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Apple-grade Specifications & Claim Drawer */}
        <div className="product-specs-dossier">
          <div>
            <div className="apple-eyebrow">{itemCode} • {item.category_name}</div>
            <h1 className="spec-header-title">{item.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.75rem' }}>
              <StatusBadge type={item.type} />
              <StatusBadge status={item.status} />
            </div>
          </div>

          {/* Hairline Specification Table */}
          <div className="spec-hairline-table">
            <div className="spec-hairline-row">
              <span className="spec-row-label">Campus Location</span>
              <span className="spec-row-val">{item.location}</span>
            </div>
            <div className="spec-hairline-row">
              <span className="spec-row-label">Date Recorded</span>
              <span className="spec-row-val">{formattedDate}</span>
            </div>
            <div className="spec-hairline-row">
              <span className="spec-row-label">Reported By</span>
              <span className="spec-row-val">{item.reporter_name}</span>
            </div>
            <div className="spec-hairline-row">
              <span className="spec-row-label">Visual Media</span>
              <span className="spec-row-val">{item.image_url ? 'Attached photograph' : '3D Procedural model'}</span>
            </div>
            <div style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--apple-divider)' }}>
              <span className="spec-row-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Description &amp; Identifying Notes
              </span>
              <p style={{ color: '#f5f5f7', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {item.description || 'No additional distinguishing specifications recorded.'}
              </p>
            </div>
          </div>

          {/* Verification Console */}
          <div className="verification-drawer">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.35rem' }}>
              Ownership Verification
            </h2>
            <p style={{ color: '#86868b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              If you are the owner, submit verifiable identifying details (passwords, serial numbers, scratches, or interior contents).
            </p>

            {isOwner ? (
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-hairline)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                <strong>You reported this item.</strong> You can manage it from <Link to="/my-items" style={{ textDecoration: 'underline', color: '#ffffff' }}>My Reports</Link>.
              </div>
            ) : userClaim ? (
              <div style={{ padding: '1.15rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-hairline)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f5f5f7' }}>Your Verification Claim</span>
                  <StatusBadge status={userClaim.status} />
                </div>
                <p style={{ color: '#a1a1a6', fontSize: '0.9rem', fontStyle: 'italic', margin: '0.5rem 0' }}>
                  "{userClaim.message}"
                </p>
                <div style={{ fontSize: '0.82rem', color: '#86868b', marginTop: '0.75rem' }}>
                  {userClaim.status === 'PENDING' && 'Pending review by campus administration.'}
                  {userClaim.status === 'APPROVED' && 'Ownership verified. Present your student ID at the security desk to collect.'}
                  {userClaim.status === 'REJECTED' && 'Claim was not approved.'}
                </div>
              </div>
            ) : item.status !== 'OPEN' ? (
              <div style={{ padding: '1rem', background: 'var(--status-review-subtle)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', color: 'var(--status-review-text)', fontSize: '0.86rem' }}>
                This record is currently marked as {item.status} and is not accepting claims.
              </div>
            ) : !user ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.025)', border: '1px solid var(--border-hairline)', borderRadius: '6px' }}>
                <p style={{ color: '#a1a1a6', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  Sign in with your campus account to file an ownership claim.
                </p>
                <Link to="/login" className="btn-apple-primary">
                  Sign In to Claim
                </Link>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                {claimError && (
                  <div className="apple-banner apple-banner-error">
                    <span>{claimError}</span>
                  </div>
                )}
                <div>
                  <textarea
                    placeholder="Describe unique marks, serial numbers, or details only the owner would know..."
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    required
                    disabled={submittingClaim}
                    className="apple-input-area"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="btn-apple-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                >
                  {submittingClaim ? 'Submitting Verification...' : 'Submit Ownership Claim'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Admin Claims Adjudication Docket */}
      {isAdmin && (
        <section style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--apple-divider)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="apple-eyebrow">Administration Queue</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f5f5f7' }}>
              Claims Submitted for this Item ({adminClaims.length})
            </h3>
          </div>

          {loadingClaims ? (
            <p style={{ color: '#86868b' }}>Loading claims...</p>
          ) : adminClaims.length === 0 ? (
            <p style={{ color: '#86868b', fontSize: '0.9rem' }}>No claims recorded for this item yet.</p>
          ) : (
            <div className="apple-table-wrap">
              <table className="apple-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Claimant</th>
                    <th>Submitted Proof</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminClaims.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#86868b' }}>
                        #CLM-{String(c.id).padStart(4, '0')}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f5f5f7' }}>{c.claimant_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#86868b' }}>{c.claimant_email}</div>
                      </td>
                      <td style={{ color: '#a1a1a6', maxWidth: '340px' }}>
                        {c.message}
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {c.status === 'PENDING' ? (
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleClaimStatusChange(c.id, 'APPROVED')}
                              className="btn-apple-primary"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', background: '#ffffff', color: '#000000' }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClaimStatusChange(c.id, 'REJECTED')}
                              className="btn-apple-secondary"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#86868b' }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
