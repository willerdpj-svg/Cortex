import api from './client';
import type { Prospect } from '../types';

export async function fetchProspects(params?: Record<string, string>) {
  const { data } = await api.get<Prospect[]>('/prospects', { params });
  return data;
}

export async function fetchProspect(id: number) {
  const { data } = await api.get<Prospect>(`/prospects/${id}`);
  return data;
}

export async function createProspect(body: Partial<Prospect>) {
  const { data } = await api.post<Prospect>('/prospects', body);
  return data;
}

export async function updateProspect(id: number, body: Partial<Prospect>) {
  const { data } = await api.put<Prospect>(`/prospects/${id}`, body);
  return data;
}

export async function updateIcpScores(id: number, scores: Record<string, number>) {
  const { data } = await api.put<Prospect>(`/prospects/${id}/icp`, scores);
  return data;
}

export async function deleteProspect(id: number) {
  await api.delete(`/prospects/${id}`);
}
