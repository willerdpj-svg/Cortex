import { supabase } from '../lib/supabase';
import { STAGE_WEIGHTS } from '../lib/constants';
import type { PipelineSummary, WinRate, ActivityCount, Task } from '../types';

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function fetchPipelineSummary(): Promise<PipelineSummary> {
  const { data: deals, error } = await supabase
    .from('deals')
    .select('stage, monthly_value')
    .not('stage', 'in', '("Closed Won","Closed Lost")');
  if (error) throw error;

  const byStage = new Map<string, { count: number; total_value: number }>();
  for (const d of deals || []) {
    const entry = byStage.get(d.stage) || { count: 0, total_value: 0 };
    entry.count++;
    entry.total_value += d.monthly_value || 0;
    byStage.set(d.stage, entry);
  }

  let totalValue = 0;
  let weightedValue = 0;
  const stages = Array.from(byStage.entries()).map(([stage, s]) => {
    const weight = STAGE_WEIGHTS[stage] || 0;
    totalValue += s.total_value;
    weightedValue += s.total_value * weight;
    return { stage, count: s.count, total_value: s.total_value, weight };
  });

  return { stages, totalValue, weightedValue };
}

export async function fetchWonRevenue() {
  const { data, error } = await supabase
    .from('deals')
    .select('monthly_value')
    .eq('stage', 'Closed Won');
  if (error) throw error;

  const deals = data || [];
  return {
    count: deals.length,
    total: deals.reduce((s, d) => s + (d.monthly_value || 0), 0),
  };
}

export async function fetchWinRate(): Promise<WinRate> {
  const { data, error } = await supabase
    .from('deals')
    .select('stage')
    .in('stage', ['Closed Won', 'Closed Lost']);
  if (error) throw error;

  const deals = data || [];
  const won = deals.filter(d => d.stage === 'Closed Won').length;
  const closed = deals.length;
  return {
    won,
    closed,
    rate: closed > 0 ? Math.round((won / closed) * 100) : 0,
  };
}

export async function fetchActivityCount(): Promise<ActivityCount> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().split('T')[0];

  const { count, error } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })
    .gte('date', dateStr);
  if (error) throw error;

  return { count: count || 0, target: 20 };
}

export async function fetchStaleDeals() {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('get_stale_deals', { p_user_id: userId });
  if (error) throw error;
  return data || [];
}

export async function fetchUpcomingTasks() {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const dateStr = sevenDaysFromNow.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*, prospects(company_name)')
    .eq('completed', false)
    .lte('due_date', dateStr)
    .order('due_date', { ascending: true })
    .limit(10);
  if (error) throw error;

  return (data || []).map((t: any) => ({
    ...t,
    prospect_name: t.prospects?.company_name,
    prospects: undefined,
  })) as Task[];
}
