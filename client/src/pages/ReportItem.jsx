import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiUpload } from '../api';
import StatusBadge from '../components/StatusBadge';

const COMMON_CAMPUS_LOCATIONS = [
  'Central Library',
  'Student Cafeteria',
  'Engineering Lab 104',
  'Sports Complex Pavilion',
  'Seminar Hall A',
  'Science Tower 3rd Floor'
];

export default function ReportItem() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('LOST');
  const [location, setLocation] = useState('');
  const [itemDate, setItemDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiGet('/api/categories');
        setCategories(data || []);
        if (data && data.length > 0) {
          setCategoryId(data[0].id.toString());
        }
      } catch (err) {
        setError('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Invalid image format. Please select JPEG, PNG, or WebP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File exceeds the 5 MB maximum size limit.');
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !location.trim() || !itemDate || !categoryId) {
      setError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('type', type);
      formData.append('location', location.trim());
      formData.append('item_date', itemDate);
      formData.append('category_id', categoryId);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const created = await apiUpload('/api/items', formData);
      navigate(`/items/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to file report.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryName = categories.find((c) => c.id.toString() === categoryId)?.name || 'General';

  return (
    <div className="page-container space-y-8">
      {/* Header */}
      <div style={{ maxWidth: '640px', paddingTop: '1rem' }}>
        <div className="apple-eyebrow">REGISTRY INTAKE / NEW INCIDENT</div>
        <h1 className="apple-headline" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Report a Belonging.
        </h1>
        <p className="apple-subhead">
          Publish a lost or found report to the campus registry. Provide details to assist campus recovery and ownership verification.
        </p>
      </div>

      {error && (
        <div className="apple-banner apple-banner-error">
          <span>{error}</span>
        </div>
      )}

      {/* Clean 2-Column Split Workspace (Zero AI Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Classification Switcher */}
          <div>
            <span className="apple-form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Incident Type
            </span>
            <div className="apple-segmented-control" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <button
                type="button"
                onClick={() => setType('LOST')}
                className={`segmented-option ${type === 'LOST' ? 'active' : ''}`}
                style={{ textAlign: 'center' }}
              >
                I Lost An Item
              </button>
              <button
                type="button"
                onClick={() => setType('FOUND')}
                className={`segmented-option ${type === 'FOUND' ? 'active' : ''}`}
                style={{ textAlign: 'center' }}
              >
                I Found An Item
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="apple-form-group">
            <label className="apple-form-label">Item Title *</label>
            <input
              type="text"
              placeholder="e.g. Midnight MacBook Air 13-inch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="apple-text-field"
            />
          </div>

          {/* Category & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="apple-form-group">
              <label className="apple-form-label">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCategories}
                className="finder-select"
                style={{ width: '100%' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id.toString()}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label">Incident Date *</label>
              <input
                type="date"
                value={itemDate}
                onChange={(e) => setItemDate(e.target.value)}
                required
                className="apple-text-field"
              />
            </div>
          </div>

          {/* Location */}
          <div className="apple-form-group">
            <label className="apple-form-label">Campus Location *</label>
            <input
              type="text"
              placeholder="e.g. Central Library 2nd Floor study lounge"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="apple-text-field"
            />
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {COMMON_CAMPUS_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  style={{ background: 'rgba(255, 255, 255, 0.035)', border: '1px solid var(--border-hairline)', borderRadius: '5px', padding: '0.2rem 0.55rem', fontSize: '0.74rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  + {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="apple-form-group">
            <label className="apple-form-label">Specifications &amp; Identifying Notes</label>
            <textarea
              placeholder="Describe serial numbers, case colors, stickers, contents, or distinguishing features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="apple-input-area"
            />
          </div>

          {/* Photo Dropzone */}
          <div className="apple-form-group">
            <label className="apple-form-label">Photo Evidence (Optional)</label>
            {imagePreview ? (
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--apple-border)', background: '#0a0a0c' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn-apple-secondary"
                  style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.75rem', color: 'var(--status-lost-text)' }}
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <label className="apple-upload-zone" htmlFor="file-upload">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem auto', color: '#86868b' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: '0.88rem', color: '#f5f5f7', fontWeight: 500, display: 'block' }}>
                  Choose a photo or drag here
                </span>
                <span style={{ fontSize: '0.78rem', color: '#86868b' }}>
                  JPEG, PNG, or WebP up to 5 MB
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-apple-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.92rem' }}
          >
            {submitting ? 'Publishing Report...' : 'Publish to Campus Directory →'}
          </button>
        </form>

        {/* Live Preview (Flows Naturally, Zero Box Card) */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ fontSize: '0.75rem', color: '#86868b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            Live Directory Preview
          </div>
          <div style={{ borderBottom: '1px solid var(--apple-divider)', paddingBottom: '1.5rem' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Live preview" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--apple-border)' }} />
            ) : (
              <div style={{ width: '100%', height: '160px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--apple-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6e73', fontSize: '0.85rem' }}>
                Visual Preview Placeholder
              </div>
            )}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <StatusBadge type={type} />
                <span style={{ fontSize: '0.78rem', color: '#86868b' }}>{selectedCategoryName}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7' }}>
                {title || 'Untitled Item'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#a1a1a6', margin: '0.4rem 0 1rem 0', lineHeight: 1.5 }}>
                {description || 'Specifications will be displayed here...'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#86868b', borderTop: '1px solid var(--apple-divider)', paddingTop: '0.75rem' }}>
                <span>📍 {location || 'Campus Location'}</span>
                <span>📅 {itemDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
