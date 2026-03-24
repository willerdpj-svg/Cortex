import { supabase } from '../lib/supabase';
import type { Deal, StageHistoryEntry } from '../types';

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function fetchDeals(params?: Record<string, string>) {
  let query = supabase
    .from('deals')
    .select('*, prospects(company_name)');

  if (params?.stage) {
    query = query.eq('stage', params.stage);
  }
  if (params?.prospect_id) {
    query = query.eq('prospect_id', params.prospect_id);
  }
  query = query.order('updated_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((d: any) => ({
    ...d,
    prospect_name: d.prospects?.company_name,
    prospects: undefined,
  })) as Deal[];
}

export async function fetchDeal(id: number) {
  const { data, error } = await supabase
    .from('deals')
    .select('*, prospects(company_name)')
    .eq('id', id)
    .single();
  if (error) throw error;

  return {
    ...data,
    prospect_name: (data as any).prospects?.company_name,
    prospects: undefined,
  } as Deal;
}

export async function createDeal(body: Partial<Deal>) {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('create_deal_with_history', {
    p_user_id: userId,
    p_name: body.name,
    p_prospect_id: body.prospect_id,
    p_stage: body.stage || 'Identified',
    p_monthly_value: body.monthly_value || 0,
    p_services: body.services || null,
    p_decision_maker: body.decision_maker || null,
    p_champion: body.champion || null,
    p_next_step: body.next_step || null,
    p_expected_close: body.expected_close || null,
    p_notes: body.notes || null,
  });
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) as Deal;
}

export async function updateDeal(id: number, body: Partial<Deal>) {
  const { user_id, prospect_name, created_at, updated_at, ...updates } = body as any;
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Deal;
}

export async function moveDealStage(id: number, stage: string) {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('move_deal_stage', {
    p_user_id: userId,
    p_deal_id: id,
    p_new_stage: stage,
  });
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) as Deal;
}

export async function fetchStageHistory(dealId: number) {
  const { data, error } = await supabase
    .from('deal_stage_history')
    .select('*')
    .eq('deal_id', dealId)
    .order('changed_at', { ascending: true });
  if (error) throw error;

  // Calculate exited_at for each entry
  return (data || []).map((entry: any, i: number, arr: any[]) => ({
    ...entry,
    exited_at: i < arr.length - 1 ? arr[i + 1].changed_at : null,
  })) as StageHistoryEntry[];
}

export async function deleteDeal(id: number) {
  const { error } = await supabase.from('deals').delete().eq('id', id);
  if (error) throw error;
}
