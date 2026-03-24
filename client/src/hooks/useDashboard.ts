import { useQuery } from '@tanstack/react-query';
import * as api from '../api/dashboard';

export function usePipelineSummary() {
  return useQuery({ queryKey: ['dashboard', 'pipeline'], queryFn: api.fetchPipelineSummary });
}

export function useWonRevenue() {
  return useQuery({ queryKey: ['dashboard', 'won-revenue'], queryFn: api.fetchWonRevenue });
}

export function useWinRate() {
  return useQuery({ queryKey: ['dashboard', 'win-rate'], queryFn: api.fetchWinRate });
}

export function useActivityCount() {
  return useQuery({ queryKey: ['dashboard', 'activity-count'], queryFn: api.fetchActivityCount });
}

export function useStaleDeals() {
  return useQuery({ queryKey: ['dashboard', 'stale-deals'], queryFn: api.fetchStaleDeals });
}

export function useUpcomingTasks() {
  return useQuery({ queryKey: ['dashboard', 'upcoming-tasks'], queryFn: api.fetchUpcomingTasks });
}
