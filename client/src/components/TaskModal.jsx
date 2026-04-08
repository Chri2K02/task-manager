import React, { useState, useEffect } from 'react';
import './Modal.css';

export default function TaskModal({ task, defaultStatus = 'todo', onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, dueDate: form.dueDate || undefined });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional details..."
            />
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              className="input"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{task ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
