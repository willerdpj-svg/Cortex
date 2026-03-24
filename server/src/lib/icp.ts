export interface IcpScores {
  icp_aum_size: number;
  icp_data_complexity: number;
  icp_pain_level: number;
  icp_budget_readiness: number;
  icp_timeline_urgency: number;
  icp_internal_champion: number;
}

const WEIGHTS: Record<keyof IcpScores, number> = {
  icp_aum_size: 0.25,
  icp_data_complexity: 0.20,
  icp_pain_level: 0.20,
  icp_budget_readiness: 0.15,
  icp_timeline_urgency: 0.10,
  icp_internal_champion: 0.10,
};

export function calculateIcpScore(scores: IcpScores): number {
  const composite = (Object.entries(WEIGHTS) as [keyof IcpScores, number][]).reduce(
    (sum, [key, weight]) => sum + scores[key] * weight * 10,
    0
  );
  return Math.round(composite * 10) / 10;
}
