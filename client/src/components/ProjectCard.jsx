import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import './ProjectCard.css';

export default function ProjectCard({ project, tasks = [], onClick, onEdit, onDelete }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const created = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="project-card" onClick={onClick}>
      <div className="pc-top">
        <div className="pc-color-swatch" style={{ background: project.color }} />
        <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
          <button className="pc-action-btn" onClick={onEdit} title="Edit">
            <Pencil size={13} />
          </button>
          <button className="pc-action-btn danger" onClick={onDelete} title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3 className="pc-name">{project.name}</h3>
      {project.description && <p className="pc-desc">{project.description}</p>}

      <div className="pc-progress-row">
        <div className="pc-progress-track">
          <div className="pc-progress-fill" style={{ width: `${progress}%`, background: project.color }} />
        </div>
        <span className="pc-pct">{progress}%</span>
      </div>

      <div className="pc-footer">
        <span className="pc-meta">{total} task{total !== 1 ? 's' : ''}</span>
        <span className="pc-meta">{created}</span>
      </div>
    </div>
  );
}
