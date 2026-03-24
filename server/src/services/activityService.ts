import db from '../db/connection.js';

export interface ActivityInput {
  type: string;
  prospect_id: number;
  deal_id?: number;
  date: string;
  summary: string;
  outcome?: string;
}

export function listActivities(params: { prospect_id?: string; deal_id?: string; type?: string }) {
  let query = `
    SELECT a.*, p.company_name AS prospect_name
    FROM activities a
    JOIN prospects p ON a.prospect_id = p.id
    WHERE 1=1
  `;
  const values: unknown[] = [];

  if (params.prospect_id) {
    query += ' AND a.prospect_id = ?';
    values.push(params.prospect_id);
  }
  if (params.deal_id) {
    query += ' AND a.deal_id = ?';
    values.push(params.deal_id);
  }
  if (params.type) {
    query += ' AND a.type = ?';
    values.push(params.type);
  }
  query += ' ORDER BY a.date DESC, a.created_at DESC';
  return db.prepare(query).all(...values);
}

export function getActivity(id: number) {
  return db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
}

export function createActivity(data: ActivityInput) {
  const result = db.prepare(`
    INSERT INTO activities (type, prospect_id, deal_id, date, summary, outcome)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.type, data.prospect_id, data.deal_id || null, data.date, data.summary, data.outcome || null);
  return getActivity(result.lastInsertRowid as number);
}

export function updateActivity(id: number, data: Partial<ActivityInput>) {
  const fields = Object.keys(data).filter(k => data[k as keyof ActivityInput] !== undefined);
  if (fields.length === 0) return getActivity(id);

  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => data[f as keyof ActivityInput] ?? null);

  db.prepare(`UPDATE activities SET ${sets} WHERE id = ?`).run(...values, id);
  return getActivity(id);
}

export function deleteActivity(id: number) {
  return db.prepare('DELETE FROM activities WHERE id = ?').run(id);
}
