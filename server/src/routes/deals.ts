import { Router } from 'express';
import * as svc from '../services/dealService.js';

const router = Router();

router.get('/', (req, res) => {
  const deals = svc.listDeals(req.query as Record<string, string>);
  res.json(deals);
});

router.get('/:id', (req, res) => {
  const deal = svc.getDeal(Number(req.params.id));
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  res.json(deal);
});

router.get('/:id/history', (req, res) => {
  const history = svc.getStageHistory(Number(req.params.id));
  res.json(history);
});

router.post('/', (req, res) => {
  const deal = svc.createDeal(req.body);
  res.status(201).json(deal);
});

router.put('/:id', (req, res) => {
  const deal = svc.updateDeal(Number(req.params.id), req.body);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  res.json(deal);
});

router.patch('/:id/stage', (req, res) => {
  const deal = svc.moveStage(Number(req.params.id), req.body.stage);
  res.json(deal);
});

router.delete('/:id', (req, res) => {
  svc.deleteDeal(Number(req.params.id));
  res.status(204).end();
});

export default router;
