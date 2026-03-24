import api from './client';
import type { PipelineSummary, WinRate, ActivityCount, Deal, Task } from '../types';

export async function fetchPipelineSummary() {
  const { data } = await api.get<PipelineSummary>('/dashboard/pipeline-summary');
  return data;
}

export async function fetchWonRevenue() {
  const { data } = await api.get<{ count: number; total: number }>('/dashboard/won-revenue');
  return data;
}

export async function fetchWinRate() {
  const { data } = await api.get<WinRate>('/dashboard/win-rate');
  return data;
}

export async function fetchActivityCount() {
  const { data } = await api.get<ActivityCount>('/dashboard/activity-count');
  return data;
}

export async function fetchStaleDeals() {
  const { data } = await api.get<(Deal & { days_stale: number })[]>('/dashboard/stale-deals');
  return data;
}

export async function fetchUpcomingTasks() {
  const { data } = await api.get<Task[]>('/dashboard/upcoming-tasks');
  return data;
}
