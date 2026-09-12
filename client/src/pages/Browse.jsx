import React, { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../api';
import ItemLedgerRow from '../components/ItemLedgerRow';
import CampusSpatial3D from '../components/CampusSpatial3D';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3D Campus stage toggle
  const [showCampusModel, setShowCampusModel] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiGet('/api/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (activeSearch) params.append('q', activeSearch);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category_id', categoryFilter);
      params.append('page', page);
      params.append('limit', limit);

      const res = await apiGet(`/api/items?${params.toString()}`);
      let fetched = res.data || [];

      if (locationFilter) {
        fetched = fetched.filter(
          (i) => i.location && i.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      setItems(fetched);
      setTotalItems(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / limit) || 1);
    } catch (err) {
      setError(err.message || 'Failed to load directory items.');
    } finally {
      setLoading(false);
    }
  }, [activeSearch, typeFilter, statusFilter, categoryFilter, locationFilter, page, limit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchQuery.trim());
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveSearch('');
    setTypeFilter('');
    setStatusFilter('');
    setCategoryFilter('');
    setLocationFilter('');
    setPage(1);
  };

  const handleLocationSelectFrom3D = (locName) => {
    setLocationFilter(locName);
    setPage(1);
  };

  const lostCount = items.filter((i) => i.type === 'LOST').length;
  const foundCount = items.filter((i) => i.type === 'FOUND').length;

  return (
    <div className="page-container space-y-8">
      {/* 1. Hero Headline Block (Precision Swiss & Monochrome) */}
      <section className="browse-hero-block">
        <div style={{ maxWidth: '680px' }}>
          <div className="apple-eyebrow">CAMPUS RECOVERY NETWORK / DIRECTORY</div>
          <h1 className="apple-headline" style={{ fontSize: '2.85rem', marginBottom: '0.75rem' }}>
            Find what was lost.<br />Return what was found.
          </h1>
          <p className="apple-subhead">
            High-precision university incident directory powered by interactive 3D spatial mapping and verified ownership recovery.
          </p>
        </div>

        {/* Flush Key Metrics */}
        <div className="hero-stats-row">
          <div className="hero-stat-unit">
            <span className="hero-stat-value">{totalItems}</span>
            <span className="hero-stat-label">Active Records</span>
          </div>
          <div className="hero-stat-unit">
            <span className="hero-stat-value" style={{ color: 'var(--status-lost-text)' }}>{lostCount}</span>
            <span className="hero-stat-label">Lost Reports</span>
          </div>
          <div className="hero-stat-unit">
            <span className="hero-stat-value" style={{ color: 'var(--status-open-text)' }}>{foundCount}</span>
            <span className="hero-stat-label">Recoveries</span>
          </div>
        </div>
      </section>

      {/* 2. Seamless 3D Architectural Campus Twin */}
      <section>
        <div className="spatial-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
            <span style={{ fontWeight: 600, color: '#f5f5f7' }}>Campus Spatial Twin</span>
            <span style={{ color: '#71717a' }}>• Interactive CAD model</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCampusModel(!showCampusModel)}
            className="btn-apple-secondary"
            style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
          >
            {showCampusModel ? 'Hide 3D View' : 'Show 3D View'}
          </button>
        </div>

        {showCampusModel && (
          <CampusSpatial3D
            items={items}
            onSelectLocation={handleLocationSelectFrom3D}
            selectedLocation={locationFilter}
          />
        )}
      </section>

      {/* 3. Finder Toolbar (Zero Box Card) */}
      <section className="finder-toolbar">
        {/* Segmented Filter Pill */}
        <div className="apple-segmented-control">
          <button
            type="button"
            onClick={() => { setTypeFilter(''); setPage(1); }}
            className={`segmented-option ${typeFilter === '' ? 'active' : ''}`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => { setTypeFilter('LOST'); setPage(1); }}
            className={`segmented-option ${typeFilter === 'LOST' ? 'active' : ''}`}
          >
            Lost
          </button>
          <button
            type="button"
            onClick={() => { setTypeFilter('FOUND'); setPage(1); }}
            className={`segmented-option ${typeFilter === 'FOUND' ? 'active' : ''}`}
          >
            Found
          </button>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="finder-search-field">
          <span className="finder-search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16" y2="16" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, description, or serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="finder-search-input"
          />
          <span className="search-kbd-hint">/</span>
        </form>

        {/* Dropdowns */}
        <div className="finder-filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="finder-select"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="finder-select"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLAIMED">In Verification</option>
            <option value="RETURNED">Returned</option>
          </select>

          {locationFilter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.06)', color: '#f4f4f5', border: '1px solid var(--border-hairline)', padding: '0.3rem 0.65rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 500 }}>
              <span>{locationFilter}</span>
              <button
                type="button"
                onClick={() => setLocationFilter('')}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
          )}

          {(activeSearch || typeFilter || statusFilter || categoryFilter || locationFilter) && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{ background: 'none', border: 'none', color: '#86868b', fontSize: '0.8rem', cursor: 'pointer', padding: '0.3rem 0.5rem' }}
            >
              Clear ↺
            </button>
          )}
        </div>
      </section>

      {/* 4. Continuous Data Table (NO CARDS, EXACT ALIGNMENT) */}
      <section>
        {error && (
          <div className="apple-banner apple-banner-error" style={{ marginBottom: '1rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="apple-table-wrap">
          <table className="apple-table">
            <thead>
              <tr>
                <th style={{ width: '85px' }}>ID</th>
                <th style={{ width: '64px' }}>Preview</th>
                <th style={{ minWidth: '240px' }}>Item &amp; Description</th>
                <th style={{ width: '130px' }}>Classification</th>
                <th style={{ width: '180px' }}>Location</th>
                <th style={{ width: '90px' }}>Date</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '80px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '4rem 0', textAlign: 'center', color: '#86868b' }}>
                    Streaming campus directory...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '5rem 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f5f5f7', marginBottom: '0.3rem' }}>
                      No matching belongings found
                    </div>
                    <p style={{ color: '#86868b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      Try adjusting your search criteria or resetting filters.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="btn-apple-primary"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <ItemLedgerRow key={item.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Flush Pagination */}
        {totalPages > 1 && (
          <div className="apple-pagination">
            <span>
              Showing {items.length} of {totalItems} total belongings
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-apple-secondary"
                style={{ opacity: page === 1 ? 0.35 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-apple-secondary"
                style={{ opacity: page === totalPages ? 0.35 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
