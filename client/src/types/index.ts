export interface Prospect {
  id: number;
  user_id: string;
  company_name: string;
  company_type: 'Asset Manager' | 'Manco' | 'DFM' | 'Brokerage' | 'LISP' | 'Other';
  contact_name: string | null;
  contact_role: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  estimated_aum: number | null;
  current_solution: string | null;
  pain_points: string | null;
  notes: string | null;
  source: string | null;
  icp_aum_size: number | null;
  icp_data_complexity: number | null;
  icp_pain_level: number | null;
  icp_budget_readiness: number | null;
  icp_timeline_urgency: number | null;
  icp_internal_champion: number | null;
  icp_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: number;
  user_id: string;
  name: string;
  prospect_id: number;
  prospect_name?: string;
  stage: string;
  monthly_value: number;
  services: string | null;
  decision_maker: string | null;
  champion: string | null;
  next_step: string | null;
  expected_close: string | null;
  notes: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StageHistoryEntry {
  id: number;
  deal_id: number;
  from_stage: string | null;
  to_stage: string;
  changed_at: string;
  exited_at: string | null;
}

export interface Activity {
  id: number;
  user_id: string;
  type: string;
  prospect_id: number;
  prospect_name?: string;
  deal_id: number | null;
  date: string;
  summary: string;
  outcome: string | null;
  created_at: string;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  prospect_id: number | null;
  prospect_name?: string;
  deal_id: number | null;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  notes: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PipelineSummary {
  stages: { stage: string; count: number; total_value: number; weight: number }[];
  totalValue: number;
  weightedValue: number;
}

export interface WinRate {
  won: number;
  closed: number;
  rate: number;
}

export interface ActivityCount {
  count: number;
  target: number;
}
