import { Router } from 'express';
import * as svc from '../services/dashboardService.js';

const router = Router();

router.get('/pipeline-summary', (_req, res) => {
  res.json(svc.getPipelineSummary());
});

router.get('/won-revenue', (_req, res) => {
  res.json(svc.getWonRevenue());
});

router.get('/win-rate', (_req, res) => {
  res.json(svc.getWinRate());
});

router.get('/activity-count', (_req, res) => {
  res.json(svc.getActivityCount());
});

router.get('/stale-deals', (_req, res) => {
  res.json(svc.getStaleDeals());
});

router.get('/upcoming-tasks', (_req, res) => {
  res.json(svc.getUpcomingTasks());
});

export default router;
