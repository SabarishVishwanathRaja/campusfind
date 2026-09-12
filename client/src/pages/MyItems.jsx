import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiDelete, apiUpload } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editType, setEditType] = useState('LOST');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editRemoveImage, setEditRemoveImage] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  const fetchMyItems = useCallback(async () => {
    try {
      const data = await apiGet('/api/items/mine/list');
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your reported items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyItems();
    async function loadCategories() {
      try {
        const cats = await apiGet('/api/categories');
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, [fetchMyItems]);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/items/${itemToDelete}`);
      setSuccessMessage(`Item #${itemToDelete} has been deleted.`);
      setItemToDelete(null);
      fetchMyItems();
    } catch (err) {
      setError(err.message || 'Failed to delete item.');
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setEditLocation(item.location);
    setEditCategoryId(item.category_id.toString());
    setEditType(item.type);
    setEditImageFile(null);
    setEditImagePreview(item.image_url || null);
    setEditRemoveImage(false);
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editLocation.trim()) {
      setEditError('Title and campus location are required.');
      return;
    }

    setUpdating(true);
    setEditError('');
    try {
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      formData.append('description', editDescription.trim());
      formData.append('location', editLocation.trim());
      formData.append('category_id', editCategoryId);
      formData.append('type', editType);

      if (editImageFile) {
        formData.append('image', editImageFile);
      } else if (editRemoveImage) {
        formData.append('remove_image', 'true');
      }

      await apiUpload(`/api/items/${editingItem.id}`, formData, 'PUT');
      setSuccessMessage('Item specifications updated successfully.');
      setEditingItem(null);
      fetchMyItems();
    } catch (err) {
      setEditError(err.message || 'Failed to update item.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem' }}>
        <div>
          <div className="apple-eyebrow">PERSONAL RECORDS / INCIDENTS</div>
          <h1 className="apple-headline" style={{ fontSize: '2.5rem' }}>
            My Reported Belongings.
          </h1>
          <p className="apple-subhead" style={{ marginTop: '0.3rem' }}>
            Manage the belongings you have filed in the directory. You can update specifications or delete resolved records.
          </p>
        </div>
        <div>
          <Link to="/report" className="btn-apple-primary">
            <span>+</span> Report Belonging
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

      {/* Apple Continuous Table */}
      <section className="apple-table-wrap">
        <table className="apple-table">
          <thead>
            <tr>
              <th style={{ width: '85px' }}>ID</th>
              <th style={{ width: '64px' }}>Photo</th>
              <th>Item &amp; Description</th>
              <th>Classification</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '4rem 0', textAlign: 'center', color: '#86868b' }}>
                  Loading your reports...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '5rem 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.3rem' }}>
                    No reports filed yet
                  </div>
                  <p style={{ color: '#86868b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    You haven't reported any lost or found items under this account.
                  </p>
                  <Link to="/report" className="btn-apple-primary">
                    Report Item Now
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#86868b' }}>
                    CF·{String(item.id).padStart(4, '0')}
                  </td>
                  <td>
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="cell-item-media" />
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
                    <Link to={`/items/${item.id}`} className="cell-title-text">
                      {item.title}
                    </Link>
                    {item.description && (
                      <div className="cell-desc-text">{item.description}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <StatusBadge type={item.type} />
                      <span style={{ fontSize: '0.75rem', color: '#86868b' }}>{item.category_name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#a1a1a6' }}>{item.location}</td>
                  <td style={{ color: '#86868b' }}>
                    {new Date(item.item_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="btn-apple-secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item.id)}
                        className="btn-apple-secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Edit Modal */}
      {editingItem && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog" style={{ maxWidth: '560px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.4rem' }}>
              Edit Report: {editingItem.title}
            </h3>
            {editError && (
              <div className="apple-banner apple-banner-error" style={{ marginBottom: '1rem' }}>
                <span>{editError}</span>
              </div>
            )}
            <form onSubmit={handleSaveEdit} className="space-y-4" style={{ marginTop: '1rem' }}>
              <div className="apple-form-group">
                <label className="apple-form-label">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="apple-text-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="apple-form-group">
                  <label className="apple-form-label">Classification</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="finder-select"
                    style={{ width: '100%' }}
                  >
                    <option value="LOST">LOST</option>
                    <option value="FOUND">FOUND</option>
                  </select>
                </div>

                <div className="apple-form-group">
                  <label className="apple-form-label">Category</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="finder-select"
                    style={{ width: '100%' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="apple-form-group">
                <label className="apple-form-label">Campus Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  required
                  className="apple-text-field"
                />
              </div>

              <div className="apple-form-group">
                <label className="apple-form-label">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="apple-input-area"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-apple-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-apple-primary"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {itemToDelete && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.5rem' }}>
              Delete Item?
            </h3>
            <p style={{ color: '#a1a1a6', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete this report?
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
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="btn-apple-primary"
                style={{ background: 'var(--status-lost)', color: '#ffffff' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
