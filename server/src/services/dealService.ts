import db from '../db/connection.js';

export interface DealInput {
  name: string;
  prospect_id: number;
  stage?: string;
  monthly_value?: number;
  services?: string;
  decision_maker?: string;
  champion?: string;
  next_step?: string;
  expected_close?: string;
  notes?: string;
}

export function listDeals(params: { stage?: string; prospect_id?: string }) {
  let query = 'SELECT d.*, p.company_name AS prospect_name FROM deals d JOIN prospects p ON d.prospect_id = p.id WHERE 1=1';
  const values: unknown[] = [];

  if (params.stage) {
    query += ' AND d.stage = ?';
    values.push(params.stage);
  }
  if (params.prospect_id) {
    query += ' AND d.prospect_id = ?';
    values.push(params.prospect_id);
  }
  query += ' ORDER BY d.updated_at DESC';
  return db.prepare(query).all(...values);
}

export function getDeal(id: number) {
  return db.prepare(`
    SELECT d.*, p.company_name AS prospect_name
    FROM deals d JOIN prospects p ON d.prospect_id = p.id
    WHERE d.id = ?
  `).get(id);
}

const createDealTx = db.transaction((data: DealInput) => {
  const stage = data.stage || 'Identified';
  const result = db.prepare(`
    INSERT INTO deals (name, prospect_id, stage, monthly_value, services,
      decision_maker, champion, next_step, expected_close, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.name, data.prospect_id, stage, data.monthly_value || 0,
    data.services || null, data.decision_maker || null, data.champion || null,
    data.next_step || null, data.expected_close || null, data.notes || null
  );
  const dealId = result.lastInsertRowid as number;

  db.prepare('INSERT INTO deal_stage_history (deal_id, from_stage, to_stage) VALUES (?, NULL, ?)')
    .run(dealId, stage);

  return getDeal(dealId);
});

export function createDeal(data: DealInput) {
  return createDealTx(data);
}

export function updateDeal(id: number, data: Partial<DealInput>) {
  const fields = Object.keys(data).filter(k => k !== 'stage' && data[k as keyof DealInput] !== undefined);
  if (fields.length === 0) return getDeal(id);

  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => data[f as keyof DealInput] ?? null);

  db.prepare(`UPDATE deals SET ${sets}, updated_at = datetime('now') WHERE id = ?`)
    .run(...values, id);
  return getDeal(id);
}

const moveStageTx = db.transaction((dealId: number, newStage: string) => {
  const deal = db.prepare('SELECT stage FROM deals WHERE id = ?').get(dealId) as { stage: string } | undefined;
  if (!deal) throw new Error('Deal not found');
  if (deal.stage === newStage) return getDeal(dealId);

  const updates = newStage === 'Closed Won' || newStage === 'Closed Lost'
    ? `stage = ?, closed_at = datetime('now'), updated_at = datetime('now')`
    : `stage = ?, updated_at = datetime('now')`;

  db.prepare(`UPDATE deals SET ${updates} WHERE id = ?`).run(newStage, dealId);
  db.prepare('INSERT INTO deal_stage_history (deal_id, from_stage, to_stage) VALUES (?, ?, ?)')
    .run(dealId, deal.stage, newStage);

  return getDeal(dealId);
});

export function moveStage(dealId: number, newStage: string) {
  return moveStageTx(dealId, newStage);
}

export function getStageHistory(dealId: number) {
  return db.prepare(`
    SELECT h.*,
      (SELECT MIN(h2.changed_at) FROM deal_stage_history h2
       WHERE h2.deal_id = h.deal_id AND h2.id > h.id) AS exited_at
    FROM deal_stage_history h
    WHERE h.deal_id = ?
    ORDER BY h.changed_at ASC
  `).all(dealId);
}

export function deleteDeal(id: number) {
  return db.prepare('DELETE FROM deals WHERE id = ?').run(id);
}
