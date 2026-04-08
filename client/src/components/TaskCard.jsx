import React from 'react';
import { Pencil, Trash2, Calendar, ArrowRight } from 'lucide-react';
import './TaskCard.css';

const PRIORITY_COLOR = { low: '#4ade80', medium: '#ca8a04', high: '#f87171' };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onOpenDetail }) {
  const NEXT = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
  const NEXT_LABEL = { todo: 'Start', 'in-progress': 'Complete', done: 'Reopen' };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="task-card">
      <div className="tc-accent" style={{ background: PRIORITY_COLOR[task.priority] }} />
      <div className="tc-inner">
        <div className="tc-header">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <div className="tc-actions">
            <button className="tc-icon-btn" onClick={onEdit}><Pencil size={12} /></button>
            <button className="tc-icon-btn danger" onClick={onDelete}><Trash2 size={12} /></button>
          </div>
        </div>

        <p
          className={`tc-title ${task.status === 'done' ? 'strikethrough' : ''}`}
          onClick={onOpenDetail}
        >
          {task.title}
        </p>

        {task.description && <p className="tc-desc">{task.description}</p>}

        <div className="tc-footer">
          {task.dueDate ? (
            <span className={`tc-date ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={11} /> {formatDate(task.dueDate)}
            </span>
          ) : <span />}
          <button className="tc-next-btn" onClick={() => onStatusChange(NEXT[task.status])}>
            {NEXT_LABEL[task.status]} <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
