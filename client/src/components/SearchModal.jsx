import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import './SearchModal.css';

export default function SearchModal({ tasks, projects, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getProjectName = (task) =>
    projects.find((p) => p._id === task.project?._id)?.name ?? '';

  const getProjectColor = (task) =>
    projects.find((p) => p._id === task.project?._id)?.color ?? '#525252';

  const results = query.trim().length < 1 ? [] : tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) { go(results[selected]); }
    if (e.key === 'Escape') onClose();
  };

  const go = (task) => {
    navigate(`/project/${task.project?._id}`);
    onClose();
  };

  const PRIORITY_COLOR = { low: '#4ade80', medium: '#ca8a04', high: '#f87171' };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <Search size={15} className="search-icon" />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((t, i) => (
              <div
                key={t._id}
                className={`search-result ${i === selected ? 'active' : ''}`}
                onClick={() => go(t)}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="result-priority-dot" style={{ background: PRIORITY_COLOR[t.priority] }} />
                <div className="result-body">
                  <span className="result-title">{t.title}</span>
                  <div className="result-meta">
                    <span className="result-proj-dot" style={{ background: getProjectColor(t) }} />
                    <span className="result-proj">{getProjectName(t)}</span>
                    {t.description && <span className="result-desc">— {t.description}</span>}
                  </div>
                </div>
                <ArrowRight size={13} className="result-arrow" />
              </div>
            ))}
          </div>
        )}

        {query.trim().length > 0 && results.length === 0 && (
          <div className="search-empty">No tasks found for "{query}"</div>
        )}

        <div className="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
