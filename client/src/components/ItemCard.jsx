import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
  const formattedDate = item.item_date
    ? new Date(item.item_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown date';

  return (
    <div className="item-card">
      <div className="item-card-image-wrapper">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="item-card-image"
            loading="lazy"
          />
        ) : (
          <div className="item-card-placeholder">
            <svg
              className="placeholder-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="placeholder-text">No Image Provided</span>
          </div>
        )}
        <div className="item-card-badges">
          <StatusBadge type={item.type} />
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="item-card-content">
        <div className="item-card-meta">
          <span className="item-card-category">{item.category_name}</span>
          <span className="item-card-date">{formattedDate}</span>
        </div>

        <h3 className="item-card-title" title={item.title}>
          {item.title}
        </h3>

        <p className="item-card-desc">
          {item.description ? (
            item.description.length > 95
              ? `${item.description.substring(0, 95)}...`
              : item.description
          ) : (
            <em>No description provided.</em>
          )}
        </p>

        <div className="item-card-footer">
          <div className="item-card-location" title={item.location}>
            <svg
              className="icon-small"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>{item.location}</span>
          </div>

          <Link to={`/items/${item.id}`} className="btn-view-details">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
