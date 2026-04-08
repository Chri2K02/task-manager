import React, { useState, useEffect } from 'react';
import './Modal.css';

const COLORS = ['#6366f1', '#ec4899', '#f97316', '#22c55e', '#06b6d4', '#a855f7', '#eab308'];

export default function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' });

  useEffect(() => {
    if (project) setForm({ name: project.name, description: project.description || '', color: project.color });
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{project ? 'Edit Project' : 'New Project'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's this project about?"
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-dot ${form.color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{project ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
