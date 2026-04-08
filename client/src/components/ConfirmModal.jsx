import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={18} />
        </div>
        <div className="confirm-body">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
