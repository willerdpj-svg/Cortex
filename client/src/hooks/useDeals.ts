import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/deals';
import type { Deal } from '../types';

export function useDeals(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => api.fetchDeals(params),
  });
}

export function useDeal(id: number) {
  return useQuery({
    queryKey: ['deals', id],
    queryFn: () => api.fetchDeal(id),
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Deal>) => api.createDeal(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
  });
}

export function useUpdateDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Deal> & { id: number }) => api.updateDeal(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
  });
}

export function useMoveDealStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: string }) => api.moveDealStage(id, stage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deals'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useStageHistory(dealId: number) {
  return useQuery({
    queryKey: ['deals', dealId, 'history'],
    queryFn: () => api.fetchStageHistory(dealId),
    enabled: !!dealId,
  });
}

export function useDeleteDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteDeal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
  });
}
