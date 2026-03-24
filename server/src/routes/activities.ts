import { Router } from 'express';
import * as svc from '../services/activityService.js';

const router = Router();

router.get('/', (req, res) => {
  const activities = svc.listActivities(req.query as Record<string, string>);
  res.json(activities);
});

router.post('/', (req, res) => {
  const activity = svc.createActivity(req.body);
  res.status(201).json(activity);
});

router.put('/:id', (req, res) => {
  const activity = svc.updateActivity(Number(req.params.id), req.body);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  res.json(activity);
});

router.delete('/:id', (req, res) => {
  svc.deleteActivity(Number(req.params.id));
  res.status(204).end();
});

export default router;
