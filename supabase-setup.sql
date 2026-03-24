-- ============================================================
-- CORTEX CRM - Supabase Setup
-- Run this entire file in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ===================== SCHEMA =====================

CREATE TABLE prospects (
  id                BIGSERIAL PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name      TEXT NOT NULL,
  company_type      TEXT NOT NULL CHECK (company_type IN ('Asset Manager','Manco','DFM','Brokerage','LISP','Other')),
  contact_name      TEXT,
  contact_role      TEXT,
  email             TEXT,
  phone             TEXT,
  linkedin_url      TEXT,
  estimated_aum     DOUBLE PRECISION,
  current_solution  TEXT,
  pain_points       TEXT,
  notes             TEXT,
  source            TEXT,
  icp_aum_size          SMALLINT CHECK (icp_aum_size BETWEEN 1 AND 10),
  icp_data_complexity   SMALLINT CHECK (icp_data_complexity BETWEEN 1 AND 10),
  icp_pain_level        SMALLINT CHECK (icp_pain_level BETWEEN 1 AND 10),
  icp_budget_readiness  SMALLINT CHECK (icp_budget_readiness BETWEEN 1 AND 10),
  icp_timeline_urgency  SMALLINT CHECK (icp_timeline_urgency BETWEEN 1 AND 10),
  icp_internal_champion SMALLINT CHECK (icp_internal_champion BETWEEN 1 AND 10),
  icp_score         DOUBLE PRECISION,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deals (
  id                BIGSERIAL PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  prospect_id       BIGINT NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  stage             TEXT NOT NULL DEFAULT 'Identified' CHECK (stage IN (
                      'Identified','Researched','Outreach','Discovery',
                      'Proposal','Negotiation','Closed Won','Closed Lost')),
  monthly_value     DOUBLE PRECISION DEFAULT 0,
  services          TEXT,
  decision_maker    TEXT,
  champion          TEXT,
  next_step         TEXT,
  expected_close    DATE,
  notes             TEXT,
  closed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deal_stage_history (
  id           BIGSERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id      BIGINT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_stage   TEXT,
  to_stage     TEXT NOT NULL,
  changed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activities (
  id           BIGSERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN (
                 'Call','Email','Meeting','LinkedIn',
                 'Proposal Sent','Demo','Follow-up','Internal')),
  prospect_id  BIGINT NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  deal_id      BIGINT REFERENCES deals(id) ON DELETE SET NULL,
  date         DATE NOT NULL,
  summary      TEXT NOT NULL,
  outcome      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id           BIGSERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  prospect_id  BIGINT REFERENCES prospects(id) ON DELETE SET NULL,
  deal_id      BIGINT REFERENCES deals(id) ON DELETE SET NULL,
  due_date     DATE NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  notes        TEXT,
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_prospects_user ON prospects(user_id);
CREATE INDEX idx_prospects_company_type ON prospects(company_type);
CREATE INDEX idx_prospects_icp_score ON prospects(icp_score DESC NULLS LAST);
CREATE INDEX idx_deals_user ON deals(user_id);
CREATE INDEX idx_deals_prospect ON deals(prospect_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_stage_history_deal ON deal_stage_history(deal_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_prospect ON activities(prospect_id);
CREATE INDEX idx_activities_deal ON activities(deal_id);
CREATE INDEX idx_activities_date ON activities(date DESC);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_prospects_updated BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_deals_updated BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tasks_updated BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===================== ROW LEVEL SECURITY =====================

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Prospects
CREATE POLICY "Users can view own prospects" ON prospects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prospects" ON prospects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prospects" ON prospects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prospects" ON prospects FOR DELETE USING (auth.uid() = user_id);

-- Deals
CREATE POLICY "Users can view own deals" ON deals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deals" ON deals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deals" ON deals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deals" ON deals FOR DELETE USING (auth.uid() = user_id);

-- Deal Stage History
CREATE POLICY "Users can view own deal history" ON deal_stage_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deal history" ON deal_stage_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activities
CREATE POLICY "Users can view own activities" ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activities" ON activities FOR DELETE USING (auth.uid() = user_id);

-- Tasks
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- ===================== RPC FUNCTIONS =====================

-- 1. Create deal + initial stage history atomically
CREATE OR REPLACE FUNCTION create_deal_with_history(
  p_user_id UUID,
  p_name TEXT,
  p_prospect_id BIGINT,
  p_stage TEXT DEFAULT 'Identified',
  p_monthly_value DOUBLE PRECISION DEFAULT 0,
  p_services TEXT DEFAULT NULL,
  p_decision_maker TEXT DEFAULT NULL,
  p_champion TEXT DEFAULT NULL,
  p_next_step TEXT DEFAULT NULL,
  p_expected_close DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS SETOF deals
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_deal deals%ROWTYPE;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM prospects WHERE id = p_prospect_id AND user_id = p_user_id) THEN
    RAISE EXCEPTION 'Prospect not found or access denied';
  END IF;

  INSERT INTO deals (user_id, name, prospect_id, stage, monthly_value, services,
    decision_maker, champion, next_step, expected_close, notes)
  VALUES (p_user_id, p_name, p_prospect_id, p_stage, p_monthly_value, p_services,
    p_decision_maker, p_champion, p_next_step, p_expected_close, p_notes)
  RETURNING * INTO new_deal;

  INSERT INTO deal_stage_history (user_id, deal_id, from_stage, to_stage)
  VALUES (p_user_id, new_deal.id, NULL, p_stage);

  RETURN NEXT new_deal;
END;
$$;

-- 2. Move deal stage + record history atomically
CREATE OR REPLACE FUNCTION move_deal_stage(
  p_user_id UUID,
  p_deal_id BIGINT,
  p_new_stage TEXT
)
RETURNS SETOF deals
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_stage TEXT;
  updated_deal deals%ROWTYPE;
BEGIN
  SELECT stage INTO current_stage FROM deals
    WHERE id = p_deal_id AND user_id = p_user_id;

  IF current_stage IS NULL THEN
    RAISE EXCEPTION 'Deal not found or access denied';
  END IF;

  IF current_stage = p_new_stage THEN
    RETURN QUERY SELECT * FROM deals WHERE id = p_deal_id;
    RETURN;
  END IF;

  IF p_new_stage IN ('Closed Won', 'Closed Lost') THEN
    UPDATE deals SET stage = p_new_stage, closed_at = NOW()
      WHERE id = p_deal_id AND user_id = p_user_id
      RETURNING * INTO updated_deal;
  ELSE
    UPDATE deals SET stage = p_new_stage
      WHERE id = p_deal_id AND user_id = p_user_id
      RETURNING * INTO updated_deal;
  END IF;

  INSERT INTO deal_stage_history (user_id, deal_id, from_stage, to_stage)
  VALUES (p_user_id, p_deal_id, current_stage, p_new_stage);

  RETURN NEXT updated_deal;
END;
$$;

-- 3. Get stale deals (no activity in 14+ days)
CREATE OR REPLACE FUNCTION get_stale_deals(p_user_id UUID)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  prospect_id BIGINT,
  stage TEXT,
  monthly_value DOUBLE PRECISION,
  prospect_name TEXT,
  last_activity_date DATE,
  days_stale INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    d.id,
    d.name,
    d.prospect_id,
    d.stage,
    d.monthly_value,
    p.company_name AS prospect_name,
    MAX(a.date) AS last_activity_date,
    EXTRACT(DAY FROM NOW() - COALESCE(MAX(a.date), d.created_at::date)::timestamp)::INT AS days_stale
  FROM deals d
  JOIN prospects p ON d.prospect_id = p.id
  LEFT JOIN activities a ON a.prospect_id = d.prospect_id AND a.user_id = p_user_id
  WHERE d.user_id = p_user_id
    AND d.stage NOT IN ('Closed Won', 'Closed Lost')
  GROUP BY d.id, d.name, d.prospect_id, d.stage, d.monthly_value, p.company_name, d.created_at
  HAVING MAX(a.date) IS NULL
     OR EXTRACT(DAY FROM NOW() - MAX(a.date)::timestamp) >= 14
  ORDER BY days_stale DESC;
$$;

-- 4. Toggle task completion
CREATE OR REPLACE FUNCTION toggle_task_complete(p_user_id UUID, p_task_id BIGINT)
RETURNS SETOF tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tasks
  SET
    completed = NOT completed,
    completed_at = CASE WHEN NOT completed THEN NOW() ELSE NULL END
  WHERE id = p_task_id AND user_id = p_user_id;

  RETURN QUERY SELECT * FROM tasks WHERE id = p_task_id AND user_id = p_user_id;
END;
$$;
