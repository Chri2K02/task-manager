import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { Layers, Plus, LogOut, Pencil, Trash2, ChevronRight, Clock, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProjectModal from '../components/ProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import SearchModal from '../components/SearchModal';
import { SkeletonRow } from '../components/Skeleton';
import './Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [projRes, taskRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/tasks'),
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    if (editProject) {
      const { data } = await axios.put(`/api/projects/${editProject._id}`, formData);
      setProjects(projects.map((p) => (p._id === data._id ? data : p)));
      toast('Project updated');
    } else {
      const { data } = await axios.post('/api/projects', formData);
      setProjects([data, ...projects]);
      toast('Project created');
    }
    setShowModal(false);
    setEditProject(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
    setTasks(tasks.filter((t) => t.project?._id !== id));
    setConfirmDelete(null);
    toast('Project deleted', 'error');
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');

  const activeTasks = tasks
    .filter((t) => t.status === 'in-progress')
    .slice(0, 6);

  const recentTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const getProjectName = (task) =>
    projects.find((p) => p._id === task.project?._id)?.name ?? '';

  const getProjectColor = (task) =>
    projects.find((p) => p._id === task.project?._id)?.color ?? '#525252';

  const getTaskCount = (projectId) => tasks.filter((t) => t.project?._id === projectId).length;

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Layers size={18} strokeWidth={1.5} />
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Workspace</span>
          <a className="nav-item active">
            <span>Projects</span>
            <span className="nav-badge">{projects.length}</span>
          </a>
          <a className="nav-item muted" onClick={() => setShowModal(true)}>
            <Plus size={13} /> New project
          </a>
          <a className="nav-item muted" onClick={() => setShowSearch(true)}>
            <Search size={13} /> Search <kbd style={{marginLeft:'auto',fontSize:10}}>⌘K</kbd>
          </a>
        </nav>

        {projects.length > 0 && (
          <div className="sidebar-project-list">
            {projects.map((p) => (
              <a key={p._id} className="sidebar-proj" onClick={() => navigate(`/project/${p._id}`)}>
                <span className="sidebar-proj-dot" style={{ background: p.color }} />
                <span className="sidebar-proj-name">{p.name}</span>
                <span className="sidebar-proj-count">{getTaskCount(p._id)}</span>
              </a>
            ))}
          </div>
        )}

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-initials">{initials}</div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign out">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-content">
          {/* Left column */}
          <div className="dash-left">
            <div className="dash-header">
              <div>
                <h1>Projects</h1>
                {!loading && (
                  <div className="dash-meta">
                    <span>{totalTasks} tasks</span>
                    <span className="dot">·</span>
                    <span>{inProgressTasks} in progress</span>
                    {overdueTasks.length > 0 && <>
                      <span className="dot">·</span>
                      <span className="overdue-text">{overdueTasks.length} overdue</span>
                    </>}
                    <span className="dot">·</span>
                    <span className="done-text">{doneTasks} done</span>
                  </div>
                )}
              </div>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={13} /> New project
              </button>
            </div>

            {loading ? (
              <div className="project-list">
                {[1,2,3].map((i) => <SkeletonRow key={i} />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <Layers size={32} strokeWidth={1} />
                <p>No projects yet</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <Plus size={13} /> Create your first project
                </button>
              </div>
            ) : (
              <div className="project-list">
                {projects.map((p) => {
                  const ptasks = tasks.filter((t) => t.project?._id === p._id);
                  const done = ptasks.filter((t) => t.status === 'done').length;
                  const inProg = ptasks.filter((t) => t.status === 'in-progress').length;
                  const todo = ptasks.filter((t) => t.status === 'todo').length;
                  const progress = ptasks.length > 0 ? Math.round((done / ptasks.length) * 100) : 0;

                  return (
                    <div key={p._id} className="project-row" onClick={() => navigate(`/project/${p._id}`)}>
                      <div className="project-row-accent" style={{ background: p.color }} />
                      <div className="project-row-body">
                        <div className="project-row-top">
                          <span className="project-row-name">{p.name}</span>
                          <div className="project-row-actions" onClick={(e) => e.stopPropagation()}>
                            <button className="row-action-btn" onClick={() => { setEditProject(p); setShowModal(true); }}>
                              <Pencil size={12} />
                            </button>
                            <button className="row-action-btn danger" onClick={() => setConfirmDelete(p)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        {p.description && <p className="project-row-desc">{p.description}</p>}
                        <div className="project-row-footer">
                          <div className="task-breakdown">
                            {todo > 0 && <span className="breakdown-pill todo">{todo} to do</span>}
                            {inProg > 0 && <span className="breakdown-pill in-progress">{inProg} active</span>}
                            {done > 0 && <span className="breakdown-pill done">{done} done</span>}
                            {ptasks.length === 0 && <span className="breakdown-pill empty">No tasks</span>}
                          </div>
                          <div className="progress-wrap">
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${progress}%`, background: p.color }} />
                            </div>
                            <span className="progress-label">{progress}%</span>
                          </div>
                          <ChevronRight size={13} className="row-chevron" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="dash-right">
            {overdueTasks.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <AlertCircle size={13} className="panel-icon overdue-icon" />
                  <span>Overdue</span>
                  <span className="panel-count">{overdueTasks.length}</span>
                </div>
                <div className="panel-list">
                  {overdueTasks.slice(0, 4).map((t) => (
                    <div
                      key={t._id}
                      className="panel-task"
                      onClick={() => navigate(`/project/${t.project?._id}`)}
                    >
                      <span className="panel-task-dot" style={{ background: getProjectColor(t) }} />
                      <div className="panel-task-body">
                        <span className="panel-task-title">{t.title}</span>
                        <span className="panel-task-sub">{getProjectName(t)} · Due {formatDate(t.dueDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="panel">
              <div className="panel-header">
                <Clock size={13} className="panel-icon" />
                <span>In Progress</span>
                <span className="panel-count">{activeTasks.length}</span>
              </div>
              {activeTasks.length === 0 ? (
                <p className="panel-empty">Nothing in progress</p>
              ) : (
                <div className="panel-list">
                  {activeTasks.map((t) => (
                    <div
                      key={t._id}
                      className="panel-task"
                      onClick={() => navigate(`/project/${t.project?._id}`)}
                    >
                      <span className="panel-task-dot" style={{ background: getProjectColor(t) }} />
                      <div className="panel-task-body">
                        <span className="panel-task-title">{t.title}</span>
                        <span className="panel-task-sub">{getProjectName(t)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel">
              <div className="panel-header">
                <CheckCircle2 size={13} className="panel-icon" />
                <span>Up Next</span>
              </div>
              {recentTasks.length === 0 ? (
                <p className="panel-empty">All caught up</p>
              ) : (
                <div className="panel-list">
                  {recentTasks.map((t) => (
                    <div
                      key={t._id}
                      className="panel-task"
                      onClick={() => navigate(`/project/${t.project?._id}`)}
                    >
                      <span className="panel-task-dot" style={{ background: getProjectColor(t) }} />
                      <div className="panel-task-body">
                        <span className="panel-task-title">{t.title}</span>
                        <span className="panel-task-sub">{getProjectName(t)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <ProjectModal
          project={editProject}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProject(null); }}
        />
      )}
      {showSearch && (
        <SearchModal
          tasks={tasks}
          projects={projects}
          onClose={() => setShowSearch(false)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete project"
          message={`"${confirmDelete.name}" and all its tasks will be permanently deleted.`}
          onConfirm={() => handleDelete(confirmDelete._id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
