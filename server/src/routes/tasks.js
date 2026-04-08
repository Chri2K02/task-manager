const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    const filter = { owner: req.userId };
    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).populate('project', 'name color').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.body.project, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({ ...req.body, owner: req.userId });
    await task.populate('project', 'name color');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    ).populate('project', 'name color');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
