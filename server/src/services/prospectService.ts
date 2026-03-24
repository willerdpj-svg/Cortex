import db from '../db/connection.js';
import { calculateIcpScore, type IcpScores } from '../lib/icp.js';

export interface ProspectInput {
  company_name: string;
  company_type: string;
  contact_name?: string;
  contact_role?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  estimated_aum?: number;
  current_solution?: string;
  pain_points?: string;
  notes?: string;
  source?: string;
}

interface ListParams {
  search?: string;
  type?: string;
  sort?: string;
  order?: string;
}

export function listProspects({ search, type, sort, order }: ListParams) {
  let query = 'SELECT * FROM prospects WHERE 1=1';
  const params: unknown[] = [];

  if (search) {
    query += ' AND (company_name LIKE ? OR contact_name LIKE ? OR email LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }
  if (type) {
    query += ' AND company_type = ?';
    params.push(type);
  }

  const sortCol = ['icp_score', 'company_name', 'created_at'].includes(sort || '')
    ? sort : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortCol} ${sortOrder}`;

  return db.prepare(query).all(...params);
}

export function getProspect(id: number) {
  return db.prepare('SELECT * FROM prospects WHERE id = ?').get(id);
}

export function createProspect(data: ProspectInput) {
  const stmt = db.prepare(`
    INSERT INTO prospects (company_name, company_type, contact_name, contact_role,
      email, phone, linkedin_url, estimated_aum, current_solution, pain_points, notes, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.company_name, data.company_type, data.contact_name || null,
    data.contact_role || null, data.email || null, data.phone || null,
    data.linkedin_url || null, data.estimated_aum || null,
    data.current_solution || null, data.pain_points || null,
    data.notes || null, data.source || null
  );
  return getProspect(result.lastInsertRowid as number);
}

export function updateProspect(id: number, data: Partial<ProspectInput>) {
  const fields = Object.keys(data).filter(k => data[k as keyof ProspectInput] !== undefined);
  if (fields.length === 0) return getProspect(id);

  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => data[f as keyof ProspectInput] ?? null);

  db.prepare(`UPDATE prospects SET ${sets}, updated_at = datetime('now') WHERE id = ?`)
    .run(...values, id);
  return getProspect(id);
}

export function deleteProspect(id: number) {
  return db.prepare('DELETE FROM prospects WHERE id = ?').run(id);
}

export function updateIcpScores(id: number, scores: IcpScores) {
  const composite = calculateIcpScore(scores);
  db.prepare(`
    UPDATE prospects SET
      icp_aum_size = ?, icp_data_complexity = ?, icp_pain_level = ?,
      icp_budget_readiness = ?, icp_timeline_urgency = ?, icp_internal_champion = ?,
      icp_score = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    scores.icp_aum_size, scores.icp_data_complexity, scores.icp_pain_level,
    scores.icp_budget_readiness, scores.icp_timeline_urgency, scores.icp_internal_champion,
    composite, id
  );
  return getProspect(id);
}
