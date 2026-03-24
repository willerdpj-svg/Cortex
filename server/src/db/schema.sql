CREATE TABLE IF NOT EXISTS prospects (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name    TEXT NOT NULL,
  company_type    TEXT NOT NULL CHECK (company_type IN ('Asset Manager','Manco','DFM','Brokerage','LISP','Other')),
  contact_name    TEXT,
  contact_role    TEXT,
  email           TEXT,
  phone           TEXT,
  linkedin_url    TEXT,
  estimated_aum   REAL,
  current_solution TEXT,
  pain_points     TEXT,
  notes           TEXT,
  source          TEXT,
  icp_aum_size        INTEGER CHECK (icp_aum_size BETWEEN 1 AND 10),
  icp_data_complexity  INTEGER CHECK (icp_data_complexity BETWEEN 1 AND 10),
  icp_pain_level       INTEGER CHECK (icp_pain_level BETWEEN 1 AND 10),
  icp_budget_readiness INTEGER CHECK (icp_budget_readiness BETWEEN 1 AND 10),
  icp_timeline_urgency INTEGER CHECK (icp_timeline_urgency BETWEEN 1 AND 10),
  icp_internal_champion INTEGER CHECK (icp_internal_champion BETWEEN 1 AND 10),
  icp_score       REAL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_prospects_company_type ON prospects(company_type);
CREATE INDEX IF NOT EXISTS idx_prospects_icp_score ON prospects(icp_score DESC);

CREATE TABLE IF NOT EXISTS deals (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  prospect_id       INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  stage             TEXT NOT NULL DEFAULT 'Identified' CHECK (stage IN (
                      'Identified','Researched','Outreach','Discovery',
                      'Proposal','Negotiation','Closed Won','Closed Lost')),
  monthly_value     REAL DEFAULT 0,
  services          TEXT,
  decision_maker    TEXT,
  champion          TEXT,
  next_step         TEXT,
  expected_close    TEXT,
  notes             TEXT,
  closed_at         TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deals_prospect ON deals(prospect_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);

CREATE TABLE IF NOT EXISTS deal_stage_history (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  deal_id      INTEGER NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_stage   TEXT,
  to_stage     TEXT NOT NULL,
  changed_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_stage_history_deal ON deal_stage_history(deal_id);

CREATE TABLE IF NOT EXISTS activities (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT NOT NULL CHECK (type IN (
                 'Call','Email','Meeting','LinkedIn',
                 'Proposal Sent','Demo','Follow-up','Internal')),
  prospect_id  INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  deal_id      INTEGER REFERENCES deals(id) ON DELETE SET NULL,
  date         TEXT NOT NULL,
  summary      TEXT NOT NULL,
  outcome      TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activities_prospect ON activities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);

CREATE TABLE IF NOT EXISTS tasks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  prospect_id  INTEGER REFERENCES prospects(id) ON DELETE SET NULL,
  deal_id      INTEGER REFERENCES deals(id) ON DELETE SET NULL,
  due_date     TEXT NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  notes        TEXT,
  completed    INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
