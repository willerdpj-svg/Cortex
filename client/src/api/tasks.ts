import { supabase } from '../lib/supabase';
import type { Task } from '../types';

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function fetchTasks(params?: Record<string, string>) {
  let query = supabase
    .from('tasks')
    .select('*, prospects(company_name)');

  if (params?.completed !== undefined) {
    query = query.eq('completed', params.completed === '1' || params.completed === 'true');
  }
  if (params?.priority) {
    query = query.eq('priority', params.priority);
  }
  if (params?.prospect_id) {
    query = query.eq('prospect_id', params.prospect_id);
  }
  if (params?.deal_id) {
    query = query.eq('deal_id', params.deal_id);
  }
  if (params?.overdue === '1') {
    query = query.eq('completed', false).lt('due_date', new Date().toISOString().split('T')[0]);
  }
  query = query.order('due_date', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((t: any) => ({
    ...t,
    prospect_name: t.prospects?.company_name,
    prospects: undefined,
  })) as Task[];
}

export async function createTask(body: Partial<Task>) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...body, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: number, body: Partial<Task>) {
  const { user_id, prospect_name, created_at, updated_at, ...updates } = body as any;
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function toggleTaskComplete(id: number) {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('toggle_task_complete', {
    p_user_id: userId,
    p_task_id: id,
  });
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) as Task;
}

export async function deleteTask(id: number) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
