import { Router } from 'express';
import * as svc from '../services/prospectService.js';

const router = Router();

router.get('/', (req, res) => {
  const prospects = svc.listProspects(req.query as Record<string, string>);
  res.json(prospects);
});

router.get('/:id', (req, res) => {
  const prospect = svc.getProspect(Number(req.params.id));
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
  res.json(prospect);
});

router.post('/', (req, res) => {
  const prospect = svc.createProspect(req.body);
  res.status(201).json(prospect);
});

router.put('/:id', (req, res) => {
  const prospect = svc.updateProspect(Number(req.params.id), req.body);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
  res.json(prospect);
});

router.put('/:id/icp', (req, res) => {
  const prospect = svc.updateIcpScores(Number(req.params.id), req.body);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
  res.json(prospect);
});

router.delete('/:id', (req, res) => {
  svc.deleteProspect(Number(req.params.id));
  res.status(204).end();
});

export default router;
