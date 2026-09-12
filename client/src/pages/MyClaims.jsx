import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPut, apiDelete } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit claim state
  const [editingClaim, setEditingClaim] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Cancel claim state
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      const data = await apiGet('/api/claims/mine/list');
      setClaims(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your submitted claims.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleOpenEdit = (claim) => {
    setEditingClaim(claim);
    setEditMessage(claim.message);
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editMessage.trim()) {
      setEditError('Claim verification text cannot be empty.');
      return;
    }

    setSavingEdit(true);
    try {
      await apiPut(`/api/claims/${editingClaim.id}`, { message: editMessage.trim() });
      setSuccessMessage('Ownership verification notes updated successfully.');
      setEditingClaim(null);
      fetchClaims();
    } catch (err) {
      setEditError(err.message || 'Failed to update claim note.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!claimToDelete) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/claims/${claimToDelete}`);
      setSuccessMessage(`Claim #${claimToDelete} has been withdrawn.`);
      setClaimToDelete(null);
      fetchClaims();
    } catch (err) {
      setError(err.message || 'Failed to withdraw claim.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem' }}>
        <div>
          <div className="apple-eyebrow">VERIFICATION DOSSIER / CLAIMS</div>
          <h1 className="apple-headline" style={{ fontSize: '2.5rem' }}>
            My Submitted Claims.
          </h1>
          <p className="apple-subhead" style={{ marginTop: '0.3rem' }}>
            Track the verification progress of items you have claimed. Once approved, present your campus ID to collect.
          </p>
        </div>
        <div>
          <Link to="/" className="btn-apple-secondary">
            ← Browse Directory
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="apple-banner apple-banner-success">
          <span>✓ {successMessage}</span>
        </div>
      )}

      {error && (
        <div className="apple-banner apple-banner-error">
          <span>{error}</span>
        </div>
      )}

      {/* Claims Continuous Table */}
      <section className="apple-table-wrap">
        <table className="apple-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Claim ID</th>
              <th style={{ width: '64px' }}>Photo</th>
              <th>Claimed Item</th>
              <th>Submitted Proof</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '4rem 0', textAlign: 'center', color: '#86868b' }}>
                  Loading your claims...
                </td>
              </tr>
            ) : claims.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '5rem 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.3rem' }}>
                    No active claims
                  </div>
                  <p style={{ color: '#86868b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    You haven't filed any ownership verification claims yet.
                  </p>
                  <Link to="/" className="btn-apple-primary">
                    Search Campus Directory
                  </Link>
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#86868b' }}>
                    #CLM-{String(claim.id).padStart(4, '0')}
                  </td>
                  <td>
                    {claim.item_image_url ? (
                      <img src={claim.item_image_url} alt="" className="cell-item-media" />
                    ) : (
                      <div className="cell-item-media-empty">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td>
                    <Link to={`/items/${claim.item_id}`} className="cell-title-text">
                      {claim.item_title}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: '#86868b' }}>Item #{claim.item_id}</div>
                  </td>
                  <td style={{ color: '#a1a1a6', maxWidth: '340px' }}>
                    "{claim.message}"
                  </td>
                  <td style={{ color: '#86868b' }}>
                    {new Date(claim.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {claim.status === 'PENDING' ? (
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(claim)}
                          className="btn-apple-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setClaimToDelete(claim.id)}
                          className="btn-apple-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                        >
                          Withdraw
                        </button>
                      </div>
                    ) : claim.status === 'APPROVED' ? (
                      <span style={{ fontSize: '0.78rem', color: 'var(--status-open-text)', fontWeight: 600 }}>Ready for Pickup</span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#86868b' }}>Resolved</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Edit Claim Modal */}
      {editingClaim && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.4rem' }}>
              Update Ownership Proof
            </h3>
            {editError && (
              <div className="apple-banner apple-banner-error" style={{ marginBottom: '1rem' }}>
                <span>{editError}</span>
              </div>
            )}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="apple-form-group">
                <label className="apple-form-label">Verifiable Identifiers</label>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  required
                  className="apple-input-area"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingClaim(null)}
                  className="btn-apple-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn-apple-primary"
                >
                  {savingEdit ? 'Updating...' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {claimToDelete && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.5rem' }}>
              Withdraw Claim?
            </h3>
            <p style={{ color: '#a1a1a6', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Are you sure you want to withdraw your ownership verification claim #{claimToDelete}?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setClaimToDelete(null)}
                className="btn-apple-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="btn-apple-primary"
                style={{ background: 'var(--status-lost)', color: '#ffffff' }}
              >
                {deleting ? 'Withdrawing...' : 'Confirm Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
