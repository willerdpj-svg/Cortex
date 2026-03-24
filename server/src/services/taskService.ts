import db from '../db/connection.js';

export interface TaskInput {
  title: string;
  prospect_id?: number;
  deal_id?: number;
  due_date: string;
  priority?: string;
  notes?: string;
}

export function listTasks(params: { completed?: string; priority?: string; prospect_id?: string; deal_id?: string; overdue?: string }) {
  let query = `
    SELECT t.*, p.company_name AS prospect_name
    FROM tasks t
    LEFT JOIN prospects p ON t.prospect_id = p.id
    WHERE 1=1
  `;
  const values: unknown[] = [];

  if (params.completed !== undefined) {
    query += ' AND t.completed = ?';
    values.push(params.completed);
  }
  if (params.priority) {
    query += ' AND t.priority = ?';
    values.push(params.priority);
  }
  if (params.prospect_id) {
    query += ' AND t.prospect_id = ?';
    values.push(params.prospect_id);
  }
  if (params.deal_id) {
    query += ' AND t.deal_id = ?';
    values.push(params.deal_id);
  }
  if (params.overdue === '1') {
    query += " AND t.completed = 0 AND t.due_date < date('now')";
  }
  query += ' ORDER BY t.due_date ASC';
  return db.prepare(query).all(...values);
}

export function getTask(id: number) {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

export function createTask(data: TaskInput) {
  const result = db.prepare(`
    INSERT INTO tasks (title, prospect_id, deal_id, due_date, priority, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.title, data.prospect_id || null, data.deal_id || null,
    data.due_date, data.priority || 'medium', data.notes || null);
  return getTask(result.lastInsertRowid as number);
}

export function updateTask(id: number, data: Partial<TaskInput>) {
  const fields = Object.keys(data).filter(k => data[k as keyof TaskInput] !== undefined);
  if (fields.length === 0) return getTask(id);

  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => data[f as keyof TaskInput] ?? null);

  db.prepare(`UPDATE tasks SET ${sets}, updated_at = datetime('now') WHERE id = ?`)
    .run(...values, id);
  return getTask(id);
}

export function toggleComplete(id: number) {
  const task = getTask(id) as { completed: number } | undefined;
  if (!task) throw new Error('Task not found');

  const newCompleted = task.completed ? 0 : 1;
  const completedAt = newCompleted ? "datetime('now')" : 'NULL';

  db.prepare(`UPDATE tasks SET completed = ?, completed_at = ${completedAt}, updated_at = datetime('now') WHERE id = ?`)
    .run(newCompleted, id);
  return getTask(id);
}

export function deleteTask(id: number) {
  return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}
