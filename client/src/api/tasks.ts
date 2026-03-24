import api from './client';
import type { Task } from '../types';

export async function fetchTasks(params?: Record<string, string>) {
  const { data } = await api.get<Task[]>('/tasks', { params });
  return data;
}

export async function createTask(body: Partial<Task>) {
  const { data } = await api.post<Task>('/tasks', body);
  return data;
}

export async function updateTask(id: number, body: Partial<Task>) {
  const { data } = await api.put<Task>(`/tasks/${id}`, body);
  return data;
}

export async function toggleTaskComplete(id: number) {
  const { data } = await api.patch<Task>(`/tasks/${id}/complete`);
  return data;
}

export async function deleteTask(id: number) {
  await api.delete(`/tasks/${id}`);
}
