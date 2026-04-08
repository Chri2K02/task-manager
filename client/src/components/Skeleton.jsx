import React from 'react';
import './Skeleton.css';

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton-accent" />
      <div className="skeleton-body">
        <div className="skeleton-line w60" />
        <div className="skeleton-line w40" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line w40" />
      <div className="skeleton-line w80" style={{ marginTop: 6 }} />
      <div className="skeleton-line w30" style={{ marginTop: 10 }} />
    </div>
  );
}
