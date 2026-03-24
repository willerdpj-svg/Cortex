import { Router } from 'express';
import * as svc from '../services/taskService.js';

const router = Router();

router.get('/', (req, res) => {
  const tasks = svc.listTasks(req.query as Record<string, string>);
  res.json(tasks);
});

router.post('/', (req, res) => {
  const task = svc.createTask(req.body);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const task = svc.updateTask(Number(req.params.id), req.body);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.patch('/:id/complete', (req, res) => {
  const task = svc.toggleComplete(Number(req.params.id));
  res.json(task);
});

router.delete('/:id', (req, res) => {
  svc.deleteTask(Number(req.params.id));
  res.status(204).end();
});

export default router;
