import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/activities';
import type { Activity } from '../types';

export function useActivities(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => api.fetchActivities(params),
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Activity>) => api.createActivity(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activities'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Activity> & { id: number }) => api.updateActivity(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteActivity(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activities'] }),
  });
}
