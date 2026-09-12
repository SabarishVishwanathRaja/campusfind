import React from 'react';

export default function StatusBadge({ status, type }) {
  if (type) {
    const isLost = type.toUpperCase() === 'LOST';
    return (
      <span className={`apple-status-indicator ${isLost ? 'status-lost' : 'status-found'}`}>
        <span className={`status-dot ${isLost ? 'lost' : 'found'}`} />
        <span>{isLost ? 'Lost' : 'Found'}</span>
      </span>
    );
  }

  if (status) {
    const upper = status.toUpperCase();
    let statusClass = 'status-open';
    let dotClass = 'open';
    let label = 'Open';

    if (upper === 'CLAIMED' || upper === 'PENDING') {
      statusClass = 'status-claimed';
      dotClass = 'claimed';
      label = upper === 'PENDING' ? 'In Verification' : 'Claimed';
    } else if (upper === 'RETURNED' || upper === 'APPROVED') {
      statusClass = 'status-returned';
      dotClass = 'returned';
      label = upper === 'APPROVED' ? 'Approved' : 'Returned';
    } else if (upper === 'REJECTED') {
      statusClass = 'status-lost';
      dotClass = 'lost';
      label = 'Rejected';
    }

    return (
      <span className={`apple-status-indicator ${statusClass}`}>
        <span className={`status-dot ${dotClass}`} />
        <span>{label}</span>
      </span>
    );
  }

  return null;
}
