export const COMPANY_TYPES = [
  'Asset Manager', 'Manco', 'DFM', 'Brokerage', 'LISP', 'Other',
] as const;

export const DEAL_STAGES = [
  'Identified', 'Researched', 'Outreach', 'Discovery',
  'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost',
] as const;

export const ACTIVITY_TYPES = [
  'Call', 'Email', 'Meeting', 'LinkedIn',
  'Proposal Sent', 'Demo', 'Follow-up', 'Internal',
] as const;

export const PRIORITIES = ['high', 'medium', 'low'] as const;

export const STAGE_WEIGHTS: Record<string, number> = {
  'Identified': 0.05,
  'Researched': 0.10,
  'Outreach': 0.15,
  'Discovery': 0.30,
  'Proposal': 0.50,
  'Negotiation': 0.75,
  'Closed Won': 1.00,
  'Closed Lost': 0,
};

export const STAGE_COLORS: Record<string, string> = {
  'Identified': 'bg-gray-100 text-gray-700',
  'Researched': 'bg-blue-100 text-blue-700',
  'Outreach': 'bg-indigo-100 text-indigo-700',
  'Discovery': 'bg-purple-100 text-purple-700',
  'Proposal': 'bg-yellow-100 text-yellow-700',
  'Negotiation': 'bg-orange-100 text-orange-700',
  'Closed Won': 'bg-green-100 text-green-700',
  'Closed Lost': 'bg-red-100 text-red-700',
};
