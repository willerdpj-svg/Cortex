import { supabase } from '../lib/supabase';
import type { Activity } from '../types';

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function fetchActivities(params?: Record<string, string>) {
  let query = supabase
    .from('activities')
    .select('*, prospects(company_name)');

  if (params?.prospect_id) {
    query = query.eq('prospect_id', params.prospect_id);
  }
  if (params?.deal_id) {
    query = query.eq('deal_id', params.deal_id);
  }
  if (params?.type) {
    query = query.eq('type', params.type);
  }
  query = query.order('date', { ascending: false }).order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((a: any) => ({
    ...a,
    prospect_name: a.prospects?.company_name,
    prospects: undefined,
  })) as Activity[];
}

export async function createActivity(body: Partial<Activity>) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('activities')
    .insert({ ...body, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function updateActivity(id: number, body: Partial<Activity>) {
  const { user_id, prospect_name, created_at, ...updates } = body as any;
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function deleteActivity(id: number) {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
}
