import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/prospects';
import type { Prospect } from '../types';

export function useProspects(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['prospects', params],
    queryFn: () => api.fetchProspects(params),
  });
}

export function useProspect(id: number) {
  return useQuery({
    queryKey: ['prospects', id],
    queryFn: () => api.fetchProspect(id),
    enabled: !!id,
  });
}

export function useCreateProspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Prospect>) => api.createProspect(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prospects'] }),
  });
}

export function useUpdateProspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Prospect> & { id: number }) => api.updateProspect(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prospects'] }),
  });
}

export function useUpdateIcpScores() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scores }: { id: number; scores: Record<string, number> }) =>
      api.updateIcpScores(id, scores),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prospects'] }),
  });
}

export function useDeleteProspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteProspect(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prospects'] }),
  });
}
