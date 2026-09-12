import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ItemLedgerRow({ item }) {
  const navigate = useNavigate();

  const formattedDate = item.item_date
    ? new Date(item.item_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : '—';

  const itemCode = `CF·${String(item.id).padStart(4, '0')}`;

  return (
    <tr
      onClick={() => navigate(`/items/${item.id}`)}
      className="table-row-item"
    >
      {/* 1. Item Code */}
      <td style={{ width: '85px' }}>
        <span className="cell-item-id">{itemCode}</span>
      </td>

      {/* 2. Photo */}
      <td style={{ width: '64px' }}>
        {item.image_url ? (
          <img src={item.image_url} alt="" className="cell-item-media" loading="lazy" />
        ) : (
          <div className="cell-item-media-empty">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </td>

      {/* 3. Title & Description */}
      <td style={{ minWidth: '240px' }}>
        <Link
          to={`/items/${item.id}`}
          onClick={(e) => e.stopPropagation()}
          className="cell-title-text"
        >
          {item.title}
        </Link>
        {item.description && (
          <div className="cell-desc-text">{item.description}</div>
        )}
      </td>

      {/* 4. Type & Category */}
      <td style={{ width: '130px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <StatusBadge type={item.type} />
          <span style={{ fontSize: '0.75rem', color: '#86868b' }}>{item.category_name}</span>
        </div>
      </td>

      {/* 5. Campus Location */}
      <td style={{ width: '180px' }}>
        <span className="cell-location-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#86868b' }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.location}
          </span>
        </span>
      </td>

      {/* 6. Date */}
      <td style={{ width: '90px' }}>
        <span className="cell-date-text">{formattedDate}</span>
      </td>

      {/* 7. Status Indicator */}
      <td style={{ width: '120px' }}>
        <StatusBadge status={item.status} />
      </td>

      {/* 8. Inspect Action */}
      <td style={{ width: '80px', textAlign: 'right' }}>
        <span className="cell-action-btn">
          View ↗
        </span>
      </td>
    </tr>
  );
}
