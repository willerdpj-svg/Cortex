import db from '../db/connection.js';

const STAGE_WEIGHTS: Record<string, number> = {
  'Identified': 0.05,
  'Researched': 0.10,
  'Outreach': 0.15,
  'Discovery': 0.30,
  'Proposal': 0.50,
  'Negotiation': 0.75,
  'Closed Won': 1.00,
  'Closed Lost': 0,
};

export function getPipelineSummary() {
  const stages = db.prepare(`
    SELECT stage, COUNT(*) as count, SUM(monthly_value) as total_value
    FROM deals
    WHERE stage NOT IN ('Closed Won', 'Closed Lost')
    GROUP BY stage
  `).all() as { stage: string; count: number; total_value: number }[];

  let totalValue = 0;
  let weightedValue = 0;

  const byStage = stages.map(s => {
    totalValue += s.total_value || 0;
    weightedValue += (s.total_value || 0) * (STAGE_WEIGHTS[s.stage] || 0);
    return { ...s, weight: STAGE_WEIGHTS[s.stage] || 0 };
  });

  return { stages: byStage, totalValue, weightedValue };
}

export function getWonRevenue() {
  const result = db.prepare(`
    SELECT COUNT(*) as count, SUM(monthly_value) as total
    FROM deals WHERE stage = 'Closed Won'
  `).get() as { count: number; total: number };
  return result;
}

export function getWinRate() {
  const result = db.prepare(`
    SELECT
      COUNT(CASE WHEN stage = 'Closed Won' THEN 1 END) as won,
      COUNT(CASE WHEN stage IN ('Closed Won', 'Closed Lost') THEN 1 END) as closed
    FROM deals
  `).get() as { won: number; closed: number };
  return {
    won: result.won,
    closed: result.closed,
    rate: result.closed > 0 ? Math.round((result.won / result.closed) * 100) : 0,
  };
}

export function getActivityCount() {
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM activities
    WHERE date >= date('now', '-7 days')
  `).get() as { count: number };
  return { count: result.count, target: 20 };
}

export function getStaleDeals() {
  return db.prepare(`
    SELECT d.*, p.company_name AS prospect_name,
      MAX(a.date) as last_activity_date,
      CAST(julianday('now') - julianday(COALESCE(MAX(a.date), d.created_at)) AS INTEGER) as days_stale
    FROM deals d
    JOIN prospects p ON d.prospect_id = p.id
    LEFT JOIN activities a ON a.prospect_id = d.prospect_id
    WHERE d.stage NOT IN ('Closed Won', 'Closed Lost')
    GROUP BY d.id
    HAVING last_activity_date IS NULL
       OR julianday('now') - julianday(MAX(a.date)) >= 14
    ORDER BY days_stale DESC
  `).all();
}

export function getUpcomingTasks() {
  return db.prepare(`
    SELECT t.*, p.company_name AS prospect_name
    FROM tasks t
    LEFT JOIN prospects p ON t.prospect_id = p.id
    WHERE t.completed = 0 AND t.due_date <= date('now', '+7 days')
    ORDER BY t.due_date ASC
    LIMIT 10
  `).all();
}
