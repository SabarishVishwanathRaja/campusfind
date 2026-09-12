import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPatch, apiPut, apiDelete, apiPost } from '../api';
import { useAuth } from '../auth';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('claims');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  const [claimStatusFilter, setClaimStatusFilter] = useState('');

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingItem, setDeletingItem] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('STUDENT');
  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [claimsData, itemsData, usersData] = await Promise.all([
        apiGet('/api/claims'),
        apiGet('/api/items?limit=100'),
        apiGet('/api/users')
      ]);

      setClaims(claimsData || []);
      setItems(itemsData.data || []);
      setUsers(usersData || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const totalItemsCount = items.length;
  const openItemsCount = items.filter((i) => i.status === 'OPEN').length;
  const claimedItemsCount = items.filter((i) => i.status === 'CLAIMED').length;
  const returnedItemsCount = items.filter((i) => i.status === 'RETURNED').length;
  const pendingClaimsCount = claims.filter((c) => c.status === 'PENDING').length;

  const handleClaimStatus = async (claimId, newStatus) => {
    setError('');
    setSuccessMessage('');
    try {
      await apiPatch(`/api/claims/${claimId}/status`, { status: newStatus });
      setSuccessMessage(`Claim #${claimId} status updated to ${newStatus}.`);
      loadAdminData();
    } catch (err) {
      setError(err.message || `Failed to update claim to ${newStatus}.`);
    }
  };

  const handleItemStatus = async (itemId, newStatus) => {
    setError('');
    setSuccessMessage('');
    try {
      await apiPatch(`/api/items/${itemId}/status`, { status: newStatus });
      setSuccessMessage(`Item #${itemId} status updated to ${newStatus}.`);
      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to update item status.');
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setDeletingItem(true);
    try {
      await apiDelete(`/api/items/${itemToDelete}`);
      setSuccessMessage(`Item #${itemToDelete} has been removed.`);
      setItemToDelete(null);
      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete item.');
    } finally {
      setDeletingItem(false);
    }
  };

  const handleUserRoleChange = async (targetUser, newRole) => {
    if (targetUser.id === currentUser.id && newRole !== 'ADMIN') {
      setError('You cannot revoke your own administrator role.');
      return;
    }

    setError('');
    setSuccessMessage('');
    try {
      await apiPut(`/api/users/${targetUser.id}`, { role: newRole });
      setSuccessMessage(`User "${targetUser.name}" role updated to ${newRole}.`);
      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      setError('You cannot delete your own administrator account.');
      setUserToDelete(null);
      return;
    }

    setDeletingUser(true);
    try {
      await apiDelete(`/api/users/${userToDelete.id}`);
      setSuccessMessage(`User "${userToDelete.name}" deleted.`);
      setUserToDelete(null);
      loadAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword) {
      setAddUserError('All account fields are required.');
      return;
    }

    setAddingUser(true);
    try {
      await apiPost('/api/users', {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword,
        role: newUserRole
      });
      setSuccessMessage(`User account "${newUserName}" created successfully.`);
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('STUDENT');
      loadAdminData();
    } catch (err) {
      setAddUserError(err.message || 'Failed to create user account.');
    } finally {
      setAddingUser(false);
    }
  };

  const filteredClaims = claimStatusFilter
    ? claims.filter((c) => c.status === claimStatusFilter)
    : claims;

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem' }}>
        <div>
          <div className="apple-eyebrow">GOVERNANCE &amp; ADJUDICATION</div>
          <h1 className="apple-headline" style={{ fontSize: '2.5rem' }}>
            Administration Console.
          </h1>
          <p className="apple-subhead" style={{ marginTop: '0.3rem' }}>
            Adjudicate ownership claims, manage items catalog, and administrate student accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAdminData}
          className="btn-apple-secondary"
        >
          ↻ Refresh Data
        </button>
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

      {/* Apple Flush KPI Metrics Bar */}
      <section className="admin-kpi-bar">
        <div className="admin-kpi-item">
          <span className="admin-kpi-value">{totalItemsCount}</span>
          <span className="admin-kpi-label">Catalog Items ({openItemsCount} Open)</span>
        </div>

        <div className="admin-kpi-item">
          <span className="admin-kpi-value" style={{ color: pendingClaimsCount > 0 ? 'var(--status-review-text)' : 'var(--text-primary)' }}>
            {pendingClaimsCount}
          </span>
          <span className="admin-kpi-label">Pending Verification Claims</span>
        </div>

        <div className="admin-kpi-item">
          <span className="admin-kpi-value">{claimedItemsCount}</span>
          <span className="admin-kpi-label">In Verification / Hold</span>
        </div>

        <div className="admin-kpi-item">
          <span className="admin-kpi-value" style={{ color: 'var(--status-open-text)' }}>{returnedItemsCount}</span>
          <span className="admin-kpi-label">Restored to Owners</span>
        </div>
      </section>

      {/* Segmented Tab Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
        <div className="apple-segmented-control">
          <button
            type="button"
            onClick={() => setActiveTab('claims')}
            className={`segmented-option ${activeTab === 'claims' ? 'active' : ''}`}
          >
            Claims Queue {pendingClaimsCount > 0 && `(${pendingClaimsCount})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`segmented-option ${activeTab === 'items' ? 'active' : ''}`}
          >
            Catalog ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`segmented-option ${activeTab === 'users' ? 'active' : ''}`}
          >
            Users ({users.length})
          </button>
        </div>

        {activeTab === 'users' && (
          <button
            type="button"
            onClick={() => setShowAddUserModal(true)}
            className="btn-apple-primary"
          >
            + Add User Account
          </button>
        )}
      </div>

      {/* Tab 1: Claims Adjudication */}
      {activeTab === 'claims' && (
        <section className="apple-table-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--apple-divider)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5f5f7' }}>
              Verification Queue ({filteredClaims.length} records)
            </span>
            <select
              value={claimStatusFilter}
              onChange={(e) => setClaimStatusFilter(e.target.value)}
              className="finder-select"
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
            >
              <option value="">All Claims</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          <table className="apple-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Claimant</th>
                <th>Submitted Proof</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem 0', textAlign: 'center', color: '#86868b' }}>
                    No claims match this filter.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#86868b' }}>
                      #CLM-{String(c.id).padStart(4, '0')}
                    </td>
                    <td>
                      <Link to={`/items/${c.item_id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.item_title}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: '#86868b' }}>Item #{c.item_id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f5f5f7' }}>{c.claimant_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#86868b' }}>{c.claimant_email}</div>
                    </td>
                    <td style={{ color: '#a1a1a6', maxWidth: '340px' }}>
                      {c.message}
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {c.status === 'PENDING' ? (
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleClaimStatus(c.id, 'APPROVED')}
                            className="btn-apple-primary"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', background: '#ffffff', color: '#000000' }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClaimStatus(c.id, 'REJECTED')}
                            className="btn-apple-secondary"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#86868b' }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Tab 2: Catalog Items */}
      {activeTab === 'items' && (
        <section className="apple-table-wrap">
          <table className="apple-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/items/${item.id}`} style={{ fontWeight: 600, color: '#f5f5f7' }}>
                      {item.title}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: '#86868b' }}>By {item.reporter_name}</div>
                  </td>
                  <td>
                    <StatusBadge type={item.type} />
                  </td>
                  <td style={{ color: '#a1a1a6' }}>{item.category_name}</td>
                  <td style={{ color: '#a1a1a6' }}>{item.location}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleItemStatus(item.id, e.target.value)}
                      className="finder-select"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                    >
                      <option value="OPEN">Open</option>
                      <option value="CLAIMED">Claimed</option>
                      <option value="RETURNED">Returned</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item.id)}
                      className="btn-apple-secondary"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Tab 3: Users */}
      {activeTab === 'users' && (
        <section className="apple-table-wrap">
          <table className="apple-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Campus Email</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: '#f5f5f7' }}>
                    {u.name} {u.id === currentUser?.id && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>(You)</span>}
                  </td>
                  <td style={{ color: '#a1a1a6' }}>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleUserRoleChange(u, e.target.value)}
                      disabled={u.id === currentUser?.id}
                      className="finder-select"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {u.id !== currentUser?.id && (
                      <button
                        type="button"
                        onClick={() => setUserToDelete(u)}
                        className="btn-apple-secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Delete Item Modal */}
      {itemToDelete && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.5rem' }}>
              Delete Item #{itemToDelete}?
            </h3>
            <p style={{ color: '#a1a1a6', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              This record and associated photo assets will be permanently removed from the directory.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="btn-apple-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteItem}
                disabled={deletingItem}
                className="btn-apple-primary"
                style={{ background: 'var(--status-lost)', color: '#ffffff' }}
              >
                {deletingItem ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.5rem' }}>
              Remove Account: {userToDelete.name}
            </h3>
            <p style={{ color: '#a1a1a6', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove this account?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="btn-apple-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={deletingUser}
                className="btn-apple-primary"
                style={{ background: 'var(--status-lost)', color: '#ffffff' }}
              >
                {deletingUser ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.4rem' }}>
              New University Account
            </h3>
            {addUserError && (
              <div className="apple-banner apple-banner-error" style={{ marginBottom: '1rem' }}>
                <span>{addUserError}</span>
              </div>
            )}
            <form onSubmit={handleAddUser} className="space-y-4" style={{ marginTop: '1rem' }}>
              <div className="apple-form-group">
                <label className="apple-form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                  className="apple-text-field"
                />
              </div>
              <div className="apple-form-group">
                <label className="apple-form-label">Campus Email</label>
                <input
                  type="email"
                  placeholder="e.g. jlee@student.edu"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="apple-text-field"
                />
              </div>
              <div className="apple-form-group">
                <label className="apple-form-label">Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  className="apple-text-field"
                />
              </div>
              <div className="apple-form-group">
                <label className="apple-form-label">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="finder-select"
                  style={{ width: '100%' }}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn-apple-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="btn-apple-primary"
                >
                  {addingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
