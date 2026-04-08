import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Layers, ArrowRight } from 'lucide-react';
import './TaskDetailPanel.css';

const PRIORITY_COLOR = { low: '#4ade80', medium: '#ca8a04', high: '#f87171' };
const STATUS_NEXT = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
const STATUS_LABEL = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

export default function TaskDetailPanel({ task, projectName, projectColor, onClose, onSave, onStatusChange }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave({ ...form, dueDate: form.dueDate || undefined });
    setDirty(false);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} />
      <div className="task-detail-panel">
        <div className="tdp-header">
          <div className="tdp-project">
            <span className="tdp-project-dot" style={{ background: projectColor }} />
            <span>{projectName}</span>
          </div>
          <button className="tdp-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="tdp-body">
          <textarea
            className="tdp-title-input"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            rows={2}
          />

          <div className="tdp-meta-row">
            <div className="tdp-meta-item">
              <Flag size={12} className="tdp-meta-icon" />
              <span className="tdp-meta-label">Priority</span>
              <select
                className="tdp-select"
                value={form.priority}
                onChange={(e) => update('priority', e.target.value)}
                style={{ color: PRIORITY_COLOR[form.priority] }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="tdp-meta-item">
              <Calendar size={12} className="tdp-meta-icon" />
              <span className="tdp-meta-label">Due date</span>
              <input
                className="tdp-date-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
              />
            </div>

            <div className="tdp-meta-item">
              <Layers size={12} className="tdp-meta-icon" />
              <span className="tdp-meta-label">Status</span>
              <button
                className={`tdp-status badge badge-${task.status}`}
                onClick={() => onStatusChange(STATUS_NEXT[task.status])}
              >
                {STATUS_LABEL[task.status]} <ArrowRight size={10} />
              </button>
            </div>
          </div>

          {isOverdue && (
            <div className="tdp-overdue-banner">
              Task is overdue — due {formatDate(task.dueDate)}
            </div>
          )}

          <div className="tdp-desc-section">
            <label className="tdp-desc-label">Description</label>
            <textarea
              className="tdp-desc-input"
              placeholder="Add a description..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <div className="tdp-footer">
          <span className="tdp-created">
            Created {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <div className="tdp-footer-actions">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={!dirty}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
