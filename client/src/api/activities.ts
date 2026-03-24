import api from './client';
import type { Activity } from '../types';

export async function fetchActivities(params?: Record<string, string>) {
  const { data } = await api.get<Activity[]>('/activities', { params });
  return data;
}

export async function createActivity(body: Partial<Activity>) {
  const { data } = await api.post<Activity>('/activities', body);
  return data;
}

export async function updateActivity(id: number, body: Partial<Activity>) {
  const { data } = await api.put<Activity>(`/activities/${id}`, body);
  return data;
}

export async function deleteActivity(id: number) {
  await api.delete(`/activities/${id}`);
}
