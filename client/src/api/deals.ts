import api from './client';
import type { Deal, StageHistoryEntry } from '../types';

export async function fetchDeals(params?: Record<string, string>) {
  const { data } = await api.get<Deal[]>('/deals', { params });
  return data;
}

export async function fetchDeal(id: number) {
  const { data } = await api.get<Deal>(`/deals/${id}`);
  return data;
}

export async function createDeal(body: Partial<Deal>) {
  const { data } = await api.post<Deal>('/deals', body);
  return data;
}

export async function updateDeal(id: number, body: Partial<Deal>) {
  const { data } = await api.put<Deal>(`/deals/${id}`, body);
  return data;
}

export async function moveDealStage(id: number, stage: string) {
  const { data } = await api.patch<Deal>(`/deals/${id}/stage`, { stage });
  return data;
}

export async function fetchStageHistory(dealId: number) {
  const { data } = await api.get<StageHistoryEntry[]>(`/deals/${dealId}/history`);
  return data;
}

export async function deleteDeal(id: number) {
  await api.delete(`/deals/${id}`);
}
