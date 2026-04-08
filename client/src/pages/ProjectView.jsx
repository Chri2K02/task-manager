import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import TaskDetailPanel from '../components/TaskDetailPanel';
import SearchModal from '../components/SearchModal';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import './ProjectView.css';

const COLUMNS = [
  { key: 'todo',        label: 'To Do',      color: '#525252' },
  { key: 'in-progress', label: 'In Progress', color: '#3b82f6' },
  { key: 'done',        label: 'Done',        color: '#22c55e' },
];

const PRIORITIES = ['all', 'high', 'medium', 'low'];

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      const [projs, taskData] = await Promise.all([
        axios.get('/api/projects').then((r) => r.data),
        axios.get(`/api/tasks?projectId=${id}`).then((r) => r.data),
      ]);
      setAllProjects(projs);
      setProject(projs.find((p) => p._id === id));
      setTasks(taskData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openAdd('todo'); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') {
        setShowModal(false);
        setDetailTask(null);
        setShowSearch(false);
        setConfirmDelete(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    const task = tasks.find((t) => t._id === draggableId);
    if (!task || task.status === newStatus) return;
    setTasks((prev) => prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t)));
    try {
      await axios.put(`/api/tasks/${draggableId}`, { status: newStatus });
    } catch {
      setTasks((prev) => prev.map((t) => (t._id === draggableId ? { ...t, status: task.status } : t)));
    }
  };

  const openAdd = (status) => { setEditTask(null); setDefaultStatus(status); setShowModal(true); };

  const handleSave = async (formData) => {
    if (editTask) {
      const { data } = await axios.put(`/api/tasks/${editTask._id}`, formData);
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
      if (detailTask?._id === data._id) setDetailTask(data);
      toast('Task updated');
    } else {
      const { data } = await axios.post('/api/tasks', { ...formData, project: id });
      setTasks([data, ...tasks]);
      toast('Task created');
    }
    setShowModal(false);
    setEditTask(null);
  };

  const handleDetailSave = async (formData) => {
    const { data } = await axios.put(`/api/tasks/${detailTask._id}`, formData);
    setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
    setDetailTask(data);
    toast('Task updated');
  };

  const handleDelete = async (taskId) => {
    await axios.delete(`/api/tasks/${taskId}`);
    setTasks(tasks.filter((t) => t._id !== taskId));
    if (detailTask?._id === taskId) setDetailTask(null);
    setConfirmDelete(null);
    toast('Task deleted', 'error');
  };

  const handleStatusChange = async (task, status) => {
    const { data } = await axios.put(`/api/tasks/${task._id}`, { status });
    setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
    if (detailTask?._id === data._id) setDetailTask(data);
  };

  const openEdit = (task) => { setEditTask(task); setShowModal(true); };

  if (!project && !loading) return null;

  const done = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const filteredTasks = filterPriority === 'all'
    ? tasks
    : tasks.filter((t) => t.priority === filterPriority);

  return (
    <div className="project-view">
      <header className="pv-header">
        <div className="pv-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> Projects
          </button>
          <div className="pv-title">
            {project && <span className="pv-color-dot" style={{ background: project.color }} />}
            <h1>{project?.name ?? '...'}</h1>
          </div>
          {project?.description && <p className="pv-desc">{project.description}</p>}
        </div>
        <div className="pv-header-right">
          {tasks.length > 0 && (
            <div className="pv-progress">
              <div className="pv-progress-track">
                <div className="pv-progress-fill" style={{ width: `${progress}%`, background: project?.color }} />
              </div>
              <span className="pv-progress-label">{progress}%</span>
            </div>
          )}
          <button className="pv-search-btn" onClick={() => setShowSearch(true)} title="Search (⌘K)">
            <Search size={14} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button className="btn btn-primary" onClick={() => openAdd('todo')} title="New task (N)">
            <Plus size={13} /> Add task
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Priority:</span>
        {PRIORITIES.map((p) => (
          <button
            key={p}
            className={`filter-btn ${filterPriority === p ? 'active' : ''}`}
            onClick={() => setFilterPriority(p)}
          >
            {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        {filterPriority !== 'all' && (
          <span className="filter-result">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</span>
        )}
        <span className="shortcut-hint">Press <kbd>N</kbd> to add a task</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="col-label-row">
                    <span className="col-dot" style={{ background: col.color }} />
                    <span className="col-label">{col.label}</span>
                    <span className="col-count">{colTasks.length}</span>
                  </div>
                  <button className="col-add-btn" onClick={() => openAdd(col.key)}>
                    <Plus size={13} />
                  </button>
                </div>
                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div
                      className={`kanban-tasks ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {loading
                        ? [1,2].map((i) => <SkeletonCard key={i} />)
                        : colTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'dragging' : ''}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={() => openEdit(task)}
                                  onDelete={() => setConfirmDelete(task)}
                                  onStatusChange={(status) => handleStatusChange(task, status)}
                                  onOpenDetail={() => setDetailTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      }
                      {provided.placeholder}
                      {!loading && colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <button className="col-empty-btn" onClick={() => openAdd(col.key)}>
                          <Plus size={12} /> Add task
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal
          task={editTask}
          defaultStatus={defaultStatus}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete task"
          message={`"${confirmDelete.title}" will be permanently deleted.`}
          onConfirm={() => handleDelete(confirmDelete._id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {detailTask && (
        <TaskDetailPanel
          task={detailTask}
          projectName={project?.name}
          projectColor={project?.color}
          onClose={() => setDetailTask(null)}
          onSave={handleDetailSave}
          onStatusChange={(status) => handleStatusChange(detailTask, status)}
        />
      )}

      {showSearch && (
        <SearchModal
          tasks={tasks}
          projects={allProjects}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}
