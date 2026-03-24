import { supabase } from '../lib/supabase';
import { calculateIcpScore } from '../lib/icp';
import type { Prospect } from '../types';

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function fetchProspects(params?: Record<string, string>) {
  let query = supabase.from('prospects').select('*');

  if (params?.search) {
    const term = `%${params.search}%`;
    query = query.or(`company_name.ilike.${term},contact_name.ilike.${term},email.ilike.${term}`);
  }
  if (params?.type) {
    query = query.eq('company_type', params.type);
  }

  const sortCol = ['icp_score', 'company_name', 'created_at'].includes(params?.sort || '')
    ? params!.sort! : 'created_at';
  const ascending = params?.order === 'asc';
  query = query.order(sortCol, { ascending, nullsFirst: false });

  const { data, error } = await query;
  if (error) throw error;
  return data as Prospect[];
}

export async function fetchProspect(id: number) {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Prospect;
}

export async function createProspect(body: Partial<Prospect>) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('prospects')
    .insert({ ...body, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Prospect;
}

export async function updateProspect(id: number, body: Partial<Prospect>) {
  const { user_id, created_at, updated_at, ...updates } = body as any;
  const { data, error } = await supabase
    .from('prospects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Prospect;
}

export async function updateIcpScores(id: number, scores: Record<string, number>) {
  const icpScore = calculateIcpScore(scores as any);
  const { data, error } = await supabase
    .from('prospects')
    .update({ ...scores, icp_score: icpScore })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Prospect;
}

export async function deleteProspect(id: number) {
  const { error } = await supabase.from('prospects').delete().eq('id', id);
  if (error) throw error;
}
